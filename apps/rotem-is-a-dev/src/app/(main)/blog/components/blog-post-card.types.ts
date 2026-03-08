import type { Post } from '#velite';

export type BlogPostCardProps = {
	post: Post;
	onCommentClick?: (post: Post) => void;
};
