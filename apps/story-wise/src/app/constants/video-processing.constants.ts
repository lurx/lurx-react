export const PROCESSING_MODES = {
	CLIENT: 'client',
	CLOUD: 'cloud',
} as const;

/**
 * Processing status states
 */
export const PROCESSING_STATES = {
	IDLE: 'idle',
	LOADING_FFMPEG: 'loading-ffmpeg',
	ANALYZING: 'analyzing',
	SPLITTING: 'splitting',
	COMPLETE: 'complete',
	ERROR: 'error',
} as const;

export const SERVICE_STATUS_REASONS = {
	MAINTENANCE: 'maintenance',
	QUOTA_EXCEEDED: 'quota_exceeded',
} as const;

/** Default segment duration in seconds (59s to allow for 1s buffer vs 60s stories). */
export const DEFAULT_SEGMENT_DURATION = 59;

/** Minimum segment duration in seconds. */
export const MIN_SEGMENT_DURATION_SEC = 1;

/** For short videos, split into this many segments (minimum). */
export const SHORT_VIDEO_MIN_SEGMENTS = 2;

/** Segment duration input: min, max, and fallback when parse fails. */
export const SEGMENT_DURATION_INPUT = {
	MIN: 5,
	MAX: 120,
	FALLBACK: 45,
} as const;

/** Output format and quality for split/process. */
export const OUTPUT_FORMAT = 'mp4';
export const QUALITY = 'medium';

/** Progress: 100 = complete. */
export const PROGRESS_COMPLETE = 100;

/** Cloud progress: UI shows 10–100% from processor 0–100%: base + percent * scale. */
export const CLOUD_PROGRESS = {
	BASE: 10,
	SCALE: 0.9,
} as const;
