import { renderHook } from '@testing-library/react';
import { useHeroContext } from '../hero.context';

describe('useHeroContext', () => {
	it('throws when used outside of HeroProvider', () => {
		expect(() => {
			renderHook(() => useHeroContext());
		}).toThrow('useHeroContext must be used within HeroProvider');
	});
});
