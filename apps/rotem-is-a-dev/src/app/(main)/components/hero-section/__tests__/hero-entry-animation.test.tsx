import { render } from '@testing-library/react';

jest.mock('../use-hero-entry-animation.hook', () => ({
	useHeroEntryAnimation: jest.fn(),
}));

import { HeroEntryAnimation } from '../hero-entry-animation.component';
import { useHeroEntryAnimation } from '../use-hero-entry-animation.hook';

const mockUseHeroEntryAnimation = useHeroEntryAnimation as jest.MockedFunction<
	typeof useHeroEntryAnimation
>;

beforeEach(() => {
	mockUseHeroEntryAnimation.mockClear();
});

describe('HeroEntryAnimation', () => {
	it('renders null (no DOM output)', () => {
		const { container } = render(<HeroEntryAnimation />);
		expect(container).toBeEmptyDOMElement();
	});

	it('calls useHeroEntryAnimation on mount', () => {
		render(<HeroEntryAnimation />);
		expect(mockUseHeroEntryAnimation).toHaveBeenCalledTimes(1);
	});

	it('calls useHeroEntryAnimation exactly once per render', () => {
		render(<HeroEntryAnimation />);
		render(<HeroEntryAnimation />);
		expect(mockUseHeroEntryAnimation).toHaveBeenCalledTimes(2);
	});
});
