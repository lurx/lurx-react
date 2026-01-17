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
 * State for the video trimmer context
 */
export interface VideoTrimmerState {
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

	/** Generated video segments */
	segments: VideoSegment[];
	/** Duration of each segment in seconds */
	segmentDuration: number;

	/** Currently selected segment ID for preview */
	selectedSegmentId: string | null;
}

/**
 * Actions for the video trimmer context
 */
export interface VideoTrimmerActions {
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
 * Combined context type
 */
export type VideoTrimmerContextType = VideoTrimmerState & VideoTrimmerActions;

/**
 * Default segment duration (45 seconds)
 */
export const DEFAULT_SEGMENT_DURATION = 45;
