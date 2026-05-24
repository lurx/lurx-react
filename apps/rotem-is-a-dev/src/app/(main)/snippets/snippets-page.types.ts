import type { Snippet } from '@/.velite';

export type SnippetItem = Snippet;

export type SnippetsPageProps = {
	snippets: SnippetItem[];
};

export type SnippetTagProps = {
	tag: string;
	draft?: boolean;
};

export type SnippetTagsListProps = {
	tags: string[];
	draft?: boolean;
};

export type SnippetHeaderProps = {
	snippet: SnippetItem;
};
