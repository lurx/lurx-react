import { throttle } from '../throttle.snippet';

describe('throttle', () => {
	it('calls the function on the first invocation', () => {
		const fn = jest.fn();
		const throttled = throttle(fn, 200);
		throttled();
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('ignores calls within the limit window', () => {
		jest.spyOn(Date, 'now').mockReturnValueOnce(0).mockReturnValueOnce(100);
		const fn = jest.fn();
		const throttled = throttle(fn, 200);
		throttled();
		throttled();
		expect(fn).toHaveBeenCalledTimes(1);
		jest.restoreAllMocks();
	});

	it('allows a call after the limit window passes', () => {
		jest.spyOn(Date, 'now').mockReturnValueOnce(0).mockReturnValueOnce(300);
		const fn = jest.fn();
		const throttled = throttle(fn, 200);
		throttled();
		throttled();
		expect(fn).toHaveBeenCalledTimes(2);
		jest.restoreAllMocks();
	});

	it('passes arguments to the wrapped function', () => {
		const fn = jest.fn();
		const throttled = throttle(fn, 0);
		throttled('x', 'y');
		expect(fn).toHaveBeenCalledWith('x', 'y');
	});
});
