import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressIndicator } from '../progress-indicator';
import { renderWithMockStoryWise } from '../../../__tests__/test-utils';

describe('ProgressIndicator', () => {
	it('returns null when status is idle', () => {
		const { container } = renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'idle',
		});
		expect(container.firstChild).toBeNull();
	});

	it('returns null when status is complete', () => {
		const { container } = renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'complete',
		});
		expect(container.firstChild).toBeNull();
	});

	it('returns null when status is error', () => {
		const { container } = renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'error',
		});
		expect(container.firstChild).toBeNull();
	});

	it('renders progress UI when splitting', () => {
		renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'splitting',
			processingProgress: { progress: 50, message: 'Splitting...' },
		});
		expect(screen.getByText(/splitting/i)).toBeInTheDocument();
		expect(screen.getByText(/50%/)).toBeInTheDocument();
		expect(document.querySelector('progress')).toHaveAttribute('value', '50');
	});

	it('shows Cloud processing badge when mode is cloud', () => {
		renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'splitting',
			processingMode: 'cloud',
			processingProgress: { progress: 10, message: 'Uploading...' },
		});
		expect(screen.getByText(/cloud processing \(fast\)/i)).toBeInTheDocument();
	});

	it('shows Processing in your browser when mode is client', () => {
		renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'splitting',
			processingMode: 'client',
			processingProgress: { progress: 10, message: 'Loading...' },
		});
		expect(screen.getByText(/processing in your browser/i)).toBeInTheDocument();
	});

	it('calls cancelProcessing when Cancel is clicked', () => {
		const cancelProcessing = jest.fn();
		renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'splitting',
			processingProgress: { progress: 30, message: 'Working...' },
			cancelProcessing,
		});
		fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
		expect(cancelProcessing).toHaveBeenCalled();
	});

	it('uses message and progress from processingProgress', () => {
		renderWithMockStoryWise(<ProgressIndicator />, {
			processingStatus: 'analyzing',
			processingProgress: { progress: 75, message: 'Analyzing video...' },
		});
		expect(screen.getByText(/analyzing video/i)).toBeInTheDocument();
		expect(screen.getByText(/75%/)).toBeInTheDocument();
	});
});
