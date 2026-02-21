import styles from '../page.module.scss';
import { leftRight } from '../wolverine.constants';
import type { WolverineSideProp } from '../wolverine.types';

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
