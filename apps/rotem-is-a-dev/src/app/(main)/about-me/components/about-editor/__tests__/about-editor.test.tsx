import { render, screen } from '@testing-library/react';
import { AboutEditor } from '../about-editor.component';

describe('AboutEditor', () => {
	it('renders the bio content region', () => {
		render(<AboutEditor />);
		expect(screen.getByLabelText('Bio content')).toBeInTheDocument();
	});

	it('renders 16 line numbers', () => {
		render(<AboutEditor />);
		expect(screen.getByText('1')).toBeInTheDocument();
		expect(screen.getByText('16')).toBeInTheDocument();
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
