'use client';

import { FaIcon, AccessibilityControls } from '@/app/components';
import { useOnClickOutside } from '@/hooks';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './accessibility-widget.module.scss';
import { useAccessibilitySettings } from './hooks/use-accessibility-settings';

export const AccessibilityWidget = () => {
	const [isOpen, setIsOpen] = useState(false);

	const wrapperRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(wrapperRef, () => setIsOpen(false));

	const settings = useAccessibilitySettings();

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
		}

		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen]);

	const toggle = useCallback(() => {
		setIsOpen(prev => !prev);
	}, []);

	return (
		<div
			ref={wrapperRef}
			className={styles.wrapper}
		>
			<button
				className={classNames(styles.trigger, { [styles.active]: isOpen })}
				aria-label="Accessibility options"
				aria-expanded={isOpen}
				onClick={toggle}
			>
				<FaIcon
					iconName="universal-access"
					iconGroup="fal"
				/>
			</button>

			{isOpen && (
				<dialog
					open
					aria-label="Accessibility settings"
					className={styles.panel}
				>
					<AccessibilityControls {...settings} />
				</dialog>
			)}
		</div>
	);
};
