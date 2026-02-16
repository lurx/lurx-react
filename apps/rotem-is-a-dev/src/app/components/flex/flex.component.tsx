import classNames from 'classnames';
import type { PropsWithChildren } from 'react';
import styles from './flex.module.scss';

type FlexDirection = 'row' | 'column';
type FlexWrap = 'nowrap' | 'wrap';
type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type FlexGap = 'none' | 'small' | 'medium' | 'large';

interface FlexProps {
  tag?: React.ElementType;
	direction?: FlexDirection;
	wrap?: FlexWrap;
	justify?: FlexJustify;
	align?: FlexAlign;
	gap?: FlexGap;
	className?: string;
}

export const Flex = ({
  tag = "div",
	direction = 'row',
	wrap = 'nowrap',
	justify = 'start',
	align = 'stretch',
	gap = 'none',
	className,
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

	const Tag = tag || 'div';
	return <Tag className={classNames(...classNamesList)}>{children}</Tag>;
};
