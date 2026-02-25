import type { RefObject } from 'react';
import { renderHook } from '@testing-library/react';
import { useOnClickOutside } from '../use-on-click-outside.hook';

function createRef<T extends HTMLElement>(element: T | null): RefObject<T | null> {
	return { current: element };
}

function fireEvent(
	eventType: string,
	target: EventTarget,
	options: EventInit = {},
): void {
	const event = new Event(eventType, { bubbles: true, ...options });
	Object.defineProperty(event, 'target', { value: target });
	document.dispatchEvent(event);
}

beforeEach(() => {
	jest.clearAllMocks();
});

describe('useOnClickOutside', () => {
	describe('single ref', () => {
		it('calls handler when mousedown occurs outside the ref element', () => {
			const handler = jest.fn();
			const inside = document.createElement('div');
			const outside = document.createElement('button');
			document.body.appendChild(inside);
			document.body.appendChild(outside);

			const ref = createRef(inside);
			renderHook(() => useOnClickOutside(ref, handler));

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			inside.remove();
			outside.remove();
		});

		it('does NOT call handler when mousedown occurs inside the ref element', () => {
			const handler = jest.fn();
			const container = document.createElement('div');
			const child = document.createElement('span');
			container.appendChild(child);
			document.body.appendChild(container);

			const ref = createRef(container);
			renderHook(() => useOnClickOutside(ref, handler));

			fireEvent('mousedown', child);
			expect(handler).not.toHaveBeenCalled();

			fireEvent('mousedown', container);
			expect(handler).not.toHaveBeenCalled();

			container.remove();
		});
	});

	describe('event types', () => {
		it('listens to touchstart events when specified', () => {
			const handler = jest.fn();
			const inside = document.createElement('div');
			const outside = document.createElement('div');
			document.body.appendChild(inside);
			document.body.appendChild(outside);

			const ref = createRef(inside);
			renderHook(() => useOnClickOutside(ref, handler, 'touchstart'));

			fireEvent('mousedown', outside);
			expect(handler).not.toHaveBeenCalled();

			fireEvent('touchstart', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			inside.remove();
			outside.remove();
		});

		it('listens to focusin events when specified', () => {
			const handler = jest.fn();
			const inside = document.createElement('div');
			const outside = document.createElement('input');
			document.body.appendChild(inside);
			document.body.appendChild(outside);

			const ref = createRef(inside);
			renderHook(() => useOnClickOutside(ref, handler, 'focusin'));

			fireEvent('mousedown', outside);
			expect(handler).not.toHaveBeenCalled();

			fireEvent('focusin', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			inside.remove();
			outside.remove();
		});

		it('listens to multiple event types when an array is provided', () => {
			const handler = jest.fn();
			const inside = document.createElement('div');
			const outside = document.createElement('div');
			document.body.appendChild(inside);
			document.body.appendChild(outside);

			const ref = createRef(inside);
			renderHook(() =>
				useOnClickOutside(ref, handler, ['mousedown', 'touchstart']),
			);

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			fireEvent('touchstart', outside);
			expect(handler).toHaveBeenCalledTimes(2);

			inside.remove();
			outside.remove();
		});

		it('defaults to mousedown when no event type is specified', () => {
			const handler = jest.fn();
			const outside = document.createElement('div');
			document.body.appendChild(outside);

			const ref = createRef(document.createElement('div'));
			document.body.appendChild(ref.current as HTMLElement);

			renderHook(() => useOnClickOutside(ref, handler));

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			fireEvent('touchstart', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			(ref.current as HTMLElement).remove();
			outside.remove();
		});
	});

	describe('multiple refs', () => {
		it('does NOT call handler when click is inside any of the refs', () => {
			const handler = jest.fn();
			const elementA = document.createElement('div');
			const elementB = document.createElement('div');
			document.body.appendChild(elementA);
			document.body.appendChild(elementB);

			const refA = createRef(elementA);
			const refB = createRef(elementB);
			renderHook(() => useOnClickOutside([refA, refB], handler));

			fireEvent('mousedown', elementA);
			expect(handler).not.toHaveBeenCalled();

			fireEvent('mousedown', elementB);
			expect(handler).not.toHaveBeenCalled();

			elementA.remove();
			elementB.remove();
		});

		it('calls handler when click is outside all refs', () => {
			const handler = jest.fn();
			const elementA = document.createElement('div');
			const elementB = document.createElement('div');
			const outside = document.createElement('div');
			document.body.appendChild(elementA);
			document.body.appendChild(elementB);
			document.body.appendChild(outside);

			const refA = createRef(elementA);
			const refB = createRef(elementB);
			renderHook(() => useOnClickOutside([refA, refB], handler));

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			elementA.remove();
			elementB.remove();
			outside.remove();
		});

		it('filters out null refs and still detects outside clicks', () => {
			const handler = jest.fn();
			const element = document.createElement('div');
			const outside = document.createElement('div');
			document.body.appendChild(element);
			document.body.appendChild(outside);

			const validRef = createRef(element);
			const nullRef = createRef<HTMLElement>(null);
			renderHook(() => useOnClickOutside([validRef, nullRef], handler));

			fireEvent('mousedown', element);
			expect(handler).not.toHaveBeenCalled();

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			element.remove();
			outside.remove();
		});
	});

	describe('null and disconnected targets', () => {
		it('does NOT call handler when ref.current is null', () => {
			const handler = jest.fn();
			const outside = document.createElement('div');
			document.body.appendChild(outside);

			const ref = createRef<HTMLElement>(null);
			renderHook(() => useOnClickOutside(ref, handler));

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			outside.remove();
		});

		it('does NOT call handler when the event target is not connected to the DOM', () => {
			const handler = jest.fn();
			const inside = document.createElement('div');
			document.body.appendChild(inside);

			const disconnectedTarget = document.createElement('div');

			const ref = createRef(inside);
			renderHook(() => useOnClickOutside(ref, handler));

			fireEvent('mousedown', disconnectedTarget);
			expect(handler).not.toHaveBeenCalled();

			inside.remove();
		});
	});

	describe('cleanup on unmount', () => {
		it('removes event listeners when the hook unmounts', () => {
			const handler = jest.fn();
			const outside = document.createElement('div');
			document.body.appendChild(outside);

			const ref = createRef(document.createElement('div'));
			document.body.appendChild(ref.current as HTMLElement);

			const { unmount } = renderHook(() => useOnClickOutside(ref, handler));

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			unmount();

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			(ref.current as HTMLElement).remove();
			outside.remove();
		});

		it('removes all event listeners for multiple event types on unmount', () => {
			const handler = jest.fn();
			const outside = document.createElement('div');
			document.body.appendChild(outside);

			const ref = createRef(document.createElement('div'));
			document.body.appendChild(ref.current as HTMLElement);

			const { unmount } = renderHook(() =>
				useOnClickOutside(ref, handler, ['mousedown', 'touchstart', 'focusin']),
			);

			fireEvent('mousedown', outside);
			fireEvent('touchstart', outside);
			fireEvent('focusin', outside);
			expect(handler).toHaveBeenCalledTimes(3);

			unmount();

			fireEvent('mousedown', outside);
			fireEvent('touchstart', outside);
			fireEvent('focusin', outside);
			expect(handler).toHaveBeenCalledTimes(3);

			(ref.current as HTMLElement).remove();
			outside.remove();
		});
	});

	describe('event listener options', () => {
		it('passes event listener options to addEventListener', () => {
			const addSpy = jest.spyOn(document, 'addEventListener');
			const handler = jest.fn();
			const ref = createRef(document.createElement('div'));
			const options: AddEventListenerOptions = { capture: true, passive: true };

			renderHook(() => useOnClickOutside(ref, handler, 'mousedown', options));

			expect(addSpy).toHaveBeenCalledWith('mousedown', expect.any(Function), options);

			addSpy.mockRestore();
		});

		it('passes event listener options to removeEventListener on unmount', () => {
			const removeSpy = jest.spyOn(document, 'removeEventListener');
			const handler = jest.fn();
			const ref = createRef(document.createElement('div'));
			const options: AddEventListenerOptions = { capture: true };

			const { unmount } = renderHook(() =>
				useOnClickOutside(ref, handler, 'mousedown', options),
			);

			unmount();

			expect(removeSpy).toHaveBeenCalledWith(
				'mousedown',
				expect.any(Function),
				options,
			);

			removeSpy.mockRestore();
		});
	});

	describe('handler ref stability', () => {
		it('always calls the latest handler even after re-render with new handler', () => {
			const firstHandler = jest.fn();
			const secondHandler = jest.fn();
			const outside = document.createElement('div');
			document.body.appendChild(outside);

			const ref = createRef(document.createElement('div'));
			document.body.appendChild(ref.current as HTMLElement);

			const { rerender } = renderHook(
				({ handler }) => useOnClickOutside(ref, handler),
				{ initialProps: { handler: firstHandler } },
			);

			fireEvent('mousedown', outside);
			expect(firstHandler).toHaveBeenCalledTimes(1);
			expect(secondHandler).not.toHaveBeenCalled();

			rerender({ handler: secondHandler });

			fireEvent('mousedown', outside);
			expect(firstHandler).toHaveBeenCalledTimes(1);
			expect(secondHandler).toHaveBeenCalledTimes(1);

			(ref.current as HTMLElement).remove();
			outside.remove();
		});
	});

	describe('all refs are null', () => {
		it('calls handler when all refs in the array are null (no elements to contain the target)', () => {
			const handler = jest.fn();
			const outside = document.createElement('div');
			document.body.appendChild(outside);

			const refA = createRef<HTMLElement>(null);
			const refB = createRef<HTMLElement>(null);
			renderHook(() => useOnClickOutside([refA, refB], handler));

			fireEvent('mousedown', outside);
			expect(handler).toHaveBeenCalledTimes(1);

			outside.remove();
		});
	});
});
