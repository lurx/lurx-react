import * as runtime from 'react/jsx-runtime';
import type { ComponentType } from 'react';
import {
	CodeCompare,
	DecisionTable,
	ImpossibleThingsGrid,
	IntegrationCode,
	MainBenchmark,
	MdxScenarioSwitcher,
	MdxVerdictBox,
	ReflowViz,
	ResizeBenchmark,
	StatsRow,
} from './components';
import blogStyles from '../../blog-post.module.scss';
import styles from './pretext-benchmark.module.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

type PretextBenchmarkMdxProps = {
	code?: string;
};

type MDXComponents = Record<string, ComponentType<Record<string, unknown>>>;

type MDXContentProps = {
	components?: MDXComponents;
};

// ─── MDX Component Map ──────────────────────────────────────────────────────

const mdxComponents: MDXComponents = {
	ReflowViz,
	CodeCompare,
	StatsRow,
	MainBenchmark,
	ResizeBenchmark,
	ScenarioSwitcher: MdxScenarioSwitcher,
	ImpossibleThingsGrid,
	DecisionTable,
	IntegrationCode,
	VerdictBox: MdxVerdictBox,
};

// ─── Server-side MDX Evaluation ─────────────────────────────────────────────

/**
 * Evaluates compiled MDX code from Velite's s.mdx() on the server.
 * Safe: code is a build-time artifact, never user input.
 * Runs in Node.js where CSP does not apply.
 */
function evaluateMdx(code: string): ComponentType<MDXContentProps> {
	const fn = new Function(code); // NOSONAR — build-time Velite artifact
	const result = fn(runtime);

	return result.default as ComponentType<MDXContentProps>;
}

// ─── Main Component (Server) ────────────────────────────────────────────────

export function PretextBenchmarkMdx({ code }: Readonly<PretextBenchmarkMdxProps>) {
	if (!code) return null;

	const MDXContent = evaluateMdx(code);

	return (
		<div className={`${blogStyles.content} ${styles.post}`}>
			<MDXContent components={mdxComponents} />
		</div>
	);
}
