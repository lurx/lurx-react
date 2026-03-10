import type { Timestamp } from 'firebase/firestore';
import { formatRelativeTime } from '../comments.helpers';

const createTimestamp = (millisAgo: number): Timestamp =>
	({
		toMillis: () => Date.now() - millisAgo,
	}) as Timestamp;

describe('formatRelativeTime', () => {
	it('returns "just now" for timestamps less than 60 seconds ago', () => {
		const timestamp = createTimestamp(30_000);
		expect(formatRelativeTime(timestamp)).toBe('just now');
	});

	it('returns "just now" for timestamps 0 seconds ago', () => {
		const timestamp = createTimestamp(0);
		expect(formatRelativeTime(timestamp)).toBe('just now');
	});

	it('returns "1m ago" for a timestamp exactly 60 seconds ago', () => {
		const timestamp = createTimestamp(60_000);
		expect(formatRelativeTime(timestamp)).toBe('1m ago');
	});

	it('returns "5m ago" for a timestamp 5 minutes ago', () => {
		const timestamp = createTimestamp(5 * 60_000);
		expect(formatRelativeTime(timestamp)).toBe('5m ago');
	});

	it('returns "59m ago" for a timestamp 59 minutes ago', () => {
		const timestamp = createTimestamp(59 * 60_000);
		expect(formatRelativeTime(timestamp)).toBe('59m ago');
	});

	it('returns "1h ago" for a timestamp exactly 1 hour ago', () => {
		const timestamp = createTimestamp(3_600_000);
		expect(formatRelativeTime(timestamp)).toBe('1h ago');
	});

	it('returns "23h ago" for a timestamp 23 hours ago', () => {
		const timestamp = createTimestamp(23 * 3_600_000);
		expect(formatRelativeTime(timestamp)).toBe('23h ago');
	});

	it('returns "1d ago" for a timestamp exactly 1 day ago', () => {
		const timestamp = createTimestamp(86_400_000);
		expect(formatRelativeTime(timestamp)).toBe('1d ago');
	});

	it('returns "6d ago" for a timestamp 6 days ago', () => {
		const timestamp = createTimestamp(6 * 86_400_000);
		expect(formatRelativeTime(timestamp)).toBe('6d ago');
	});

	it('returns formatted date for timestamps 7 or more days ago', () => {
		const timestamp = createTimestamp(7 * 86_400_000);
		const result = formatRelativeTime(timestamp);
		expect(result).toMatch(/\w{3} \d{1,2}, \d{4}/);
	});

	it('returns formatted date for timestamps 30 days ago', () => {
		const timestamp = createTimestamp(30 * 86_400_000);
		const result = formatRelativeTime(timestamp);
		expect(result).toMatch(/\w{3} \d{1,2}, \d{4}/);
	});
});
