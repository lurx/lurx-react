import type {
	ProcessingError,
	ProcessingProgress,
	VideoMetadata,
	VideoSegment,
} from '@lurx-react/video-processing';
import {
	PROCESSING_MODES,
	PROCESSING_STATES,
	SERVICE_STATUS_REASONS,
} from '../constants/video-processing.constants';
import type { ExtractObjectValues, Nullable } from './utility-types.types';

/**
 * Processing status states
 */
export type ProcessingStatus = ExtractObjectValues<typeof PROCESSING_STATES>;

/**
 * Processing mode - where the video is being processed
 */
export type ProcessingMode = ExtractObjectValues<typeof PROCESSING_MODES>;

/**
 * State for the story wise context
 */
export interface StoryWiseState {
	/** Source video file */
	sourceFile: Nullable<File>;
	/** Object URL for source video preview */
	sourceUrl: Nullable<string>;
	/** Source video duration in seconds */
	sourceDuration: number;
	/** Source video metadata */
	sourceMetadata: Nullable<VideoMetadata>;

	/** Current processing status */
	processingStatus: ProcessingStatus;
	/** Processing progress information */
	processingProgress: Nullable<ProcessingProgress>;
	/** Processing error if any */
	processingError: Nullable<ProcessingError>;
	/** Current processing mode (client or cloud) */
	processingMode: Nullable<ProcessingMode>;

	/** Generated video segments */
	segments: VideoSegment[];
	/** Duration of each segment in seconds */
	segmentDuration: number;

	/** Currently selected segment ID for preview */
	selectedSegmentId: Nullable<string>;
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

type ServiceStatusReason = ExtractObjectValues<typeof SERVICE_STATUS_REASONS>;
export interface ServiceStatus {
	online: boolean;
	reason?: ServiceStatusReason;
	message?: string;
}

/**
 * Combined context type
 */
export type StoryWiseContextType = StoryWiseState &
	StoryWiseActions & {
		serviceStatus: ServiceStatus;
	};

/** Re-export for consumers that import from types. */
export { DEFAULT_SEGMENT_DURATION } from '../constants/video-processing.constants';
