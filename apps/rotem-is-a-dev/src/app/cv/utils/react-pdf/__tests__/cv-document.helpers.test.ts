import { resolveIntroText, formatDuration } from '../cv-document.helpers';

jest.mock('@/app/cv/sections/intro/intro.helpers', () => ({
	calculateYearsOfExperience: jest.fn(() => 15),
}));

describe('resolveIntroText', () => {
	it('replaces %numYears% with calculated years', () => {
		const result = resolveIntroText('I have %numYears% years of experience.', []);
		expect(result).toBe('I have 15 years of experience.');
	});

	it('returns text unchanged when no placeholder exists', () => {
		const result = resolveIntroText('No placeholder here.', []);
		expect(result).toBe('No placeholder here.');
	});
});

describe('formatDuration', () => {
	it('formats numeric start and end', () => {
		expect(formatDuration({ start: 2020, end: 2023 })).toBe('2020 - 2023');
	});

	it('formats Present end date', () => {
		expect(formatDuration({ start: 2023, end: 'Present' })).toBe('2023 - Present');
	});
});
