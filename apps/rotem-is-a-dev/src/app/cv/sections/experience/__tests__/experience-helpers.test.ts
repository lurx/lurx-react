import { sortByEndDate } from '../experience.helpers';

const makeJob = (start: number, end: number | 'Present'): ExperienceItem => ({
	company: 'Acme Corp',
	position: 'Engineer',
	duration: { start, end },
	description: '',
});

describe('sortByEndDate', () => {
	it('returns an empty array when given an empty array', () => {
		expect(sortByEndDate([])).toEqual([]);
	});

	it('returns a single-item array unchanged', () => {
		const jobs = [makeJob(2020, 2022)];
		expect(sortByEndDate(jobs)).toEqual(jobs);
	});

	it('places the job with Present end date first', () => {
		const jobs = [makeJob(2018, 2021), makeJob(2021, 'Present')];
		const result = sortByEndDate(jobs);
		expect(result[0].duration.end).toBe('Present');
	});

	it('sorts numeric end dates in descending order', () => {
		const jobs = [makeJob(2015, 2018), makeJob(2018, 2021), makeJob(2010, 2015)];
		const result = sortByEndDate(jobs);
		expect(result.map(job => job.duration.end)).toEqual([2021, 2018, 2015]);
	});

	it('places Present before all numeric end dates', () => {
		const jobs = [makeJob(2010, 2023), makeJob(2015, 2020), makeJob(2019, 'Present')];
		const result = sortByEndDate(jobs);
		expect(result[0].duration.end).toBe('Present');
		expect(result[1].duration.end).toBe(2023);
		expect(result[2].duration.end).toBe(2020);
	});

	it('does not mutate the original array', () => {
		const jobs = [makeJob(2018, 2021), makeJob(2021, 'Present')];
		const original = [...jobs];
		sortByEndDate(jobs);
		expect(jobs).toEqual(original);
	});

	it('handles multiple Present entries by preserving their relative order', () => {
		const jobA = makeJob(2020, 'Present');
		const jobB = makeJob(2018, 'Present');
		const result = sortByEndDate([jobA, jobB]);
		expect(result[0].duration.end).toBe('Present');
		expect(result[1].duration.end).toBe('Present');
	});

	it('returns 1 when only jobB has Present end date', () => {
		const numericJob = makeJob(2015, 2020);
		const presentJob = makeJob(2019, 'Present');
		const result = sortByEndDate([numericJob, presentJob]);
		expect(result[0]).toBe(presentJob);
		expect(result[1]).toBe(numericJob);
	});
});
