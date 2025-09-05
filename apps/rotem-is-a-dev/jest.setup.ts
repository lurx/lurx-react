import '@testing-library/jest-dom';

// Mock Next.js fonts
jest.mock('next/font/google', () => ({
	Inter: jest.fn(() => ({
		variable: '--font-inter',
		style: {
			fontFamily: 'Inter, sans-serif',
		},
	})),
	Poppins: jest.fn(() => ({
		variable: '--font-poppins',
		style: {
			fontFamily: 'Poppins, sans-serif',
		},
	})),
	Fira_Code: jest.fn(() => ({
		variable: '--font-fira-code',
		style: {
			fontFamily: 'Fira Code, monospace',
		},
	})),
}));
