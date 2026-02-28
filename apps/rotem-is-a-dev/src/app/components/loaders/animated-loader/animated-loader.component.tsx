import { Logo, LOGO_SIZES } from '../../logo';
import type { AnimatedLoaderProps } from './animated-loader.types';

export const AnimatedLoader = ({ size }: AnimatedLoaderProps) => (
	<Logo
		size={size ?? LOGO_SIZES.LOADER}
		animated
	/>
);
