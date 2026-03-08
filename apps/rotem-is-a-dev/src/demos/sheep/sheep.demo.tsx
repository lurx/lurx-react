import classNames from 'classnames';
import { Bangers } from 'next/font/google';
import { DemoContainer } from '../demo-container/demo-container.component';
import styles from './sheep.module.scss';
import { DemoCredits } from '../demo-credits';
import { inspiredBy } from './sheep.constants';

const bangers = Bangers({
	subsets: ['latin'],
	weight: '400',
	variable: '--font-bangers',
});

export const SheepDemo = () => {
	return (
		<DemoContainer
			width="800px"
			height="600px"
		>
			<div className={classNames(styles.sheepContainer, bangers.variable)}>
				<div className={classNames(styles.sheep, styles.animate)}>
					<div className={styles.baaaa}>Baaaa!</div>
					<div className={styles['head-wrapper']}>
						<div className={styles.head}>
							<div className={styles.face}></div>
							<div className={styles.hair}></div>
							<div className={classNames(styles.eye, styles.left)}></div>
							<div className={classNames(styles.eye, styles.right)}></div>
							<div className={classNames(styles.ear, styles.left)}></div>
							<div className={classNames(styles.ear, styles.right)}></div>
							<div className={styles.nose}></div>
							<div className={classNames(styles.leaf, styles.one)}></div>
							<div className={classNames(styles.leaf, styles.two)}></div>
							<div className={styles.mouth}></div>
						</div>
					</div>
				</div>
			</div>
			<DemoCredits credits={inspiredBy} />
		</DemoContainer>
	);
};
