const mockSend = jest.fn();

jest.mock('resend', () => ({
	Resend: jest.fn().mockImplementation(() => ({
		emails: { send: mockSend },
	})),
}));

import { sendMessageAction } from '../send-message.action';

const buildFormData = (entries: Record<string, string>): FormData => {
	const formData = new FormData();
	Object.entries(entries).forEach(([key, value]) => formData.set(key, value));
	return formData;
};

const validFormEntries = {
	name: 'Jane',
	email: 'jane@example.com',
	subject: 'Hi there',
	message: 'A meaningful message for testing.',
};

describe('sendMessageAction', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.clearAllMocks();
		process.env = {
			...originalEnv,
			RESEND_API_KEY: 'test-key',
			NEXT_PUBLIC_CONTACT_EMAIL: 'rotem@example.com',
		};
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	it('returns success without calling resend when honeypot is filled', async () => {
		const formData = buildFormData({ ...validFormEntries, website: 'spam' });
		const result = await sendMessageAction({ status: 'idle' }, formData);
		expect(result).toEqual({ status: 'success' });
		expect(mockSend).not.toHaveBeenCalled();
	});

	it('returns field errors for invalid input', async () => {
		const formData = buildFormData({
			name: '',
			email: 'not-email',
			subject: '',
			message: 'short',
		});
		const result = await sendMessageAction({ status: 'idle' }, formData);
		expect(result.status).toBe('error');
		if (result.status === 'error') {
			expect(result.fieldErrors?.name).toBeDefined();
			expect(result.fieldErrors?.email).toBeDefined();
			expect(result.fieldErrors?.message).toBeDefined();
		}
	});

	it('returns not-configured error when RESEND_API_KEY is missing', async () => {
		delete process.env.RESEND_API_KEY;
		const formData = buildFormData(validFormEntries);
		const result = await sendMessageAction({ status: 'idle' }, formData);
		expect(result.status).toBe('error');
	});

	it('sends a single email to the owner when sendCopy is off', async () => {
		mockSend.mockResolvedValue({ data: { id: 'msg-1' }, error: null });
		const formData = buildFormData(validFormEntries);
		const result = await sendMessageAction({ status: 'idle' }, formData);

		expect(result).toEqual({ status: 'success' });
		expect(mockSend).toHaveBeenCalledTimes(1);
		expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
			to: 'rotem@example.com',
			replyTo: 'jane@example.com',
		}));
	});

	it('sends a copy to the sender when sendCopy is on', async () => {
		mockSend.mockResolvedValue({ data: { id: 'msg-2' }, error: null });
		const formData = buildFormData({ ...validFormEntries, sendCopy: 'on' });
		await sendMessageAction({ status: 'idle' }, formData);

		expect(mockSend).toHaveBeenCalledTimes(2);
		expect(mockSend).toHaveBeenNthCalledWith(2, expect.objectContaining({
			to: 'jane@example.com',
		}));
	});

	it('returns error when resend send returns an error', async () => {
		mockSend.mockResolvedValue({ data: null, error: { message: 'boom' } });
		const formData = buildFormData(validFormEntries);
		const result = await sendMessageAction({ status: 'idle' }, formData);
		expect(result.status).toBe('error');
	});

	it('returns error when resend throws', async () => {
		mockSend.mockRejectedValue(new Error('network'));
		const formData = buildFormData(validFormEntries);
		const result = await sendMessageAction({ status: 'idle' }, formData);
		expect(result.status).toBe('error');
	});
});
