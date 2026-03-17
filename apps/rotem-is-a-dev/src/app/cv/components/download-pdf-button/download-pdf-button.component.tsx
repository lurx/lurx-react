'use client';

import { generateCvPdf } from '@/app/cv/utils/generate-pdf';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { FaIcon } from '@/app/components';
import { Button } from '../button';

export const DownloadPdfButton = () => {
	const searchParams = useSearchParams();
	const [isGenerating, setIsGenerating] = useState(false);

	if (searchParams.has('noDownload')) return null;

	const handleClick = async () => {
		setIsGenerating(true);

		if (searchParams.has('new-pdf')) {
			const { generateReactPdf } = await import('@/app/cv/utils/react-pdf');
			await generateReactPdf();
		} else {
			await generateCvPdf();
		}

		setIsGenerating(false);
	};

	return (
		<Button variant="ghost" onClick={handleClick} disabled={isGenerating}>
			<FaIcon iconName={isGenerating ? 'spinner' : 'file-arrow-down'} />
      Download CV as PDF
		</Button>
	);
};
