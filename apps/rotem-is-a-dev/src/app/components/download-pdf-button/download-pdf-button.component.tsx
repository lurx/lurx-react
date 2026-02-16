'use client';

import { generateCvPdf } from '@/app/utils/generate-pdf';
import { useState } from 'react';
import { Button } from '../button/button.component';
import { FaIcon } from '../fa-icon/fa-icon.component';

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
