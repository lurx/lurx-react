import { render, screen } from '@testing-library/react';

jest.mock('../../../actions/send-message.action', () => ({
	sendMessageAction: jest.fn(),
}));

import { ContactForm } from '../contact-form.component';

describe('ContactForm', () => {
	it('renders all fields and the submit button', () => {
		render(<ContactForm />);
		expect(screen.getByLabelText(/_name/)).toBeInTheDocument();
		expect(screen.getByLabelText(/_email/)).toBeInTheDocument();
		expect(screen.getByLabelText(/_subject/)).toBeInTheDocument();
		expect(screen.getByLabelText(/_message/)).toBeInTheDocument();
		expect(screen.getByRole('checkbox', { name: /send me a copy/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
	});

	it('the send-copy checkbox is unchecked by default', () => {
		render(<ContactForm />);
		const checkbox = screen.getByRole('checkbox', { name: /send me a copy/i });
		expect(checkbox).not.toBeChecked();
	});

	it('renders the honeypot field hidden from assistive tech', () => {
		const { container } = render(<ContactForm />);
		const honeypot = container.querySelector('input[name="website"]');
		expect(honeypot).toBeInTheDocument();
		expect(honeypot).toHaveAttribute('aria-hidden', 'true');
		expect(honeypot).toHaveAttribute('tabIndex', '-1');
	});
});
