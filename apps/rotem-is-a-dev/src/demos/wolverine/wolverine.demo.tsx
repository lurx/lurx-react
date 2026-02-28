import classNames from 'classnames';
import { DemoContainer } from '../demo-container/demo-container.component';
import styles from './wolverine.module.scss';

import { Flex } from '@/app/components/flex/flex.component';
import { Link } from '@/app/components/link';
import { Chelsea_Market } from 'next/font/google';
import { WolverineCowl } from './components';
import { WolverineArm } from './components/wolverine-arm.component';
import type { DemoCredits, DemoCreditsProps } from './wolverine.types';

const chelseaMarket = Chelsea_Market({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-chelsea-market',
});
// <link href="https://fonts.googleapis.com/css?family=Chelsea+Market" rel="stylesheet">

const inspiredBy = {
	name: 'Wolverine',
	url: 'https://dribbble.com/shots/2047572-Wolverine',
	author: 'Gregory Hartman',
	authorUrl: 'https://dribbble.com/gregoryhartman',
} satisfies DemoCredits;

const DemoCredits = ({ credits }: DemoCreditsProps) => {
	if (!credits) return null;

	return (
		<Flex
			gap="small"
			justify="center"
		>
			Inspired by
			<Link href={credits.url}>{credits.name}</Link>
			by
			<Link href={credits.authorUrl}>{credits.author}</Link>
		</Flex>
	);
};

export const WolverineDemo = () => {
	return (
		<DemoContainer
			width="800px"
			height="600px"
		>
			<div
				className={classNames(
					styles.wolverineContainer,
					chelseaMarket.variable,
				)}
			>
				<div className={styles.wrapper}>
					{/* <div className="logo"> */}
					{/* <img src="http://www.clipartroo.com/images/3/exciting-word-clipart-3646.png" alt="" /> */}
					{/* </div> */}
					<div className={styles.wolverine}>
						<div className={styles['wolverine-body']}>
							<div className={styles['wolverine-torso']}>
								<div className={classNames(styles.peck, styles.left)}>
									{' '}
									<WolverineArm side="left" />
									<div className={styles.shoulderpad}></div>
								</div>
								<div className={classNames(styles.peck, styles.right)}>
									<WolverineArm side="right" />
									<div className={styles.shoulderpad}></div>
								</div>
							</div>
							<div className={styles['wolverine-head']}>
								<WolverineCowl />
								<div className={styles.face}>
									<div className={styles.mouth}>
										<div className={styles.tongue}></div>
										<div className={styles.teeth}></div>
									</div>
								</div>
							</div>
							<div
								className={classNames(styles['wolverine-leg'], styles.right)}
							>
								<div className={styles.boot}>
									<div className={styles.chevron}></div>
								</div>
							</div>
							<div className={styles['wolverine-crotch']}></div>
							<div className={styles['wolverine-belt']}>
								<div className={styles.buckle}></div>
							</div>
							<div className={classNames(styles['wolverine-leg'], styles.left)}>
								<div className={styles.boot}>
									<div className={styles.chevron}></div>
								</div>
							</div>
						</div>
						<div className={classNames(styles.snikt, styles.left)}>Snikt!</div>
						<div className={classNames(styles.snikt, styles.right)}>Snikt!</div>
					</div>
				</div>
			</div>
			<DemoCredits credits={inspiredBy} />
		</DemoContainer>
	);
};
