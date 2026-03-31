import type { Post, MdxPost } from "@/.velite";

export type AnyPost = Post | MdxPost;

export type BlogTagProps = {
  tag: string;
};

export type BlogTagsListProps = {
  tags: string[];
};

export type BlogPostHeaderProps = {
  post: AnyPost;
  actions?: React.ReactNode;
}

export type BlogPageProps = {
  posts: AnyPost[];
}
