'use client';
import { FaIcon } from '@/app/components/fa-icon';
import { Flex } from '@/app/cv/components/flex/flex.component';
import { Link } from '@/app/cv/components/link';
import type { IconGroupName } from '@/app/cv/types';

interface NavItem {
	label: string;
	href: string;
	iconName: string;
	iconGroup?: IconGroupName;
}

const navItems: NavItem[] = [
	{
		label: 'About',
		href: '#about',
		iconName: 'user',
		iconGroup: 'fas',
	},
	{
		label: 'Experience',
		href: '#work_experience',
		iconName: 'suitcase',
		iconGroup: 'fas',
	},
	{
		label: 'Skills',
		href: '#skills',
		iconName: 'code',
		iconGroup: 'fas',
	},
	{
		label: 'Languages',
		href: '#languages',
		iconName: 'language',
		iconGroup: 'fas',
	},
	{
		label: 'Portfolio',
		href: '#portfolio',
		iconName: 'laptop-code',
		iconGroup: 'fas',
	},

	// Add more nav items here as needed
];

export const Nav = () => {
	// const { work_experience } = useCV();
	return (
		<Flex
			gap="medium"
			justify="center"
			align="center"
		>
			{navItems.map(({ label, href, iconName, iconGroup }) => (
				<Link
					key={label}
					href={href}
					title={label}
				>
					<FaIcon
						iconName={iconName}
						iconGroup={iconGroup}
					/>
					<span>{label}</span>
				</Link>
			))}
		</Flex>
	);
};
