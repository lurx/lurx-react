import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockGenerateCvPdf = jest.fn(() => Promise.resolve());
const mockGenerateReactPdf = jest.fn(() => Promise.resolve());
const mockUseSearchParams = jest.fn();

jest.mock('@/app/cv/utils/generate-pdf', () => ({
	generateCvPdf: (...args: unknown[]) => mockGenerateCvPdf(...args),
}));

jest.mock('@/app/cv/utils/react-pdf', () => ({
	generateReactPdf: (...args: unknown[]) => mockGenerateReactPdf(...args),
}));

jest.mock('next/navigation', () => ({
	useSearchParams: () => mockUseSearchParams(),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="fa-icon">{iconName}</span>
	),
}));

jest.mock('@/app/cv/components/button', () => ({
	Button: ({
		children,
		onClick,
		disabled,
	}: {
		children: React.ReactNode;
		onClick: () => void;
		disabled?: boolean;
	}) => (
		<button onClick={onClick} disabled={disabled}>
			{children}
		</button>
	),
}));

import { DownloadPdfButton } from '../download-pdf-button.component';

beforeEach(() => {
	mockGenerateCvPdf.mockClear();
	mockGenerateReactPdf.mockClear();
	mockUseSearchParams.mockReturnValue({ has: () => false });
});

describe('DownloadPdfButton', () => {
	it('renders a button with download text', () => {
		render(<DownloadPdfButton />);
		expect(screen.getByRole('button')).toBeInTheDocument();
		expect(screen.getByText('Download CV as PDF')).toBeInTheDocument();
	});

	it('returns null when noDownload search param is present', () => {
		mockUseSearchParams.mockReturnValue({ has: () => true });
		const { container } = render(<DownloadPdfButton />);
		expect(container.innerHTML).toBe('');
	});

	it('shows the file-arrow-down icon when not generating', () => {
		render(<DownloadPdfButton />);
		expect(screen.getByText('file-arrow-down')).toBeInTheDocument();
	});

	it('shows the spinner icon while generating', async () => {
		let resolveGenerate!: () => void;
		mockGenerateCvPdf.mockReturnValueOnce(
			new Promise<void>(resolve => {
				resolveGenerate = resolve;
			}),
		);

		render(<DownloadPdfButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByText('spinner')).toBeInTheDocument();
		});

		resolveGenerate();

		await waitFor(() => {
			expect(screen.getByText('file-arrow-down')).toBeInTheDocument();
		});
	});

	it('disables the button while generating', async () => {
		let resolveGenerate!: () => void;
		mockGenerateCvPdf.mockReturnValueOnce(
			new Promise<void>(resolve => {
				resolveGenerate = resolve;
			}),
		);

		render(<DownloadPdfButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByRole('button')).toBeDisabled();
		});

		resolveGenerate();

		await waitFor(() => {
			expect(screen.getByRole('button')).not.toBeDisabled();
		});
	});

	it('calls generateCvPdf when clicked', async () => {
		render(<DownloadPdfButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockGenerateCvPdf).toHaveBeenCalledTimes(1);
		});
	});

	it('re-enables the button after generation completes', async () => {
		render(<DownloadPdfButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByRole('button')).not.toBeDisabled();
		});
	});

	it('calls generateReactPdf when new-pdf param is present', async () => {
		mockUseSearchParams.mockReturnValue({
			has: (key: string) => key === 'new-pdf',
		});

		render(<DownloadPdfButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockGenerateReactPdf).toHaveBeenCalledTimes(1);
			expect(mockGenerateCvPdf).not.toHaveBeenCalled();
		});
	});

	it('calls generateCvPdf when new-pdf param is absent', async () => {
		mockUseSearchParams.mockReturnValue({ has: () => false });

		render(<DownloadPdfButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockGenerateCvPdf).toHaveBeenCalledTimes(1);
			expect(mockGenerateReactPdf).not.toHaveBeenCalled();
		});
	});
});
