import type { Metadata } from 'next';
import { ContactPage } from './contact-page.component';

export const metadata: Metadata = {
	title: 'Contact',
	description: 'Get in touch with Rotem Horovitz — opportunities, collaborations, and questions welcome.',
};

export default function Contact() {
	return <ContactPage />;
}
