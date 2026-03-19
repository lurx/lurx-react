import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useResponsive } from '@/hooks';

const mockGenerateReactPdf = jest.fn(() => Promise.resolve());

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

jest.mock('@/app/cv/utils/react-pdf', () => ({
	generateReactPdf: () => mockGenerateReactPdf(),
}));

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="icon">{iconName}</span>
	),
	SimpleLoader: () => <div data-testid="simple-loader" />,
}));

const mockUseResponsive = jest.mocked(useResponsive);

import { DownloadCVButton } from '../download-cv-button.component';

beforeEach(() => {
	mockGenerateReactPdf.mockClear();
	mockUseResponsive.mockReturnValue({
		isMobile: false,
		isTablet: false,
		isDesktop: true,
	});
});

describe('DownloadCVButton', () => {
	it('returns null on mobile', () => {
		mockUseResponsive.mockReturnValue({
			isMobile: true,
			isTablet: false,
			isDesktop: false,
		});
		const { container } = render(<DownloadCVButton />);
		expect(container.innerHTML).toBe('');
	});

	it('ignores clicks while already generating', async () => {
		let resolveGenerate!: () => void;
		mockGenerateReactPdf.mockReturnValueOnce(
			new Promise<void>(resolve => {
				resolveGenerate = resolve;
			}),
		);

		render(<DownloadCVButton />);
		const button = screen.getByRole('button');

		fireEvent.click(button);
		fireEvent.click(button);

		resolveGenerate();

		await waitFor(() => {
			expect(mockGenerateReactPdf).toHaveBeenCalledTimes(1);
		});
	});

	it('renders a button with the download label', () => {
		render(<DownloadCVButton />);
		expect(screen.getByRole('button')).toBeInTheDocument();
		expect(screen.getByText('_download-cv')).toBeInTheDocument();
	});

	it('calls generateReactPdf on click', async () => {
		render(<DownloadCVButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockGenerateReactPdf).toHaveBeenCalledTimes(1);
		});
	});

	it('shows SimpleLoader while generating', async () => {
		let resolveGenerate!: () => void;
		mockGenerateReactPdf.mockReturnValueOnce(
			new Promise<void>(resolve => {
				resolveGenerate = resolve;
			}),
		);

		render(<DownloadCVButton />);
		fireEvent.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByTestId('simple-loader')).toBeInTheDocument();
		});

		resolveGenerate();

		await waitFor(() => {
			expect(screen.getByText('file-pdf')).toBeInTheDocument();
		});
	});
});
