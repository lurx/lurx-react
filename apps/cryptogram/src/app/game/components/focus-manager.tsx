import React, { useRef, ReactNode } from 'react';

interface FocusManagerProps {
	children: ReactNode;
}

const FocusManager: React.FC<FocusManagerProps> = ({ children }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const focusNextElement = () => {
		if (!containerRef.current) return;

		// Define focusable selectors
		const focusableSelectors = `
      a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
    `;

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

		// Focus the next element
		focusableElements[nextIndex]?.focus();
	};

	return (
		<div ref={containerRef}>
			{/* Add a button to test focus functionality */}
			<button onClick={focusNextElement}>Focus Next</button>
			{children}
		</div>
	);
};

export default FocusManager;
