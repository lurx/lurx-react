import type { AnyPost } from '../blog-page.types';

export type BlogPostCardProps = {
	post: AnyPost;
	onCommentClickAction?: (post: AnyPost) => void;
};
