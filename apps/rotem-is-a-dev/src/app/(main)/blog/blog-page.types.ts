import type { Post, MdxPost } from "@/.velite";
import type { SeriesMeta } from './data/blog-series.types';

export type AnyPost = Post | MdxPost;

export type BlogListPost = {
  type: 'post';
  post: AnyPost;
};

export type BlogListSeries = {
  type: 'series';
  meta: SeriesMeta;
  posts: AnyPost[];
};

export type BlogListItem = BlogListPost | BlogListSeries;

export type BlogTagProps = {
  tag: string;
  draft?: boolean;
};

export type BlogTagsListProps = {
  tags: string[];
  draft?: boolean;
};

export type BlogPostHeaderProps = {
  post: AnyPost;
  actions?: React.ReactNode;
}

export type BlogPageProps = {
  posts: AnyPost[];
}
