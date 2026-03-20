import {
  ASCII_NO_DATA,
  ASCII_NO_DATA_MOBILE,
  ASCII_NO_POSTS,
  ASCII_NO_POSTS_MOBILE,
} from '@/ascii-art';

export const EMPTY_STATE_VARIANTS = {
	NO_DATA: 'NO_DATA',
	NO_POSTS: 'NO_POSTS',
} as const;

export const EMPTY_STATE_ASCII_ART_MAP = {
	[EMPTY_STATE_VARIANTS.NO_DATA]: ASCII_NO_DATA,
	[EMPTY_STATE_VARIANTS.NO_POSTS]: ASCII_NO_POSTS,
} as const satisfies Record<ExtractObjectValues<typeof EMPTY_STATE_VARIANTS>, string>;

export const EMPTY_STATE_MOBILE_ASCII_ART_MAP = {
	[EMPTY_STATE_VARIANTS.NO_DATA]: ASCII_NO_DATA_MOBILE,
	[EMPTY_STATE_VARIANTS.NO_POSTS]: ASCII_NO_POSTS_MOBILE,
} as const satisfies Record<ExtractObjectValues<typeof EMPTY_STATE_VARIANTS>, string>;

export const EMPTY_STATE_ASCII_LABELS_MAP = {
	[EMPTY_STATE_VARIANTS.NO_DATA]: "No file selected. Choose a file to learn more about me.",
	[EMPTY_STATE_VARIANTS.NO_POSTS]: "No posts found",
} as const satisfies Record<ExtractObjectValues<typeof EMPTY_STATE_VARIANTS>, string>;
