'use client';

import { useResponsive } from '@/hooks';
import classNames from 'classnames';
import { useEntryAnimation } from '../entry-animation/entry-animation.context';
import { HeroBlurs } from './components/hero-blurs.component';
import { HeroIntroduction } from './components/hero-introduction.component';
import { HeroEntryAnimation } from './hero-entry-animation.component';
import { HeroGame } from './hero-game.component';
import styles from './hero-section.module.scss';
import { HeroSnippets } from './hero-snippets.component';
import { HeroProvider } from './hero.context';

export const HeroSection = () => {
	const { isMobile } = useResponsive();
	const { isShellLoaded } = useEntryAnimation();

	return (
		<HeroProvider>
			<section
				className={classNames(styles.hero, { [styles.heroHidden]: !isShellLoaded })}
			>
				<HeroEntryAnimation />
				<HeroBlurs />
				<HeroIntroduction />

				{!isMobile && (
					<div className={styles.right}>
						<HeroGame />
						<HeroSnippets />
					</div>
				)}
			</section>
		</HeroProvider>
	);
};
