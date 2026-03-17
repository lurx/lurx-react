import type { CvContextValue } from '@/app/cv/context/cv.context.types';

export type PdfHeaderProps = {
	name: CvContextValue['name'];
	titles: CvContextValue['titles'];
	contact: CvContextValue['contact'];
	introText: string;
};
