'use client';

import { generateCvPdf } from '@/app/cv/utils/generate-pdf';
import { useState } from 'react';
import { FaIcon } from '../../../components/fa-icon/fa-icon.component';
import { Button } from '../button/button.component';

export const DownloadPdfButton = () => {
	const [isGenerating, setIsGenerating] = useState(false);

	const handleClick = async () => {
		setIsGenerating(true);
		await generateCvPdf();
		setIsGenerating(false);
	};

	return (
		<Button variant="ghost" onClick={handleClick} disabled={isGenerating}>
			<FaIcon iconName={isGenerating ? 'spinner' : 'file-arrow-down'} />
      Download CV as PDF
		</Button>
	);
};
