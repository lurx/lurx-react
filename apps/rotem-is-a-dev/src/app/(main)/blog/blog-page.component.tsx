'use client';

import { FilterPanel, TextInput } from '@/app/components';
import { EMPTY_STATE_VARIANTS, EmptyState } from '@/app/components/empty-state';
import { TagFilter } from '@/app/components/tag-filter';
import { filterByTagsAndSearch } from '@/app/utils/filter-by-tags-and-search.util';
import { getAllTags } from '@/app/utils/get-all-tags.util';
import { toggleInArray } from '@/app/utils/toggle-in-array.util';
import type { BlogListItem, BlogPageProps } from './blog-page.types';
import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { groupPostsIntoListItems } from './blog-page.helpers';
import styles from './blog-page.module.scss';
import { BlogPostCard } from './components/blog-post-card.component';
import { BlogSeriesCard } from './components/blog-series-card';

export const BlogPage = ({ posts }: BlogPageProps) => {
	const [search, setSearch] = useState('');
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const handleSearchChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			setSearch(event.target.value);
		},
		[],
	);

	const allTags = useMemo(
		() => getAllTags(posts),
		[posts],
	);

	const toggleTag = useCallback((tag: string) => {
		setSelectedTags(prev => toggleInArray(prev, tag));
	}, []);

	const filteredPosts = filterByTagsAndSearch(posts, selectedTags, search);
	const listItems = groupPostsIntoListItems(filteredPosts);

	const renderListItem = (item: BlogListItem) => {
		if (item.type === 'series') {
			return <BlogSeriesCard key={item.meta.slug} meta={item.meta} posts={item.posts} />;
		}

		return <BlogPostCard key={item.post.slug} post={item.post} />;
	};

	const postListContent = listItems.length === 0
		? <EmptyState variant={EMPTY_STATE_VARIANTS.NO_POSTS}>No posts match the current filters.</EmptyState>
		: <ul className={styles.list}>
				{listItems.map(renderListItem)}
			</ul>;

	return (
		<div className={styles.page}>
			<FilterPanel>
				<TextInput
					label="_search:"
					value={search}
					onChange={handleSearchChange}
					placeholder="Search posts..."
				/>
				<TagFilter
					tags={allTags}
					selected={selectedTags}
					onToggleAction={toggleTag}
				/>
			</FilterPanel>

			<div className={styles.content}>
				{postListContent}
			</div>
		</div>
	);
};
