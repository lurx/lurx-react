import type { AnyPost } from '../../../../blog-page.types';

export type BlogSeriesMiniCardProps = {
	post: AnyPost;
	partNumber: number;
	sharedTags: string[];
};
