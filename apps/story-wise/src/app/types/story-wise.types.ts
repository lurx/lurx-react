import type {
	VideoMetadata,
	VideoSegment,
	ProcessingProgress,
	ProcessingError,
} from '@lurx-react/video-processing';

/**
 * Processing status states
 */
export type ProcessingStatus =
	| 'idle'
	| 'loading-ffmpeg'
	| 'analyzing'
	| 'splitting'
	| 'complete'
	| 'error';

/**
 * Processing mode - where the video is being processed
 */
export type ProcessingMode = 'client' | 'cloud' | null;

/**
 * State for the story wise context
 */
export interface StoryWiseState {
	/** Source video file */
	sourceFile: File | null;
	/** Object URL for source video preview */
	sourceUrl: string | null;
	/** Source video duration in seconds */
	sourceDuration: number;
	/** Source video metadata */
	sourceMetadata: VideoMetadata | null;

	/** Current processing status */
	processingStatus: ProcessingStatus;
	/** Processing progress information */
	processingProgress: ProcessingProgress | null;
	/** Processing error if any */
	processingError: ProcessingError | null;
	/** Current processing mode (client or cloud) */
	processingMode: ProcessingMode;

	/** Generated video segments */
	segments: VideoSegment[];
	/** Duration of each segment in seconds */
	segmentDuration: number;

	/** Currently selected segment ID for preview */
	selectedSegmentId: string | null;
}

/**
 * Actions for the story wise context
 */
export interface StoryWiseActions {
	/** Set the source video file */
	setSourceFile: (file: File) => void;
	/** Start processing the video */
	startProcessing: () => Promise<void>;
	/** Cancel ongoing processing */
	cancelProcessing: () => void;
	/** Download a specific segment */
	downloadSegment: (segmentId: string) => void;
	/** Download all segments as a zip */
	downloadAllSegments: () => void;
	/** Set the segment duration */
	setSegmentDuration: (duration: number) => void;
	/** Select a segment for preview */
	selectSegment: (segmentId: string | null) => void;
	/** Reset to initial state */
	reset: () => void;
}

/**
 * Service status
 */
export interface ServiceStatus {
	online: boolean;
	reason?: 'maintenance' | 'quota_exceeded';
	message?: string;
}

/**
 * Combined context type
 */
export type StoryWiseContextType = StoryWiseState & StoryWiseActions & {
	serviceStatus: ServiceStatus;
};

/**
 * Default segment duration (seconds)
 */
export const DEFAULT_SEGMENT_DURATION = 59; // 59 seconds to allow for 1-second buffer
