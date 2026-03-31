import React from 'react';
import { render } from '@testing-library/react';
import { PretextBenchmarkMdx } from '../pretext-benchmark-mdx.component';

// ─── Mock components ────────────────────────────────────────────────────────

jest.mock('../components', () => ({
	CodeCompare: () => <div data-testid="code-compare" />,
	DecisionTable: () => <div data-testid="decision-table" />,
	ImpossibleThingsGrid: () => <div data-testid="impossible-things-grid" />,
	IntegrationCode: () => <div data-testid="integration-code" />,
	MainBenchmark: () => <div data-testid="main-benchmark" />,
	MdxScenarioSwitcher: () => <div data-testid="mdx-scenario-switcher" />,
	MdxVerdictBox: () => <div data-testid="mdx-verdict-box" />,
	ReflowViz: () => <div data-testid="reflow-viz" />,
	ResizeBenchmark: () => <div data-testid="resize-benchmark" />,
	StatsRow: () => <div data-testid="stats-row" />,
}));

// SCSS modules are handled by identity-obj-proxy (jest config)
// blogStyles.content returns "content", styles.post returns "post"

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('PretextBenchmarkMdx', () => {
	it('returns null when code is undefined', () => {
		const { container } = render(<PretextBenchmarkMdx />);

		expect(container.innerHTML).toBe('');
	});

	it('returns null when code is an empty string', () => {
		const { container } = render(<PretextBenchmarkMdx code="" />);

		expect(container.innerHTML).toBe('');
	});

	it('renders a wrapper div with correct CSS classes when code is provided', () => {
		// Velite's s.mdx() produces code that accesses jsx-runtime via arguments[0]
		const validCode = [
			'const {jsx} = arguments[0];',
			'function MDXContent() { return jsx("p", { children: "Hello" }); }',
			'return { default: MDXContent };',
		].join('\n');

		const { container } = render(<PretextBenchmarkMdx code={validCode} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).not.toBeNull();
		expect(wrapper.tagName).toBe('DIV');
		expect(wrapper.className).toContain('content');
		expect(wrapper.className).toContain('post');
	});

	it('renders MDX content inside the wrapper', () => {
		const validCode = [
			'const {jsx} = arguments[0];',
			'function MDXContent() { return jsx("p", { children: "Test content" }); }',
			'return { default: MDXContent };',
		].join('\n');

		const { getByText } = render(<PretextBenchmarkMdx code={validCode} />);

		expect(getByText('Test content')).toBeInTheDocument();
	});
});
