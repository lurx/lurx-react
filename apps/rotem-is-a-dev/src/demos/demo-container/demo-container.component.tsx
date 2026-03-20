import { Flex } from '@/app/components';
import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import styles from './demo-container.module.scss';
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
	};

	return (
		<Flex
			direction="column"
			align="center"
      justify="center"
			className={classNames(styles.demoContainer, className)}
			style={cssVariables}
      gap="small"
		>
			{children}
		</Flex>
	);
};
