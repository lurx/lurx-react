import { render, screen, getDefaultNormalizer } from '@testing-library/react';
import type { ShikiLine } from '@/lib/shiki';

const mockUseShikiTokens = jest.fn();

jest.mock('@/lib/shiki', () => ({
	useShikiTokens: (...args: unknown[]) => mockUseShikiTokens(...args),
}));

import { CodeBlock } from '../code-block.component';

const noTrimNormalizer = getDefaultNormalizer({ trim: false, collapseWhitespace: false });

describe('CodeBlock', () => {
	const mockLines: ShikiLine[] = [
		{
			tokens: [
				{ content: 'const', color: '#C792EA', offset: 0 },
				{ content: ' x', color: '#D6DEEB', offset: 6 },
			],
		},
		{
			tokens: [
				{ content: '  = 1;', color: '#D6DEEB', offset: 0 },
			],
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseShikiTokens.mockReturnValue(mockLines);
	});

	it('renders the code block wrapper', () => {
		const { container } = render(<CodeBlock code="const x = 1;" />);

		expect(container.firstChild).toHaveClass('wrapper');
	});

	it('calls useShikiTokens with code and default language typescript', () => {
		render(<CodeBlock code="const x = 1;" />);

		expect(mockUseShikiTokens).toHaveBeenCalledWith({
			code: 'const x = 1;',
			language: 'typescript',
		});
	});

	it('calls useShikiTokens with a custom language', () => {
		render(<CodeBlock code="var a = 1;" language="javascript" />);

		expect(mockUseShikiTokens).toHaveBeenCalledWith({
			code: 'var a = 1;',
			language: 'javascript',
		});
	});

	it('renders highlighted tokens when shikiLines are available', () => {
		render(<CodeBlock code="const x\n  = 1;" />);

		expect(screen.getByText('const')).toBeInTheDocument();
		expect(screen.getByText(' x', { normalizer: noTrimNormalizer })).toBeInTheDocument();
		expect(screen.getByText('  = 1;', { normalizer: noTrimNormalizer })).toBeInTheDocument();
	});

	it('applies token colors as inline styles', () => {
		render(<CodeBlock code="const x = 1;" />);

		const constToken = screen.getByText('const');
		expect(constToken).toHaveStyle({ color: '#C792EA' });

		const xToken = screen.getByText(' x', { normalizer: noTrimNormalizer });
		expect(xToken).toHaveStyle({ color: '#D6DEEB' });
	});

	it('renders raw code as fallback while loading (null shikiLines)', () => {
		mockUseShikiTokens.mockReturnValue(null);

		render(<CodeBlock code="const x = 1;" />);

		const codeElement = screen.getByText('const x = 1;');
		expect(codeElement).toBeInTheDocument();
	});

	it('does not render line numbers when numberOfLines is not provided', () => {
		const { container } = render(<CodeBlock code="const x = 1;" />);

		expect(container.firstChild).not.toHaveClass('withLineNumbers');
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
	});

	it('renders line numbers when numberOfLines is provided', () => {
		const { container } = render(
			<CodeBlock code="const x = 1;\nconst y = 2;\nconst z = 3;" numberOfLines={3} />,
		);

		expect(container.firstChild).toHaveClass('withLineNumbers');
		const lineNumbersPre = container.querySelector('[aria-hidden="true"]');
		expect(lineNumbersPre).toBeInTheDocument();
		expect(lineNumbersPre?.textContent).toBe('1\n2\n3');
	});

	it('renders correct line numbers for five lines', () => {
		const { container } = render(
			<CodeBlock code="line1\nline2\nline3\nline4\nline5" numberOfLines={5} />,
		);

		const lineNumbersPre = container.querySelector('[aria-hidden="true"]');
		expect(lineNumbersPre?.textContent).toBe('1\n2\n3\n4\n5');
	});

	it('sets aria-hidden on line numbers pre element', () => {
		const { container } = render(
			<CodeBlock code="const x = 1;" numberOfLines={1} />,
		);

		const lineNumbersPre = container.querySelector('pre.lineNumbers');
		expect(lineNumbersPre).toHaveAttribute('aria-hidden', 'true');
	});

	it('applies aria-label on the code pre element', () => {
		render(
			<CodeBlock code="const x = 1;" aria-label="TypeScript code example" />,
		);

		const codePre = screen.getByLabelText('TypeScript code example');
		expect(codePre).toBeInTheDocument();
		expect(codePre.tagName).toBe('PRE');
	});

	it('does not set aria-label when not provided', () => {
		const { container } = render(<CodeBlock code="const x = 1;" />);

		const codePre = container.querySelector('pre.code');
		expect(codePre).not.toHaveAttribute('aria-label');
	});

	it('applies a custom className to the wrapper', () => {
		const { container } = render(
			<CodeBlock code="const x = 1;" className="custom-class" />,
		);

		expect(container.firstChild).toHaveClass('custom-class');
	});

	it('renders with json language', () => {
		render(<CodeBlock code='{"key": "value"}' language="json" />);

		expect(mockUseShikiTokens).toHaveBeenCalledWith({
			code: '{"key": "value"}',
			language: 'json',
		});
	});

	it('renders the code element inside the pre element', () => {
		const { container } = render(<CodeBlock code="const x = 1;" />);

		const preElement = container.querySelector('pre.code');
		const codeElement = preElement?.querySelector('code');
		expect(codeElement).toBeInTheDocument();
	});

	it('renders multiple lines with newline characters between them', () => {
		const { container } = render(<CodeBlock code="const x\n  = 1;" />);

		const codeElement = container.querySelector('code');
		expect(codeElement?.textContent).toContain('const');
		expect(codeElement?.textContent).toContain(' x');
		expect(codeElement?.textContent).toContain('  = 1;');
	});

	it('applies both wrapper and withLineNumbers classes when numberOfLines is set', () => {
		const { container } = render(
			<CodeBlock code="const x = 1;" numberOfLines={1} />,
		);

		expect(container.firstChild).toHaveClass('wrapper');
		expect(container.firstChild).toHaveClass('withLineNumbers');
	});

	it('does not render line numbers pre when numberOfLines is 0 (falsy)', () => {
		const { container } = render(
			<CodeBlock code="const x = 1;" numberOfLines={0} />,
		);

		expect(container.firstChild).not.toHaveClass('withLineNumbers');
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
	});
});
