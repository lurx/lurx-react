import type { DemoCreditsProps } from './demo-credits.types';
import { Flex, Link } from '@/app/components';

export const DemoCredits = ({ credits }: DemoCreditsProps) => {
	if (!credits) return null;

	return (
		<Flex
			gap="small"
			justify="center"
		>
			Inspired by
			<Link href={credits.url}>{credits.name}</Link>
			by
			<Link href={credits.authorUrl}>{credits.author}</Link>
		</Flex>
	);
};
