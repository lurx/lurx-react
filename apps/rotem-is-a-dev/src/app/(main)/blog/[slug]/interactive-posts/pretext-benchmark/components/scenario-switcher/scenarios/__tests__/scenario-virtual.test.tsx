import { render, screen } from '@testing-library/react';
import { ScenarioVirtual } from '../scenario-virtual.component';

jest.mock('@/app/components', () => ({
	CodeBlock: ({ code, language }: { code: string; language: string }) => (
		<pre data-testid="code-block" data-language={language}>
			{code}
		</pre>
	),
}));

describe('ScenarioVirtual', () => {
	it('renders the heading', () => {
		render(<ScenarioVirtual />);
		expect(screen.getByText('Virtualised lists with variable-height rows')).toBeInTheDocument();
	});

	it('renders the traditional virtual scroll comparison header', () => {
		render(<ScenarioVirtual />);
		expect(screen.getByText(/Traditional virtual scroll/)).toBeInTheDocument();
	});

	it('renders the Pretext virtual scroll comparison header', () => {
		render(<ScenarioVirtual />);
		expect(screen.getByText(/Pretext virtual scroll/)).toBeInTheDocument();
	});

	it('renders two code blocks for the comparison', () => {
		render(<ScenarioVirtual />);
		expect(screen.getAllByTestId('code-block')).toHaveLength(2);
	});

	it('renders the verdict callout text', () => {
		render(<ScenarioVirtual />);
		expect(screen.getByText(/Verdict: Strong use case/)).toBeInTheDocument();
	});

	it('renders the explanatory paragraph about virtual scrolling', () => {
		render(<ScenarioVirtual />);
		expect(screen.getByText(/Virtual scrolling renders only what/)).toBeInTheDocument();
	});

	it('renders the paragraph about conventional approach', () => {
		render(<ScenarioVirtual />);
		expect(screen.getByText(/The conventional approach uses a ResizeObserver/)).toBeInTheDocument();
	});
});
