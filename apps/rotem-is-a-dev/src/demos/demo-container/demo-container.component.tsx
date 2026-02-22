import { Flex } from '@/app/components/flex';
import classNames from 'classnames';
import { type PropsWithChildren } from 'react';

interface DemoContainerProps {
	width?: number | string;
	height?: number | string;
	className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

export const DemoContainer = ({
	width,
	height,
	className,
	children,
}: PropsWithChildren<DemoContainerProps>) => {
	const cssVariables = {
		'--demo-container-width': width,
		'--demo-container-height': height,
	} as React.CSSProperties;

	return (
		<Flex
			direction="column"
			align="center"
			className={classNames(className)}
			style={cssVariables}
		>
			{children}
		</Flex>
	);
};
