import { act, renderHook } from '@testing-library/react';

const mockAddDoc = jest.fn();
const mockDeleteDoc = jest.fn();
const mockOnSnapshot = jest.fn();
const mockCollection = jest.fn();
const mockDoc = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockServerTimestamp = jest.fn(() => 'SERVER_TIMESTAMP');

jest.mock('firebase/firestore', () => ({
	addDoc: (...args: unknown[]) => mockAddDoc(...args),
	deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
	onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
	collection: (...args: unknown[]) => mockCollection(...args),
	doc: (...args: unknown[]) => mockDoc(...args),
	query: (...args: unknown[]) => mockQuery(...args),
	where: (...args: unknown[]) => mockWhere(...args),
	orderBy: (...args: unknown[]) => mockOrderBy(...args),
	serverTimestamp: () => mockServerTimestamp(),
}));

jest.mock('@/lib/firebase', () => ({
	db: 'mock-db',
}));

const mockUser = {
	uid: 'user-1',
	displayName: 'Test User',
	photoURL: 'https://example.com/photo.jpg',
	provider: 'google',
	email: 'test@example.com',
};

const mockUseAuth = jest.fn(() => ({
	user: mockUser,
	isLoading: false,
	signInWithGoogle: jest.fn(),
	signInWithGitHub: jest.fn(),
	signOut: jest.fn(),
}));

jest.mock('@/app/context/auth', () => ({
	useAuth: () => mockUseAuth(),
}));

import { useComments } from '../use-comments.hook';

beforeEach(() => {
	jest.clearAllMocks();
	mockOnSnapshot.mockReturnValue(jest.fn());
	mockQuery.mockReturnValue('mock-query');
	mockCollection.mockReturnValue('mock-collection');
	mockWhere.mockReturnValue('mock-where');
	mockOrderBy.mockReturnValue('mock-order-by');
	mockDoc.mockReturnValue('mock-doc-ref');
});

describe('useComments', () => {
	it('starts with loading state', () => {
		const { result } = renderHook(() => useComments('project', '1'));
		expect(result.current.isLoading).toBe(true);
		expect(result.current.comments).toEqual([]);
		expect(result.current.error).toBeNull();
	});

	it('creates a Firestore query with correct parameters', () => {
		renderHook(() => useComments('project', '1'));
		expect(mockCollection).toHaveBeenCalledWith('mock-db', 'comments');
		expect(mockWhere).toHaveBeenCalledWith('entityType', '==', 'project');
		expect(mockWhere).toHaveBeenCalledWith('entityId', '==', '1');
		expect(mockOrderBy).toHaveBeenCalledWith('createdAt', 'desc');
	});

	it('subscribes to snapshot updates', () => {
		renderHook(() => useComments('project', '1'));
		expect(mockOnSnapshot).toHaveBeenCalledTimes(1);
	});

	it('updates comments when snapshot fires', () => {
		const mockSnapshot = {
			docs: [
				{
					id: 'comment-1',
					data: () => ({
						entityType: 'project',
						entityId: '1',
						userId: 'user-1',
						displayName: 'Test User',
						photoURL: null,
						provider: 'google',
						text: 'Hello!',
						createdAt: { toMillis: () => Date.now() },
					}),
				},
			],
		};

		mockOnSnapshot.mockImplementation((queryArg: unknown, onNext: (snap: typeof mockSnapshot) => void) => {
			onNext(mockSnapshot);
			return jest.fn();
		});

		const { result } = renderHook(() => useComments('project', '1'));
		expect(result.current.comments).toHaveLength(1);
		expect(result.current.comments[0].id).toBe('comment-1');
		expect(result.current.comments[0].text).toBe('Hello!');
		expect(result.current.isLoading).toBe(false);
	});

	it('sets error when snapshot fails', () => {
		mockOnSnapshot.mockImplementation(
			(queryArg: unknown, onNext: unknown, onError: (err: Error) => void) => {
				onError(new Error('Permission denied'));
				return jest.fn();
			},
		);

		const { result } = renderHook(() => useComments('project', '1'));
		expect(result.current.error).toBe('Permission denied');
		expect(result.current.isLoading).toBe(false);
	});

	it('unsubscribes on unmount', () => {
		const mockUnsubscribe = jest.fn();
		mockOnSnapshot.mockReturnValue(mockUnsubscribe);

		const { unmount } = renderHook(() => useComments('project', '1'));
		unmount();
		expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
	});

	it('calls addDoc with correct data when addComment is called', async () => {
		const { result } = renderHook(() => useComments('project', '1'));

		await act(async () => {
			await result.current.addComment('Great project!');
		});

		expect(mockAddDoc).toHaveBeenCalledWith('mock-collection', {
			entityType: 'project',
			entityId: '1',
			userId: 'user-1',
			displayName: 'Test User',
			photoURL: 'https://example.com/photo.jpg',
			provider: 'google',
			text: 'Great project!',
			createdAt: 'SERVER_TIMESTAMP',
		});
	});

	it('does not call addDoc when user is null', async () => {
		mockUseAuth.mockReturnValue({
			user: null,
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		const { result } = renderHook(() => useComments('project', '1'));

		await act(async () => {
			await result.current.addComment('Should not post');
		});

		expect(mockAddDoc).not.toHaveBeenCalled();
	});

	it('calls deleteDoc with correct document reference', async () => {
		const { result } = renderHook(() => useComments('project', '1'));

		await act(async () => {
			await result.current.deleteComment('comment-123');
		});

		expect(mockDoc).toHaveBeenCalledWith('mock-db', 'comments', 'comment-123');
		expect(mockDeleteDoc).toHaveBeenCalledWith('mock-doc-ref');
	});

	it('resubscribes when entityType changes', () => {
		const mockUnsubscribe = jest.fn();
		mockOnSnapshot.mockReturnValue(mockUnsubscribe);

		const { rerender } = renderHook(
			({ entityType, entityId }) => useComments(entityType, entityId),
			{ initialProps: { entityType: 'project' as const, entityId: '1' } },
		);

		rerender({ entityType: 'blog' as const, entityId: '1' });
		expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
		expect(mockOnSnapshot).toHaveBeenCalledTimes(2);
	});

	it('resubscribes when entityId changes', () => {
		const mockUnsubscribe = jest.fn();
		mockOnSnapshot.mockReturnValue(mockUnsubscribe);

		const { rerender } = renderHook(
			({ entityType, entityId }) => useComments(entityType, entityId),
			{ initialProps: { entityType: 'project' as const, entityId: '1' } },
		);

		rerender({ entityType: 'project' as const, entityId: '2' });
		expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
		expect(mockOnSnapshot).toHaveBeenCalledTimes(2);
	});

	it('uses empty string for displayName when user displayName is null', async () => {
		mockUseAuth.mockReturnValue({
			user: { ...mockUser, displayName: null },
			isLoading: false,
			signInWithGoogle: jest.fn(),
			signInWithGitHub: jest.fn(),
			signOut: jest.fn(),
		});

		const { result } = renderHook(() => useComments('project', '1'));

		await act(async () => {
			await result.current.addComment('Hello');
		});

		expect(mockAddDoc).toHaveBeenCalledWith(
			'mock-collection',
			expect.objectContaining({ displayName: '' }),
		);
	});
});
