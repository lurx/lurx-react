'use client';

import { FadeIn, ScaleIn, SlideIn, StaggerFadeIn } from '../../components/animations';
import styles from './page.module.scss';

/**
 * Animations showcase page demonstrating various animation capabilities
 */
export default function AnimationsPage() {
	return (
		<div className={styles.animationsPage}>
			<div className={styles.container}>
				{/* Header */}
				<FadeIn direction="down" className={styles.header}>
					<h1 className={styles.title}>Animation Showcase</h1>
					<p className={styles.subtitle}>
						Demonstrating various animation patterns and techniques built with our animation system
					</p>
				</FadeIn>

				{/* Basic Reveal Animations */}
				<section className={styles.section}>
					<FadeIn delay={200}>
						<h2 className={styles.sectionTitle}>Basic Reveal Animations</h2>
					</FadeIn>
					<div className={styles.grid}>
						<FadeIn delay={400}>
							<div className={`${styles.demo} ${styles.fadeDemo}`}>
								<h3>Fade In</h3>
								<p>Simple opacity transition on scroll</p>
							</div>
						</FadeIn>

						<SlideIn direction="left" delay={600}>
							<div className={`${styles.demo} ${styles.slideDemo}`}>
								<h3>Slide In Left</h3>
								<p>Slides in from the left side</p>
							</div>
						</SlideIn>

						<SlideIn direction="right" delay={800}>
							<div className={`${styles.demo} ${styles.slideDemo}`}>
								<h3>Slide In Right</h3>
								<p>Slides in from the right side</p>
							</div>
						</SlideIn>

						<ScaleIn delay={1000}>
							<div className={`${styles.demo} ${styles.scaleDemo}`}>
								<h3>Scale In</h3>
								<p>Scales up from center point</p>
							</div>
						</ScaleIn>

						<SlideIn direction="up" delay={1200}>
							<div className={`${styles.demo} ${styles.slideDemo}`}>
								<h3>Slide In Up</h3>
								<p>Slides in from bottom</p>
							</div>
						</SlideIn>

						<SlideIn direction="down" delay={1400}>
							<div className={`${styles.demo} ${styles.slideDemo}`}>
								<h3>Slide In Down</h3>
								<p>Slides in from top</p>
							</div>
						</SlideIn>
					</div>
				</section>

				{/* Direction Variations */}
				<section className={styles.section}>
					<FadeIn>
						<h2 className={styles.sectionTitle}>Direction Variations</h2>
					</FadeIn>
					<div className={styles.directionGrid}>
						<FadeIn direction="up" delay={200}>
							<div className={styles.directionDemo}>
								<h4>Fade Up</h4>
								<p>From bottom</p>
							</div>
						</FadeIn>
						<FadeIn direction="down" delay={400}>
							<div className={styles.directionDemo}>
								<h4>Fade Down</h4>
								<p>From top</p>
							</div>
						</FadeIn>
						<FadeIn direction="left" delay={600}>
							<div className={styles.directionDemo}>
								<h4>Fade Left</h4>
								<p>From right</p>
							</div>
						</FadeIn>
						<FadeIn direction="right" delay={800}>
							<div className={styles.directionDemo}>
								<h4>Fade Right</h4>
								<p>From left</p>
							</div>
						</FadeIn>
					</div>
				</section>

				{/* Scale Variations */}
				<section className={styles.section}>
					<FadeIn>
						<h2 className={styles.sectionTitle}>Scale Animations</h2>
					</FadeIn>
					<div className={styles.scaleGrid}>
						<ScaleIn scale={0.5} delay={200}>
							<div className={styles.scaleDemo}>
								<h4>Scale 0.5x</h4>
								<p>Starts at half size</p>
							</div>
						</ScaleIn>
						<ScaleIn scale={0.8} delay={400}>
							<div className={styles.scaleDemo}>
								<h4>Scale 0.8x</h4>
								<p>Starts at 80% size</p>
							</div>
						</ScaleIn>
						<ScaleIn scale={1.2} delay={600}>
							<div className={styles.scaleDemo}>
								<h4>Scale 1.2x</h4>
								<p>Starts at 120% size</p>
							</div>
						</ScaleIn>
					</div>
				</section>

				{/* Stagger Animations */}
				<section className={styles.section}>
					<FadeIn>
						<h2 className={styles.sectionTitle}>Stagger Animations</h2>
					</FadeIn>
					<StaggerFadeIn stagger={{ stagger: 100 }} itemSelector=".stagger-item">
						<div className={styles.staggerContainer}>
							{Array.from({ length: 8 }, (_, i) => (
								<div key={i} className={`${styles.staggerItem} stagger-item`}>
									<div className={styles.number}>{i + 1}</div>
									<p>Item {i + 1}</p>
								</div>
							))}
						</div>
					</StaggerFadeIn>
				</section>

				{/* Fast Stagger */}
				<section className={styles.section}>
					<FadeIn>
						<h2 className={styles.sectionTitle}>Fast Stagger (50ms)</h2>
					</FadeIn>
					<StaggerFadeIn stagger={{ stagger: 50 }} itemSelector=".fast-stagger-item">
						<div className={styles.fastStaggerContainer}>
							{Array.from({ length: 12 }, (_, i) => (
								<div key={i} className={`${styles.fastStaggerItem} fast-stagger-item`}>
									{i + 1}
								</div>
							))}
						</div>
					</StaggerFadeIn>
				</section>

				{/* Slow Stagger */}
				<section className={styles.section}>
					<FadeIn>
						<h2 className={styles.sectionTitle}>Slow Stagger (200ms)</h2>
					</FadeIn>
					<StaggerFadeIn stagger={{ stagger: 200 }} itemSelector=".slow-stagger-item" direction="left">
						<div className={styles.slowStaggerContainer}>
							{Array.from({ length: 4 }, (_, i) => (
								<div key={i} className={`${styles.slowStaggerItem} slow-stagger-item`}>
									<h4>Card {i + 1}</h4>
									<p>This is a larger card with more content to demonstrate the slow stagger effect.</p>
								</div>
							))}
						</div>
					</StaggerFadeIn>
				</section>

				{/* Interactive Hover Effects */}
				<section className={styles.section}>
					<FadeIn>
						<h2 className={styles.sectionTitle}>Interactive Hover Effects</h2>
						<p className={styles.hoverDescription}>
							These effects are achieved with pure CSS transforms for optimal performance
						</p>
					</FadeIn>
					<div className={styles.hoverGrid}>
						<FadeIn delay={200}>
							<div className={`${styles.hoverCard} ${styles.hoverGlow}`}>
								<h3>Glow Effect</h3>
								<p>Hover for glow animation</p>
							</div>
						</FadeIn>
						<FadeIn delay={400}>
							<div className={`${styles.hoverCard} ${styles.hoverTilt}`}>
								<h3>3D Tilt</h3>
								<p>Hover for 3D tilt effect</p>
							</div>
						</FadeIn>
						<FadeIn delay={600}>
							<div className={`${styles.hoverCard} ${styles.hoverScale}`}>
								<h3>Scale & Shadow</h3>
								<p>Hover for scale and shadow</p>
							</div>
						</FadeIn>
						<FadeIn delay={800}>
							<div className={`${styles.hoverCard} ${styles.hoverSlide}`}>
								<h3>Slide Transform</h3>
								<p>Hover for slide effect</p>
							</div>
						</FadeIn>
					</div>
				</section>

				{/* Performance and Accessibility */}
				<section className={styles.section}>
					<FadeIn>
						<div className={styles.performanceInfo}>
							<h2>Performance & Accessibility Features</h2>
							<div className={styles.featureGrid}>
								<div className={styles.feature}>
									<h3>🚀 Performance</h3>
									<ul>
										<li>GPU-accelerated transforms</li>
										<li>Intersection Observer for scroll triggers</li>
										<li>Automatic cleanup on unmount</li>
										<li>60fps smooth animations</li>
									</ul>
								</div>
								<div className={styles.feature}>
									<h3>♿ Accessibility</h3>
									<ul>
										<li>Respects prefers-reduced-motion</li>
										<li>Configurable motion levels</li>
										<li>Skip animations option</li>
										<li>Focus management</li>
									</ul>
								</div>
								<div className={styles.feature}>
									<h3>🔧 Developer Experience</h3>
									<ul>
										<li>TypeScript support</li>
										<li>Composable components</li>
										<li>Customizable timing</li>
										<li>Easy configuration</li>
									</ul>
								</div>
							</div>
						</div>
					</FadeIn>
				</section>

				{/* Code Examples */}
				<section className={styles.section}>
					<FadeIn>
						<h2 className={styles.sectionTitle}>Usage Examples</h2>
						<div className={styles.codeExamples}>
							<div className={styles.codeExample}>
								<h3>Basic Fade In</h3>
								<code>
									{`<FadeIn direction="up" delay={200}>
  <div>Content</div>
</FadeIn>`}
								</code>
							</div>
							<div className={styles.codeExample}>
								<h3>Slide Animation</h3>
								<code>
									{`<SlideIn direction="left" distance={50}>
  <div>Content</div>
</SlideIn>`}
								</code>
							</div>
							<div className={styles.codeExample}>
								<h3>Stagger Effect</h3>
								<code>
									{`<StaggerFadeIn stagger={{ stagger: 100 }}>
  <div className="items">
    {items.map(item => <div key={item.id}>{item}</div>)}
  </div>
</StaggerFadeIn>`}
								</code>
							</div>
						</div>
					</FadeIn>
				</section>
			</div>
		</div>
	);
}
