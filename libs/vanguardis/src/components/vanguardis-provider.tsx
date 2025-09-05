'use client';

import type { PropsWithChildren } from 'react';

export interface VanguardisProviderProps extends PropsWithChildren {
	/**
	 * Optional CSS class to add to the provider wrapper
	 */
	className?: string;
}

/**
 * VanguardisProvider - Provides the design system context and loads global styles
 *
 * This component should wrap your application to ensure the Vanguardis design system
 * is properly initialized with all the necessary global styles, design tokens,
 * and utilities.
 *
 * @example
 * ```tsx
 * import { VanguardisProvider } from '@lurx-react/vanguardis';
 *
 * export default function App({ children }) {
 *   return (
 *     <VanguardisProvider>
 *       {children}
 *     </VanguardisProvider>
 *   );
 * }
 * ```
 */
export function VanguardisProvider({ children, className }: VanguardisProviderProps): React.JSX.Element {
	// Note: CSS is imported via '@lurx-react/vanguardis/style' at build time
	// No dynamic CSS loading needed when used with build-time imports

	return (
		<div className={`vanguardis-provider ${className || ''}`} data-vanguardis-provider>
			{children}
		</div>
	);
}
