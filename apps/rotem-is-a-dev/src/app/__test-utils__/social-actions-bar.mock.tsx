export const SocialActionsBar = ({
	starCount,
	hasUserStarred,
	commentCount,
	hasUserCommented,
	isAuthenticated,
	onStarClickAction,
	onCommentClickAction,
}: {
	starCount: number;
	hasUserStarred: boolean;
	commentCount: number;
	hasUserCommented: boolean;
	isAuthenticated: boolean;
	onStarClickAction: () => void;
	onCommentClickAction: () => void;
}) => (
	<button
		type="button"
		data-testid="social-actions-bar"
		data-star-count={starCount}
		data-has-user-starred={hasUserStarred}
		data-comment-count={commentCount}
		data-has-user-commented={hasUserCommented}
		data-is-authenticated={isAuthenticated}
		onClick={onStarClickAction}
		onDoubleClick={onCommentClickAction}
	/>
);
