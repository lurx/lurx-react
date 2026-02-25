import '@testing-library/jest-dom';

// Mock Next.js fonts
jest.mock('next/font/google', () => ({
	Chelsea_Market: jest.fn(() => ({
		variable: '--font-chelsea-market',
		style: {
			fontFamily: 'Chelsea Market, cursive',
		},
	})),
}));
