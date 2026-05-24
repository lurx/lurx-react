'use client';

import { FilterPanel, TextInput } from '@/app/components';
import { EMPTY_STATE_VARIANTS, EmptyState } from '@/app/components/empty-state';
import { TagFilter } from '@/app/components/tag-filter';
import { filterByTagsAndSearch } from '@/app/utils/filter-by-tags-and-search.util';
import { getAllTags } from '@/app/utils/get-all-tags.util';
import { toggleInArray } from '@/app/utils/toggle-in-array.util';
import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { SnippetCard } from './components';
import styles from './snippets-page.module.scss';
import type { SnippetItem, SnippetsPageProps } from './snippets-page.types';

export const SnippetsPage = ({ snippets }: SnippetsPageProps) => {
	const [search, setSearch] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const allTags = useMemo(() => getAllTags(snippets), [snippets]);

	const handleSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		},
		[],
	);

	const toggleTag = useCallback((tag: string) => {
		setSelectedTags(previous => toggleInArray(previous, tag));
	}, []);

	const filteredSnippets = filterByTagsAndSearch(snippets, selectedTags, search);

	const renderSnippet = (snippet: SnippetItem) => (
		<SnippetCard key={snippet.slug} snippet={snippet} />
	);

	const listContent = filteredSnippets.length === 0
		? <EmptyState variant={EMPTY_STATE_VARIANTS.NO_POSTS}>No snippets match the current filters.</EmptyState>
		: <ul className={styles.list}>{filteredSnippets.map(renderSnippet)}</ul>;

	return (
		<div className={styles.page}>
			<FilterPanel>
				<TextInput
					label="_search:"
					value={search}
					onChange={handleSearchChange}
					placeholder="Search snippets..."
				/>
				<TagFilter
					tags={allTags}
					selected={selectedTags}
					onToggleAction={toggleTag}
				/>
			</FilterPanel>
			<div className={styles.content}>{listContent}</div>
		</div>
	);
};
