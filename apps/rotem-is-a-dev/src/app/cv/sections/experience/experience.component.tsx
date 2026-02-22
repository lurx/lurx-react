'use client';

import { Card } from '@/app/cv/components/card';
import { useCV } from '@/app/cv/context/cv.context';

import { Flex } from '@/app/components/flex';
import { ExperienceItem } from './experience-item.component';

export const Experience = () => {
	const { work_experience } = useCV();

	const sortedExperience = [...work_experience].sort((jobA, jobB) => {
		if (jobA.duration.end === 'Present') return -1;
		if (jobB.duration.end === 'Present') return 1;
		return jobB.duration.end - jobA.duration.end;
	});

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
