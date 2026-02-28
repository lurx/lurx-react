import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import styles from './flex.module.scss';
import type { FlexProps } from './flex.types';

export const Flex = ({
	id,
	tag = 'div',
	direction = 'row',
	wrap = 'nowrap',
	justify = 'start',
	align = 'stretch',
	gap = 'none',
	className,
  style,
	children,
}: PropsWithChildren<FlexProps>) => {
	const flexDefaults = {
		direction: 'row',
		wrap: 'nowrap',
		justify: 'start',
		align: 'stretch',
		gap: 'none',
	};

	const directionClassName =
		direction !== flexDefaults.direction && styles[`direction-${direction}`];
	const wrapClassName = wrap !== flexDefaults.wrap && styles[`wrap-${wrap}`];
	const justifyClassName =
		justify !== flexDefaults.justify && styles[`justify-${justify}`];
	const alignClassName =
		align !== flexDefaults.align && styles[`align-${align}`];
	const gapClassName = gap !== flexDefaults.gap && styles[`gap-${gap}`];

	const classNamesList = [
		styles.flex,
		directionClassName,
		wrapClassName,
		justifyClassName,
		alignClassName,
		gapClassName,
		className,
	];

	const Tag = tag;
	return (
		<Tag
			id={id}
			className={classNames(...classNamesList)}
      style={style}
		>
			{children}
		</Tag>
	);
};
