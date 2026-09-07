import { render, screen, within } from '@testing-library/react';

jest.mock('../actions/send-message.action', () => ({
	sendMessageAction: jest.fn(),
}));

import { ContactPage } from '../contact-page.component';

describe('ContactPage', () => {
	it('renders the page title and the contact form', () => {
		render(<ContactPage />);
		expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
	});

	it('renders the right-rail info column', () => {
		render(<ContactPage />);
		const aside = screen.getByRole('complementary');
		expect(within(aside).getByText('_github')).toBeInTheDocument();
		expect(within(aside).getByText('_linkedin')).toBeInTheDocument();
		expect(within(aside).getByText('_email')).toBeInTheDocument();
	});
});
