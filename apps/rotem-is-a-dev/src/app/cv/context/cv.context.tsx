'use client';

import cv from '@/data/cv.data';
import { createContext, useContext, type PropsWithChildren } from 'react';
import type { CvContextValue } from './cv.context.types';

export const cvContext = createContext<CvContextValue>(cv);

export const useCV = () => useContext(cvContext);

export const CvProvider = ({ children }: PropsWithChildren) => {
	return <cvContext.Provider value={cv}>{children}</cvContext.Provider>;
};
