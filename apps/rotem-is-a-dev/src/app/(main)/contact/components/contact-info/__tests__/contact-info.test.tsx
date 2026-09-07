import { render, screen } from '@testing-library/react';
import { ContactInfo } from '../contact-info.component';

describe('ContactInfo', () => {
	it('renders github, linkedin and email channels', () => {
		render(<ContactInfo />);
		expect(screen.getByText('_github')).toBeInTheDocument();
		expect(screen.getByText('_linkedin')).toBeInTheDocument();
		expect(screen.getByText('_email')).toBeInTheDocument();
	});

	it('uses target=_blank for external links only', () => {
		render(<ContactInfo />);
		const github = screen.getByLabelText(/github:/);
		const email = screen.getByLabelText(/email:/);
		expect(github).toHaveAttribute('target', '_blank');
		expect(email).not.toHaveAttribute('target');
	});
});
