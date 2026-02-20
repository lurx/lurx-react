import { deepClone } from '../deep-clone.snippet';

describe('deepClone', () => {
	it('clones a plain object', () => {
		const obj = { a: 1, b: 'hello' };
		const clone = deepClone(obj);
		expect(clone).toEqual(obj);
		expect(clone).not.toBe(obj);
	});

	it('clones nested objects without shared references', () => {
		const obj = { a: { b: { c: 42 } } };
		const clone = deepClone(obj);
		expect(clone).toEqual(obj);
		clone.a.b.c = 99;
		expect(obj.a.b.c).toBe(42);
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
