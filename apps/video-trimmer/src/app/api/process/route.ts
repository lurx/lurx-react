import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';

const UPLOAD_DIR = join(process.cwd(), 'tmp', 'uploads');

interface ProcessRequestBody {
	sessionId: string;
	segmentDuration?: number;
}

/**
 * Check if FFmpeg is available on the system
 */
async function isFFmpegAvailable(): Promise<boolean> {
	return new Promise(resolve => {
		const process = spawn('ffmpeg', ['-version']);
		process.on('error', () => resolve(false));
		process.on('close', code => resolve(code === 0));
	});
}

/**
 * Get video duration using FFmpeg
 */
async function getVideoDuration(inputPath: string): Promise<number> {
	return new Promise((resolve, reject) => {
		const args = [
			'-i',
			inputPath,
			'-show_entries',
			'format=duration',
			'-v',
			'quiet',
			'-of',
			'csv=p=0',
		];

		const process = spawn('ffprobe', args);
		let output = '';

		process.stdout.on('data', data => {
			output += data.toString();
		});

		process.on('close', code => {
			if (code === 0) {
				const duration = parseFloat(output.trim());
				resolve(isNaN(duration) ? 0 : duration);
			} else {
				reject(new Error('Failed to get video duration'));
			}
		});

		process.on('error', reject);
	});
}

/**
 * Split video into segments using FFmpeg
 */
async function splitVideo(
	inputPath: string,
	outputDir: string,
	segmentDuration: number,
): Promise<string[]> {
	return new Promise((resolve, reject) => {
		const outputPattern = join(outputDir, 'segment_%03d.mp4');

		const args = [
			'-i',
			inputPath,
			'-c:v',
			'libx264',
			'-c:a',
			'aac',
			'-f',
			'segment',
			'-segment_time',
			segmentDuration.toString(),
			'-reset_timestamps',
			'1',
			'-movflags',
			'+faststart',
			outputPattern,
		];

		const process = spawn('ffmpeg', args);

		process.on('close', async code => {
			if (code === 0) {
				// List generated segments
				const files = await readdir(outputDir);
				const segments = files
					.filter(f => f.startsWith('segment_') && f.endsWith('.mp4'))
					.sort();
				resolve(segments);
			} else {
				reject(new Error('FFmpeg processing failed'));
			}
		});

		process.on('error', reject);
	});
}

export async function POST(request: NextRequest) {
	try {
		// Check if FFmpeg is available
		const ffmpegAvailable = await isFFmpegAvailable();
		if (!ffmpegAvailable) {
			return NextResponse.json(
				{
					error: 'Server-side processing unavailable',
					message:
						'FFmpeg is not installed on the server. Please use client-side processing.',
				},
				{ status: 503 },
			);
		}

		const body = (await request.json()) as ProcessRequestBody;
		const { sessionId, segmentDuration = 45 } = body;

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'Session ID is required' },
				{ status: 400 },
			);
		}

		const sessionDir = join(UPLOAD_DIR, sessionId);

		// Check if session directory exists
		try {
			await stat(sessionDir);
		} catch {
			return NextResponse.json(
				{ error: 'Session not found' },
				{ status: 404 },
			);
		}

		// Find input file
		const files = await readdir(sessionDir);
		const inputFile = files.find(f => f.startsWith('input.'));
		if (!inputFile) {
			return NextResponse.json(
				{ error: 'Input file not found' },
				{ status: 404 },
			);
		}

		const inputPath = join(sessionDir, inputFile);

		// Get video duration
		const duration = await getVideoDuration(inputPath);
		const totalSegments = Math.ceil(duration / segmentDuration);

		// Split video
		const segmentFiles = await splitVideo(
			inputPath,
			sessionDir,
			segmentDuration,
		);

		// Build response with segment info
		const segments = segmentFiles.map((filename, index) => ({
			filename,
			index,
			downloadUrl: `/api/download/${sessionId}/${filename}`,
		}));

		return NextResponse.json({
			success: true,
			duration,
			totalSegments,
			segments,
		});
	} catch (error) {
		console.error('Processing error:', error);
		return NextResponse.json(
			{
				error: 'Processing failed',
				message: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
