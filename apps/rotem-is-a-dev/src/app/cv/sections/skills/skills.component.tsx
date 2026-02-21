'use client';

import { FaIcon } from '@/app/components/fa-icon';
import { Flex } from '@/app/components/flex/flex.component';
import { useCV } from '@/app/cv/context/cv.context';
import type { SkillObject } from '@/app/cv/types';
import styles from './skills.module.scss';

const skillBrandColors: Record<string, string> = {
	html: '#e34f26',
	css: '#264de4',
	javascript: '#f7df1e',
	typescript: '#3178c6',
	react: '#61dafb',
	'vue js': '#42b883',
	scss: '#cf649a',
	git: '#f05032',
};

export const Skills = () => {
	const { skills } = useCV();

	return (
		<Flex direction="column" id="skills">
			<h3>Skills</h3>
			<div className={styles.tags}>
				{skills.map(skill => (
					<SkillTag
						key={skill.name}
						skill={skill}
					/>
				))}
			</div>
		</Flex>
	);
};

const SkillTag = ({ skill }: { skill: SkillObject }) => {
	const { iconGroup, icon, name, level } = skill;
	const fillPercent = (level / 10) * 100;
	const brandColor = skillBrandColors[name] ?? '#646cff';

	const style = {
		'--skill-progress-color': brandColor,
	} as React.CSSProperties;

	return (
		<div
			className={styles.tag}
			style={style}
		>
			<div
				className={styles.tagFill}
				style={{
					width: `${fillPercent}%`,
				}}
			/>
			<Flex
				className={styles.tagContent}
				gap="small"
				align="center"
				justify="center"
			>
				<FaIcon
					iconGroup={iconGroup}
					iconName={icon ?? 'code'}
				/>
				{name}
			</Flex>
		</div>
	);
};
