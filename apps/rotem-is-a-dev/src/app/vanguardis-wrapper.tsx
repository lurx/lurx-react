'use client';

import { VanguardisProvider } from '@lurx-react/vanguardis';
import '@lurx-react/vanguardis/style';
import type { PropsWithChildren } from 'react';
/**
 * VanguardisWrapper - Client-side wrapper for the VanguardisProvider
 *
 * This component is needed because the VanguardisProvider uses client-side hooks
 * and needs to be wrapped in a client component.
 */
export function VanguardisWrapper({
	children,
}: PropsWithChildren): React.JSX.Element {
	return <VanguardisProvider>{children}</VanguardisProvider>;
}
