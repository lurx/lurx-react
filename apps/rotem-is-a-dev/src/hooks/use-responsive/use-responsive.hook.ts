import { useMemo } from 'react';
import { useMediaQuery } from 'usehooks-ts';

const SSR_SAFE = { initializeWithValue: false } as const;

export const useResponsive = () => {
	const isDesktop = useMediaQuery('(min-width: 1024px)', SSR_SAFE);
	const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)', SSR_SAFE);
	const isMobile = useMediaQuery('(max-width: 767px)', SSR_SAFE);

  // memoize to avoid unnecessary re-renders in components that use this hook
	const output = useMemo(
		() => ({ isDesktop, isTablet, isMobile }),
		[isDesktop, isTablet, isMobile],
	);

	return output;
};
