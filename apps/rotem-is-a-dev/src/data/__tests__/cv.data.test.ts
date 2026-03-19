describe('cv data', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
	});

	afterEach(() => {
		process.env = originalEnv;
	});

	it('uses environment variables for contact info when set', () => {
		process.env = {
			...originalEnv,
			NEXT_PUBLIC_CONTACT_EMAIL: 'test@example.com',
			NEXT_PUBLIC_CONTACT_PHONE: '+1234567890',
		};
		const cv = require('../cv.data').default;
		expect(cv.contact.email).toBe('test@example.com');
		expect(cv.contact.phone).toBe('+1234567890');
	});

	it('falls back to empty string when env vars are not set', () => {
		const env = { ...originalEnv };
		delete env.NEXT_PUBLIC_CONTACT_EMAIL;
		delete env.NEXT_PUBLIC_CONTACT_PHONE;
		process.env = env;
		const cv = require('../cv.data').default;
		expect(cv.contact.email).toBe('');
		expect(cv.contact.phone).toBe('');
	});
});
