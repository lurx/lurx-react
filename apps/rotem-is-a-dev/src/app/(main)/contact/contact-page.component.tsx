'use client';

import { useCallback, useState } from 'react';
import { ContactForm, ContactInfo } from './components';
import { contactPageStrings } from './contact-page.strings';
import styles from './contact-page.module.scss';

export const ContactPage = () => {
	const [isSuccess, setIsSuccess] = useState(false);

	const handleSuccess = useCallback(() => {
		setIsSuccess(true);
	}, []);

	const handleSendAnother = useCallback(() => {
		setIsSuccess(false);
	}, []);

	const renderFormSection = () => {
		if (isSuccess) {
			return (
				<div className={styles.success} role="status">
					<p className={styles.successHeading}>{contactPageStrings.successHeading}</p>
					<p className={styles.successBody}>{contactPageStrings.successBody}</p>
					<button
						type="button"
						className={styles.sendAnother}
						onClick={handleSendAnother}
					>
						{contactPageStrings.sendAnother}
					</button>
				</div>
			);
		}

		return (
			<>
				<p className={styles.formHeading}>{contactPageStrings.formHeading}</p>
				<ContactForm onSuccessAction={handleSuccess} />
			</>
		);
	};

	return (
		<div className={styles.page}>
			<header className={styles.header}>
				<h1 className={styles.title}>{contactPageStrings.title}</h1>
				<p className={styles.subtitle}>{contactPageStrings.subtitle}</p>
			</header>

			<div className={styles.layout}>
				<section className={styles.formColumn}>{renderFormSection()}</section>
				<ContactInfo />
			</div>
		</div>
	);
};
