'use client';

import { useCV } from '@/app/cv/context/cv.context';
import { calculateYearsOfExperience } from './intro.helpers';
import styles from './intro.module.scss';

export const Intro = () => {
	const { intro, work_experience } = useCV();
	const numberOfYears = calculateYearsOfExperience(work_experience);
	const introString = intro.replace('%numYears%', String(numberOfYears));
	return <p className={styles.intro}>{introString}</p>;
};
