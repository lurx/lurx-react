import type { Metadata } from 'next';
import { snippets } from '#velite';
import { IS_PREVIEW_ENV } from '@/app/utils/is-preview-env.util';
import { SnippetsPage } from './snippets-page.component';
import { sortSnippetsByDate } from './snippets-page.helpers';

export const metadata: Metadata = {
	title: 'Snippets',
	description:
		'A growing collection of small, reusable utility snippets — debounce, throttle, deep-clone, and more — with annotated TypeScript source.',
};

export default function SnippetsServerPage() {
	const publishedSnippets = sortSnippetsByDate(
		snippets.filter(snippet => IS_PREVIEW_ENV || !snippet.draft),
	);

	return <SnippetsPage snippets={publishedSnippets} />;
}
