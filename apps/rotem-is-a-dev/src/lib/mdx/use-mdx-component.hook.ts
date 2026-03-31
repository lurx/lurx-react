import { useMemo } from 'react';
import * as runtime from 'react/jsx-runtime';
import type { ComponentType } from 'react';

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

type MDXContentProps = {
	components?: MDXComponents;
};

/**
 * Evaluates compiled MDX code from Velite's `s.mdx()` and returns a React component.
 * The code is a function body string that expects `jsx-runtime` exports.
 */
export function useMDXComponent(code: string): ComponentType<MDXContentProps> {
	return useMemo(() => {
		// Safe: `code` is a build-time artifact from Velite's s.mdx() compiler,
		// never from user input. This is the standard MDX runtime evaluation pattern.
		const fn = new Function(code); // NOSONAR
		const result = fn(runtime);

		return result.default as ComponentType<MDXContentProps>;
	}, [code]);
}
