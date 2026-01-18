import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, readFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { getCloudConfig } from '../../../config/cloud.config';
import { getR2Client } from '../../../lib/r2-client';
import { buildSegmentArgs } from '@lurx-react/video-processing';

const TMP_DIR = join(process.cwd(), 'tmp', 'processing');

interface ProcessRequestBody {
	sessionId: string;
	segmentDuration?: number;
	outputFormat?: 'mp4' | 'webm';
	quality?: 'high' | 'medium' | 'low';
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
 * Get video duration using FFprobe
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

		process.stderr.on('data', data => {
			// FFprobe outputs to stderr
			output += data.toString();
		});

		process.on('close', code => {
			if (code === 0 || output.includes('Duration:')) {
				// Try to parse duration from output
				const durationMatch = output.match(
					/Duration:\s*(\d{2}):(\d{2}):(\d{2}\.\d+)/,
				);
				if (durationMatch) {
					const hours = Number.parseInt(durationMatch[1], 10);
					const minutes = Number.parseInt(durationMatch[2], 10);
					const seconds = parseFloat(durationMatch[3]);
					const duration = hours * 3600 + minutes * 60 + seconds;
					resolve(duration);
					return;
				}

				// Try parsing from stdout
				const duration = parseFloat(output.trim());
				if (!Number.isNaN(duration) && duration > 0) {
					resolve(duration);
					return;
				}
			}
			reject(new Error('Failed to get video duration'));
		});

		process.on('error', reject);
	});
}

/**
 * Process a single video segment
 */
async function processSegment(
	inputPath: string,
	outputPath: string,
	startTime: number,
	duration: number,
	outputFormat: 'mp4' | 'webm',
	quality: 'high' | 'medium' | 'low',
): Promise<void> {
	return new Promise((resolve, reject) => {
		const args = buildSegmentArgs({
			startTime,
			segmentDuration: duration,
			outputFormat,
			quality,
			outputName: outputPath,
		});

		// buildSegmentArgs returns ['-i', 'input', ...rest, outputName]
		// Replace 'input' placeholder with actual input path and outputName with outputPath
		const finalArgs = args.map((arg, index) => {
			if (index === 1 && arg === 'input') return inputPath;
			if (index === args.length - 1) return outputPath;
			return arg;
		});

		console.log('[API] FFmpeg args:', finalArgs.join(' '));
		const process = spawn('ffmpeg', finalArgs);

		let errorOutput = '';

		process.stderr.on('data', data => {
			errorOutput += data.toString();
		});

		process.on('close', code => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`FFmpeg failed with code ${code}: ${errorOutput}`));
			}
		});

		process.on('error', reject);
	});
}

export async function POST(request: NextRequest) {
	console.log('[API] Process request received');
	try {
		const config = getCloudConfig();

		// Check if cloud processing is enabled
		if (!config.enabled) {
			console.warn('[API] Cloud processing is not enabled');
			return NextResponse.json(
				{ error: 'Cloud processing is not enabled' },
				{ status: 503 },
			);
		}

		console.log('[API] Checking FFmpeg availability...');
		// Check if FFmpeg is available
		const ffmpegAvailable = await isFFmpegAvailable();
		if (!ffmpegAvailable) {
			console.error('[API] FFmpeg is not available');
			return NextResponse.json(
				{
					error: 'Server-side processing unavailable',
					message:
						'FFmpeg is not installed on the server. Vercel serverless functions do not include FFmpeg. Consider using a separate processing service or Cloudflare Workers.',
				},
				{ status: 503 },
			);
		}

		console.log('[API] ✓ FFmpeg is available');

		const body = (await request.json()) as ProcessRequestBody;
		const {
			sessionId,
			segmentDuration = config.processing.defaultSegmentDuration,
			outputFormat = config.processing.outputFormat,
			quality = config.processing.quality,
		} = body;

		if (!sessionId) {
			return NextResponse.json(
				{ error: 'Session ID is required' },
				{ status: 400 },
			);
		}

		// Get R2 client
		console.log('[API] Initializing R2 client...');
		const r2Client = getR2Client();

		// Find input file in R2
		console.log('[API] Searching for input file in R2:', { sessionId });
		// Try common extensions
		const extensions = ['mp4', 'mov', 'webm', 'avi'];
		let inputKey: string | null = null;
		let inputExt: string | null = null;

		for (const ext of extensions) {
			const key = r2Client.generateVideoKey(sessionId, `input.${ext}`);
			const exists = await r2Client.fileExists(key);
			if (exists) {
				inputKey = key;
				inputExt = ext;
				console.log('[API] ✓ Input file found:', { key, ext });
				break;
			}
		}

		if (!inputKey) {
			console.error('[API] Input file not found in R2:', { sessionId });
			return NextResponse.json(
				{ error: 'Input file not found in R2' },
				{ status: 404 },
			);
		}

		// Download file from R2 to temporary location
		console.log('[API] Downloading file from R2 to temp location...');
		const tmpDir = join(TMP_DIR, sessionId);
		await mkdir(tmpDir, { recursive: true });
		const inputPath = join(tmpDir, `input.${inputExt}`);

		try {
			const buffer = await r2Client.downloadFile(inputKey);
			await writeFile(inputPath, new Uint8Array(buffer));
			console.log('[API] ✓ File downloaded to temp location:', {
				inputPath,
				size: buffer.length,
			});
		} catch (error) {
			console.error('[API] ✗ Error downloading from R2:', error);
			return NextResponse.json(
				{ error: 'Failed to download file from R2' },
				{ status: 500 },
			);
		}

		// Get video duration
		console.log('[API] Getting video duration...');
		const duration = await getVideoDuration(inputPath);
		const totalSegments = Math.ceil(duration / segmentDuration);
		console.log('[API] Video info:', {
			duration,
			totalSegments,
			segmentDuration,
		});

		// Process segments
		console.log('[API] Starting segment processing...');
		const segments: Array<{
			index: number;
			key: string;
			startTime: number;
			endTime: number;
			duration: number;
		}> = [];

		for (let i = 0; i < totalSegments; i++) {
			console.log(`[API] Processing segment ${i + 1}/${totalSegments}...`);
			const startTime = i * segmentDuration;
			const actualDuration = Math.min(segmentDuration, duration - startTime);
			const outputPath = join(
				tmpDir,
				`segment_${String(i).padStart(3, '0')}.${outputFormat}`,
			);

			// Process segment
			console.log(`[API] FFmpeg processing segment ${i + 1}...`);
			await processSegment(
				inputPath,
				outputPath,
				startTime,
				actualDuration,
				outputFormat,
				quality,
			);
			console.log(`[API] ✓ Segment ${i + 1} processed`);

			// Read processed segment
			const segmentData = await readFile(outputPath);

			// Upload to R2
			const segmentKey = r2Client.generateSegmentKey(
				sessionId,
				i,
				outputFormat,
			);
			console.log(`[API] Uploading segment ${i + 1} to R2...`);
			await r2Client.uploadFile(
				segmentKey,
				segmentData,
				outputFormat === 'mp4' ? 'video/mp4' : 'video/webm',
			);
			console.log(`[API] ✓ Segment ${i + 1} uploaded to R2`);

			segments.push({
				index: i,
				key: segmentKey,
				startTime,
				endTime: startTime + actualDuration,
				duration: actualDuration,
			});

			// Clean up local file
			await unlink(outputPath);
		}

		console.log('[API] ✓ All segments processed and uploaded');

		// Clean up input file
		await unlink(inputPath);

		return NextResponse.json({
			success: true,
			duration,
			totalSegments,
			segments: segments.map(seg => ({
				...seg,
				downloadUrl: `/api/download/${sessionId}/${seg.index}`,
			})),
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
