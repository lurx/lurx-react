import type { Snippet } from '@/.velite';

export type SnippetItem = Snippet;

export type SnippetsPageProps = {
	snippets: SnippetItem[];
};

export type SnippetHeaderProps = {
	snippet: SnippetItem;
};
