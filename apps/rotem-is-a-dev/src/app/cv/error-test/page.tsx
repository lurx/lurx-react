'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './error-test.module.scss';

function CVErrorTestContent() {
	const searchParams = useSearchParams();

	if (searchParams.has('trigger')) {
		throw new Error('Test error: CV route boundary');
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Error Boundary Test</h1>
			<p className={styles.description}>
				This page triggers the <code>cv/error.tsx</code> boundary.
			</p>
			<a href="/cv/error-test?trigger" className={styles.link}>
				Trigger error →
			</a>
		</div>
	);
}

export default function CVErrorTestPage() {
	return (
		<Suspense>
			<CVErrorTestContent />
		</Suspense>
	);
}
