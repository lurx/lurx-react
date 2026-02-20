export function throttle<T extends (...args: unknown[]) => void>(
	fn: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let lastCall = -Infinity;
	return (...args: Parameters<T>) => {
		const now = Date.now();
		if (now - lastCall >= limit) {
			lastCall = now;
			fn(...args);
		}
	};
}

