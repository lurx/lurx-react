import { Button } from '@/app/cv/components/button';
import type { PropsWithChildren } from 'react';
import { Flex } from '../flex';

interface CollapsibleProps {
	isCollapsed: boolean;
	onToggle: () => void;
	numberOfItems?: number;
}

export const Collapsible = ({
	isCollapsed,
	onToggle,
	numberOfItems,
	children,
}: PropsWithChildren<CollapsibleProps>) => {
	const additionalItems = `(${numberOfItems ?? ''})`;
	const showMoreLabel = `Show More ${additionalItems}`.trim();
	const showLessLabel = 'Show Less';
	const buttonLabel = isCollapsed ? showMoreLabel : showLessLabel;

	return (
		<Flex
			direction="column"
			align="start"
			gap="small"
		>
			{!isCollapsed && <div>{children}</div>}
			<Button
				onClick={onToggle}
				variant="ghost"
			>
				{buttonLabel}
			</Button>
		</Flex>
	);
};
