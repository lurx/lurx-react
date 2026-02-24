import type { Metadata } from 'next';
import { HeroSection } from './components/hero-section/hero-section.component';

export const metadata: Metadata = {
	title: 'Hello',
	description:
		'Welcome to the portfolio of Rotem Horovitz — a Senior Frontend Developer building modern, performant web experiences.',
};

export default function Home() {
	return <HeroSection />;
}
