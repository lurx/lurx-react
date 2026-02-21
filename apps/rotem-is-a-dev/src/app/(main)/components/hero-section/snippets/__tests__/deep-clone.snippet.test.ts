import { deepClone } from '../deep-clone.snippet';

describe('deepClone', () => {
	it('clones a plain object', () => {
		const obj = { alpha: 1, beta: 'hello' };
		const clone = deepClone(obj);
		expect(clone).toEqual(obj);
		expect(clone).not.toBe(obj);
	});

	it('clones nested objects without shared references', () => {
		const obj = { outer: { middle: { inner: 42 } } };
		const clone = deepClone(obj);
		expect(clone).toEqual(obj);
		clone.outer.middle.inner = 99;
		expect(obj.outer.middle.inner).toBe(42);
	});

	it('clones arrays', () => {
		const arr = [1, [2, 3], [4, [5]]];
		const clone = deepClone(arr);
		expect(clone).toEqual(arr);
		expect(clone[1]).not.toBe(arr[1]);
	});

	it('returns primitives as-is', () => {
		expect(deepClone(42)).toBe(42);
		expect(deepClone('hello')).toBe('hello');
		expect(deepClone(null)).toBeNull();
	});
});
