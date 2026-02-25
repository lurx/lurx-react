export function getOpacity(
	index: number,
	active: number,
	total: number,
): number {
	let rel = (((index - active) % total) + total) % total;
	if (rel > Math.floor(total / 2)) rel -= total;
	const dist = Math.abs(rel);
	if (dist === 0) return 1;
	if (dist === 1) return 0.4;
	return 0.1;
}
