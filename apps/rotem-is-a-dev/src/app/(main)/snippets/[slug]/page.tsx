import '@/lib/mdx/velite-hmr-trigger';
import { snippets } from '#velite';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IS_PREVIEW_ENV } from '@/app/utils/is-preview-env.util';
import blogStyles from '../../blog/[slug]/blog-post.module.scss';
import { BackToSnippetsLink, SnippetHeader } from './components';
import type { SnippetPageProps } from './snippet-page.types';
import styles from './snippet.module.scss';

function getSnippetBySlug(slug: string) {
	return snippets.find(
		snippet => snippet.slug === slug && (IS_PREVIEW_ENV || !snippet.draft),
	);
}

export function generateStaticParams() {
	return snippets
		.filter(snippet => IS_PREVIEW_ENV || !snippet.draft)
		.map(snippet => ({ slug: snippet.slug }));
}

export async function generateMetadata({
	params,
}: SnippetPageProps): Promise<Metadata> {
	const { slug } = await params;
	const snippet = getSnippetBySlug(slug);

	if (!snippet) return {};

	return {
		title: snippet.title,
		description: snippet.description,
	};
}

export default async function SnippetPage({ params }: Readonly<SnippetPageProps>) {
	const { slug } = await params;
	const snippet = getSnippetBySlug(slug);

	if (!snippet) notFound();

	return (
		<article className={styles.page}>
			<BackToSnippetsLink />
			<SnippetHeader snippet={snippet} />
			<div
				className={blogStyles.content}
				dangerouslySetInnerHTML={{ __html: snippet.content }}
			/>
		</article>
	);
}
