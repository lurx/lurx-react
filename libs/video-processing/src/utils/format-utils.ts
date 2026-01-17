import type {
	VideoFormat,
	VideoCodec,
	AudioCodec,
	VideoMetadata,
} from '../types/video.types';

/**
 * Detect video format from MIME type
 */
export function detectFormatFromMimeType(mimeType: string): VideoFormat {
	const formatMap: Record<string, VideoFormat> = {
		'video/mp4': 'mp4',
		'video/quicktime': 'mov',
		'video/webm': 'webm',
		'video/x-msvideo': 'avi',
		'video/x-matroska': 'mkv',
	};

	return formatMap[mimeType] ?? 'unknown';
}

/**
 * Detect video format from file extension
 */
export function detectFormatFromExtension(filename: string): VideoFormat {
	const extension = filename.split('.').pop()?.toLowerCase();

	const formatMap: Record<string, VideoFormat> = {
		mp4: 'mp4',
		m4v: 'mp4',
		mov: 'mov',
		webm: 'webm',
		avi: 'avi',
		mkv: 'mkv',
	};

	return formatMap[extension ?? ''] ?? 'unknown';
}

/**
 * Get file extension for output format
 */
export function getExtensionForFormat(format: 'mp4' | 'webm'): string {
	return format;
}

/**
 * Get MIME type for output format
 */
export function getMimeTypeForFormat(format: 'mp4' | 'webm'): string {
	const mimeMap: Record<string, string> = {
		mp4: 'video/mp4',
		webm: 'video/webm',
	};
	return mimeMap[format];
}

/**
 * Parse codec string to VideoCodec
 */
export function parseVideoCodec(codecString: string): VideoCodec {
	const normalized = codecString.toLowerCase();

	if (normalized.includes('h264') || normalized.includes('avc')) return 'h264';
	if (normalized.includes('h265') || normalized.includes('hevc')) return 'h265';
	if (normalized.includes('vp8')) return 'vp8';
	if (normalized.includes('vp9')) return 'vp9';
	if (normalized.includes('av1') || normalized.includes('av01')) return 'av1';
	if (normalized.includes('mpeg4') || normalized.includes('mp4v')) return 'mpeg4';

	return 'unknown';
}

/**
 * Parse audio codec string to AudioCodec
 */
export function parseAudioCodec(codecString: string): AudioCodec {
	const normalized = codecString.toLowerCase();

	if (normalized.includes('aac')) return 'aac';
	if (normalized.includes('mp3') || normalized.includes('mp4a')) return 'mp3';
	if (normalized.includes('opus')) return 'opus';
	if (normalized.includes('vorbis')) return 'vorbis';
	if (normalized.includes('pcm')) return 'pcm';

	return 'unknown';
}

/**
 * Calculate number of segments needed for a given duration
 */
export function calculateSegmentCount(
	totalDuration: number,
	segmentDuration: number,
): number {
	return Math.ceil(totalDuration / segmentDuration);
}

/**
 * Generate segment time ranges
 */
export function generateSegmentRanges(
	totalDuration: number,
	segmentDuration: number,
): Array<{ startTime: number; endTime: number; duration: number }> {
	const segments: Array<{
		startTime: number;
		endTime: number;
		duration: number;
	}> = [];
	let currentTime = 0;

	while (currentTime < totalDuration) {
		const startTime = currentTime;
		const endTime = Math.min(currentTime + segmentDuration, totalDuration);
		const duration = endTime - startTime;

		segments.push({ startTime, endTime, duration });
		currentTime = endTime;
	}

	return segments;
}

/**
 * Create default video metadata
 */
export function createDefaultMetadata(): VideoMetadata {
	return {
		duration: 0,
		width: 0,
		height: 0,
		frameRate: 0,
		codec: 'unknown',
		audioCodec: null,
		bitrate: 0,
		rotation: 0,
		format: 'unknown',
		hasAudio: false,
	};
}

/**
 * Get recommended output settings based on input
 */
export function getRecommendedOutputSettings(
	_metadata: VideoMetadata,
	quality: 'high' | 'medium' | 'low',
): {
	videoBitrate: string;
	audioBitrate: string;
	preset: string;
} {
	const settings = {
		high: {
			videoBitrate: '5M',
			audioBitrate: '192k',
			preset: 'slow',
		},
		medium: {
			videoBitrate: '2.5M',
			audioBitrate: '128k',
			preset: 'medium',
		},
		low: {
			videoBitrate: '1M',
			audioBitrate: '96k',
			preset: 'ultrafast',
		},
	};

	return settings[quality];
}
