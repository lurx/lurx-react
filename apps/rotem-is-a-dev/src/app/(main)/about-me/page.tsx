import type { Metadata } from 'next';
import { AboutPage } from './about-page.component';

export const metadata: Metadata = {
	title: 'About Me',
	description:
		'Learn more about Rotem Horovitz — background, skills, and experience as a Senior Frontend Developer.',
};

export default function AboutMePage() {
	return <AboutPage />;
}
