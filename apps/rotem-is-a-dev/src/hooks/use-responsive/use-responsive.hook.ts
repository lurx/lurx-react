import { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';

export const useResponsive = () => {
	const isDesktop = useMediaQuery('(min-width: 1024px)');
	const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
	const isMobile = useMediaQuery('(max-width: 767px)');

  // memoize to avoid unnecessary re-renders in components that use this hook
	const output = useMemo(
		() => ({ isDesktop, isTablet, isMobile }),
		[isDesktop, isTablet, isMobile],
	);

	return output;
};
