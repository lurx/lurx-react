export type SocialActionsBarProps = {
	starCount: number;
	hasUserStarred: boolean;
	commentCount: number;
	hasUserCommented: boolean;
	isAuthenticated: boolean;
	onStarClick: () => void;
	onCommentClick: () => void;
};
