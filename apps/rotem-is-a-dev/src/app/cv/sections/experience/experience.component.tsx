'use client';

import { Card } from '@/app/cv/components';
import { useCV } from '@/app/cv/context/cv.context';

import { Flex } from '@/app/components';
import { ExperienceItem } from './experience-item.component';
import { sortByEndDate } from './experience.helpers';

export const Experience = () => {
	const { work_experience } = useCV();

	const sortedExperience = sortByEndDate(work_experience);

	return (
		<Card id="work_experience">
			<h3>Experience</h3>
			<Flex
				direction="column"
				gap="medium"
			>
				{sortedExperience.map(job => (
					<ExperienceItem
						key={job.company + job.position}
						job={job}
					/>
				))}
			</Flex>
		</Card>
	);
};
