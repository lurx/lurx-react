'use client';

import { FilterPanel, TechnologyFilter, TextInput } from '@/app/components';
import { EMPTY_STATE_VARIANTS, EmptyState } from '@/app/components/empty-state';
import { toggleInArray } from '@/app/utils/toggle-in-array.util';
import type { Post } from '#velite';
import { useRouter } from 'next/navigation';
import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { filterPosts, getAllTags } from './blog-page.helpers';
import styles from './blog-page.module.scss';
import type { BlogPageProps } from './blog-page.types';
import { BlogPostCard } from './components/blog-post-card.component';

export const BlogPage = ({ posts }: BlogPageProps) => {
	const router = useRouter();
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

	const handleCommentClick = useCallback((post: Post) => {
		router.push(`/blog/${post.slug}`);
	}, [router]);

	const filteredPosts = filterPosts(posts, selectedTags, search);

	const postListContent = filteredPosts.length === 0
		? <EmptyState variant={EMPTY_STATE_VARIANTS.NO_POSTS}>No posts match the current filters.</EmptyState>
		: <ul className={styles.list}>
				{filteredPosts.map(post => (
					<BlogPostCard key={post.slug} post={post} onCommentClick={handleCommentClick} />
				))}
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
				<TechnologyFilter
					technologies={allTags}
					selected={selectedTags}
					onToggle={toggleTag}
					sectionLabel="tags"
				/>
			</FilterPanel>

			<div className={styles.content}>
				{postListContent}
			</div>
		</div>
	);
};
