import { Logo } from '@/app/components/logo/logo.component';
import { LOGO_SIZES } from '@/app/components/logo/logo.constants';
import type { AnimatedLoaderProps } from './animated-loader.types';

export const AnimatedLoader = ({ size }: AnimatedLoaderProps) => (
	<Logo
		size={size ?? LOGO_SIZES.LOADER}
		animated
	/>
);
