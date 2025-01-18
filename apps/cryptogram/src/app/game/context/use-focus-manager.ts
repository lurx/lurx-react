import { useRef } from 'react';

export const useFocusManager = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const focusNextElement = () => {
    if (!containerRef.current) return;

    // Define focusable selectors
    const focusableSelectors = `input`;

    // Get all focusable elements within the container
    const focusableElements: HTMLElement[] = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
    ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);

    if (focusableElements.length === 0) return;

    // Get the currently focused element
    const currentIndex = focusableElements.indexOf(
      document.activeElement as HTMLElement,
    );

    // Determine the next index (loop back to the start if at the end)
    const nextIndex = (currentIndex + 1) % focusableElements.length;

    const nextElement = focusableElements[nextIndex];

    // Focus the next element
    nextElement?.focus();
  };

  return { containerRef, focusNextElement };
};