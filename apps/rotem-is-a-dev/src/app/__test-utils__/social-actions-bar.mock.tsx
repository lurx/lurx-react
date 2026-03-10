export const SocialActionsBar = ({
	starCount,
	hasUserStarred,
	commentCount,
	hasUserCommented,
	isAuthenticated,
	onStarClick,
	onCommentClick,
}: {
	starCount: number;
	hasUserStarred: boolean;
	commentCount: number;
	hasUserCommented: boolean;
	isAuthenticated: boolean;
	onStarClick: () => void;
	onCommentClick: () => void;
}) => (
	<button
		type="button"
		data-testid="social-actions-bar"
		data-star-count={starCount}
		data-has-user-starred={hasUserStarred}
		data-comment-count={commentCount}
		data-has-user-commented={hasUserCommented}
		data-is-authenticated={isAuthenticated}
		onClick={onStarClick}
		onDoubleClick={onCommentClick}
	/>
);
