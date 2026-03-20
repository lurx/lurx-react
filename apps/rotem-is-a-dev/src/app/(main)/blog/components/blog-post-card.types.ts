import type { Post } from '#velite';

export type BlogPostCardProps = {
	post: Post;
	onCommentClickAction?: (post: Post) => void;
};
