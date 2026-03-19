import classNames from 'classnames';
import styles from '../page.module.scss';
import type { WolverineSideProp } from '../wolverine.types';

const FINGER_KEYS = ['finger-index', 'finger-middle', 'finger-ring', 'finger-pinky'] as const;
const CLAW_KEYS = ['claw-top', 'claw-middle', 'claw-bottom'] as const;

const Fingers = () => (
	<>
		{FINGER_KEYS.map((key) => (
			<div
				key={key}
				className={styles.finger}
			/>
		))}
	</>
);

const Claws = () => (
	<div className={styles['wolverine-claws']}>
		{CLAW_KEYS.map((key) => (
			<div
				key={key}
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
