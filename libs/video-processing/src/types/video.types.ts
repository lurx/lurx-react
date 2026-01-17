/**
 * Supported video codecs
 */
export type VideoCodec =
	| 'h264'
	| 'h265'
	| 'vp8'
	| 'vp9'
	| 'av1'
	| 'mpeg4'
	| 'unknown';

/**
 * Supported audio codecs
 */
export type AudioCodec =
	| 'aac'
	| 'mp3'
	| 'opus'
	| 'vorbis'
	| 'pcm'
	| 'unknown';

/**
 * Supported video formats/containers
 */
export type VideoFormat = 'mp4' | 'webm' | 'mov' | 'avi' | 'mkv' | 'unknown';

/**
 * Supported MIME types for video upload
 */
export type VideoMimeType =
	| 'video/mp4'
	| 'video/quicktime'
	| 'video/webm'
	| 'video/x-msvideo';

/**
 * Video file metadata extracted from the source
 */
export interface VideoMetadata {
	/** Duration in seconds */
	duration: number;
	/** Video width in pixels */
	width: number;
	/** Video height in pixels */
	height: number;
	/** Frame rate (frames per second) */
	frameRate: number;
	/** Video codec used */
	codec: VideoCodec;
	/** Audio codec used, null if no audio */
	audioCodec: AudioCodec | null;
	/** Bitrate in bits per second */
	bitrate: number;
	/** Rotation in degrees (0, 90, 180, 270) */
	rotation: number;
	/** Container format */
	format: VideoFormat;
	/** Whether the video has an audio track */
	hasAudio: boolean;
}

/**
 * Video file with metadata
 */
export interface VideoFile {
	/** The file object */
	file: File;
	/** Original file name */
	name: string;
	/** File size in bytes */
	size: number;
	/** MIME type */
	type: string;
	/** Last modified timestamp */
	lastModified: number;
}

/**
 * Processing quality options
 */
export type ProcessingQuality = 'high' | 'medium' | 'low';

/**
 * Output format options
 */
export type OutputFormat = 'mp4' | 'webm';

/**
 * Options for video processing
 */
export interface ProcessingOptions {
	/** Duration of each segment in seconds */
	segmentDuration: number;
	/** Output format */
	outputFormat: OutputFormat;
	/** Quality preset */
	quality: ProcessingQuality;
	/** Whether to generate thumbnail for each segment */
	generateThumbnails: boolean;
}

/**
 * Processing stage identifiers
 */
export type ProcessingStage =
	| 'validating'
	| 'loading'
	| 'analyzing'
	| 'splitting'
	| 'finalizing';

/**
 * Progress information during processing
 */
export interface ProcessingProgress {
	/** Current stage of processing */
	stage: ProcessingStage;
	/** Overall progress (0-100) */
	progress: number;
	/** Current segment being processed */
	currentSegment?: number;
	/** Total number of segments */
	totalSegments?: number;
	/** Human-readable message */
	message?: string;
}

/**
 * Error codes for processing errors
 */
export type ProcessingErrorCode =
	| 'FILE_TOO_LARGE'
	| 'INVALID_FORMAT'
	| 'UNSUPPORTED_CODEC'
	| 'PROCESSING_FAILED'
	| 'FFMPEG_LOAD_ERROR'
	| 'OUT_OF_MEMORY'
	| 'CANCELLED';

/**
 * Processing error information
 */
export interface ProcessingError {
	/** Error code */
	code: ProcessingErrorCode;
	/** Human-readable message */
	message: string;
	/** Whether the error can be recovered from */
	recoverable: boolean;
	/** Suggested action to resolve */
	suggestion?: string;
}
