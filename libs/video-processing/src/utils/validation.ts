import type { VideoMimeType } from '../types/video.types';

/**
 * Validation error
 */
export interface ValidationError {
	code: 'FILE_TOO_LARGE' | 'INVALID_FORMAT' | 'EMPTY_FILE';
	message: string;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
	code: 'LARGE_FILE' | 'CODEC_TRANSCODE';
	message: string;
}

/**
 * Result of file validation
 */
export interface ValidationResult {
	isValid: boolean;
	errors: ValidationError[];
	warnings: ValidationWarning[];
}

/** Maximum file size: 2GB */
export const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;

/** Recommended file size for client-side processing: 500MB */
export const RECOMMENDED_FILE_SIZE = 500 * 1024 * 1024;

/** Allowed MIME types */
export const ALLOWED_MIME_TYPES: VideoMimeType[] = [
	'video/mp4',
	'video/quicktime',
	'video/webm',
	'video/x-msvideo',
];

/**
 * Validate a video file before processing
 */
export function validateVideoFile(file: File): ValidationResult {
	const errors: ValidationError[] = [];
	const warnings: ValidationWarning[] = [];

	// Check for empty file
	if (file.size === 0) {
		errors.push({
			code: 'EMPTY_FILE',
			message: 'File is empty',
		});
		return { isValid: false, errors, warnings };
	}

	// Check file size
	if (file.size > MAX_FILE_SIZE) {
		errors.push({
			code: 'FILE_TOO_LARGE',
			message: `File exceeds maximum size of ${formatFileSize(MAX_FILE_SIZE)}`,
		});
	} else if (file.size > RECOMMENDED_FILE_SIZE) {
		warnings.push({
			code: 'LARGE_FILE',
			message: `Large files (>${formatFileSize(RECOMMENDED_FILE_SIZE)}) may take longer to process`,
		});
	}

	// Check MIME type
	if (!isValidMimeType(file.type)) {
		errors.push({
			code: 'INVALID_FORMAT',
			message: `Unsupported format: ${file.type || 'unknown'}. Supported formats: MP4, MOV, WebM, AVI`,
		});
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	};
}

/**
 * Check if a MIME type is supported
 * Accepts any video/* type for iOS compatibility (HEVC videos may report unusual MIME types)
 */
export function isValidMimeType(mimeType: string): mimeType is VideoMimeType {
	// Accept any video/* type for broader compatibility
	if (mimeType.startsWith('video/')) {
		return true;
	}
	// Also check explicit list for edge cases
	return ALLOWED_MIME_TYPES.includes(mimeType as VideoMimeType);
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return '0 Bytes';

	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration to human-readable string (MM:SS or HH:MM:SS)
 */
export function formatDuration(seconds: number): string {
	const hrs = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = Math.floor(seconds % 60);

	if (hrs > 0) {
		return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	}
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if file size requires server-side processing
 */
export function requiresServerProcessing(fileSize: number): boolean {
	return fileSize > RECOMMENDED_FILE_SIZE;
}
