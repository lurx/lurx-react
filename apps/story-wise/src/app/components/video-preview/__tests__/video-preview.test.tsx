import { render, screen } from '@testing-library/react';
import { VideoPreview } from '../video-preview';
import { renderWithMockStoryWise } from '../../../__tests__/test-utils';

describe('VideoPreview', () => {
	it('returns null when no sourceUrl', () => {
		const { container } = renderWithMockStoryWise(<VideoPreview />, {
			sourceUrl: null,
			sourceDuration: 0,
		});
		expect(container.firstChild).toBeNull();
	});

	it('renders video element when sourceUrl is set', () => {
		renderWithMockStoryWise(<VideoPreview />, {
			sourceUrl: 'blob:http://localhost/fake',
			sourceDuration: 100,
			segments: [],
		});
		const video = document.querySelector('video');
		expect(video).toBeInTheDocument();
		expect(video).toHaveAttribute('src', 'blob:http://localhost/fake');
	});

	it('renders play/pause button and seek range', () => {
		renderWithMockStoryWise(<VideoPreview />, {
			sourceUrl: 'blob:http://localhost/fake',
			sourceDuration: 100,
		});
		expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument();
		const range = document.querySelector('input[type="range"]');
		expect(range).toBeInTheDocument();
		expect(range).toHaveAttribute('max', '100');
	});

	it('shows selected segment info when a segment is selected', () => {
		renderWithMockStoryWise(<VideoPreview />, {
			sourceUrl: 'blob:http://localhost/fake',
			sourceDuration: 120,
			selectedSegmentId: 'seg-1',
			segments: [
				{
					id: 'seg-1',
					index: 1,
					startTime: 45,
					endTime: 90,
					duration: 45,
					blobUrl: 'blob:http://localhost/seg1',
					status: 'ready',
				},
			],
		});
		expect(screen.getByText(/previewing: segment 2/i)).toBeInTheDocument();
	});
});
