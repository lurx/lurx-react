import type { ReactNode } from 'react';

type MockProps = { children?: ReactNode; style?: unknown; [key: string]: unknown };

const createMockElement = (tag: string) => {
	const MockElement = ({ children, ...props }: MockProps) => (
		<div data-testid={`pdf-${tag}`} {...filterProps(props)}>
			{children}
		</div>
	);
	MockElement.displayName = `Mock${tag}`;
	return MockElement;
};

const filterProps = (props: Record<string, unknown>) => {
	const filtered: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(props)) {
		if (key !== 'style' && key !== 'wrap' && key !== 'size' && typeof value !== 'object') {
			filtered[key] = value;
		}
	}
	return filtered;
};

export const Document = createMockElement('document');
export const Page = createMockElement('page');
export const View = createMockElement('view');
export const Text = ({ children }: MockProps) => <span>{children}</span>;
export const StyleSheet = {
	create: <T extends Record<string, unknown>>(styles: T): T => styles,
};
export const pdf = jest.fn();
