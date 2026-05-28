'use client';

import { useResponsive } from '@/hooks';
import classNames from 'classnames';
import { useEntryAnimation } from '../entry-animation';
import { HeroBlurs } from './components/hero-blurs.component';
import { HeroGameDialog } from './components/hero-game-dialog';
import { HeroGameTrigger } from './components/hero-game-trigger';
import { HeroIntroduction } from './components/hero-introduction.component';
import { HeroSnippets } from './components/hero-snippets/hero-snippets.component';
import { HeroEntryAnimation } from './hero-entry-animation.component';
import styles from './hero-section.module.scss';
import { HeroProvider } from './hero.context';

export const HeroSection = () => {
	const { isMobile } = useResponsive();
	const { isShellLoaded } = useEntryAnimation();

	const carouselAxis = isMobile ? 'x' : 'y';

	return (
		<HeroProvider>
			<section
				className={classNames(styles.hero, { [styles.heroHidden]: !isShellLoaded })}
			>
				<HeroEntryAnimation />
				<HeroBlurs />
				<HeroIntroduction />

				<div className={styles.right}>
					<HeroSnippets key={carouselAxis} axis={carouselAxis} />
					{!isMobile && <HeroGameTrigger />}
				</div>

				{!isMobile && <HeroGameDialog />}
			</section>
		</HeroProvider>
	);
};
