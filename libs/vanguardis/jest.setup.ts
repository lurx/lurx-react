import '@testing-library/jest-dom';

// Global test setup for Vanguardis library
// This file sets up Jest DOM matchers and any other global test configurations

// Mock console.warn for animation utilities that may warn about reduced motion
const originalWarn = console.warn;
beforeAll(() => {
	console.warn = jest.fn();
});

afterAll(() => {
	console.warn = originalWarn;
});
