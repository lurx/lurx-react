import { render, screen } from '@testing-library/react';

jest.mock('next/dynamic', () => {
	return jest.fn(() => () => null);
});

jest.mock('@/app/components', () => ({
	AnimatedLoader: () => <div data-testid="animated-loader" />,
}));

jest.mock('@/demos/wolverine/wolverine.demo', () => ({
	WolverineDemo: () => <div />,
}));
jest.mock('@/demos/sheep/sheep.demo', () => ({
	SheepDemo: () => <div />,
}));
jest.mock('@/demos/moon/moon.demo', () => ({
	MoonDemo: () => <div />,
}));

import dynamic from 'next/dynamic';
import { PROJECTS, ALL_TECHNOLOGIES } from '../projects.data';

const mockDynamic = dynamic as unknown as jest.Mock;

describe('projects data', () => {
	it('exports ALL_TECHNOLOGIES array', () => {
		expect(ALL_TECHNOLOGIES).toEqual(
			expect.arrayContaining(['react', 'typescript', 'css']),
		);
	});

	it('exports PROJECTS with all entries', () => {
		expect(PROJECTS).toHaveLength(4);
	});

	it('renders the loading component', () => {
		const options = mockDynamic.mock.calls[0][1] as { loading: React.ComponentType };
		const Loading = options.loading;
		render(<Loading />);
		expect(screen.getByTestId('animated-loader')).toBeInTheDocument();
	});

	it('resolves WolverineDemo factory', async () => {
		const factory = mockDynamic.mock.calls[0][0] as () => Promise<unknown>;
		const result = await factory();
		expect(result).toBeDefined();
	});

	it('resolves SheepDemo factory', async () => {
		const factory = mockDynamic.mock.calls[1][0] as () => Promise<unknown>;
		const result = await factory();
		expect(result).toBeDefined();
	});

	it('resolves MoonDemo factory', async () => {
		const factory = mockDynamic.mock.calls[2][0] as () => Promise<unknown>;
		const result = await factory();
		expect(result).toBeDefined();
	});
});
