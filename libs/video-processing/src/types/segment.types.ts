import type { ProcessingError, VideoMetadata } from './video.types';

/**
 * Status of a video segment
 */
export type SegmentStatus =
	| 'pending'
	| 'processing'
	| 'ready'
	| 'downloading'
	| 'error';

/**
 * A video segment extracted from the source video
 */
export interface VideoSegment {
	/** Unique identifier */
	id: string;
	/** Zero-based index in the sequence */
	index: number;
	/** Start time in seconds */
	startTime: number;
	/** End time in seconds */
	endTime: number;
	/** Duration in seconds */
	duration: number;
	/** Raw video data (available when processed) */
	data?: Uint8Array;
	/** Blob URL for playback (available when processed) */
	blobUrl?: string;
	/** Thumbnail URL (if thumbnails enabled) */
	thumbnailUrl?: string;
	/** Current status */
	status: SegmentStatus;
	/** File size in bytes (available when processed) */
	fileSize?: number;
}

/**
 * Result of video processing
 */
export interface ProcessingResult {
	/** Whether processing was successful */
	success: boolean;
	/** Generated segments */
	segments: VideoSegment[];
	/** Source video metadata */
	metadata: VideoMetadata;
	/** Total processing time in milliseconds */
	processingTime: number;
	/** Error if processing failed */
	error?: ProcessingError;
}

/**
 * Options for splitting a video
 */
export interface SplitOptions {
	/** Input file */
	inputFile: File;
	/** Duration of each segment in seconds */
	segmentDuration: number;
	/** Output format */
	outputFormat: 'mp4' | 'webm';
	/** Quality preset */
	quality: 'high' | 'medium' | 'low';
	/** Progress callback */
	onProgress?: (progress: number, currentSegment: number, totalSegments: number) => void;
}

/**
 * Result of splitting operation
 */
export interface SplitResult {
	/** Array of segment data */
	segments: Uint8Array[];
	/** Total segments created */
	totalSegments: number;
}
