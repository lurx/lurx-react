'use client';

import { FaIcon } from '@/app/components/fa-icon';
import { useCallback, useEffect } from 'react';
import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';
import { useEventListener } from 'usehooks-ts';
import classNames from 'classnames';
import styles from './dialog.module.scss';
import type { DialogProps } from './dialog.types';

export const Dialog = ({
	isOpen,
	onCloseAction,
	ariaLabel,
	className,
	fullScreen = false,
	children,
}: PropsWithChildren<DialogProps>) => {
	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				onCloseAction();
			}
		},
		[isOpen, onCloseAction],
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

	if (!isOpen) return null;

	/* istanbul ignore next -- SSR guard */
	const portalTarget =
		typeof document === 'undefined'
			? null
			: document.getElementById('portal-root') ?? document.body;

	/* istanbul ignore next -- only reachable during SSR */
	if (!portalTarget) return null;

	return createPortal(
		<div
			className={styles.wrapper}
			data-testid="dialog-wrapper"
		>
			<div
				className={styles.overlay}
				onClick={onCloseAction}
				aria-hidden="true"
				data-testid="dialog-overlay"
			/>

			<dialog
				open
				className={classNames(styles.card, fullScreen && styles.fullScreen, className)}
				aria-label={ariaLabel}
				data-testid="dialog"
			>
				<button
					type="button"
					className={styles.closeButton}
					onClick={onCloseAction}
					aria-label="Close dialog"
				>
					<FaIcon iconName="xmark" iconGroup="fal" />
				</button>
				{children}
			</dialog>
		</div>,
		portalTarget,
	);
};
