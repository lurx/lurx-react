const XSMALL_LOGO_SIZE = 100;
const SMALL_LOGO_SIZE = 150;
const MEDIUM_LOGO_SIZE = 200;
const LARGE_LOGO_SIZE = 250;
const XLARGE_LOGO_SIZE = 300;
const LOADER_LOGO_SIZE = 500;

export const LOGO_SIZES = {
	XSMALL: {
		width: XSMALL_LOGO_SIZE,
		height: XSMALL_LOGO_SIZE,
	},
	SMALL: {
		width: SMALL_LOGO_SIZE,
		height: SMALL_LOGO_SIZE,
	},
	MEDIUM: {
		width: MEDIUM_LOGO_SIZE,
		height: MEDIUM_LOGO_SIZE,
	},
	LARGE: {
		width: LARGE_LOGO_SIZE,
		height: LARGE_LOGO_SIZE,
	},
	XLARGE: {
		width: XLARGE_LOGO_SIZE,
		height: XLARGE_LOGO_SIZE,
	},
	LOADER: {
		width: LOADER_LOGO_SIZE,
		height: LOADER_LOGO_SIZE,
	},
} as const;

export const DEFAULT_LOGO_SIZE = 'MEDIUM';
