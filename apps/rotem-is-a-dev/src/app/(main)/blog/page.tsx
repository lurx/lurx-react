import type { Metadata } from 'next';
import { posts } from '#velite';
import { BlogPage } from './blog-page.component';

export const metadata: Metadata = {
	title: 'Blog',
	description:
		'Read the latest articles and insights from Rotem Horovitz on frontend development, web technologies, and more.',
};

export default function BlogServerPage() {
	const publishedPosts = posts
		.filter(post => !post.draft)
		.sort(
			(postA, postB) =>
				new Date(postB.date).getTime() -
				new Date(postA.date).getTime(),
		);

	return <BlogPage posts={publishedPosts} />;
}
