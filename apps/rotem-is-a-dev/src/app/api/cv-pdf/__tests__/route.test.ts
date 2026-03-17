const mockBuffer = Buffer.from('mock-pdf-content');

jest.mock('@react-pdf/renderer', () => ({
	renderToBuffer: jest.fn(() => Promise.resolve(mockBuffer)),
	Document: ({ children }: { children: React.ReactNode }) => children,
	Page: ({ children }: { children: React.ReactNode }) => children,
	View: ({ children }: { children: React.ReactNode }) => children,
	Text: ({ children }: { children: React.ReactNode }) => children,
	Link: ({ children }: { children: React.ReactNode }) => children,
	StyleSheet: { create: <T extends Record<string, unknown>>(s: T): T => s },
}));

jest.mock('@/data/cv.data', () => ({
	__esModule: true,
	default: {
		name: 'Test',
		titles: [],
		intro: '',
		contact: {
			email: '',
			phone: '',
			website: '',
			social: { linkedin: '', github: '' },
		},
		work_experience: [],
		skills: [],
		languages: [],
	},
}));

jest.mock('@/app/cv/sections/intro/intro.helpers', () => ({
	calculateYearsOfExperience: jest.fn(() => 10),
}));

jest.mock('@/app/cv/sections/experience/experience.helpers', () => ({
	sortByEndDate: (jobs: unknown[]) => jobs,
}));

import type React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { PDF_FILE_NAME } from '@/app/cv/utils/react-pdf/cv-document.constants';

const mockHeaders: Record<string, string> = {};
const MockResponse = jest.fn().mockImplementation((_body: unknown, init: { headers: Record<string, string> }) => {
	Object.assign(mockHeaders, init.headers);
});

const originalResponse = globalThis.Response;

beforeAll(() => {
	globalThis.Response = MockResponse as unknown as typeof Response;
});

afterAll(() => {
	globalThis.Response = originalResponse;
});

beforeEach(() => {
	jest.clearAllMocks();
	Object.keys(mockHeaders).forEach(key => delete mockHeaders[key]);
});

describe('GET /api/cv-pdf', () => {
	it('calls renderToBuffer to generate the PDF', async () => {
		const { GET } = await import('../route');
		await GET();

		expect(renderToBuffer).toHaveBeenCalledTimes(1);
	});

	it('creates a Response with the PDF buffer as Uint8Array', async () => {
		const { GET } = await import('../route');
		await GET();

		const body = MockResponse.mock.calls[0][0];
		expect(body).toBeInstanceOf(Uint8Array);
		expect(Buffer.from(body).toString()).toBe('mock-pdf-content');
	});

	it('sets Content-Type to application/pdf', async () => {
		const { GET } = await import('../route');
		await GET();

		expect(mockHeaders['Content-Type']).toBe('application/pdf');
	});

	it('sets Content-Disposition with the correct filename', async () => {
		const { GET } = await import('../route');
		await GET();

		expect(mockHeaders['Content-Disposition']).toBe(
			`inline; filename="${PDF_FILE_NAME}"`,
		);
	});
});
