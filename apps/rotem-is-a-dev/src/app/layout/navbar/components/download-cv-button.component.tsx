'use client';

import { FaIcon } from '@/app/components';
import { useResponsive } from '@/hooks';
import { useState } from 'react';
import styles from '../navbar.module.scss';
import { NavItem } from './nav-item.component';

export const DownloadCVButton = () => {
	const { isMobile } = useResponsive();
	const [isGenerating, setIsGenerating] = useState(false);

	if (isMobile) return null;

	const handleClick = async () => {
		if (isGenerating) return;
		setIsGenerating(true);

		try {
			const { renderCvOffscreen } = await import('@/app/cv/utils/render-cv-offscreen');
			const { generateCvPdf } = await import('@/app/cv/utils/generate-pdf');

			const { container, cleanup } = renderCvOffscreen();
			try {
				await generateCvPdf(container);
			} finally {
				cleanup();
			}
		} catch {
			// PDF generation may fail silently — the user can retry
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<NavItem
			label="Download CV"
			icon={
				<FaIcon
					iconName={isGenerating ? 'spinner' : 'file-pdf'}
					iconGroup="fal"
					className={styles.downloadIcon}
					data-animate-icon
				/>
			}
			onClick={handleClick}
			className={styles.downloadCv}
			active={false}
			data-animate-text="download-cv"
		/>
	);
};
