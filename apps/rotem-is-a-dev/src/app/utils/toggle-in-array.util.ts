export const toggleInArray = <T>(array: T[], item: T): T[] =>
	array.includes(item)
		? array.filter(element => element !== item)
		: [...array, item];
