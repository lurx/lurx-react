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

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: jest.fn().mockImplementation(query => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Mock localStorage
const localStorageMock = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
});

// Mock IntersectionObserver for animation components
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));

// Mock ResizeObserver for animation components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
	observe: jest.fn(),
	unobserve: jest.fn(),
	disconnect: jest.fn(),
}));
