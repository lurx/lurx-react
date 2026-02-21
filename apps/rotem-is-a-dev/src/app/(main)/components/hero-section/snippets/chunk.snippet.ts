export function chunk<T>(arr: T[], size: number): T[][] {
	if (size <= 0) throw new RangeError('Chunk size must be greater than 0');
	const result: T[][] = [];
	for (let index = 0; index < arr.length; index += size) {
		result.push(arr.slice(index, index + size));
	}
	return result;
}

