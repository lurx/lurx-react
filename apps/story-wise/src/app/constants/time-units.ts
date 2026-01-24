const oneSecond = 1000;

export const TIME_UNITS = {
	SECOND: oneSecond,
	MINUTE: oneSecond * 60,
	HOUR: oneSecond * 60 * 60,
	DAY: oneSecond * 60 * 60 * 24,
	WEEK: oneSecond * 60 * 60 * 24 * 7,
	MONTH: oneSecond * 60 * 60 * 24 * 30,
	YEAR: oneSecond * 60 * 60 * 24 * 365,
} as const;
