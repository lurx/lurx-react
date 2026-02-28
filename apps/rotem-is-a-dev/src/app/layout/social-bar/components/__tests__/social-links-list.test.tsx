import { render, screen } from '@testing-library/react';
import { SocialLinkList } from '../social-links-list.component';
import type { SocialLinks } from '../../social-bar.types';

jest.mock('../social-link.component', () => ({
	SocialLink: ({ link }: { link: { label: string; url: string } }) => (
		<a href={link.url} aria-label={link.label}>
			{link.label}
		</a>
	),
}));

const links: SocialLinks = {
	github: {
		url: 'https://github.com/rotem',
		label: 'GitHub',
		icon: { iconName: 'github', iconGroup: 'fab' },
	},
	linkedin: {
		url: 'https://linkedin.com/in/rotem',
		label: 'LinkedIn',
		icon: { iconName: 'linkedin', iconGroup: 'fab' },
	},
};

describe('SocialLinkList', () => {
	it('renders an unordered list', () => {
		render(<SocialLinkList links={links} />);
		expect(screen.getByRole('list')).toBeInTheDocument();
	});

	it('renders a list item for each link', () => {
		render(<SocialLinkList links={links} />);
		expect(screen.getAllByRole('listitem')).toHaveLength(2);
	});

	it('renders each link label', () => {
		render(<SocialLinkList links={links} />);
		expect(screen.getByText('GitHub')).toBeInTheDocument();
		expect(screen.getByText('LinkedIn')).toBeInTheDocument();
	});

	it('renders the correct href for each link', () => {
		render(<SocialLinkList links={links} />);
		expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
			'href',
			'https://github.com/rotem',
		);
		expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
			'href',
			'https://linkedin.com/in/rotem',
		);
	});

	it('renders nothing when links is empty', () => {
		render(<SocialLinkList links={{}} />);
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('renders a single link correctly', () => {
		const singleLink: SocialLinks = {
			github: {
				url: 'https://github.com/rotem',
				label: 'GitHub',
				icon: { iconName: 'github', iconGroup: 'fab' },
			},
		};
		render(<SocialLinkList links={singleLink} />);
		expect(screen.getAllByRole('listitem')).toHaveLength(1);
		expect(screen.getByText('GitHub')).toBeInTheDocument();
	});
});
