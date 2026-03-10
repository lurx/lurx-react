import type { EntityType } from '@/app/components/comments/comments.types';

export type ProjectCardFooterProps = {
	entityType: EntityType;
	entityId: string;
	onCommentClick: () => void;
	onViewClick?: () => void;
};
