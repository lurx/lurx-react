import styles from '../wolverine.module.scss';
import type { WolverineSideProp } from '../wolverine.types';
import { leftRight } from '../wolverine.constants';

export const WolverineCowlSide = ({ side }: WolverineSideProp) => (
	<div className={styles[`cowl-${side}`]}>
		<div className={styles.eye}></div>
	</div>
);

export const WolverineCowl = () => (
	<>
		{leftRight.map(side => (
			<WolverineCowlSide
				key={`wolverine-cowl-${side}`}
				side={side}
			/>
		))}
	</>
);
