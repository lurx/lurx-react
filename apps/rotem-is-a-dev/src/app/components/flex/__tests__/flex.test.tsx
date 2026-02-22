import { render, screen } from '@testing-library/react';
import { Flex } from '../flex.component';

describe('Flex', () => {
	it('renders children inside a div by default', () => {
		render(<Flex>hello</Flex>);
		expect(screen.getByText('hello')).toBeInTheDocument();
		expect(screen.getByText('hello').tagName).toBe('DIV');
	});

	it('applies a custom tag', () => {
		render(<Flex tag="section">content</Flex>);
		expect(screen.getByText('content').tagName).toBe('SECTION');
	});

	it('passes id and className', () => {
		const { container } = render(
			<Flex id="test-id" className="custom">
				text
			</Flex>,
		);
		const el = container.firstChild as HTMLElement;
		expect(el.id).toBe('test-id');
		expect(el.classList.contains('custom')).toBe(true);
	});

	it('passes inline style', () => {
		const { container } = render(
			<Flex style={{ color: 'red' }}>styled</Flex>,
		);
		const el = container.firstChild as HTMLElement;
		expect(el.style.color).toBe('red');
	});

	it('applies direction className when not the default', () => {
		const { container } = render(<Flex direction="column">col</Flex>);
		const el = container.firstChild as HTMLElement;
		expect(el.className).toContain('direction-column');
	});

	it('applies wrap className when not the default', () => {
		const { container } = render(<Flex wrap="wrap">wrapped</Flex>);
		const el = container.firstChild as HTMLElement;
		expect(el.className).toContain('wrap-wrap');
	});

	it('applies justify className when not the default', () => {
		const { container } = render(<Flex justify="center">centered</Flex>);
		const el = container.firstChild as HTMLElement;
		expect(el.className).toContain('justify-center');
	});

	it('applies align className when not the default', () => {
		const { container } = render(<Flex align="center">aligned</Flex>);
		const el = container.firstChild as HTMLElement;
		expect(el.className).toContain('align-center');
	});

	it('applies gap className when not the default', () => {
		const { container } = render(<Flex gap="large">gapped</Flex>);
		const el = container.firstChild as HTMLElement;
		expect(el.className).toContain('gap-large');
	});

	it('does not apply non-default classNames for default values', () => {
		const { container } = render(<Flex>defaults</Flex>);
		const el = container.firstChild as HTMLElement;
		expect(el.className).not.toContain('direction-');
		expect(el.className).not.toContain('wrap-');
		expect(el.className).not.toContain('justify-');
		expect(el.className).not.toContain('align-');
		expect(el.className).not.toContain('gap-');
	});
});
