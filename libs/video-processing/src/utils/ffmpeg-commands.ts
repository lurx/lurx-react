import type { ProcessingQuality, OutputFormat } from '../types/video.types';

/**
 * Get video codec for output format
 */
export function getVideoCodec(format: OutputFormat): string {
	return format === 'webm' ? 'libvpx-vp9' : 'libx264';
}

/**
 * Get audio codec for output format
 */
export function getAudioCodec(format: OutputFormat): string {
	return format === 'webm' ? 'libopus' : 'aac';
}

/**
 * Get encoding preset based on quality
 */
export function getEncodingPreset(quality: ProcessingQuality): string {
	const presets: Record<ProcessingQuality, string> = {
		high: 'slow',
		medium: 'medium',
		low: 'ultrafast',
	};
	return presets[quality];
}

/**
 * Get CRF (Constant Rate Factor) based on quality
 * Lower = better quality, higher file size
 */
export function getCRF(quality: ProcessingQuality): number {
	const crfValues: Record<ProcessingQuality, number> = {
		high: 18,
		medium: 23,
		low: 28,
	};
	return crfValues[quality];
}

/**
 * Build FFmpeg arguments for segment extraction
 * Re-encodes for FFmpeg.wasm compatibility (stream copy not supported)
 */
export function buildSegmentArgs(options: {
	startTime: number;
	segmentDuration: number;
	outputFormat: OutputFormat;
	quality: ProcessingQuality;
	outputName: string;
}): string[] {
	const { startTime, segmentDuration, outputFormat, quality, outputName } = options;

	const args: string[] = [
		// Input file first (required for FFmpeg.wasm)
		'-i',
		'input',
		// Seek to start time
		'-ss',
		startTime.toString(),
		// Duration
		'-t',
		segmentDuration.toString(),
	];

	// Video encoding - use libx264 for MP4 (FFmpeg.wasm compatible)
	if (outputFormat === 'mp4') {
		args.push(
			'-c:v', 'libx264',
			'-preset', getEncodingPreset(quality),
			'-crf', getCRF(quality).toString(),
			// Use yuv420p for maximum compatibility
			'-pix_fmt', 'yuv420p',
		);
	} else {
		// WebM format
		args.push(
			'-c:v', 'libvpx-vp9',
			'-crf', getCRF(quality).toString(),
			'-b:v', '0',
		);
	}

	// Audio encoding
	args.push(
		'-c:a', 'aac',
		'-b:a', '128k',
	);

	// Avoid negative timestamps
	args.push('-avoid_negative_ts', 'make_zero');

	// MP4-specific flags
	if (outputFormat === 'mp4') {
		args.push('-movflags', '+faststart');
	}

	// Output file
	args.push(outputName);

	return args;
}

/**
 * Build FFmpeg arguments for thumbnail extraction
 */
export function buildThumbnailArgs(options: {
	time: number;
	outputName: string;
	width?: number;
}): string[] {
	const { time, outputName, width = 320 } = options;

	return [
		'-ss',
		time.toString(),
		'-i',
		'input',
		'-vframes',
		'1',
		'-vf',
		`scale=${width}:-1`,
		'-f',
		'image2',
		outputName,
	];
}

/**
 * Build FFmpeg arguments for metadata extraction
 */
export function buildProbeArgs(): string[] {
	return ['-i', 'input', '-hide_banner'];
}

/**
 * Generate output filename for a segment
 */
export function generateSegmentFilename(
	index: number,
	format: OutputFormat,
): string {
	const paddedIndex = index.toString().padStart(3, '0');
	return `segment_${paddedIndex}.${format}`;
}

/**
 * Generate output filename for a thumbnail
 */
export function generateThumbnailFilename(index: number): string {
	const paddedIndex = index.toString().padStart(3, '0');
	return `thumb_${paddedIndex}.jpg`;
}

/**
 * Parse FFmpeg duration string to seconds
 * Handles formats like "00:01:23.45" or "Duration: 00:01:23.45"
 */
export function parseDuration(durationString: string): number {
	// Extract time pattern (HH:MM:SS.ms)
	const match = durationString.match(/(\d{2}):(\d{2}):(\d{2})\.?(\d{0,2})/);
	if (!match) return 0;

	const [, hours, minutes, seconds, ms] = match;
	return (
		parseInt(hours) * 3600 +
		parseInt(minutes) * 60 +
		parseInt(seconds) +
		(ms ? parseInt(ms) / 100 : 0)
	);
}

/**
 * Parse FFmpeg output to extract video dimensions
 */
export function parseDimensions(
	ffmpegOutput: string,
): { width: number; height: number } | null {
	// Match patterns like "1920x1080" or "1280x720"
	const match = ffmpegOutput.match(/(\d{3,4})x(\d{3,4})/);
	if (!match) return null;

	return {
		width: parseInt(match[1]),
		height: parseInt(match[2]),
	};
}

/**
 * Parse FFmpeg output to extract frame rate
 */
export function parseFrameRate(ffmpegOutput: string): number {
	// Match patterns like "30 fps" or "29.97 fps"
	const match = ffmpegOutput.match(/(\d+(?:\.\d+)?)\s*fps/);
	if (!match) return 30; // Default to 30 fps

	return parseFloat(match[1]);
}
