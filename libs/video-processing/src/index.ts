// Types
export type {
	VideoCodec,
	AudioCodec,
	VideoFormat,
	VideoMimeType,
	VideoMetadata,
	VideoFile,
	ProcessingQuality,
	OutputFormat,
	ProcessingOptions,
	ProcessingStage,
	ProcessingProgress,
	ProcessingErrorCode,
	ProcessingError,
} from './types/video.types';

export type {
	SegmentStatus,
	VideoSegment,
	ProcessingResult,
	SplitOptions,
	SplitResult,
} from './types/segment.types';

// Validation utilities
export {
	validateVideoFile,
	isValidMimeType,
	formatFileSize,
	formatDuration,
	requiresServerProcessing,
	MAX_FILE_SIZE,
	RECOMMENDED_FILE_SIZE,
	ALLOWED_MIME_TYPES,
} from './utils/validation';

export type {
	ValidationError,
	ValidationWarning,
	ValidationResult,
} from './utils/validation';

// Format utilities
export {
	detectFormatFromMimeType,
	detectFormatFromExtension,
	getExtensionForFormat,
	getMimeTypeForFormat,
	parseVideoCodec,
	parseAudioCodec,
	calculateSegmentCount,
	generateSegmentRanges,
	createDefaultMetadata,
	getRecommendedOutputSettings,
} from './utils/format-utils';

// FFmpeg command utilities
export {
	getVideoCodec,
	getAudioCodec,
	getEncodingPreset,
	getCRF,
	buildSegmentArgs,
	buildThumbnailArgs,
	buildProbeArgs,
	generateSegmentFilename,
	generateThumbnailFilename,
	parseDuration,
	parseDimensions,
	parseFrameRate,
} from './utils/ffmpeg-commands';
