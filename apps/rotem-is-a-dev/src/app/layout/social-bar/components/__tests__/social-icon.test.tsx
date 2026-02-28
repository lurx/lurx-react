import { render, screen } from '@testing-library/react';
import { SocialIcon } from '../social-icon.component';

jest.mock('@/app/components', () => ({
	FaIcon: ({ iconName, className }: { iconName: string; className?: string }) => (
		<span data-testid="icon" className={className}>{iconName}</span>
	),
}));

const baseLink = {
	url: 'https://github.com/test',
	label: 'GitHub',
	icon: { iconName: 'github', iconGroup: 'fab' as const },
};

describe('SocialIcon', () => {
	it('renders the FaIcon component', () => {
		render(<SocialIcon link={baseLink} />);
		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('passes the icon name to FaIcon', () => {
		render(<SocialIcon link={baseLink} />);
		expect(screen.getByTestId('icon')).toHaveTextContent('github');
	});

	it('renders with a different icon name', () => {
		render(
			<SocialIcon
				link={{
					...baseLink,
					icon: { iconName: 'twitter', iconGroup: 'fab' as const },
				}}
			/>,
		);
		expect(screen.getByTestId('icon')).toHaveTextContent('twitter');
	});

	it('renders with a linkedin icon', () => {
		render(
			<SocialIcon
				link={{
					...baseLink,
					icon: { iconName: 'linkedin', iconGroup: 'fab' as const },
				}}
			/>,
		);
		expect(screen.getByTestId('icon')).toHaveTextContent('linkedin');
	});
});
