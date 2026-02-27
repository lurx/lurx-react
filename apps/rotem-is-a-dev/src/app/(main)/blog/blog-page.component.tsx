'use client';

import type { Post } from '#velite';
import { FilterPanel, TechnologyFilter, TextInput } from '@/app/components';
import Link from 'next/link';
import { type ChangeEvent, useCallback, useMemo, useState } from 'react';
import { formatDate, getAllTags } from './blog-page.helpers';
import styles from './blog-page.module.scss';
import { BlogTagsList } from './components';
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
				{filteredPosts.length === 0 ? (
          <NoPosts />
				) : (
					<ul className={styles.list}>
						{filteredPosts.map(post => (
							<li key={post.slug}>
								<Link
									href={`/blog/${post.slug}`}
									className={styles.card}
								>
									<h2 className={styles.cardTitle}>
										{post.title}
									</h2>
									<div className={styles.cardMeta}>
										<time dateTime={post.date}>
											{formatDate(post.date)}
										</time>
										<span>
											{post.metadata.readingTime} min read
										</span>
									</div>
									<p className={styles.cardDescription}>
										{post.description}
									</p>
									<BlogTagsList tags={post.tags} />
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};
