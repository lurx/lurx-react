import type { RefObject } from 'react';
import { useEffect, useRef } from 'react';
import type { AllowedElements, EventType } from './use-on-click-outside.types';

export function useOnClickOutside<T extends AllowedElements = AllowedElements>(
	ref: RefObject<Nullable<T> | null> | RefObject<Nullable<T> | null>[],
	handler: (event: MouseEvent | TouchEvent | FocusEvent) => void,
	eventType: EventType | EventType[] = 'mousedown',
	eventListenerOptions: AddEventListenerOptions = {},
): void {
	const handlerRef = useRef(handler);
	handlerRef.current = handler;

	useEffect(() => {
		const listener = (event: Event) => {
			const target = event.target as Node;

			if (!target?.isConnected) {
				return;
			}

			const refs = Array.isArray(ref) ? ref : [ref];
			const isOutside = refs
				.filter(refItem => Boolean(refItem.current))
				.every(refItem => !refItem.current?.contains(target));

			if (isOutside) {
				handlerRef.current(event as MouseEvent | TouchEvent | FocusEvent);
			}
		};

		const eventTypes = Array.isArray(eventType) ? eventType : [eventType];

		for (const type of eventTypes) {
			document.addEventListener(type, listener, eventListenerOptions);
		}

		return () => {
			for (const type of eventTypes) {
				document.removeEventListener(type, listener, eventListenerOptions);
			}
		};
	}, [ref, eventType, eventListenerOptions]);
}
