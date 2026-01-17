'use client';

import { UNDER_CONSTRUCTION_WHITELIST } from '@/config/under-construction';
import { useRedirectIfUnderConstruction } from '@/utils/redirect-under-construction';
import { type PropsWithChildren } from 'react';
import { useAppContext } from '../context/app-context';

export function InnerLayout({ children }: PropsWithChildren) {
	const { isUnderConstruction } = useAppContext();

	useRedirectIfUnderConstruction(
		isUnderConstruction,
		UNDER_CONSTRUCTION_WHITELIST,
	);

	return children;
}
