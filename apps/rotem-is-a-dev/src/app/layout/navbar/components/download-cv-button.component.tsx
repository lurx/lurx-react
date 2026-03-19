'use client';

import { FaIcon, SimpleLoader } from '@/app/components';
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
			const { generateReactPdf } = await import('@/app/cv/utils/react-pdf');
			await generateReactPdf();
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
				isGenerating ? (
					<SimpleLoader />
				) : (
					<FaIcon
						iconName="file-pdf"
						iconGroup="fal"
						className={styles.downloadIcon}
						data-animate-icon
					/>
				)
			}
			onClick={handleClick}
			className={styles.downloadCv}
			active={false}
			data-animate-text="download-cv"
		/>
	);
};
