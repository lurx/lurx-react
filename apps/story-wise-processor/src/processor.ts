import { spawn } from 'child_process';
import { writeFile, readFile, mkdir, unlink, rm } from 'fs/promises';
import { join } from 'path';
import type { Config } from './config';
import type { StorageClient } from './r2-client';

export interface ProcessingOptions {
	sessionId: string;
	segmentDuration: number;
	outputFormat: 'mp4' | 'webm';
	quality: 'high' | 'medium' | 'low';
	onProgress?: (progress: {
		currentSegment: number;
		totalSegments: number;
		percent: number;
		stage: 'downloading' | 'processing' | 'uploading';
	}) => void;
}

export interface ProcessingResult {
	success: boolean;
	duration: number;
	totalSegments: number;
	segments: Array<{
		index: number;
		key: string;
		startTime: number;
		endTime: number;
		duration: number;
	}>;
}

/**
 * Video processor using system FFmpeg
 */
export class VideoProcessor {
	private config: Config;
	private storage: StorageClient;

	constructor(config: Config, storage: StorageClient) {
		this.config = config;
		this.storage = storage;
	}

	/**
	 * Check if FFmpeg is available
	 */
	async checkFFmpeg(): Promise<boolean> {
		return new Promise((resolve) => {
			const proc = spawn('ffmpeg', ['-version']);
			proc.on('error', () => resolve(false));
			proc.on('close', (code) => resolve(code === 0));
		});
	}

	/**
	 * Get video duration using FFprobe
	 */
	private async getVideoDuration(inputPath: string): Promise<number> {
		return new Promise((resolve, reject) => {
			const args = [
				'-i', inputPath,
				'-show_entries', 'format=duration',
				'-v', 'quiet',
				'-of', 'csv=p=0',
			];

			const proc = spawn('ffprobe', args);
			let output = '';
			let errorOutput = '';

			proc.stdout.on('data', (data) => {
				output += data.toString();
			});

			proc.stderr.on('data', (data) => {
				errorOutput += data.toString();
			});

			proc.on('close', (code) => {
				// Try parsing duration from stdout first
				const duration = parseFloat(output.trim());
				if (!isNaN(duration) && duration > 0) {
					resolve(duration);
					return;
				}

				// Try parsing from stderr (ffprobe sometimes outputs there)
				const match = errorOutput.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2}\.\d+)/);
				if (match) {
					const hours = parseInt(match[1], 10);
					const minutes = parseInt(match[2], 10);
					const seconds = parseFloat(match[3]);
					resolve(hours * 3600 + minutes * 60 + seconds);
					return;
				}

				reject(new Error(`Failed to get video duration (exit code: ${code})`));
			});

			proc.on('error', reject);
		});
	}

	/**
	 * Process a single segment
	 */
	private async processSegment(
		inputPath: string,
		outputPath: string,
		startTime: number,
		duration: number,
		options: ProcessingOptions
	): Promise<void> {
		return new Promise((resolve, reject) => {
			// Build FFmpeg args based on quality
			const qualityArgs = this.getQualityArgs(options.quality, options.outputFormat);

			const args = [
				'-y', // Overwrite output
				'-ss', startTime.toString(),
				'-i', inputPath,
				'-t', duration.toString(),
				...qualityArgs,
				outputPath,
			];

			console.log('[Processor] FFmpeg args:', args.join(' '));

			const proc = spawn('ffmpeg', args);
			let errorOutput = '';

			proc.stderr.on('data', (data) => {
				errorOutput += data.toString();
			});

			proc.on('close', (code) => {
				if (code === 0) {
					resolve();
				} else {
					reject(new Error(`FFmpeg failed (code ${code}): ${errorOutput.slice(-500)}`));
				}
			});

			proc.on('error', reject);
		});
	}

	/**
	 * Get FFmpeg quality arguments
	 */
	private getQualityArgs(quality: string, format: string): string[] {
		if (format === 'webm') {
			const crf = quality === 'high' ? 20 : quality === 'medium' ? 30 : 40;
			return ['-c:v', 'libvpx-vp9', '-crf', crf.toString(), '-b:v', '0', '-c:a', 'libopus'];
		}

		// MP4 with H.264
		const crf = quality === 'high' ? 18 : quality === 'medium' ? 23 : 28;
		return [
			'-c:v', 'libx264',
			'-preset', 'fast',
			'-crf', crf.toString(),
			'-c:a', 'aac',
			'-b:a', '128k',
			'-movflags', '+faststart',
		];
	}

	/**
	 * Process a video into segments
	 */
	async process(options: ProcessingOptions): Promise<ProcessingResult> {
		const { sessionId, segmentDuration, outputFormat, quality, onProgress } = options;
		const workDir = join(this.config.processing.tempDir, sessionId);

		console.log('[Processor] Starting processing:', { sessionId, segmentDuration, outputFormat, quality });

		try {
			// Create work directory
			await mkdir(workDir, { recursive: true });

			// Find and download input file
			const keys = this.storage.generateKeys(sessionId);
			const inputFiles = await this.storage.listFiles(keys.inputPrefix);

			if (inputFiles.length === 0) {
				throw new Error('No input file found');
			}

			const inputKey = inputFiles[0];
			const inputExt = inputKey.split('.').pop() || 'mp4';
			const inputPath = join(workDir, `input.${inputExt}`);

			// Report download progress
			onProgress?.({ currentSegment: 0, totalSegments: 0, percent: 0, stage: 'downloading' });

			console.log('[Processor] Downloading input:', inputKey);
			const inputBuffer = await this.storage.downloadFile(inputKey);
			await writeFile(inputPath, inputBuffer);
			console.log('[Processor] Input downloaded:', inputBuffer.length, 'bytes');

			// Get video duration
			const duration = await this.getVideoDuration(inputPath);
			const totalSegments = Math.ceil(duration / segmentDuration);
			console.log('[Processor] Video duration:', duration, 'Total segments:', totalSegments);

			// Process segments
			const segments: ProcessingResult['segments'] = [];

			for (let i = 0; i < totalSegments; i++) {
				const startTime = i * segmentDuration;
				const segDuration = Math.min(segmentDuration, duration - startTime);
				const outputPath = join(workDir, `segment_${String(i).padStart(3, '0')}.${outputFormat}`);

				// Report processing progress
				const processingPercent = Math.round(((i * 2) / (totalSegments * 2)) * 100);
				onProgress?.({ currentSegment: i + 1, totalSegments, percent: processingPercent, stage: 'processing' });

				console.log(`[Processor] Processing segment ${i + 1}/${totalSegments}...`);
				await this.processSegment(inputPath, outputPath, startTime, segDuration, options);

				// Read and upload segment
				const segmentData = await readFile(outputPath);
				const segmentKey = keys.segmentKey(i, outputFormat);

				// Report uploading progress
				const uploadingPercent = Math.round(((i * 2 + 1) / (totalSegments * 2)) * 100);
				onProgress?.({ currentSegment: i + 1, totalSegments, percent: uploadingPercent, stage: 'uploading' });

				console.log(`[Processor] Uploading segment ${i + 1}...`);
				await this.storage.uploadFile(
					segmentKey,
					segmentData,
					outputFormat === 'mp4' ? 'video/mp4' : 'video/webm'
				);

				segments.push({
					index: i,
					key: segmentKey,
					startTime,
					endTime: startTime + segDuration,
					duration: segDuration,
				});

				// Clean up segment file
				await unlink(outputPath);
			}

			// Clean up input file and work directory
			await unlink(inputPath);
			await rm(workDir, { recursive: true, force: true });

			// Report completion
			onProgress?.({ currentSegment: totalSegments, totalSegments, percent: 100, stage: 'uploading' });

			console.log('[Processor] Processing complete:', { totalSegments });

			return {
				success: true,
				duration,
				totalSegments,
				segments,
			};
		} catch (error) {
			// Clean up on error
			try {
				await rm(workDir, { recursive: true, force: true });
			} catch {
				// Ignore cleanup errors
			}
			throw error;
		}
	}
}
