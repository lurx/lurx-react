import { render, screen } from '@testing-library/react';
import { SocialLink } from '../social-link.component';

const baseLinkData = {
	url: 'https://github.com/test',
	label: 'GitHub',
	icon: { iconName: 'github', iconGroup: 'fab' as const },
};

describe('SocialLink', () => {
	it('renders a link with correct href and accessibility attributes', () => {
		render(<SocialLink link={baseLinkData} />);
		const link = screen.getByRole('link', { name: 'GitHub' });
		expect(link).toHaveAttribute('href', 'https://github.com/test');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('renders the label text', () => {
		render(<SocialLink link={baseLinkData} />);
		expect(screen.getByText('GitHub')).toBeInTheDocument();
	});

	it('renders displayText instead of label when provided', () => {
		render(
			<SocialLink link={{ ...baseLinkData, displayText: '@lurx' }} />,
		);
		expect(screen.getByText('@lurx')).toBeInTheDocument();
		expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
	});

	it('hides the label when hideLabel is true', () => {
		render(
			<SocialLink link={{ ...baseLinkData, hideLabel: true }} />,
		);
		expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
	});

	it('hides the icon when iconPosition is hide', () => {
		render(<SocialLink link={baseLinkData} iconPosition="hide" />);
		// The label should still render
		expect(screen.getByText('GitHub')).toBeInTheDocument();
	});

	it('reverses order when iconPosition is end', () => {
		render(
			<SocialLink link={baseLinkData} iconPosition="end" />,
		);
		expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
	});
});
