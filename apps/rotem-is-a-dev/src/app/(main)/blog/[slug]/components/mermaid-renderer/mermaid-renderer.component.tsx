'use client';

import { useEffect } from 'react';
import { mermaidThemeConfig } from '@/app/content/plugins/mermaid.config';

const MERMAID_SELECTOR = 'pre.mermaid';

export const MermaidRenderer = () => {
	useEffect(() => {
		let cancelled = false;

		const renderDiagrams = async () => {
			if (document.querySelector(MERMAID_SELECTOR) === null) return;

			const mermaid = (await import('mermaid')).default;

			if (cancelled) return;

			mermaid.initialize(mermaidThemeConfig);

			await mermaid.run({ querySelector: MERMAID_SELECTOR });
		};

		void renderDiagrams();

		return () => {
			cancelled = true;
		};
	}, []);

	return null;
};
