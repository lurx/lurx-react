import { render, screen } from '@testing-library/react';
import { VideoUploader } from '../video-uploader';
import { renderWithMockStoryWise } from '../../../__tests__/test-utils';

describe('VideoUploader', () => {
	it('renders dropzone with prompt', () => {
		renderWithMockStoryWise(<VideoUploader />);
		expect(screen.getByText(/drag and drop your video here/i)).toBeInTheDocument();
		expect(screen.getByText(/supports mp4, mov, webm, avi/i)).toBeInTheDocument();
	});

	it('shows processing error when set', () => {
		renderWithMockStoryWise(<VideoUploader />, {
			processingError: {
				code: 'INVALID_FORMAT',
				message: 'Invalid format',
				suggestion: 'Use MP4',
				recoverable: true,
			},
		});
		expect(screen.getByText(/invalid format/i)).toBeInTheDocument();
		expect(screen.getByText(/use mp4/i)).toBeInTheDocument();
	});

	it('renders file input for dropzone', () => {
		renderWithMockStoryWise(<VideoUploader />);
		const input = document.querySelector('input[type="file"]');
		expect(input).toBeInTheDocument();
	});
});
