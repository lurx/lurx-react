import type { PropsWithChildren, ReactNode } from 'react';

export interface ResizableDrawerProps {
	/** Whether the drawer is currently visible */
	isOpen: boolean;
	/** Callback when the drawer requests to close (overlay click, Escape, close button) */
	onClose: () => void;
	/** Optional content rendered in the header next to the close button */
	title?: ReactNode;
	/** Initial width of the drawer in pixels. Defaults to 50% of viewport. */
	initialWidth?: number;
	/** Minimum width the drawer can be resized to, in pixels. Defaults to 320. */
	minWidth?: number;
	/** Maximum width the drawer can be resized to, in pixels. Defaults to 90vw. */
	maxWidth?: number;
	/** Accessible label for the drawer panel */
	ariaLabel?: string;
}

export type ResizableDrawerComponentProps = PropsWithChildren<ResizableDrawerProps>;
