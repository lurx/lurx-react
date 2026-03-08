export const COMMENTS_COLLECTION = 'comments';
export const STARS_COLLECTION = 'stars';

export const ENTITY_TYPES = {
	PROJECT: 'project',
	BLOG: 'blog',
} as const;

export const COMMENTS_STRINGS = {
	HEADING: 'Comments',
	EMPTY: 'No comments yet. Be the first to comment!',
	LOADING: 'Loading comments...',
	ERROR: 'Failed to load comments.',
	DELETE_CONFIRM: 'Delete this comment?',
} as const;

export const MAX_COMMENT_LENGTH = 2000;

export const RELATIVE_TIME = {
	JUST_NOW: 'just now',
	MINUTES_AGO: 'm ago',
	HOURS_AGO: 'h ago',
	DAYS_AGO: 'd ago',
} as const;

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const DAYS_THRESHOLD = 7;

export const TIME_THRESHOLDS = {
	SECONDS_IN_MINUTE,
	SECONDS_IN_HOUR,
	SECONDS_IN_DAY,
	DAYS_THRESHOLD,
} as const;
