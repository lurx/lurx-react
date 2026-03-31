import { render, screen } from '@testing-library/react';
import { CodeCompare, StatsRow, ImpossibleThingsGrid, IntegrationCode, MdxVerdictBox } from '../mdx-static.component';
import { IMPOSSIBLE_THINGS } from '../../../pretext-benchmark.constants';

jest.mock('@/app/components', () => ({
	CodeBlock: ({ code, language }: { code: string; language: string }) => (
		<pre data-testid="code-block" data-language={language}>
			{code}
		</pre>
	),
}));

jest.mock('../../verdict-box', () => ({
	VerdictBox: ({ title, children }: { title: string; children: React.ReactNode }) => (
		<div data-testid="verdict-box">
			<div data-testid="verdict-box-title">{title}</div>
			{children}
		</div>
	),
}));

describe('CodeCompare', () => {
	it('renders the DOM approach header', () => {
		render(<CodeCompare />);
		expect(screen.getByText(/DOM approach/)).toBeInTheDocument();
	});

	it('renders the Pretext approach header', () => {
		render(<CodeCompare />);
		expect(screen.getByText(/Pretext approach/)).toBeInTheDocument();
	});

	it('renders two code blocks', () => {
		render(<CodeCompare />);
		expect(screen.getAllByTestId('code-block')).toHaveLength(2);
	});

	it('renders the DOM timing footnote', () => {
		render(<CodeCompare />);
		expect(screen.getByText(/~0.18ms per batch/)).toBeInTheDocument();
	});

	it('renders the Pretext timing footnote', () => {
		render(<CodeCompare />);
		expect(screen.getByText(/~0.02ms for all 500/)).toBeInTheDocument();
	});
});

describe('StatsRow', () => {
	it('renders the 19ms stat value', () => {
		render(<StatsRow />);
		expect(screen.getByText('19ms')).toBeInTheDocument();
	});

	it('renders the 0.09ms stat value', () => {
		render(<StatsRow />);
		expect(screen.getByText('0.09ms')).toBeInTheDocument();
	});

	it('renders the 100% stat value', () => {
		render(<StatsRow />);
		expect(screen.getByText('100%')).toBeInTheDocument();
	});

	it('renders the 7680 stat value', () => {
		render(<StatsRow />);
		expect(screen.getByText('7680')).toBeInTheDocument();
	});

	it('renders the prepare() label', () => {
		render(<StatsRow />);
		expect(screen.getByText(/prepare\(\)/)).toBeInTheDocument();
	});

	it('renders the layout() label', () => {
		render(<StatsRow />);
		expect(screen.getByText(/layout\(\)/)).toBeInTheDocument();
	});
});

describe('ImpossibleThingsGrid', () => {
	it('renders all impossible thing labels', () => {
		render(<ImpossibleThingsGrid />);
		for (const thing of IMPOSSIBLE_THINGS) {
			expect(screen.getByText(thing.label)).toBeInTheDocument();
		}
	});

	it('renders all impossible thing descriptions', () => {
		render(<ImpossibleThingsGrid />);
		for (const thing of IMPOSSIBLE_THINGS) {
			expect(screen.getByText(thing.description)).toBeInTheDocument();
		}
	});

	it('renders all impossible thing icons', () => {
		render(<ImpossibleThingsGrid />);
		for (const thing of IMPOSSIBLE_THINGS) {
			expect(screen.getByText(thing.icon)).toBeInTheDocument();
		}
	});
});

describe('IntegrationCode', () => {
	it('renders a code block', () => {
		render(<IntegrationCode />);
		expect(screen.getByTestId('code-block')).toBeInTheDocument();
	});

	it('renders the code block with javascript language', () => {
		render(<IntegrationCode />);
		expect(screen.getByTestId('code-block')).toHaveAttribute('data-language', 'javascript');
	});
});

describe('MdxVerdictBox', () => {
	it('renders a VerdictBox with the correct title', () => {
		render(<MdxVerdictBox />);
		expect(screen.getByTestId('verdict-box-title')).toHaveTextContent('The short answer');
	});

	it('renders the positive recommendation text', () => {
		render(<MdxVerdictBox />);
		expect(screen.getByText(/yes, pretext is the best tool available/)).toBeInTheDocument();
	});

	it('renders the negative recommendation text', () => {
		render(<MdxVerdictBox />);
		expect(screen.getByText(/don't reach for pretext/)).toBeInTheDocument();
	});
});
