import { renderHook } from '@testing-library/react';
import { useMediaQuery } from 'usehooks-ts';
import { useResponsive } from '../use-responsive.hook';

jest.mock('usehooks-ts', () => ({
	useMediaQuery: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock;

function mockViewport(width: 'mobile' | 'tablet' | 'desktop') {
	mockUseMediaQuery.mockImplementation((query: string) => {
		switch (width) {
			case 'mobile':
				return query === '(max-width: 767px)';
			case 'tablet':
				return query === '(min-width: 768px) and (max-width: 1023px)';
			case 'desktop':
				return query === '(min-width: 1024px)';
		}
	});
}

beforeEach(() => {
	jest.clearAllMocks();
});

describe('useResponsive', () => {
	it('returns isMobile true on mobile viewport', () => {
		mockViewport('mobile');
		const { result } = renderHook(() => useResponsive());

		expect(result.current.isMobile).toBe(true);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(false);
	});

	it('returns isTablet true on tablet viewport', () => {
		mockViewport('tablet');
		const { result } = renderHook(() => useResponsive());

		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(true);
		expect(result.current.isDesktop).toBe(false);
	});

	it('returns isDesktop true on desktop viewport', () => {
		mockViewport('desktop');
		const { result } = renderHook(() => useResponsive());

		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(true);
	});

	it('returns all false during SSR (default state)', () => {
		mockUseMediaQuery.mockReturnValue(false);
		const { result } = renderHook(() => useResponsive());

		expect(result.current.isMobile).toBe(false);
		expect(result.current.isTablet).toBe(false);
		expect(result.current.isDesktop).toBe(false);
	});

	it('passes correct media queries to useMediaQuery', () => {
		mockUseMediaQuery.mockReturnValue(false);
		renderHook(() => useResponsive());

		expect(mockUseMediaQuery).toHaveBeenCalledWith('(min-width: 1024px)');
		expect(mockUseMediaQuery).toHaveBeenCalledWith(
			'(min-width: 768px) and (max-width: 1023px)',
		);
		expect(mockUseMediaQuery).toHaveBeenCalledWith('(max-width: 767px)');
	});

	it('returns a stable reference when values do not change', () => {
		mockViewport('mobile');
		const { result, rerender } = renderHook(() => useResponsive());
		const first = result.current;

		rerender();
		expect(result.current).toBe(first);
	});
});
