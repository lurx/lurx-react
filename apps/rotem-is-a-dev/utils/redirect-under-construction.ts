'use client';

import { useEffect, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const DEFAULT_SAFE_ROUTES = ['/under-construction'];

export function useRedirectIfUnderConstruction(
	isUnderConstruction: boolean,
	additionalWhitelist: string[] = [],
) {
	const pathname = usePathname();
	const router = useRouter();

	const fullWhitelist = useMemo(
		() => [...DEFAULT_SAFE_ROUTES, ...additionalWhitelist],
		[additionalWhitelist],
	);

	useEffect(() => {
		if (isUnderConstruction && !fullWhitelist.includes(pathname)) {
			router.replace('/under-construction');
		}
	}, [isUnderConstruction, pathname, router, fullWhitelist]);
}
