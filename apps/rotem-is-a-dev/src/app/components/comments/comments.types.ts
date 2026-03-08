import type { Timestamp } from 'firebase/firestore';
import type { ENTITY_TYPES } from './comments.constants';

export type EntityType = ExtractObjectValues<typeof ENTITY_TYPES>;

export type CommentData = {
	entityType: EntityType;
	entityId: string;
	userId: string;
	displayName: string;
	photoURL: Nullable<string>;
	provider: string;
	text: string;
	createdAt: Timestamp;
};

export type Comment = CommentData & {
	id: string;
};

export type CommentsProps = {
	entityType: EntityType;
	entityId: string;
};
