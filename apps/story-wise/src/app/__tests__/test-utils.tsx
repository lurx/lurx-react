import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import type { StoryWiseContextType } from '../types/story-wise.types';
import { StoryWiseContext, StoryWiseProvider } from '../context/story-wise-context';

/** Default mock context value for StoryWise. Override with partial in tests. */
export function createMockStoryWiseContext(
	overrides: Partial<StoryWiseContextType> = {}
): StoryWiseContextType {
	return {
		sourceFile: null,
		sourceUrl: null,
		sourceDuration: 0,
		sourceMetadata: null,
		processingStatus: 'idle',
		processingProgress: null,
		processingError: null,
		processingMode: null,
		segments: [],
		segmentDuration: 45,
		selectedSegmentId: null,
		serviceStatus: { online: true },
		setSourceFile: jest.fn(),
		startProcessing: jest.fn().mockResolvedValue(undefined),
		cancelProcessing: jest.fn(),
		downloadSegment: jest.fn(),
		downloadAllSegments: jest.fn(),
		setSegmentDuration: jest.fn(),
		selectSegment: jest.fn(),
		reset: jest.fn(),
		...overrides,
	};
}

/** Renders `children` wrapped in StoryWiseProvider (uses real context; mock useFFmpeg in that test). */
export function renderWithStoryWiseProvider(
	ui: ReactElement,
	options?: Omit<RenderOptions, 'wrapper'>
) {
	return render(ui, {
		...options,
		wrapper: ({ children }) => <StoryWiseProvider>{children}</StoryWiseProvider>,
	});
}

/** Renders `children` with an injected mock StoryWise context. */
export function MockStoryWiseProvider({
	value,
	children,
}: {
	value: StoryWiseContextType;
	children: React.ReactNode;
}) {
	return (
		<StoryWiseContext.Provider value={value}>{children}</StoryWiseContext.Provider>
	);
}

/** Renders `ui` wrapped in MockStoryWiseProvider with the given context overrides. */
export function renderWithMockStoryWise(
	ui: ReactElement,
	contextOverrides: Partial<StoryWiseContextType> = {},
	options?: Omit<RenderOptions, 'wrapper'>
) {
	const value = createMockStoryWiseContext(contextOverrides);
	return render(ui, {
		...options,
		wrapper: ({ children }) => (
			<MockStoryWiseProvider value={value}>{children}</MockStoryWiseProvider>
		),
	});
}
