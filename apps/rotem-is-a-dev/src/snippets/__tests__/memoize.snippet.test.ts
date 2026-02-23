import { memoize } from '../memoize.snippet';

describe('memoize', () => {
	it('returns the correct result', () => {
		const add = memoize((first: unknown, second: unknown) => (first as number) + (second as number));
		expect(add(2, 3)).toBe(5);
	});

	it('calls the function only once for the same arguments', () => {
		const fn = jest.fn((num: unknown) => (num as number) * 2);
		const memoized = memoize(fn);
		memoized(5);
		memoized(5);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('calls the function again for different arguments', () => {
		const fn = jest.fn((num: unknown) => (num as number) * 2);
		const memoized = memoize(fn);
		memoized(1);
		memoized(2);
		expect(fn).toHaveBeenCalledTimes(2);
	});

	it('caches results independently per argument set', () => {
		const fn = jest.fn((num: unknown) => (num as number) + 10);
		const memoized = memoize(fn);
		expect(memoized(1)).toBe(11);
		expect(memoized(2)).toBe(12);
		expect(memoized(1)).toBe(11);
		expect(fn).toHaveBeenCalledTimes(2);
	});
});
