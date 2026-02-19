'use client';

import { useCV } from '@/app/cv/context/cv.context';
import styles from './intro.module.scss';

export const Intro = () => {
	const { intro, work_experience } = useCV();
	const earliestExperienceYear = Math.min(
		...work_experience.map(exp => exp.duration.start),
	);
	const numberOfYears = new Date().getFullYear() - earliestExperienceYear;
	const introString = intro.replace('%numYears%', String(numberOfYears));
	return <p className={styles.intro}>{introString}</p>;
};
