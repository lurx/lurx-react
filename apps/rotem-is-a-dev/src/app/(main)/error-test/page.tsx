'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './error-test.module.scss';

function MainErrorTestContent() {
	const searchParams = useSearchParams();

	if (searchParams.has('trigger')) {
		throw new Error('Test error: (main) route group boundary');
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Error Boundary Test</h1>
			<p className={styles.description}>
				This page triggers the <code>(main)/error.tsx</code> boundary.
			</p>
			<a href="/error-test?trigger" className={styles.link}>
				Trigger error →
			</a>
		</div>
	);
}

export default function MainErrorTestPage() {
	return (
		<Suspense>
			<MainErrorTestContent />
		</Suspense>
	);
}
