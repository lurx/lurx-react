import type { Post } from "@/.velite";

export type BlogTagProps = {
  tag: string;
};

export type BlogTagsListProps = {
  tags: string[];
};

export type BlogPostHeaderProps = {
  post: Post;
}
