import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockCleanup = jest.fn();
const mockRenderCvOffscreen = jest.fn(() => ({
	container: document.createElement('div'),
	cleanup: mockCleanup,
}));

const mockGenerateCvPdf = jest.fn(() => Promise.resolve());

jest.mock('@/app/cv/utils/render-cv-offscreen', () => ({
	renderCvOffscreen: (...args: unknown[]) => mockRenderCvOffscreen(...args),
}));

jest.mock('@/app/cv/utils/generate-pdf', () => ({
	generateCvPdf: (...args: unknown[]) => mockGenerateCvPdf(...args),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
}));

import { DownloadCVButton } from '../download-cv-button.component';

beforeEach(() => {
	mockCleanup.mockClear();
	mockRenderCvOffscreen.mockClear();
	mockGenerateCvPdf.mockClear();
});

describe('DownloadCVButton', () => {
	it('renders a button with the download label', () => {
		render(<DownloadCVButton />);
		expect(screen.getByRole('button')).toBeInTheDocument();
		expect(screen.getByText('_download-cv')).toBeInTheDocument();
	});

	it('calls renderCvOffscreen and generateCvPdf on click', async () => {
		render(<DownloadCVButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockRenderCvOffscreen).toHaveBeenCalledTimes(1);
			expect(mockGenerateCvPdf).toHaveBeenCalledTimes(1);
		});
	});

	it('passes the offscreen container to generateCvPdf', async () => {
		const fakeContainer = document.createElement('div');
		mockRenderCvOffscreen.mockReturnValueOnce({
			container: fakeContainer,
			cleanup: mockCleanup,
		});

		render(<DownloadCVButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockGenerateCvPdf).toHaveBeenCalledWith(fakeContainer);
		});
	});

	it('calls cleanup after PDF generation', async () => {
		render(<DownloadCVButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockCleanup).toHaveBeenCalledTimes(1);
		});
	});

	it('calls cleanup even when generateCvPdf fails', async () => {
		mockGenerateCvPdf.mockRejectedValueOnce(new Error('pdf error'));

		render(<DownloadCVButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockCleanup).toHaveBeenCalledTimes(1);
		});
	});

	it('shows spinner icon while generating', async () => {
		let resolveGenerate!: () => void;
		mockGenerateCvPdf.mockReturnValueOnce(
			new Promise<void>(resolve => {
				resolveGenerate = resolve;
			}),
		);

		render(<DownloadCVButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByText('spinner')).toBeInTheDocument();
		});

		resolveGenerate();

		await waitFor(() => {
			expect(screen.getByText('file-pdf')).toBeInTheDocument();
		});
	});
});
