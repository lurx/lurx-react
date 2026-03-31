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
		const fn = new Function(code);
		const result = fn(runtime);

		return result.default as ComponentType<MDXContentProps>;
	}, [code]);
}
