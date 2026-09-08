import React from 'react';
import { render, screen } from '@testing-library/react';
import { NodeBuiltinZipMdx } from '../node-builtin-zip-mdx.component';

jest.mock('../components', () => ({
	ReadAllChart: () => <div data-testid="read-all-chart" />,
	WriteChart: () => <div data-testid="write-chart" />,
}));

// Mirrors the shape Velite's s.mdx() emits: a function body that reads jsx-runtime from arguments[0]
function compiledMdx(body: string): string {
	return [
		'const {jsx: _jsx, jsxs: _jsxs} = arguments[0];',
		'function _createMdxContent(props) {',
		'  const {ReadAllChart, WriteChart} = props.components;',
		`  return ${body};`,
		'}',
		'return { default: function MDXContent(props = {}) { return _createMdxContent(props); } };',
	].join('\n');
}

describe('NodeBuiltinZipMdx', () => {
	it('renders nothing without compiled code', () => {
		const { container } = render(<NodeBuiltinZipMdx />);

		expect(container.innerHTML).toBe('');
	});

	it('renders nothing for an empty code string', () => {
		const { container } = render(<NodeBuiltinZipMdx code="" />);

		expect(container.innerHTML).toBe('');
	});

	it('evaluates the MDX and wires both chart components', () => {
		const code = compiledMdx('_jsxs("div", { children: [_jsx(ReadAllChart, {}), _jsx(WriteChart, {})] })');
		const { container } = render(<NodeBuiltinZipMdx code={code} />);

		expect(container.firstChild).toHaveClass('content', 'post');
		expect(screen.getByTestId('read-all-chart')).toBeInTheDocument();
		expect(screen.getByTestId('write-chart')).toBeInTheDocument();
	});
});
