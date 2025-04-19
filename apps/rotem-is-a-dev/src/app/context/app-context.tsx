'use client';

import React, {
	createContext,
	type PropsWithChildren,
	useContext,
} from 'react';
import { IS_UNDER_CONSTRUCTION } from '@/utils/env';

type AppContextType = {
	isUnderConstruction: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
	const contextValue = {
		isUnderConstruction: IS_UNDER_CONSTRUCTION,
	};

	return (
		<AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
	);
}

export function useAppContext() {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an <AppProvider>');
	}
	return context;
}
