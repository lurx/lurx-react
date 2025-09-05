'use client';

import React, { useState } from 'react';
import { FadeIn, ScaleIn, SlideIn } from '../../components/animations';
import { Footer, NavigationHeader } from '../../components/layout';
import { HeroSection } from '../../components/sections';
import { LoadingScreen, LoadingSpinner } from '../../components/ui';
import styles from './page.module.scss';

/**
 * Components showcase page demonstrating various UI components
 */
export default function ComponentsPage() {
	const [activeTab, setActiveTab] = useState('sections');

	const tabs = [
		{ id: 'sections', label: 'Page Sections' },
		{ id: 'layout', label: 'Layout Components' },
		{ id: 'ui', label: 'UI Elements' },
	];

	const handleTabChange = (tabId: string) => {
		setActiveTab(tabId);
	};

	return (
		<div className={styles.componentsPage}>
			<div className={styles.container}>
				{/* Header */}
				<FadeIn direction="down" className={styles.header}>
					<h1 className={styles.title}>Component Showcase</h1>
					<p className={styles.subtitle}>
						Explore our comprehensive collection of reusable components built with modern web technologies
					</p>
				</FadeIn>

				{/* Tab Navigation */}
				<FadeIn delay={200}>
					<div className={styles.tabNavigation}>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
								onClick={() => handleTabChange(tab.id)}
							>
								{tab.label}
							</button>
						))}
					</div>
				</FadeIn>

				{/* Tab Content */}
				<div className={styles.tabContent}>
					{/* Page Sections Tab */}
					{activeTab === 'sections' && (
						<div className={styles.sectionsTab}>
							<FadeIn delay={300}>
								<section className={styles.componentSection}>
									<h2 className={styles.componentTitle}>Hero Section</h2>
									<p className={styles.componentDescription}>
										A full-screen hero section with animated background particles, gradient overlays,
										and call-to-action buttons. Features responsive design and smooth animations.
									</p>
									<div className={styles.componentDemo}>
										<div className={styles.demoContainer}>
											<HeroSection
												title="Demo Hero"
												subtitle="This is a demonstration of the hero section component"
												primaryCta="Primary Action"
												secondaryCta="Secondary Action"
												onPrimaryCta={() => alert('Primary CTA clicked!')}
												onSecondaryCta={() => alert('Secondary CTA clicked!')}
											/>
										</div>
									</div>
									<div className={styles.codeExample}>
										<h3>Usage Example</h3>
										<pre><code>{`<HeroSection
  title="Rotem Horovitz"
  subtitle="Full-Stack Developer & Creative Problem Solver"
  primaryCta="View My Work"
  secondaryCta="Get In Touch"
  onPrimaryCta={() => handlePrimaryAction()}
  onSecondaryCta={() => handleSecondaryAction()}
/>`}</code></pre>
									</div>
								</section>
							</FadeIn>
						</div>
					)}

					{/* Layout Components Tab */}
					{activeTab === 'layout' && (
						<div className={styles.layoutTab}>
							<SlideIn direction="up" delay={300}>
								<section className={styles.componentSection}>
									<h2 className={styles.componentTitle}>Navigation Header</h2>
									<p className={styles.componentDescription}>
										A responsive navigation header with auto-hide on scroll, glassmorphism background,
										and smooth mobile menu transitions.
									</p>
									<div className={styles.componentDemo}>
										<div className={styles.navigationDemo}>
											<NavigationHeader
												items={[
													{ label: 'Home', href: '#home', isActive: true },
													{ label: 'About', href: '#about' },
													{ label: 'Projects', href: '#projects' },
													{ label: 'Contact', href: '#contact' },
												]}
												logo="Demo"
												onLogoClick={() => console.log('Logo clicked')}
												onNavClick={(href) => console.log('Nav clicked:', href)}
											/>
										</div>
									</div>
								</section>
							</SlideIn>

							<SlideIn direction="up" delay={400}>
								<section className={styles.componentSection}>
									<h2 className={styles.componentTitle}>Footer</h2>
									<p className={styles.componentDescription}>
										A comprehensive footer with social links, contact information,
										and animated background elements.
									</p>
									<div className={styles.componentDemo}>
										<div className={styles.footerDemo}>
											<Footer
												email="demo@example.com"
												copyright="Demo Company"
												socialLinks={[
													{ name: 'GitHub', href: '#', icon: 'GH', ariaLabel: 'GitHub' },
													{ name: 'LinkedIn', href: '#', icon: 'LI', ariaLabel: 'LinkedIn' },
												]}
											/>
										</div>
									</div>
								</section>
							</SlideIn>
						</div>
					)}

					{/* UI Elements Tab */}
					{activeTab === 'ui' && (
						<div className={styles.uiTab}>
							<ScaleIn delay={300}>
								{/* Loading Components */}
								<section className={styles.componentSection}>
									<h2 className={styles.componentTitle}>Loading Components</h2>
									<p className={styles.componentDescription}>
										Beautiful loading screens and spinners using our design system tokens and smooth animations.
									</p>

									<div className={styles.componentDemo}>
										<div className={styles.uiGrid}>
											{/* Loading Spinners */}
											<div className={styles.uiItem}>
												<h3>Loading Spinners</h3>
												<div className={styles.spinnerDemo}>
													<LoadingSpinner size="sm" variant="primary" />
													<LoadingSpinner size="md" variant="accent" />
													<LoadingSpinner size="lg" variant="secondary" />
												</div>
												<p>Available in multiple sizes and color variants</p>
											</div>

											{/* Loading Screen Demo */}
											<div className={styles.uiItem}>
												<h3>Loading Screen (Demo)</h3>
												<div className={styles.loadingDemo}>
													<button
														className={styles.demoButton}
														onClick={() => {
															// Demo the loading screen
															const demoContainer = document.createElement('div');
															demoContainer.style.position = 'fixed';
															demoContainer.style.top = '0';
															demoContainer.style.left = '0';
															demoContainer.style.zIndex = '10000';
															document.body.appendChild(demoContainer);

															// Create a React root for the demo
															const { createRoot } = require('react-dom/client');
															const root = createRoot(demoContainer);

															let progress = 0;
															const interval = setInterval(() => {
																progress += 10;
																root.render(
																	React.createElement(LoadingScreen, {
																		isVisible: true,
																		message: 'Demo Loading...',
																		progress: progress,
																		variant: 'brand',
																		onComplete: () => {
																			clearInterval(interval);
																			setTimeout(() => {
																				root.unmount();
																				document.body.removeChild(demoContainer);
																			}, 500);
																		}
																	})
																);

																if (progress >= 100) {
																	clearInterval(interval);
																	setTimeout(() => {
																		root.render(
																			React.createElement(LoadingScreen, {
																				isVisible: false,
																				message: 'Demo Loading...',
																				progress: 100,
																				variant: 'brand',
																				onComplete: () => {
																					root.unmount();
																					document.body.removeChild(demoContainer);
																				}
																			})
																		);
																	}, 1000);
																}
															}, 200);
														}}
													>
														Show Loading Screen Demo
													</button>
												</div>
												<p>Full-screen loading with progress tracking</p>
											</div>
										</div>
									</div>

									<div className={styles.codeExample}>
										<h3>Usage Examples</h3>
										<div className={styles.codeBlock}>
											<h4>Loading Spinner</h4>
											<pre><code>{`<LoadingSpinner
  size="md"
  variant="primary"
/>`}</code></pre>
										</div>
										<div className={styles.codeBlock}>
											<h4>Loading Screen</h4>
											<pre><code>{`<LoadingScreen
  isVisible={isLoading}
  message="Loading content..."
  progress={loadingProgress}
  showProgress={true}
  variant="default"
  onComplete={() => setIsLoading(false)}
/>`}</code></pre>
										</div>
									</div>
								</section>

								{/* Interactive Components */}
								<section className={styles.componentSection}>
									<h2 className={styles.componentTitle}>Interactive Elements</h2>
									<p className={styles.componentDescription}>
										Enhanced user interaction components including loading screens and page transitions.
									</p>

									<div className={styles.componentDemo}>
										<div className={styles.uiGrid}>
											{/* Future Components */}
											<div className={styles.uiItem}>
												<h3>Coming Soon</h3>
												<div className={styles.futureComponents}>
													<div className={styles.futureItem}>✨ Animated Buttons</div>
													<div className={styles.futureItem}>🃏 3D Cards</div>
													<div className={styles.futureItem}>📊 Progress Bars</div>
													<div className={styles.futureItem}>📝 Form Elements</div>
												</div>
												<p>More interactive components in development</p>
											</div>
										</div>
									</div>

									<div className={styles.codeExample}>
										<h3>Usage Examples</h3>
										<div className={styles.codeBlock}>
											<h4>Loading Screen</h4>
											<pre><code>{`<LoadingScreen
  isVisible={true}
  message="Loading content..."
  progress={75}
  variant="brand"
  showProgress={true}
/>`}</code></pre>
										</div>
									</div>
								</section>
							</ScaleIn>
						</div>
					)}
				</div>

				{/* Features Grid */}
				<section className={styles.featuresSection}>
					<FadeIn>
						<h2 className={styles.featuresTitle}>Component Features</h2>
						<div className={styles.featuresGrid}>
							<div className={styles.feature}>
								<div className={styles.featureIcon}>🚀</div>
								<h3 className={styles.featureTitle}>Performance</h3>
								<p className={styles.featureDescription}>
									Optimized components with lazy loading and efficient animations
								</p>
							</div>
							<div className={styles.feature}>
								<div className={styles.featureIcon}>📱</div>
								<h3 className={styles.featureTitle}>Responsive</h3>
								<p className={styles.featureDescription}>
									Mobile-first design that works perfectly on all devices
								</p>
							</div>
							<div className={styles.feature}>
								<div className={styles.featureIcon}>♿</div>
								<h3 className={styles.featureTitle}>Accessible</h3>
								<p className={styles.featureDescription}>
									WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
								</p>
							</div>
							<div className={styles.feature}>
								<div className={styles.featureIcon}>🎨</div>
								<h3 className={styles.featureTitle}>Customizable</h3>
								<p className={styles.featureDescription}>
									Easily customizable with CSS custom properties and SCSS variables
								</p>
							</div>
						</div>
					</FadeIn>
				</section>
			</div>
		</div>
	);
}
