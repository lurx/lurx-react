'use client';

import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';

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
	useEffect(() => {
		// Dynamically import the CSS to ensure it's loaded
		if (typeof window !== 'undefined') {
			const linkElement = document.createElement('link');
			linkElement.rel = 'stylesheet';
			linkElement.href = '/_next/static/css/vanguardis.css';
			linkElement.id = 'vanguardis-styles';

			// Only add if not already present
			if (!document.getElementById('vanguardis-styles')) {
				document.head.appendChild(linkElement);
			}
		}
	}, []);

	return (
		<div className={`vanguardis-provider ${className || ''}`} data-vanguardis-provider>
			{children}
		</div>
	);
}
