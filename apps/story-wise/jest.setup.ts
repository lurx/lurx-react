import '@testing-library/jest-dom';

// jsdom does not implement HTMLMediaElement.load/play/pause
beforeAll(() => {
	HTMLMediaElement.prototype.load = jest.fn();
	HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
	HTMLMediaElement.prototype.pause = jest.fn();
	// Reduce noise from expected warnings in tests
	jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
	jest.restoreAllMocks();
});
