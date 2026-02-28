import { calculateYearsOfExperience } from '../intro.helpers';

const makeJob = (start: number, end: number | 'Present' = 'Present'): ExperienceItem => ({
	company: 'Acme Corp',
	position: 'Engineer',
	duration: { start, end },
	description: '',
});

describe('calculateYearsOfExperience', () => {
	const MOCK_YEAR = 2030;

	beforeEach(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date(`${MOCK_YEAR}-06-01`));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it('returns years from the earliest start year to the current year', () => {
		const jobs = [makeJob(2020), makeJob(2022)];
		expect(calculateYearsOfExperience(jobs)).toBe(MOCK_YEAR - 2020);
	});

	it('uses the earliest start year across all jobs', () => {
		const jobs = [makeJob(2018), makeJob(2015), makeJob(2021)];
		expect(calculateYearsOfExperience(jobs)).toBe(MOCK_YEAR - 2015);
	});

	it('returns 0 when the only job started in the current year', () => {
		const jobs = [makeJob(MOCK_YEAR)];
		expect(calculateYearsOfExperience(jobs)).toBe(0);
	});

	it('handles a single job correctly', () => {
		const jobs = [makeJob(2025)];
		expect(calculateYearsOfExperience(jobs)).toBe(MOCK_YEAR - 2025);
	});

	it('is not affected by the end dates of the jobs', () => {
		const jobs = [makeJob(2019, 2021), makeJob(2021, 'Present')];
		expect(calculateYearsOfExperience(jobs)).toBe(MOCK_YEAR - 2019);
	});
});
