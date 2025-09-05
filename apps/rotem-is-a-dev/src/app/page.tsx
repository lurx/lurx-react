import styles from './page.module.scss';

export default function Home() {
	return (
		<main className={styles.wrapper}>
			{/* Animated background elements */}
			<div className={styles.backgroundEffects}>
				<div className={styles.floatingOrb1}></div>
				<div className={styles.floatingOrb2}></div>
				<div className={styles.floatingOrb3}></div>
			</div>

			{/* Main hero section */}
			<section className={styles.hero}>
				<div className={styles.heroContent}>
					<div className={styles.badge}>
						<span className={styles.badgeText}>🚀 Building cool stuff</span>
					</div>

					<h1 className={styles.heroTitle}>
						<span className={styles.greeting}>Hey, I&apos;m</span>
						<span className={styles.name}>Rotem Horovitz</span>
						<span className={styles.role}>Frontend Developer</span>
					</h1>

					<p className={styles.heroDescription}>
						I craft beautiful, accessible, and performant web experiences using
						React, TypeScript, and modern web technologies. Currently focused on
						building scalable design systems and delightful user interfaces.
					</p>

					<div className={styles.heroActions}>
						<a
							href="#contact"
							className={styles.primaryButton}
						>
							<span>Get In Touch</span>
							<svg
								className={styles.buttonIcon}
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M7 17L17 7M17 7H7M17 7V17"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</a>
						<a
							href="#work"
							className={styles.secondaryButton}
						>
							<span>View My Work</span>
						</a>
					</div>

					<div className={styles.stats}>
						<div className={styles.stat}>
							<span className={styles.statNumber}>4+</span>
							<span className={styles.statLabel}>Years Experience</span>
						</div>
						<div className={styles.stat}>
							<span className={styles.statNumber}>50+</span>
							<span className={styles.statLabel}>Projects Built</span>
						</div>
						<div className={styles.stat}>
							<span className={styles.statNumber}>100%</span>
							<span className={styles.statLabel}>Client Satisfaction</span>
						</div>
					</div>
				</div>

				{/* Animated tech stack showcase */}
				<div className={styles.techShowcase}>
					<div className={styles.techGrid}>
						<div
							className={styles.techCard}
							data-tech="react"
						>
							<div className={styles.techIcon}>⚛️</div>
							<span>React</span>
						</div>
						<div
							className={styles.techCard}
							data-tech="typescript"
						>
							<div className={styles.techIcon}>�</div>
							<span>TypeScript</span>
						</div>
						<div
							className={styles.techCard}
							data-tech="nextjs"
						>
							<div className={styles.techIcon}>▲</div>
							<span>Next.js</span>
						</div>
						<div
							className={styles.techCard}
							data-tech="sass"
						>
							<div className={styles.techIcon}>🎨</div>
							<span>SCSS</span>
						</div>
						<div
							className={styles.techCard}
							data-tech="testing"
						>
							<div className={styles.techIcon}>🧪</div>
							<span>Testing</span>
						</div>
						<div
							className={styles.techCard}
							data-tech="a11y"
						>
							<div className={styles.techIcon}>♿</div>
							<span>Accessibility</span>
						</div>
					</div>
				</div>
			</section>

			{/* Quick links section */}
			<section className={styles.quickLinks}>
				<a
					href="https://github.com/lurx"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.quickLink}
				>
					<div className={styles.linkIcon}>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
						</svg>
					</div>
					<div className={styles.linkContent}>
						<span className={styles.linkTitle}>GitHub</span>
						<span className={styles.linkDescription}>Check out my code</span>
					</div>
				</a>

				<a
					href="mailto:rotem@example.com"
					className={styles.quickLink}
				>
					<div className={styles.linkIcon}>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
							<polyline points="22,6 12,13 2,6" />
						</svg>
					</div>
					<div className={styles.linkContent}>
						<span className={styles.linkTitle}>Email</span>
						<span className={styles.linkDescription}>
							Let&apos;s work together
						</span>
					</div>
				</a>

				<a
					href="/resume.pdf"
					target="_blank"
					rel="noopener noreferrer"
					className={styles.quickLink}
				>
					<div className={styles.linkIcon}>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M14,2 L8,2 C6.9,2 6,2.9 6,4 L6,20 C6,21.1 6.9,22 8,22 L16,22 C17.1,22 18,21.1 18,20 L18,8 L14,2 Z" />
							<polyline points="14,2 14,8 18,8" />
							<line
								x1="16"
								y1="13"
								x2="8"
								y2="13"
							/>
							<line
								x1="16"
								y1="17"
								x2="8"
								y2="17"
							/>
							<polyline points="10,9 9,9 8,9" />
						</svg>
					</div>
					<div className={styles.linkContent}>
						<span className={styles.linkTitle}>Resume</span>
						<span className={styles.linkDescription}>Download PDF</span>
					</div>
				</a>
			</section>
		</main>
	);
}
