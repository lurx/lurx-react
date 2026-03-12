import { renderHook, act } from '@testing-library/react';
import { useActiveKey } from '../use-active-key.hook';

const KEY_MAP: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
	ArrowUp: 'UP',
	ArrowDown: 'DOWN',
	ArrowLeft: 'LEFT',
	ArrowRight: 'RIGHT',
};

describe('useActiveKey', () => {
	it('returns null initially', () => {
		const { result } = renderHook(() => useActiveKey(KEY_MAP));
		expect(result.current).toBeNull();
	});

	it('sets the mapped value on keydown', () => {
		const { result } = renderHook(() => useActiveKey(KEY_MAP));

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
		});

		expect(result.current).toBe('UP');
	});

	it('clears value on keyup', () => {
		const { result } = renderHook(() => useActiveKey(KEY_MAP));

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
		});

		expect(result.current).toBe('LEFT');

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
		});

		expect(result.current).toBeNull();
	});

	it('ignores unmapped keys', () => {
		const { result } = renderHook(() => useActiveKey(KEY_MAP));

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
		});

		expect(result.current).toBeNull();
	});

	it('cleans up listeners on unmount', () => {
		const removeSpy = jest.spyOn(globalThis, 'removeEventListener');
		const { unmount } = renderHook(() => useActiveKey(KEY_MAP));

		unmount();

		expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith('keyup', expect.any(Function));
		removeSpy.mockRestore();
	});

	it('updates listeners when keyMap changes', () => {
		/* eslint-disable id-length */
		const wasdMap: Record<string, 'UP' | 'DOWN'> = { w: 'UP', s: 'DOWN' };
		/* eslint-enable id-length */
		const { result, rerender } = renderHook(
			({ keyMap }) => useActiveKey(keyMap),
			{ initialProps: { keyMap: KEY_MAP as Record<string, string> } },
		);

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
		});

		expect(result.current).toBe('UP');

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
		});

		rerender({ keyMap: wasdMap as Record<string, string> });

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
		});

		expect(result.current).toBeNull();

		act(() => {
			globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
		});

		expect(result.current).toBe('UP');
	});
});
