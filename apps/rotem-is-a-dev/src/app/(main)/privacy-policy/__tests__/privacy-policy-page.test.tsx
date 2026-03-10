import { render, screen } from '@testing-library/react';
import { PrivacyPolicyPage } from '../privacy-policy-page.component';
import type { PrivacyPolicyPageProps } from '../privacy-policy-page.types';

const MOCK_PAGE: PrivacyPolicyPageProps['page'] = {
	title: 'Privacy Policy',
	slug: 'privacy-policy',
	lastUpdated: 'March 10, 2026',
	description: 'Test privacy policy description.',
	content:
		'<h2>Introduction</h2><p>Welcome to <strong>rotem.is-a.dev</strong>.</p>' +
		'<h2>Contact</h2><p>Email us at <a href="mailto:test@example.com">test@example.com</a>.</p>',
};

describe('PrivacyPolicyPage', () => {
	beforeEach(() => {
		render(<PrivacyPolicyPage page={MOCK_PAGE} />);
	});

	it('renders the page title', () => {
		expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument();
	});

	it('renders the last-updated date', () => {
		expect(screen.getByText('Last updated: March 10, 2026')).toBeInTheDocument();
	});

	it('renders content HTML with section headings', () => {
		expect(screen.getByRole('heading', { level: 2, name: 'Introduction' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 2, name: 'Contact' })).toBeInTheDocument();
	});

	it('renders content HTML with links', () => {
		const emailLink = screen.getByRole('link', { name: 'test@example.com' });
		expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
	});

	it('renders content HTML with inline elements', () => {
		expect(screen.getByText('rotem.is-a.dev')).toBeInTheDocument();
	});
});
