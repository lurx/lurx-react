import { render, screen } from '@testing-library/react';
import { DemoContainer } from '../demo-container.component';

jest.mock('@/app/components', () => ({
	Flex: ({
		children,
		style,
		className,
		direction,
		align,
	}: {
		children: React.ReactNode;
		style?: React.CSSProperties;
		className?: string;
		direction?: string;
		align?: string;
	}) => (
		<div
			data-testid="flex"
			data-direction={direction}
			data-align={align}
			className={className}
			style={style}
		>
			{children}
		</div>
	),
}));

describe('DemoContainer', () => {
	it('renders children', () => {
		render(
			<DemoContainer>
				<span>Demo content</span>
			</DemoContainer>,
		);
		expect(screen.getByText('Demo content')).toBeInTheDocument();
	});

	it('renders a Flex with column direction and center alignment', () => {
		render(<DemoContainer>child</DemoContainer>);
		const flex = screen.getByTestId('flex');
		expect(flex).toHaveAttribute('data-direction', 'column');
		expect(flex).toHaveAttribute('data-align', 'center');
	});

	it('sets --demo-container-width CSS variable from width prop', () => {
		render(<DemoContainer width="800px">child</DemoContainer>);
		const flex = screen.getByTestId('flex');
		expect(flex.style.getPropertyValue('--demo-container-width')).toBe('800px');
	});

	it('sets --demo-container-height CSS variable from height prop', () => {
		render(<DemoContainer height="600px">child</DemoContainer>);
		const flex = screen.getByTestId('flex');
		expect(flex.style.getPropertyValue('--demo-container-height')).toBe('600px');
	});

	it('sets both width and height CSS variables when both are provided', () => {
		render(
			<DemoContainer width="400px" height="300px">
				child
			</DemoContainer>,
		);
		const flex = screen.getByTestId('flex');
		expect(flex.style.getPropertyValue('--demo-container-width')).toBe('400px');
		expect(flex.style.getPropertyValue('--demo-container-height')).toBe('300px');
	});

	it('renders without width and height when not provided', () => {
		render(<DemoContainer>child</DemoContainer>);
		const flex = screen.getByTestId('flex');
		expect(flex.style.getPropertyValue('--demo-container-width')).toBe('');
		expect(flex.style.getPropertyValue('--demo-container-height')).toBe('');
	});
});
