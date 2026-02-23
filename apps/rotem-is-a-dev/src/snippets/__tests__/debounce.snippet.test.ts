import { debounce } from '../debounce.snippet';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('debounce', () => {
	it('calls the function after the delay', () => {
		const fn = jest.fn();
		const debounced = debounce(fn, 200);
		debounced();
		expect(fn).not.toHaveBeenCalled();
		jest.advanceTimersByTime(200);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('resets the timer on repeated calls', () => {
		const fn = jest.fn();
		const debounced = debounce(fn, 200);
		debounced();
		jest.advanceTimersByTime(100);
		debounced();
		jest.advanceTimersByTime(100);
		expect(fn).not.toHaveBeenCalled();
		jest.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('passes arguments to the wrapped function', () => {
		const fn = jest.fn();
		const debounced = debounce(fn, 100);
		debounced('a', 'b');
		jest.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledWith('a', 'b');
	});
});
