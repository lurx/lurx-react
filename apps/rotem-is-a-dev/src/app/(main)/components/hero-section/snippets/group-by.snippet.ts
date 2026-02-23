export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
	return arr.reduce<Record<string, T[]>>((acc, item) => {
		const group = String(item[key]);
		if (!acc[group]) acc[group] = [];
		acc[group].push(item);
		return acc;
	}, {});
}
