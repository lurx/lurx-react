import { fireEvent, render, screen } from '@testing-library/react';
import CVErrorPage from '../error';

jest.mock('@/ascii-art', () => ({
	ASCII_ERROR: 'MOCKED_ASCII_ERROR',
}));

jest.mock('@/app/components', () => ({
	CodeBlock: ({ code }: { code: string }) => (
		<pre data-testid="code-block"><code>{code}</code></pre>
	),
}));

jest.mock('@/app/components/error-page', () => ({
	ErrorPage: ({ asciiArt, asciiArtLabel, reset, children }: { asciiArt: string; asciiArtLabel?: string; reset: () => void; children: React.ReactNode }) => (
		<div>
			<pre aria-label={asciiArtLabel} aria-hidden={!asciiArtLabel}>{asciiArt}</pre>
			<div>{children}</div>
			<button onClick={reset}>Try again</button>
		</div>
	),
}));

describe('CV ErrorPage', () => {
	const defaultProps = {
		error: new Error('Test error') as Error & { digest?: string },
		reset: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the ASCII art with "Error" label', () => {
		render(<CVErrorPage {...defaultProps} />);
		const asciiArt = screen.getByLabelText('Error');
		expect(asciiArt).toBeInTheDocument();
	});

	it('renders the error code snippet', () => {
		render(<CVErrorPage {...defaultProps} />);
		expect(
			screen.getByText(/Failed to load the CV page/),
		).toBeInTheDocument();
	});

	it('renders the "Try again" button', () => {
		render(<CVErrorPage {...defaultProps} />);
		expect(
			screen.getByRole('button', { name: 'Try again' }),
		).toBeInTheDocument();
	});

	it('calls reset when "Try again" button is clicked', () => {
		render(<CVErrorPage {...defaultProps} />);

		fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

		expect(defaultProps.reset).toHaveBeenCalledTimes(1);
	});

	it('renders the CodeBlock component', () => {
		render(<CVErrorPage {...defaultProps} />);
		expect(screen.getByTestId('code-block')).toBeInTheDocument();
	});
});
