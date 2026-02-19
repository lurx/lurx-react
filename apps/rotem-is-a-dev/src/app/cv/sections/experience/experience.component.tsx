'use client';

import { Card } from '@/app/cv/components/card';
import { useCV } from '@/app/cv/context/cv.context';

import { Collapsible } from '@/app/cv/components/collapsible/collapsible.component';
import { Flex } from '@/app/cv/components/flex';
import { useState } from 'react';
import { JobItem } from './experience-item.component';

export const Experience = () => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const { work_experience } = useCV();

	const sortedExperience = [...work_experience].sort((a, b) => {
		if (a.duration.end === 'Present') return -1;
		if (b.duration.end === 'Present') return 1;
		return b.duration.end - a.duration.end;
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
				<JobItem job={firstJob} />
				<Collapsible
					numberOfItems={otherJobs.length}
					isCollapsed={isCollapsed}
					onToggle={toggleCollapse}
				>
					{otherJobs.map(job => (
						<JobItem
							key={job.company + job.position}
							job={job}
						/>
					))}
				</Collapsible>
			</Flex>
		</Card>
	);
};
