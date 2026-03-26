import type { Post } from "@/.velite";

export type BlogTagProps = {
  tag: string;
  draft?: boolean;
};

export type BlogTagsListProps = {
  tags: string[];
  draft?: boolean;
};

export type BlogPostHeaderProps = {
  post: Post;
  actions?: React.ReactNode;
}

export type BlogPageProps = {
  posts: Post[];
}
