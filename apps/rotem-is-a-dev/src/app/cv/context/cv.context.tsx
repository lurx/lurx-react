'use client';

import cv from '@/app/cv/cv';
import type { CvContextValue } from '@/app/cv/types';
import { createContext, useContext, type PropsWithChildren } from 'react';

export const cvContext = createContext<CvContextValue>(cv);

export const useCV = () => useContext(cvContext);

export const CvProvider = ({ children }: PropsWithChildren) => {
	return <cvContext.Provider value={cv}>{children}</cvContext.Provider>;
};
