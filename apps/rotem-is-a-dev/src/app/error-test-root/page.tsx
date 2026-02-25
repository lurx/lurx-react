'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './error-test.module.scss';

function RootErrorTestContent() {
	const searchParams = useSearchParams();

	if (searchParams.has('trigger')) {
		throw new Error('Test error: root boundary');
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Error Boundary Test</h1>
			<p className={styles.description}>
				This page triggers the root <code>app/error.tsx</code> boundary.
			</p>
			<a href="/error-test-root?trigger" className={styles.link}>
				Trigger error →
			</a>
		</div>
	);
}

export default function RootErrorTestPage() {
	return (
		<Suspense>
			<RootErrorTestContent />
		</Suspense>
	);
}
