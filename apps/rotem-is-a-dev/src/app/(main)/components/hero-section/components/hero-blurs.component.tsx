import { BlueBlur } from '../blurs/blue-blur.component';
import { GreenBlur } from '../blurs/green-blur.component';
import styles from '../hero-section.module.scss';

const BLUR_SIZES = {
	width: 454,
	height: 492,
};

export const HeroBlurs = () => (
	<div className={styles.heroBlurs}>
		<GreenBlur
			className={styles.greenBlur}
			{...BLUR_SIZES}
		/>
		<BlueBlur
			className={styles.blueBlur}
			{...BLUR_SIZES}
		/>
	</div>
);
