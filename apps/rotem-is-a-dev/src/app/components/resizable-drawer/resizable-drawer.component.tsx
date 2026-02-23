'use client';

import { FaIcon } from '@/app/components/fa-icon/fa-icon.component';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useEventListener } from 'usehooks-ts';
import styles from './resizable-drawer.module.scss';
import type { ResizableDrawerComponentProps } from './resizable-drawer.types';

const DEFAULT_MIN_WIDTH = 320;
const DEFAULT_MAX_WIDTH_FRACTION = 0.9;
const DEFAULT_WIDTH_FRACTION = 0.5;

export const ResizableDrawer = ({
	isOpen,
	onClose,
	title,
	initialWidth,
	minWidth = DEFAULT_MIN_WIDTH,
	maxWidth,
	ariaLabel = 'Content drawer',
	children,
}: ResizableDrawerComponentProps) => {
	const drawerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState<number>(() =>
		initialWidth ?? (typeof window !== 'undefined' ? window.innerWidth * DEFAULT_WIDTH_FRACTION : 600),
	);
	const isDraggingRef = useRef(false);
	const startXRef = useRef(0);
	const startWidthRef = useRef(0);

	const resolveMaxWidth = useCallback(
		() => maxWidth ?? (typeof window !== 'undefined' ? window.innerWidth * DEFAULT_MAX_WIDTH_FRACTION : 1200),
		[maxWidth],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				onClose();
			}
		},
		[isOpen, onClose],
	);
	useEventListener('keydown', handleKeyDown);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		if (isOpen) {
			setWidth(initialWidth ?? window.innerWidth * DEFAULT_WIDTH_FRACTION);
		}
	}, [isOpen, initialWidth]);

	const handlePointerDown = useCallback(
		(event: React.PointerEvent) => {
			event.preventDefault();
			isDraggingRef.current = true;
			startXRef.current = event.clientX;
			startWidthRef.current = width;
			(event.target as HTMLElement).setPointerCapture(event.pointerId);
		},
		[width],
	);

	const handlePointerMove = useCallback(
		(event: React.PointerEvent) => {
			if (!isDraggingRef.current) return;
			const delta = startXRef.current - event.clientX;
			const resolved = resolveMaxWidth();
			const newWidth = Math.min(resolved, Math.max(minWidth, startWidthRef.current + delta));
			setWidth(newWidth);
		},
		[minWidth, resolveMaxWidth],
	);

	const handlePointerUp = useCallback(() => {
		isDraggingRef.current = false;
	}, []);

	if (!isOpen) return null;

	const portalTarget =
		typeof document !== 'undefined'
			? document.getElementById('portal-root') ?? document.body
			: null;

	if (!portalTarget) return null;

	return createPortal(
		<div className={styles.wrapper} data-testid="resizable-drawer-wrapper">
			<div
				className={styles.overlay}
				onClick={onClose}
				aria-hidden="true"
				data-testid="resizable-drawer-overlay"
			/>

			<div
				ref={drawerRef}
				className={styles.drawer}
				style={{ width: `${width}px` }}
				role="dialog"
				aria-modal="true"
				aria-label={ariaLabel}
				data-testid="resizable-drawer"
			>
				<div
					className={styles.dragHandle}
					onPointerDown={handlePointerDown}
					onPointerMove={handlePointerMove}
					onPointerUp={handlePointerUp}
					data-testid="resizable-drawer-drag-handle"
					aria-hidden="true"
				/>

				<div className={styles.header}>
					{title && <div className={styles.title}>{title}</div>}
					<button
						type="button"
						className={styles.closeButton}
						onClick={onClose}
						aria-label="Close drawer"
						data-testid="resizable-drawer-close"
					>
						<FaIcon iconName="xmark" iconGroup="fas" />
					</button>
				</div>

				<div className={styles.content}>
					{children}
				</div>
			</div>
		</div>,
		portalTarget,
	);
};
