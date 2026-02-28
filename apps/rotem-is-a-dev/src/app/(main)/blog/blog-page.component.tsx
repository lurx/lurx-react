'use client';

import type { Post } from '#velite';
import { FilterPanel, TechnologyFilter, TextInput } from '@/app/components';
import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { getAllTags } from './blog-page.helpers';
import styles from './blog-page.module.scss';
import { BlogPostCard } from './components/blog-post-card.component';
import { NoPosts } from './components/no-posts.component';

interface BlogPageProps {
	posts: Post[];
}

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
		setSelectedTags(prev =>
			prev.includes(tag)
				? prev.filter(item => item !== tag)
				: [...prev, tag],
		);
	}, []);

	const searchLower = search.toLowerCase();

	const filteredPosts = posts.filter(post => {
		const matchesTags =
			selectedTags.length === 0 ||
			post.tags.some(tag => selectedTags.includes(tag));
		const matchesSearch =
			!search ||
			post.title.toLowerCase().includes(searchLower) ||
			post.description.toLowerCase().includes(searchLower);
		return matchesTags && matchesSearch;
	});

	const postListContent = filteredPosts.length === 0
		? <NoPosts />
		: <ul className={styles.list}>
				{filteredPosts.map(post => (
					<BlogPostCard key={post.slug} post={post} />
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
