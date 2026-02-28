'use client';

import { Flex } from '@/app/components';
import { useCV } from '@/app/cv/context/cv.context';
import styles from './languages.module.scss';

export const Languages = () => {
	const { languages } = useCV();

	return (
		<Flex direction="column" id="languages">
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
		</Flex>
	);
};
