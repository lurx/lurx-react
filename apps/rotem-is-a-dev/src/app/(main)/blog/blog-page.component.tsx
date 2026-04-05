'use client';

import { FilterPanel, TextInput } from '@/app/components';
import { EMPTY_STATE_VARIANTS, EmptyState } from '@/app/components/empty-state';
import { toggleInArray } from '@/app/utils/toggle-in-array.util';
import type { AnyPost, BlogListItem, BlogPageProps } from './blog-page.types';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { filterPosts, getAllTags, groupPostsIntoListItems } from './blog-page.helpers';
import styles from './blog-page.module.scss';
import { BlogPostCard } from './components/blog-post-card.component';
import { BlogTagFilter } from './components/blog-tag-filter';
import { BlogSeriesCard } from './components/blog-series-card';

export const BlogPage = ({ posts }: BlogPageProps) => {
	const router = useRouter();
	const [search, setSearch] = useState('');
	const [selectedTags, setSelectedTags] = useState<Technology[]>([]);

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

	const toggleTag = useCallback((tag: Technology) => {
		setSelectedTags(prev => toggleInArray(prev, tag));
	}, []);

	const handleCommentClick = useCallback((post: AnyPost) => {
		router.push(`/blog/${post.slug}`);
	}, [router]);

	const filteredPosts = filterPosts(posts, selectedTags, search);
	const listItems = groupPostsIntoListItems(filteredPosts);

	const renderListItem = (item: BlogListItem) => {
		if (item.type === 'series') {
			return <BlogSeriesCard key={item.meta.slug} meta={item.meta} posts={item.posts} />;
		}

		return <BlogPostCard key={item.post.slug} post={item.post} onCommentClickAction={handleCommentClick} />;
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
				<BlogTagFilter
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
