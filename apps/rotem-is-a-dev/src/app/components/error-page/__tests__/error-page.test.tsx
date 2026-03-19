import { render, screen } from '@testing-library/react';
import { ErrorPage } from '../error-page.component';

jest.mock('../../status-page/status-page.component', () => ({
	StatusPage: ({
		asciiArt,
		asciiArtLabel,
		children,
	}: {
		asciiArt: string;
		asciiArtLabel?: string;
		children: React.ReactNode;
	}) => (
		<div>
			<pre aria-label={asciiArtLabel} aria-hidden={asciiArtLabel ? undefined : true}>
				{asciiArt}
			</pre>
			<div>{children}</div>
		</div>
	),
}));

const defaultProps = {
	asciiArt: 'ASCII_ART',
	error: new Error('test'),
	reset: jest.fn(),
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('ErrorPage', () => {
	it('renders the ascii art via StatusPage', () => {
		render(<ErrorPage {...defaultProps}>Error message</ErrorPage>);
		expect(screen.getByText('ASCII_ART')).toBeInTheDocument();
	});

	it('passes asciiArtLabel to StatusPage', () => {
		render(
			<ErrorPage {...defaultProps} asciiArtLabel="Error 500">
				Something went wrong
			</ErrorPage>,
		);
		expect(screen.getByLabelText('Error 500')).toBeInTheDocument();
	});

	it('renders children', () => {
		render(<ErrorPage {...defaultProps}>Custom error content</ErrorPage>);
		expect(screen.getByText('Custom error content')).toBeInTheDocument();
	});

	it('renders the Try again button', () => {
		render(<ErrorPage {...defaultProps}>Error</ErrorPage>);
		expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
	});

	it('calls reset when Try again is clicked', () => {
		const reset = jest.fn();
		render(<ErrorPage asciiArt="ART" error={new Error('test')} reset={reset}>Error</ErrorPage>);
		screen.getByRole('button', { name: 'Try again' }).click();
		expect(reset).toHaveBeenCalledTimes(1);
	});

	it('renders children alongside the ErrorPageButton', () => {
		render(<ErrorPage {...defaultProps}><p data-testid="child">Details</p></ErrorPage>);
		expect(screen.getByTestId('child')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
	});
});
