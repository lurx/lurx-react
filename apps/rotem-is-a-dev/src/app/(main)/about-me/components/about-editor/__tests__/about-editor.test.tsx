import { render, screen } from '@testing-library/react';
import { AboutEditor } from '../about-editor.component';

describe('AboutEditor', () => {
	it('renders the bio content region', () => {
		render(<AboutEditor />);
		expect(screen.getByLabelText('Bio content')).toBeInTheDocument();
	});

	it('renders sequential line numbers starting at 1', () => {
		render(<AboutEditor />);
		const lineNumbers = screen
			.getAllByRole('generic')
			.filter((el) => el.className.split(' ').includes('lineNumber'));
		expect(lineNumbers[0]).toHaveTextContent('1');
		lineNumbers.forEach((el, index) => {
			expect(el).toHaveTextContent(String(index + 1));
		});
	});

	it('renders the JSDoc opening comment', () => {
		render(<AboutEditor />);
		expect(screen.getByText('/**')).toBeInTheDocument();
	});

	it('renders the About me heading line', () => {
		render(<AboutEditor />);
		expect(screen.getByText(/About me/)).toBeInTheDocument();
	});

	it('renders the JSDoc closing comment', () => {
		render(<AboutEditor />);
		expect(screen.getByText(/\*\//)).toBeInTheDocument();
	});
});
