import classNames from 'classnames';
import styles from '../page.module.scss';
import type { WolverineSideProp } from '../wolverine.types';

const fingers = new Array(4).fill(0);
const claws = new Array(3).fill(0);

const Fingers = () => (
	<>
		{fingers.map((_, index) => (
			<div
				key={index}
				className={styles.finger}
			/>
		))}
	</>
);

const Claws = () => (
	<div className={styles['wolverine-claws']}>
		{claws.map((_, index) => (
			<div
				key={index}
				className={styles['wolverine-claw']}
			/>
		))}
	</div>
);

export const WolverineArm = ({ side }: WolverineSideProp) => (
	<div className={classNames(styles['wolverine-arm'], styles[side])}>
		<div className={styles.forearm}></div>
		<div className={styles.fist}>
			<Fingers />
			<Claws />
		</div>
	</div>
);
