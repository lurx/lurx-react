'use client';

import { Avatar } from '@/app/components/avatar/avatar.component';
import { Card } from '@/app/components/card';
import { Flex } from '@/app/components/flex';
import { useCV } from '@/app/context/cv.context';
import { Contact } from '../contact';
import { Intro } from '../intro';

export const Header = () => {
	const { name, titles } = useCV();
	const titleString = titles.join(' | ');

	return (
		<Card id="about">
			<Flex direction="column">
				<Flex gap="medium">
					<Avatar
						name={name}
						image="/me.jpg"
					/>
					<Flex direction="column">
						<h1>{name}</h1>
						<h2>{titleString}</h2>
						<Contact />
					</Flex>
				</Flex>
        <Intro />
			</Flex>
		</Card>
	);
};
