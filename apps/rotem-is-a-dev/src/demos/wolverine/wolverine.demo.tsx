import classNames from 'classnames';
import { DemoContainer } from '../demo-container/demo-container.component';
import styles from './wolverine.module.scss';

import { Chelsea_Market } from 'next/font/google';
import { DemoCredits } from '../demo-credits';
import { WolverineCowl } from './components';
import { WolverineArm } from './components/wolverine-arm.component';
import { inspiredBy } from './wolverine.constants';

const chelseaMarket = Chelsea_Market({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-chelsea-market',
});


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
