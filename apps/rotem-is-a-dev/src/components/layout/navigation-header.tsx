'use client';

import { FadeIn } from '@lurx-react/vanguardis';
import { throttle } from 'es-toolkit';
import React, { useEffect, useState } from 'react';
import styles from './navigation-header.module.scss';

/**
 * Props for navigation items
 */
interface NavigationItem {
	label: string;
	href: string;
	isActive?: boolean;
}

/**
 * Props for the NavigationHeader component
 */
interface NavigationHeaderProps {
	/** Navigation items */
	items?: NavigationItem[];
	/** Logo text or component */
	logo?: string | React.ReactNode;
	/** Whether to show navigation on mobile */
	showMobileNav?: boolean;
	/** Callback for logo click */
	onLogoClick?: () => void;
	/** Callback for navigation item click */
	onNavClick?: (href: string) => void;
}

/**
 * Navigation header with smooth transitions and scroll effects
 * Features auto-hide on scroll down, glass morphism background
 */
export default function NavigationHeader({
	items = [
		{ label: 'Home', href: '#home', isActive: true },
		{ label: 'About', href: '#about' },
		{ label: 'Projects', href: '#projects' },
		{ label: 'Experience', href: '#experience' },
		{ label: 'Contact', href: '#contact' },
	],
	logo = 'RH',
	showMobileNav = true,
	onLogoClick,
	onNavClick,
}: NavigationHeaderProps) {
	const [isVisible, setIsVisible] = useState(true);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [lastScrollY, setLastScrollY] = useState(0);
	const [scrollY, setScrollY] = useState(0);

	// Handle scroll for navigation visibility
	useEffect(() => {
		const handleScroll = throttle(() => {
			const currentScrollY = window.scrollY;
			setScrollY(currentScrollY);

			if (currentScrollY < 100) {
				// Always show at top
				setIsVisible(true);
			} else if (currentScrollY > lastScrollY) {
				// Scrolling down - hide
				setIsVisible(false);
			} else {
				// Scrolling up - show
				setIsVisible(true);
			}

			setLastScrollY(currentScrollY);

			// Close mobile menu on scroll
			if (isMobileMenuOpen) {
				setIsMobileMenuOpen(false);
			}
		}, 16);

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [lastScrollY, isMobileMenuOpen]);

	const handleNavClick = (href: string) => {
		onNavClick?.(href);
		setIsMobileMenuOpen(false);
	};

	const handleLogoClick = () => {
		onLogoClick?.();
		setIsMobileMenuOpen(false);
	};

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const isScrolled = scrollY > 50;

	return (
		<>
			<header
				className={`${styles.header} ${isVisible ? styles.visible : styles.hidden} ${isScrolled ? styles.scrolled : ''}`}
			>
				<nav className={styles.nav}>
					<div className={styles.container}>
						{/* Logo */}
						<FadeIn direction="right" delay={100}>
							<button
								className={styles.logo}
								onClick={handleLogoClick}
								aria-label="Go to home"
							>
								{typeof logo === 'string' ? (
									<span className={styles.logoText}>{logo}</span>
								) : (
									logo
								)}
							</button>
						</FadeIn>

						{/* Desktop Navigation */}
						<FadeIn direction="down" delay={200}>
							<ul className={styles.navList}>
								{items.map((item, index) => (
									<li key={item.href} className={styles.navItem}>
										<a
											href={item.href}
											className={`${styles.navLink} ${item.isActive ? styles.active : ''}`}
											onClick={(e) => {
												e.preventDefault();
												handleNavClick(item.href);
											}}
											style={{ animationDelay: `${300 + index * 100}ms` }}
										>
											{item.label}
											<span className={styles.navLinkUnderline} />
										</a>
									</li>
								))}
							</ul>
						</FadeIn>

						{/* Mobile Menu Button */}
						{showMobileNav && (
							<FadeIn direction="left" delay={100}>
								<button
									className={`${styles.mobileMenuButton} ${isMobileMenuOpen ? styles.open : ''}`}
									onClick={toggleMobileMenu}
									aria-label="Toggle mobile menu"
									aria-expanded={isMobileMenuOpen}
								>
									<span className={styles.hamburgerLine} />
									<span className={styles.hamburgerLine} />
									<span className={styles.hamburgerLine} />
								</button>
							</FadeIn>
						)}
					</div>
				</nav>
			</header>

			{/* Mobile Menu Overlay */}
			{showMobileNav && (
				<div
					className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ''}`}
					aria-hidden={!isMobileMenuOpen}
				>
					<div className={styles.mobileMenuContent}>
						<ul className={styles.mobileNavList}>
							{items.map((item, index) => (
								<li
									key={item.href}
									className={styles.mobileNavItem}
									style={{
										animationDelay: isMobileMenuOpen ? `${index * 100}ms` : '0ms',
										transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms'
									}}
								>
									<a
										href={item.href}
										className={`${styles.mobileNavLink} ${item.isActive ? styles.active : ''}`}
										onClick={(e) => {
											e.preventDefault();
											handleNavClick(item.href);
										}}
									>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}

			{/* Mobile Menu Backdrop */}
			{showMobileNav && isMobileMenuOpen && (
				<div
					className={styles.mobileMenuBackdrop}
					onClick={() => setIsMobileMenuOpen(false)}
					aria-hidden="true"
				/>
			)}
		</>
	);
}
