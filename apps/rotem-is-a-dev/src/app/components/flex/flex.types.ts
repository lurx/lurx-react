export type FlexDirection = 'row' | 'column';
export type FlexWrap = 'nowrap' | 'wrap';
export type FlexJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type FlexAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type FlexGap = 'none' | 'small' | 'medium' | 'large' | 'xlarge';

export type FlexProps = {
	tag?: React.ElementType;
	direction?: FlexDirection;
	wrap?: FlexWrap;
	justify?: FlexJustify;
	align?: FlexAlign;
	gap?: FlexGap;
	id?: string;
	className?: string;
	style?: React.CSSProperties;
}
