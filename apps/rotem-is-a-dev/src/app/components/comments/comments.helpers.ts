import type { Timestamp } from 'firebase/firestore';
import { RELATIVE_TIME, TIME_THRESHOLDS } from './comments.constants';

export const formatRelativeTime = (timestamp: Timestamp): string => {
	const now = Date.now();
	const then = timestamp.toMillis();
	const diffSeconds = Math.floor((now - then) / 1000);

	if (diffSeconds < TIME_THRESHOLDS.SECONDS_IN_MINUTE) {
		return RELATIVE_TIME.JUST_NOW;
	}

	if (diffSeconds < TIME_THRESHOLDS.SECONDS_IN_HOUR) {
		const minutes = Math.floor(diffSeconds / TIME_THRESHOLDS.SECONDS_IN_MINUTE);
		return `${minutes}${RELATIVE_TIME.MINUTES_AGO}`;
	}

	if (diffSeconds < TIME_THRESHOLDS.SECONDS_IN_DAY) {
		const hours = Math.floor(diffSeconds / TIME_THRESHOLDS.SECONDS_IN_HOUR);
		return `${hours}${RELATIVE_TIME.HOURS_AGO}`;
	}

	const days = Math.floor(diffSeconds / TIME_THRESHOLDS.SECONDS_IN_DAY);

	if (days < TIME_THRESHOLDS.DAYS_THRESHOLD) {
		return `${days}${RELATIVE_TIME.DAYS_AGO}`;
	}

	const date = new Date(then);

	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
};
