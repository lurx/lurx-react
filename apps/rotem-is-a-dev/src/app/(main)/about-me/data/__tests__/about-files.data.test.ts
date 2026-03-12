import {
	getFileSection,
	ABOUT_FILES,
	SECTIONS,
	SECTION_FILES,
	DEFAULT_FILE_ID,
} from '../about-files.data';

describe('about-files.data', () => {
	describe('getFileSection', () => {
		it('returns "personal-info" for bio', () => {
			expect(getFileSection('bio')).toBe('personal-info');
		});

		it('returns "personal-info" for interests', () => {
			expect(getFileSection('interests')).toBe('personal-info');
		});

		it('returns "work-experience" for payoneer', () => {
			expect(getFileSection('payoneer')).toBe('work-experience');
		});

		it('returns "work-experience" for startup-booster', () => {
			expect(getFileSection('startup-booster')).toBe('work-experience');
		});

		it('returns null for a file not in any section', () => {
			expect(getFileSection('nonexistent' as never)).toBeNull();
		});
	});

	describe('constants', () => {
		it('sets bio as the default file id', () => {
			expect(DEFAULT_FILE_ID).toBe('bio');
		});

		it('defines all expected sections', () => {
			const sectionIds = SECTIONS.map(section => section.id);
			expect(sectionIds).toContain('personal-info');
			expect(sectionIds).toContain('work-experience');
		});

		it('maps section files correctly', () => {
			expect(SECTION_FILES['personal-info']).toContain('bio');
			expect(SECTION_FILES['work-experience']).toContain('payoneer');
		});

		it('defines all about file entries', () => {
			expect(ABOUT_FILES['bio']).toBeDefined();
			expect(ABOUT_FILES['bio'].format).toBe('jsdoc');
			expect(ABOUT_FILES['payoneer'].format).toBe('json');
		});
	});
});
