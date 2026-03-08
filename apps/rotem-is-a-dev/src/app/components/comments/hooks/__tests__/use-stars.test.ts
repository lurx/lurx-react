import { act, renderHook } from '@testing-library/react';

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

import { useStars } from '../use-stars.hook';

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
		const mockSnapshot = {
			docs: [
				{
					id: 'star-1',
					data: () => ({
						entityType: 'project',
						entityId: '1',
						userId: 'user-1',
					}),
				},
				{
					id: 'star-2',
					data: () => ({
						entityType: 'project',
						entityId: '1',
						userId: 'user-2',
					}),
				},
			],
		};

		mockOnSnapshot.mockImplementation((queryArg: unknown, onNext: (snap: typeof mockSnapshot) => void) => {
			onNext(mockSnapshot);
			return jest.fn();
		});

		const { result } = renderHook(() => useStars('project', '1'));
		expect(result.current.starCount).toBe(2);
		expect(result.current.isLoading).toBe(false);
	});

	it('sets hasUserStarred to true when user has starred', () => {
		const mockSnapshot = {
			docs: [
				{
					id: 'star-1',
					data: () => ({
						entityType: 'project',
						entityId: '1',
						userId: 'user-1',
					}),
				},
			],
		};

		mockOnSnapshot.mockImplementation((queryArg: unknown, onNext: (snap: typeof mockSnapshot) => void) => {
			onNext(mockSnapshot);
			return jest.fn();
		});

		const { result } = renderHook(() => useStars('project', '1'));
		expect(result.current.hasUserStarred).toBe(true);
	});

	it('sets hasUserStarred to false when user has not starred', () => {
		const mockSnapshot = {
			docs: [
				{
					id: 'star-1',
					data: () => ({
						entityType: 'project',
						entityId: '1',
						userId: 'user-2',
					}),
				},
			],
		};

		mockOnSnapshot.mockImplementation((queryArg: unknown, onNext: (snap: typeof mockSnapshot) => void) => {
			onNext(mockSnapshot);
			return jest.fn();
		});

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
		mockOnSnapshot.mockImplementation((queryArg: unknown, onNext: (snap: { docs: unknown[] }) => void) => {
			onNext({ docs: [] });
			return jest.fn();
		});

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
		const mockSnapshot = {
			docs: [
				{
					id: 'star-1',
					data: () => ({
						entityType: 'project',
						entityId: '1',
						userId: 'user-1',
					}),
				},
			],
		};

		mockOnSnapshot.mockImplementation((queryArg: unknown, onNext: (snap: typeof mockSnapshot) => void) => {
			onNext(mockSnapshot);
			return jest.fn();
		});

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

		mockOnSnapshot.mockImplementation((queryArg: unknown, onNext: (snap: { docs: unknown[] }) => void) => {
			onNext({ docs: [] });
			return jest.fn();
		});

		const { result } = renderHook(() => useStars('project', '1'));

		await act(async () => {
			await result.current.toggleStar();
		});

		expect(mockAddDoc).not.toHaveBeenCalled();
		expect(mockDeleteDoc).not.toHaveBeenCalled();
	});

	it('resubscribes when entityType changes', () => {
		const mockUnsubscribe = jest.fn();
		mockOnSnapshot.mockReturnValue(mockUnsubscribe);

		const { rerender } = renderHook(
			({ entityType, entityId }) => useStars(entityType, entityId),
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
			({ entityType, entityId }) => useStars(entityType, entityId),
			{ initialProps: { entityType: 'project' as const, entityId: '1' } },
		);

		rerender({ entityType: 'project' as const, entityId: '2' });
		expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
		expect(mockOnSnapshot).toHaveBeenCalledTimes(2);
	});
});
