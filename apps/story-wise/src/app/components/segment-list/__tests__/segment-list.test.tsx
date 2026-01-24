import { render, screen, fireEvent } from '@testing-library/react';
import { SegmentList } from '../segment-list';
import { renderWithMockStoryWise } from '../../../__tests__/test-utils';

const mockSegments = [
	{
		id: 'seg-0',
		index: 0,
		startTime: 0,
		endTime: 45,
		duration: 45,
		blobUrl: 'blob:http://localhost/0',
		status: 'ready' as const,
		fileSize: 1000000,
	},
	{
		id: 'seg-1',
		index: 1,
		startTime: 45,
		endTime: 90,
		duration: 45,
		blobUrl: 'blob:http://localhost/1',
		status: 'ready' as const,
	},
];

describe('SegmentList', () => {
	it('returns null when no segments', () => {
		const { container } = renderWithMockStoryWise(<SegmentList />, {
			segments: [],
		});
		expect(container.firstChild).toBeNull();
	});

	it('renders segment count and Download All button', () => {
		renderWithMockStoryWise(<SegmentList />, {
			segments: mockSegments,
			processingStatus: 'complete',
		});
		expect(screen.getByText(/segments \(2\)/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /download all/i })).toBeInTheDocument();
	});

	it('disables Download All when not complete', () => {
		renderWithMockStoryWise(<SegmentList />, {
			segments: mockSegments,
			processingStatus: 'splitting',
		});
		expect(screen.getByRole('button', { name: /download all/i })).toBeDisabled();
	});

	it('renders each segment with Part N and times', () => {
		renderWithMockStoryWise(<SegmentList />, {
			segments: mockSegments,
			processingStatus: 'complete',
		});
		expect(screen.getByText(/part 1/i)).toBeInTheDocument();
		expect(screen.getByText(/part 2/i)).toBeInTheDocument();
	});

	it('calls selectSegment when segment row is clicked', () => {
		const selectSegment = jest.fn();
		renderWithMockStoryWise(<SegmentList />, {
			segments: mockSegments,
			processingStatus: 'complete',
			selectSegment,
		});
		fireEvent.click(screen.getByText(/part 1/i));
		expect(selectSegment).toHaveBeenCalledWith('seg-0');
	});

	it('calls downloadSegment when segment download button is clicked', () => {
		const downloadSegment = jest.fn();
		renderWithMockStoryWise(<SegmentList />, {
			segments: mockSegments,
			processingStatus: 'complete',
			downloadSegment,
		});
		const downloadBtn = screen.getByRole('button', { name: /download segment 1/i });
		fireEvent.click(downloadBtn);
		expect(downloadSegment).toHaveBeenCalledWith('seg-0');
	});

	it('calls downloadAllSegments when Download All is clicked', () => {
		const downloadAllSegments = jest.fn();
		renderWithMockStoryWise(<SegmentList />, {
			segments: mockSegments,
			processingStatus: 'complete',
			downloadAllSegments,
		});
		fireEvent.click(screen.getByRole('button', { name: /download all/i }));
		expect(downloadAllSegments).toHaveBeenCalled();
	});
});
