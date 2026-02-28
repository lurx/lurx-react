import { Flex } from '@/app/components';
import classNames from 'classnames';
import { type PropsWithChildren } from 'react';
import type { DemoContainerProps } from './demo-container.types';

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
