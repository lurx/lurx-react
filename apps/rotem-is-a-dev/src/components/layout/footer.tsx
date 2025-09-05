'use client';

import { FadeIn, SlideIn } from '@lurx-react/vanguardis';
import styles from './footer.module.scss';

/**
 * Social media link interface
 */
interface SocialLink {
	name: string;
	href: string;
	icon: string; // We'll use simple text icons for now
	ariaLabel: string;
}

/**
 * Props for the Footer component
 */
interface FooterProps {
	/** Social media links */
	socialLinks?: SocialLink[];
	/** Contact email */
	email?: string;
	/** Copyright text */
	copyright?: string;
	/** Additional footer links */
	footerLinks?: Array<{ label: string; href: string }>;
}

/**
 * Footer component with social links and contact information
 * Features smooth animations and responsive design
 */
export default function Footer({
	socialLinks = [
		{ name: 'GitHub', href: 'https://github.com', icon: 'GH', ariaLabel: 'Visit GitHub profile' },
		{ name: 'LinkedIn', href: 'https://linkedin.com', icon: 'LI', ariaLabel: 'Visit LinkedIn profile' },
		{ name: 'Twitter', href: 'https://twitter.com', icon: 'TW', ariaLabel: 'Visit Twitter profile' },
		{ name: 'Email', href: 'mailto:hello@example.com', icon: '@', ariaLabel: 'Send email' },
	],
	email = 'hello@rotemhorovitz.dev',
	copyright = 'Rotem Horovitz',
	footerLinks = [
		{ label: 'Privacy', href: '/privacy' },
		{ label: 'Terms', href: '/terms' },
	],
}: FooterProps) {
	const currentYear = new Date().getFullYear();

	return (
		<footer className={styles.footer}>
			<div className={styles.container}>
				{/* Main Footer Content */}
				<div className={styles.content}>
					{/* Contact Section */}
					<div className={styles.section}>
						<FadeIn direction="up" delay={100}>
							<h3 className={styles.sectionTitle}>Let&apos;s Connect</h3>
							<p className={styles.sectionText}>
								Ready to bring your ideas to life? Let&apos;s create something amazing together.
							</p>
							<a
								href={`mailto:${email}`}
								className={styles.emailLink}
							>
								{email}
							</a>
						</FadeIn>
					</div>

					{/* Social Links */}
					<div className={styles.section}>
						<SlideIn direction="up" delay={200}>
							<h3 className={styles.sectionTitle}>Follow Me</h3>
							<div className={styles.socialLinks}>
								{socialLinks.map((link, index) => (
									<a
										key={link.name}
										href={link.href}
										className={styles.socialLink}
										aria-label={link.ariaLabel}
										target="_blank"
										rel="noopener noreferrer"
										style={{ animationDelay: `${300 + index * 100}ms` }}
									>
										<span className={styles.socialIcon}>{link.icon}</span>
										<span className={styles.socialName}>{link.name}</span>
									</a>
								))}
							</div>
						</SlideIn>
					</div>

					{/* Quick Links */}
					<div className={styles.section}>
						<SlideIn direction="up" delay={300}>
							<h3 className={styles.sectionTitle}>Quick Links</h3>
							<nav className={styles.quickLinks}>
								<a href="#about" className={styles.quickLink}>About</a>
								<a href="#projects" className={styles.quickLink}>Projects</a>
								<a href="#experience" className={styles.quickLink}>Experience</a>
								<a href="#contact" className={styles.quickLink}>Contact</a>
							</nav>
						</SlideIn>
					</div>
				</div>

				{/* Divider */}
				<FadeIn delay={400}>
					<div className={styles.divider} />
				</FadeIn>

				{/* Bottom Section */}
				<div className={styles.bottom}>
					<SlideIn direction="right" delay={500}>
						<p className={styles.copyright}>
							© {currentYear} {copyright}. All rights reserved.
						</p>
					</SlideIn>

					<SlideIn direction="left" delay={500}>
						<div className={styles.footerLinks}>
							{footerLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className={styles.footerLink}
								>
									{link.label}
								</a>
							))}
						</div>
					</SlideIn>
				</div>

				{/* Back to Top Button */}
				<FadeIn delay={600}>
					<button
						className={styles.backToTop}
						onClick={() => {
							window.scrollTo({ top: 0, behavior: 'smooth' });
						}}
						aria-label="Back to top"
					>
						<span className={styles.backToTopIcon}>↑</span>
					</button>
				</FadeIn>
			</div>

			{/* Animated background elements */}
			<div className={styles.backgroundElements}>
				<div className={styles.bgElement} style={{ animationDelay: '0s' }} />
				<div className={styles.bgElement} style={{ animationDelay: '2s' }} />
				<div className={styles.bgElement} style={{ animationDelay: '4s' }} />
			</div>
		</footer>
	);
}
