import type { EntityType } from '@/app/components/comments/comments.types';

export type BlogPostCardFooterProps = {
	entityType: EntityType;
	entityId: string;
	onCommentClick: () => void;
};
