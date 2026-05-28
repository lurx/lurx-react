import {
	DEFAULT_SUBJECT,
	buildOwnerHtml,
	buildSenderCopyHtml,
	hasErrors,
	isHoneypotFilled,
	parseFormInput,
	truncateSubject,
	validateInput,
} from '../send-message.action.helpers';

const buildFormData = (entries: Record<string, string>): FormData => {
	const formData = new FormData();
	Object.entries(entries).forEach(([key, value]) => formData.set(key, value));
	return formData;
};

describe('parseFormInput', () => {
	it('extracts trimmed fields and defaults subject when blank', () => {
		const formData = buildFormData({
			name: '  Jane  ',
			email: ' jane@example.com ',
			subject: '   ',
			message: '  Hello there  ',
		});

		expect(parseFormInput(formData)).toEqual({
			name: 'Jane',
			email: 'jane@example.com',
			subject: DEFAULT_SUBJECT,
			message: 'Hello there',
			sendCopy: false,
		});
	});

	it('flags sendCopy when checkbox is on', () => {
		const formData = buildFormData({
			name: 'Jane',
			email: 'jane@example.com',
			subject: 'Hi',
			message: 'Hello there friend',
			sendCopy: 'on',
		});

		expect(parseFormInput(formData).sendCopy).toBe(true);
	});
});

describe('isHoneypotFilled', () => {
	it('returns true when website honeypot is filled', () => {
		const formData = buildFormData({ website: 'http://spam.test' });
		expect(isHoneypotFilled(formData)).toBe(true);
	});

	it('returns false when honeypot is empty', () => {
		const formData = buildFormData({ website: '   ' });
		expect(isHoneypotFilled(formData)).toBe(false);
	});
});

describe('validateInput', () => {
	const validInput = {
		name: 'Jane',
		email: 'jane@example.com',
		subject: 'Hi',
		message: 'This is a sufficiently long message.',
		sendCopy: false,
	};

	it('returns no errors for valid input', () => {
		expect(validateInput(validInput)).toEqual({});
	});

	it('requires name', () => {
		expect(validateInput({ ...validInput, name: '' })).toHaveProperty('name');
	});

	it('rejects invalid email', () => {
		expect(validateInput({ ...validInput, email: 'not-an-email' })).toHaveProperty('email');
	});

	it('requires a minimum message length', () => {
		expect(validateInput({ ...validInput, message: 'short' })).toHaveProperty('message');
	});
});

describe('hasErrors', () => {
	it('returns true when any field error is present', () => {
		expect(hasErrors({ name: 'required' })).toBe(true);
	});

	it('returns false for an empty errors object', () => {
		expect(hasErrors({})).toBe(false);
	});
});

describe('truncateSubject', () => {
	it('limits subjects to 200 characters', () => {
		const long = 'a'.repeat(500);
		expect(truncateSubject(long).length).toBe(200);
	});
});

describe('buildOwnerHtml / buildSenderCopyHtml', () => {
	const input = {
		name: 'Jane <script>',
		email: 'jane@example.com',
		subject: 'Hello & welcome',
		message: 'Line one\nLine two',
		sendCopy: false,
	};

	it('escapes html in owner email', () => {
		const html = buildOwnerHtml(input);
		expect(html).toContain('Jane &lt;script&gt;');
		expect(html).toContain('Hello &amp; welcome');
		expect(html).toContain('Line one<br>Line two');
	});

	it('addresses the sender by name in the copy email', () => {
		const html = buildSenderCopyHtml(input);
		expect(html).toContain('Hi Jane &lt;script&gt;,');
	});
});
