'use client';

import { FaIcon } from '@/app/components';
import { toCodeLike } from '@/app/utils/to-code-like.util';
import { useOnClickOutside, useResponsive } from '@/hooks';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import { NAV_ITEMS } from '../../nav-items.constants';
import styles from './mobile-menu.module.scss';

export const MobileMenu = () => {
	const { isMobile } = useResponsive();
	const [isOpen, setIsOpen] = useState(false);
	const pathname = usePathname();
	const wrapperRef = useRef<HTMLDivElement>(null);

	const toggle = useCallback(() => {
		setIsOpen(prev => !prev);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	const handleEscape = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			close();
		}
	};

	useOnClickOutside(wrapperRef, close, 'mousedown');
	useEventListener('keydown', handleEscape);

	useEffect(() => {
		close();
	}, [pathname, close]);

	if (!isMobile) return null;

	return (
		<div ref={wrapperRef} className={styles.wrapper}>
			<button
				className={classNames(styles.hamburger, { [styles.active]: isOpen })}
				onClick={toggle}
				aria-expanded={isOpen}
				aria-controls="mobile-menu-dropdown"
				aria-label={isOpen ? 'Close menu' : 'Open menu'}
			>
				<FaIcon
					iconName={isOpen ? 'xmark' : 'bars'}
					iconGroup="fas"
				/>
			</button>

			{isOpen && (
				<div
					id="mobile-menu-dropdown"
					className={styles.dropdown}
					role="menu"
				>
					<span className={styles.header}># navigate:</span>

					<ul className={styles.navList}>
						{NAV_ITEMS.filter(item => item.enabled).map(({ label, href }) => (
							<li key={label}>
								<a
									href={href}
									className={classNames(styles.navLink, {
										[styles.active]: pathname === href,
									})}
									aria-current={pathname === href ? 'page' : undefined}
									role="menuitem"
								>
									{toCodeLike(label, { prefix: '_', convertCase: 'kebab-case' })}
								</a>
							</li>
						))}
					</ul>

					<div className={styles.actions}>
						<a
							href="#downloadPdf"
							className={styles.navLink}
							role="menuitem"
						>
							<FaIcon
								iconName="file-pdf"
								iconGroup="fal"
							/>
							<span>_download-cv</span>
						</a>
						<a
							href="#contact-me"
							className={styles.navLink}
							role="menuitem"
						>
							<span>_contact-me</span>
						</a>
					</div>
				</div>
			)}
		</div>
	);
};
