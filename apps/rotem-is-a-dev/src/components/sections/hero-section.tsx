'use client';

import { FadeIn, SlideIn } from '@lurx-react/vanguardis';
import { throttle } from 'es-toolkit';
import { useEffect, useRef } from 'react';
import styles from './hero-section.module.scss';

/**
 * Props for the HeroSection component
 */
interface HeroSectionProps {
	/** Main title text */
	title?: string;
	/** Subtitle or description */
	subtitle?: string;
	/** Primary call-to-action text */
	primaryCta?: string;
	/** Secondary call-to-action text */
	secondaryCta?: string;
	/** Callback for primary CTA click */
	onPrimaryCta?: () => void;
	/** Callback for secondary CTA click */
	onSecondaryCta?: () => void;
}

type Nullable<T> = T | null;

/**
 * Hero section with animated background and interactive elements
 * Features particle effects, smooth animations, and responsive design
 */
export default function HeroSection({
	title = 'Rotem Horovitz',
	subtitle = 'Full-Stack Developer & Creative Problem Solver',
	primaryCta = 'View My Work',
	secondaryCta = 'Get In Touch',
	onPrimaryCta,
	onSecondaryCta,
}: HeroSectionProps) {
	const heroRef = useRef<Nullable<HTMLElement>>(null);
	const particlesRef = useRef<Nullable<HTMLDivElement>>(null);

	// Animated background particles
	useEffect(() => {
		if (!particlesRef.current) return;

		const particles: HTMLDivElement[] = [];
		const particleContainer = particlesRef.current;

		// Create floating particles
		for (let i = 0; i < 30; i++) {
			const particle = document.createElement('div');
			particle.className = styles.particle;
			particle.style.left = `${Math.random() * 100}%`;
			particle.style.top = `${Math.random() * 100}%`;
			particle.style.animationDelay = `${Math.random() * 20}s`;
			particle.style.animationDuration = `${15 + Math.random() * 10}s`;
			particleContainer.appendChild(particle);
			particles.push(particle);
		}

		// Parallax effect on scroll
		const handleScroll = throttle(() => {
			if (!heroRef.current) return;

			const scrollY = window.scrollY;
			const heroHeight = heroRef.current.offsetHeight;
			const scrollProgress = Math.min(scrollY / heroHeight, 1);

			// Parallax background
			if (particlesRef.current) {
				particlesRef.current.style.transform = `translateY(${
					scrollProgress * 30
				}px)`;
			}
		}, 16); // ~60fps

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			// Cleanup particles
			particles.forEach(particle => {
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
			});
		};
	}, []);

	return (
		<section
			ref={heroRef}
			className={styles.heroSection}
		>
			{/* Animated background particles */}
			<div
				ref={particlesRef}
				className={styles.particles}
			/>

			{/* Gradient overlay */}
			<div className={styles.gradientOverlay} />

			<div className={styles.container}>
				<div className={styles.content}>
					{/* Main title with typing animation */}
					<FadeIn
						direction="down"
						delay={300}
					>
						<h1 className={styles.title}>{title}</h1>
					</FadeIn>

					{/* Subtitle */}
					<SlideIn
						direction="up"
						delay={600}
						distance={30}
					>
						<p className={styles.subtitle}>{subtitle}</p>
					</SlideIn>

					{/* CTA buttons */}
					<div className={styles.ctaContainer}>
						<button
							className={`${styles.ctaButton} ${styles.primary}`}
							onClick={onPrimaryCta}
						>
							{primaryCta}
							<span className={styles.buttonRipple} />
						</button>

						<button
							className={`${styles.ctaButton} ${styles.secondary}`}
							onClick={onSecondaryCta}
						>
							{secondaryCta}
							<span className={styles.buttonRipple} />
						</button>
					</div>
				</div>

				{/* Scroll indicator */}
				<FadeIn delay={2000}>
					<div className={styles.scrollIndicator}>
						<div className={styles.scrollArrow} />
						<span className={styles.scrollText}>Scroll to explore</span>
					</div>
				</FadeIn>
			</div>
		</section>
	);
}
