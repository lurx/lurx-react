import * as runtime from 'react/jsx-runtime';
import type { ComponentType } from 'react';
import { ReadAllChart, WriteChart } from './components';
import blogStyles from '../../blog-post.module.scss';
import styles from './node-builtin-zip.module.scss';
import type { NodeBuiltinZipMdxProps } from './node-builtin-zip.types';

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

type MDXContentProps = {
	components?: MDXComponents;
};

const mdxComponents: MDXComponents = {
	ReadAllChart,
	WriteChart,
};

/**
 * Evaluates compiled MDX code from Velite's s.mdx() on the server.
 * Safe: code is a build-time artifact, never user input.
 */
function evaluateMdx(code: string): ComponentType<MDXContentProps> {
	const fn = new Function(code); // NOSONAR — build-time Velite artifact
	const result = fn(runtime);

	return result.default as ComponentType<MDXContentProps>;
}

export function NodeBuiltinZipMdx({ code }: Readonly<NodeBuiltinZipMdxProps>) {
	if (!code) return null;

	const MDXContent = evaluateMdx(code);

	return (
		<div className={`${blogStyles.content} ${styles.post}`}>
			<MDXContent components={mdxComponents} />
		</div>
	);
}
