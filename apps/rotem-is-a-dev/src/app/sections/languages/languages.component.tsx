'use client';

import { Card } from '@/app/components/card';
import { useCV } from '@/app/context/cv.context';
import styles from './languages.module.scss';

export const Languages = () => {
	const { languages } = useCV();

	return (
		<Card id="languages">
			<h3>Languages</h3>
			<div className={styles.tags}>
				{languages.map(language => (
					<span
						key={language}
						className={styles.tag}
					>
						{language}
					</span>
				))}
			</div>
		</Card>
	);
};
