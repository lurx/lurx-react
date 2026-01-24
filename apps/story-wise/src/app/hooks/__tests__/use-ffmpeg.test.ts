import { renderHook, act, waitFor } from '@testing-library/react';
import { useFFmpeg } from '../use-ffmpeg';

const mockLoad = jest.fn().mockResolvedValue(undefined);
const mockWriteFile = jest.fn().mockResolvedValue(undefined);
const mockExec = jest.fn().mockResolvedValue(undefined);
const mockReadFile = jest.fn().mockResolvedValue(new Uint8Array(100));
const mockDeleteFile = jest.fn().mockResolvedValue(undefined);
const mockTerminate = jest.fn();
const mockOn = jest.fn();
const mockOff = jest.fn();

jest.mock('@ffmpeg/ffmpeg', () => ({
	FFmpeg: jest.fn().mockImplementation(() => ({
		load: mockLoad,
		writeFile: mockWriteFile,
		readFile: mockReadFile,
		exec: mockExec,
		deleteFile: mockDeleteFile,
		terminate: mockTerminate,
		on: mockOn,
		off: mockOff,
	})),
}));

const mockFetchFile = jest.fn().mockResolvedValue(new Uint8Array(10));
jest.mock('@ffmpeg/util', () => ({
	fetchFile: (...args: unknown[]) => mockFetchFile(...args),
}));

describe('useFFmpeg', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockLoad.mockResolvedValue(undefined);
	});

	it('returns isLoaded false and isLoading false initially', () => {
		const { result } = renderHook(() => useFFmpeg());
		expect(result.current.isLoaded).toBe(false);
		expect(result.current.isLoading).toBe(false);
		expect(result.current.loadError).toBeNull();
	});

	it('load() sets isLoading and then isLoaded after resolve', async () => {
		const { result } = renderHook(() => useFFmpeg());

		act(() => {
			result.current.load();
		});

		expect(result.current.isLoading).toBe(true);

		await waitFor(() => {
			expect(result.current.isLoaded).toBe(true);
			expect(result.current.isLoading).toBe(false);
		});
	});

	it('splitVideo throws when not loaded', async () => {
		const { result } = renderHook(() => useFFmpeg());

		await expect(
			result.current.splitVideo({
				inputFile: new File(['x'], 'x.mp4', { type: 'video/mp4' }),
				segmentDuration: 30,
				outputFormat: 'mp4',
				quality: 'medium',
			})
		).rejects.toThrow(/FFmpeg is not loaded/);
	});

	it('getMetadata throws when not loaded', async () => {
		const { result } = renderHook(() => useFFmpeg());

		await expect(
			result.current.getMetadata(new File(['x'], 'x.mp4', { type: 'video/mp4' }))
		).rejects.toThrow(/FFmpeg is not loaded/);
	});

	it('terminate does not throw when called', () => {
		const { result } = renderHook(() => useFFmpeg());
		expect(() => result.current.terminate()).not.toThrow();
	});
});
