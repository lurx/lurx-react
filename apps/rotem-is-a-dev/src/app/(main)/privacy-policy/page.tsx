import type { Metadata } from 'next';
import { pages } from '#velite';
import { notFound } from 'next/navigation';
import { PrivacyPolicyPage } from './privacy-policy-page.component';

const page = pages.find(entry => entry.slug === 'privacy-policy');

export const metadata: Metadata = {
	title: page?.title,
	description: page?.description,
};

export default function PrivacyPolicy() {
	if (!page) notFound();

	return <PrivacyPolicyPage page={page} />;
}
