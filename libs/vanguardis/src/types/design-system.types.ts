// Design System Types
// Comprehensive type definitions for our design system components and tokens

// =============================================================================
// DESIGN TOKEN TYPES
// =============================================================================

export type ColorVariant =
	| 'primary'
	| 'accent'
	| 'secondary'
	| 'neutral'
	| 'success'
	| 'warning'
	| 'error'
	| 'info';

export type ColorScale =
	| '50'
	| '100'
	| '200'
	| '300'
	| '400'
	| '500'
	| '600'
	| '700'
	| '800'
	| '900'
	| '950';

export type SpacingScale =
	| '0'
	| 'px'
	| '0.5'
	| '1'
	| '1.5'
	| '2'
	| '2.5'
	| '3'
	| '3.5'
	| '4'
	| '5'
	| '6'
	| '7'
	| '8'
	| '9'
	| '10'
	| '11'
	| '12'
	| '14'
	| '16'
	| '20'
	| '24'
	| '28'
	| '32'
	| '36'
	| '40'
	| '44'
	| '48'
	| '52'
	| '56'
	| '60'
	| '64'
	| '72'
	| '80'
	| '96';

export type FontSize =
	| 'xs'
	| 'sm'
	| 'base'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| '8xl'
	| '9xl';

export type FontWeight =
	| 'thin'
	| 'light'
	| 'normal'
	| 'medium'
	| 'semibold'
	| 'bold'
	| 'extrabold'
	| 'black';

export type FontFamily = 'primary' | 'retro' | 'mono';

export type BorderRadius =
	| 'none'
	| 'sm'
	| 'base'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| '3xl'
	| 'full';

export type BoxShadow =
	| 'sm'
	| 'base'
	| 'md'
	| 'lg'
	| 'xl'
	| '2xl'
	| 'inner'
	| 'glow-primary'
	| 'glow-accent'
	| 'glow-secondary';

export type AnimationDuration =
	| 'instant'
	| 'fast'
	| 'normal'
	| 'slow'
	| 'slower'
	| 'slowest';

export type AnimationEasing =
	| 'linear'
	| 'in'
	| 'out'
	| 'in-out'
	| 'bounce'
	| 'elastic';

// =============================================================================
// COMPONENT VARIANT TYPES
// =============================================================================

export type ComponentSize = 'sm' | 'md' | 'lg' | 'xl';
export type ComponentVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ComponentState =
	| 'default'
	| 'hover'
	| 'active'
	| 'disabled'
	| 'loading';

// =============================================================================
// ANIMATION TYPES
// =============================================================================

export interface AnimationConfig {
	duration?: number;
	delay?: number;
	easing?: string;
	fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
	direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
	iterationCount?: number | 'infinite';
}

export interface ScrollAnimationConfig extends AnimationConfig {
	threshold?: number;
	triggerOnce?: boolean;
	rootMargin?: string;
}

export interface ParallaxConfig {
	speed?: number;
	direction?: 'up' | 'down' | 'left' | 'right';
	scale?: number;
}

export interface TimelineAnimationConfig {
	targets: string | Element | Element[];
	duration?: number;
	delay?: number;
	easing?: string;
	[key: string]: unknown;
}

// =============================================================================
// LAYOUT TYPES
// =============================================================================

export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
export type JustifyContent =
	| 'flex-start'
	| 'flex-end'
	| 'center'
	| 'space-between'
	| 'space-around'
	| 'space-evenly';
export type AlignItems =
	| 'flex-start'
	| 'flex-end'
	| 'center'
	| 'baseline'
	| 'stretch';

export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type GridSpan =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 'full';

export interface FlexProps {
	direction?: FlexDirection;
	wrap?: FlexWrap;
	justify?: JustifyContent;
	align?: AlignItems;
	gap?: SpacingScale;
}

export interface GridProps {
	columns?: GridColumns;
	rows?: number;
	gap?: SpacingScale;
	columnGap?: SpacingScale;
	rowGap?: SpacingScale;
}

// =============================================================================
// RESPONSIVE TYPES
// =============================================================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ResponsiveValue<T> =
	| T
	| {
			[K in Breakpoint]?: T;
	  };

// =============================================================================
// THEME TYPES
// =============================================================================

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
	mode: ThemeMode;
	colors: Record<string, string>;
	fonts: Record<string, string>;
	spacing: Record<string, string>;
	borderRadius: Record<string, string>;
	shadows: Record<string, string>;
	animations: Record<string, AnimationConfig>;
}

// =============================================================================
// COMPONENT PROP TYPES
// =============================================================================

export interface BaseComponentProps {
	className?: string;
	'data-testid'?: string;
}

export interface AnimatedComponentProps extends BaseComponentProps {
	animationConfig?: AnimationConfig;
	reduceMotion?: boolean;
}

export interface InteractiveComponentProps extends BaseComponentProps {
	isDisabled?: boolean;
	isLoading?: boolean;
	tabIndex?: number;
	role?: string;
	'aria-label'?: string;
	'aria-describedby'?: string;
	'aria-expanded'?: boolean;
	'aria-selected'?: boolean;
}

// =============================================================================
// FORM TYPES
// =============================================================================

export interface FormFieldProps extends InteractiveComponentProps {
	name: string;
	label?: string;
	placeholder?: string;
	helperText?: string;
	errorMessage?: string;
	isRequired?: boolean;
	isInvalid?: boolean;
}

export interface ValidationRule {
	required?: boolean | string;
	pattern?: RegExp | string;
	minLength?: number | string;
	maxLength?: number | string;
	min?: number | string;
	max?: number | string;
	validate?: (value: unknown) => boolean | string;
}

// =============================================================================
// EVENT TYPES
// =============================================================================

export type MouseEventHandler<T = Element> = (
	event: React.MouseEvent<T>,
) => void;
export type KeyboardEventHandler<T = Element> = (
	event: React.KeyboardEvent<T>,
) => void;
export type FocusEventHandler<T = Element> = (
	event: React.FocusEvent<T>,
) => void;
export type ChangeEventHandler<T = Element> = (
	event: React.ChangeEvent<T>,
) => void;

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type MaybeArray<T> = T | T[];

export type Override<T, U> = Omit<T, keyof U> & U;

export type PolymorphicComponentProp<T extends React.ElementType> = {
	as?: T;
};

export type PolymorphicRef<T extends React.ElementType> =
	React.ComponentPropsWithRef<T>['ref'];

export type PolymorphicComponentPropsWithRef<
	T extends React.ElementType,
	Props = Record<string, unknown>,
> = Props &
	PolymorphicComponentProp<T> &
	Omit<React.ComponentPropsWithRef<T>, keyof Props | 'as'> & {
		ref?: PolymorphicRef<T>;
	};

// =============================================================================
// DATA TYPES
// =============================================================================

export interface PersonalDetails {
	name: string;
	title: string;
	tagline: string;
	bio: string;
	location: string;
	email: string;
	website: string;
	social: {
		github: string;
		linkedin: string;
		twitter?: string;
		instagram?: string;
	};
	skills: Skill[];
	experience: Experience[];
	projects: Project[];
	education: Education[];
}

export interface Skill {
	id: string;
	name: string;
	category: 'frontend' | 'backend' | 'tools' | 'design' | 'other';
	level: 1 | 2 | 3 | 4 | 5;
	years: number;
	icon?: string;
}

export interface Experience {
	id: string;
	company: string;
	position: string;
	startDate: string;
	endDate?: string;
	description: string;
	technologies: string[];
	achievements: string[];
	logo?: string;
	website?: string;
}

export interface Project {
	id: string;
	title: string;
	description: string;
	longDescription?: string;
	technologies: string[];
	features: string[];
	demoUrl?: string;
	githubUrl?: string;
	images: string[];
	status: 'completed' | 'in-progress' | 'planned';
	featured: boolean;
	category: 'web' | 'mobile' | 'desktop' | 'library' | 'other';
	startDate: string;
	endDate?: string;
}

export interface Education {
	id: string;
	institution: string;
	degree: string;
	field: string;
	startDate: string;
	endDate?: string;
	gpa?: string;
	achievements: string[];
	logo?: string;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

export interface ApiError {
	message: string;
	code: string;
	status: number;
	details?: Record<string, unknown>;
}

export interface ValidationError {
	field: string;
	message: string;
	code: string;
}

// =============================================================================
// CONFIGURATION TYPES
// =============================================================================

export interface AppConfig {
	name: string;
	version: string;
	description: string;
	author: PersonalDetails;
	theme: ThemeConfig;
	features: {
		animations: boolean;
		analytics: boolean;
		darkMode: boolean;
		blog: boolean;
		contact: boolean;
	};
	api: {
		baseUrl: string;
		timeout: number;
		retries: number;
	};
	seo: {
		title: string;
		description: string;
		keywords: string[];
		ogImage: string;
		twitterCard: 'summary' | 'summary_large_image';
	};
}
