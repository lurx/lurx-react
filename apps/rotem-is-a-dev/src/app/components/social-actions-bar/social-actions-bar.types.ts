export type SocialActionsBarProps = {
	starCount: number;
	hasUserStarred: boolean;
	commentCount: number;
	hasUserCommented: boolean;
	isAuthenticated: boolean;
	onStarClickAction: () => void;
	onCommentClickAction: () => void;
	className?: string;
};
