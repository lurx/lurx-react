'use client';

import { Card } from '@/app/cv/components/card';
import { useCV } from '@/app/cv/context/cv.context';

import { Flex } from '@/app/components/flex';
import { Collapsible } from '@/app/cv/components/collapsible/collapsible.component';
import { useState } from 'react';
import { ExperienceItem } from './experience-item.component';

export const Experience = () => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const { work_experience } = useCV();

	const sortedExperience = [...work_experience].sort((jobA, jobB) => {
		if (jobA.duration.end === 'Present') return -1;
		if (jobB.duration.end === 'Present') return 1;
		return jobB.duration.end - jobA.duration.end;
	});

	const toggleCollapse = () => {
		setIsCollapsed(prev => !prev);
	};

	const [firstJob, ...otherJobs] = sortedExperience;

	return (
		<Card id="work_experience">
			<h3>Experience</h3>
			<Flex
				direction="column"
				gap="medium"
			>
				<ExperienceItem job={firstJob} />
				<Collapsible
					numberOfItems={otherJobs.length}
					isCollapsed={isCollapsed}
					onToggle={toggleCollapse}
				>
					{otherJobs.map(job => (
						<ExperienceItem
							key={job.company + job.position}
							job={job}
						/>
					))}
				</Collapsible>
			</Flex>
		</Card>
	);
};
