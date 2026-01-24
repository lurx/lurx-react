import { render, screen, fireEvent } from '@testing-library/react';
import StoryWisePage from '../page';
import { renderWithMockStoryWise } from './test-utils';

jest.mock('../components/status-badge/status-badge', () => ({
	StatusBadge: () => null,
}));

const healthResponse = {
	status: 'healthy' as const,
	cloud: { enabled: false, connected: false },
	processor: { configured: false },
	mode: 'client-only' as const,
	timestamp: new Date().toISOString(),
};

beforeEach(() => {
	(global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
		ok: true,
		json: async () => healthResponse,
	});
});

describe('StoryWisePage', () => {
	it('shows tagline', () => {
		renderWithMockStoryWise(<StoryWisePage />);
		expect(screen.getByText(/split your videos into story-sized clips/i)).toBeInTheDocument();
	});

	it('shows OfflineScreen when service is offline', () => {
		renderWithMockStoryWise(<StoryWisePage />, {
			serviceStatus: { online: false, message: 'Quota exceeded' },
		});
		expect(screen.getByRole('heading', { name: /temporarily offline/i })).toBeInTheDocument();
		expect(screen.getByText(/quota exceeded/i)).toBeInTheDocument();
	});

	it('shows VideoUploader when no video and not processing', () => {
		renderWithMockStoryWise(<StoryWisePage />);
		expect(screen.getByText(/drag and drop your video here/i)).toBeInTheDocument();
	});

	it('shows VideoPreview and segment form when has video, no segments, not processing', () => {
		renderWithMockStoryWise(<StoryWisePage />, {
			sourceUrl: 'blob:http://localhost/fake',
			sourceDuration: 120,
			segments: [],
			processingStatus: 'idle',
		});
		expect(screen.getByLabelText(/segment duration/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /choose different video/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /split video/i })).toBeInTheDocument();
	});

	it('shows processing error when set', () => {
		renderWithMockStoryWise(<StoryWisePage />, {
			sourceUrl: 'blob:http://localhost/fake',
			sourceDuration: 120,
			segments: [],
			processingStatus: 'error',
			processingError: { code: 'INVALID_FORMAT', message: 'Unsupported format', recoverable: true },
		});
		expect(screen.getByText(/unsupported format/i)).toBeInTheDocument();
	});

	it('shows ProgressIndicator when processing', () => {
		renderWithMockStoryWise(<StoryWisePage />, {
			sourceUrl: 'blob:http://localhost/fake',
			processingStatus: 'splitting',
		});
		expect(screen.getByText(/processing/i)).toBeInTheDocument();
	});

	it('shows VideoPreview, SegmentList, and Start Over when complete with segments', () => {
		renderWithMockStoryWise(<StoryWisePage />, {
			sourceUrl: 'blob:http://localhost/fake',
			sourceDuration: 120,
			processingStatus: 'complete',
			segments: [
				{
					id: 'seg-0',
					index: 0,
					startTime: 0,
					endTime: 45,
					duration: 45,
					blobUrl: 'blob:http://localhost/seg0',
					status: 'ready' as const,
				},
			],
		});
		expect(screen.getByText(/segments \(1\)/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /start over/i })).toBeInTheDocument();
	});

	it('reset and startProcessing are called when buttons clicked', () => {
		const reset = jest.fn();
		const startProcessing = jest.fn().mockResolvedValue(undefined);
		renderWithMockStoryWise(<StoryWisePage />, {
			sourceUrl: 'blob:http://localhost/fake',
			sourceDuration: 120,
			segments: [],
			processingStatus: 'idle',
			reset,
			startProcessing,
		});

		fireEvent.click(screen.getByRole('button', { name: /split video/i }));
		expect(startProcessing).toHaveBeenCalled();

		fireEvent.click(screen.getByRole('button', { name: /choose different video/i }));
		expect(reset).toHaveBeenCalled();
	});
});
