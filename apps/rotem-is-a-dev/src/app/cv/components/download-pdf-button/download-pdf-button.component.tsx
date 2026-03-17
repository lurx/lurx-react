'use client';

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

		const { generateReactPdf } = await import('@/app/cv/utils/react-pdf');
		await generateReactPdf();

		setIsGenerating(false);
	};

	return (
		<Button variant="ghost" onClick={handleClick} disabled={isGenerating}>
			<FaIcon iconName={isGenerating ? 'spinner' : 'file-arrow-down'} />
      Download CV as PDF
		</Button>
	);
};
