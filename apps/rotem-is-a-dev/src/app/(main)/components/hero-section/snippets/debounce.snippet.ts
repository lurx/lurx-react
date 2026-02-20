export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timerId: ReturnType<typeof setTimeout> | null = null;
	return (...args: Parameters<T>) => {
		if (timerId !== null) clearTimeout(timerId);
		timerId = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

