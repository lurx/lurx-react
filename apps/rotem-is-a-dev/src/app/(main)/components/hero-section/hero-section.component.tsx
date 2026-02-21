'use client';

import { useEntryAnimation } from '../entry-animation/entry-animation.context';
import { HeroBlurs } from './components/hero-blurs.component';
import { HeroIntroduction } from './components/hero-introduction.component';
import { HeroGame } from './hero-game.component';
import styles from './hero-section.module.scss';
import { HeroSnippets } from './hero-snippets.component';
import { HeroProvider } from './hero.context';

export const HeroSection = () => {
	const { isShellLoaded } = useEntryAnimation();

	return (
		<HeroProvider>
			<section
				className={styles.hero}
				style={
					isShellLoaded
						? undefined
						: { opacity: 0, transition: 'opacity 0.5s ease' }
				}
			>
				<HeroBlurs />
				<HeroIntroduction />

				<div className={styles.right}>
					<HeroGame />
					<HeroSnippets />
				</div>
			</section>
		</HeroProvider>
	);
};
