import type { Metadata } from 'next';
import { posts, mdxPosts } from '#velite';
import { IS_PREVIEW_ENV } from '@/app/utils/is-preview-env.util';
import { BlogPage } from './blog-page.component';

export const metadata: Metadata = {
	title: 'Blog',
	description:
		'Read the latest articles and insights from Rotem Horovitz on frontend development, web technologies, and more.',
};

export default function BlogServerPage() {
	const publishedPosts = [...posts, ...mdxPosts]
		.filter(post => IS_PREVIEW_ENV || !post.draft)
		.sort(
			(postA, postB) =>
				new Date(postB.date).getTime() -
				new Date(postA.date).getTime(),
		);

	return <BlogPage posts={publishedPosts} />;
}
