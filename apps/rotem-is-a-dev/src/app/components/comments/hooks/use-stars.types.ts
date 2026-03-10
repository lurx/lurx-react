export type StarData = {
	entityType: string;
	entityId: string;
	userId: string;
};

export type Star = StarData & {
	id: string;
};

export type UseStarsReturn = {
	starCount: number;
	hasUserStarred: boolean;
	isLoading: boolean;
	error: Nullable<string>;
	toggleStar: () => Promise<void>;
};
