import { act, renderHook } from '@testing-library/react';
import type { EntityType } from '../../comments.types';
import { mockUseAuth } from '../../../../__test-utils__/social-mocks';

const mockAddDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockOnSnapshot = jest.fn();
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();

jest.mock('firebase/firestore', () => ({
	addDoc: (...args: unknown[]) => mockAddDoc(...args),
	deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
	onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
	collection: (...args: unknown[]) => mockCollection(...args),
	doc: (...args: unknown[]) => mockDoc(...args),
	query: (...args: unknown[]) => mockQuery(...args),
	where: (...args: unknown[]) => mockWhere(...args),
}));

jest.mock('@/lib/firebase', () => ({
	db: 'mock-db',
}));

jest.mock('@/app/context/auth', () => ({
	useAuth: () => require('@/app/__test-utils__/social-mocks').mockUseAuth(),
}));

import { useStars } from '../use-stars.hook';

const createStarDocs = (...userIds: string[]) =>
	userIds.map((userId, index) => ({
		id: `star-${index + 1}`,
		data: () => ({ entityType: 'project', entityId: '1', userId }),
	}));

const mockSnapshotWith = (docs: ReturnType<typeof createStarDocs>) => {
	const snapshot = { docs };
	mockOnSnapshot.mockImplementation((_query: unknown, onNext: (s: typeof snapshot) => void) => {
		onNext(snapshot);
		return jest.fn();
	});
};

beforeEach(() => {
	jest.clearAllMocks();
	mockOnSnapshot.mockReturnValue(jest.fn());
	mockQuery.mockReturnValue('mock-query');
	mockCollection.mockReturnValue('mock-collection');
	mockWhere.mockReturnValue('mock-where');
	mockDoc.mockReturnValue('mock-doc-ref');
});

describe('useStars', () => {
	it('starts with loading state', () => {
		const { result } = renderHook(() => useStars('project', '1'));
		expect(result.current.isLoading).toBe(true);
		expect(result.current.starCount).toBe(0);
		expect(result.current.hasUserStarred).toBe(false);
		expect(result.current.error).toBeNull();
	});

	it('creates a Firestore query with correct parameters', () => {
		renderHook(() => useStars('project', '1'));
		expect(mockCollection).toHaveBeenCalledWith('mock-db', 'stars');
		expect(mockWhere).toHaveBeenCalledWith('entityType', '==', 'project');
		expect(mockWhere).toHaveBeenCalledWith('entityId', '==', '1');
	});

	it('subscribes to snapshot updates', () => {
		renderHook(() => useStars('project', '1'));
		expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
	});

	it('updates star count when snapshot fires', () => {
		mockSnapshotWith(createStarDocs('user-1', 'user-2'));
		const { result } = renderHook(() => useStars('project', '1'));
		expect(result.current.starCount).toBe(2);
		expect(result.current.isLoading).toBe(false);
	});

	it('sets hasUserStarred to true when user has starred', () => {
		mockSnapshotWith(createStarDocs('user-1'));
		const { result } = renderHook(() => useStars('project', '1'));
		expect(result.current.hasUserStarred).toBe(true);
	});

	it('sets hasUserStarred to false when user has not starred', () => {
		mockSnapshotWith(createStarDocs('user-2'));
		const { result } = renderHook(() => useStars('project', '1'));
		expect(result.current.hasUserStarred).toBe(false);
	});

	it('sets error when snapshot fails', () => {
		mockOnSnapshot.mockImplementation(
			(queryArg: unknown, onNext: unknown, onError: (err: Error) => void) => {
				onError(new Error('Permission denied'));
				return jest.fn();
			},
		);

		const { result } = renderHook(() => useStars('project', '1'));
		expect(result.current.error).toBe('Permission denied');
		expect(result.current.isLoading).toBe(false);
	});

	it('unsubscribes on unmount', () => {
		const mockUnsubscribe = jest.fn();
		mockOnSnapshot.mockReturnValue(mockUnsubscribe);

		const { unmount } = renderHook(() => useStars('project', '1'));
		unmount();
		expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
	});

	it('adds a star when toggleStar is called and user has not starred', async () => {
		mockSnapshotWith([]);

		const { result } = renderHook(() => useStars('project', '1'));

		await act(async () => {
			await result.current.toggleStar();
		});

		expect(mockAddDoc).toHaveBeenCalledWith('mock-collection', {
			entityType: 'project',
			entityId: '1',
			userId: 'user-1',
		});
	});

	it('removes a star when toggleStar is called and user has already starred', async () => {
		mockSnapshotWith(createStarDocs('user-1'));

		const { result } = renderHook(() => useStars('project', '1'));

		await act(async () => {
			await result.current.toggleStar();
		});

		expect(mockDoc).toHaveBeenCalledWith('mock-db', 'stars', 'star-1');
		expect(mockDeleteDoc).toHaveBeenCalledWith('mock-doc-ref');
	});

	it('does not toggle when user is null', async () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		mockSnapshotWith([]);

		const { result } = renderHook(() => useStars('project', '1'));

		await act(async () => {
			await result.current.toggleStar();
		});

		expect(mockAddDoc).not.toHaveBeenCalled();
		expect(mockDeleteDoc).not.toHaveBeenCalled();
	});

	it.each<{ label: string; initial: { entityType: EntityType; entityId: string }; updated: { entityType: EntityType; entityId: string } }>([
		{ label: 'entityType', initial: { entityType: 'project', entityId: '1' }, updated: { entityType: 'blog', entityId: '1' } },
		{ label: 'entityId', initial: { entityType: 'project', entityId: '1' }, updated: { entityType: 'project', entityId: '2' } },
	])('resubscribes when $label changes', ({ initial, updated }) => {
		const mockUnsubscribe = jest.fn();
		mockOnSnapshot.mockReturnValue(mockUnsubscribe);

		const { rerender } = renderHook(
			({ entityType, entityId }) => useStars(entityType, entityId),
			{ initialProps: initial },
		);

		rerender(updated);
		expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
		expect(mockOnSnapshot).toHaveBeenCalledTimes(2);
	});
});
