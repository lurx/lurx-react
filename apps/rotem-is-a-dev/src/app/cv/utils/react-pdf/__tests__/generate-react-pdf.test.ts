const mockToBlob = jest.fn(() => Promise.resolve(new Blob(['pdf-content'])));

jest.mock('@react-pdf/renderer', () => ({
	...require('../__mocks__/react-pdf-mock'),
	pdf: jest.fn(() => ({ toBlob: mockToBlob })),
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

import { pdf } from '@react-pdf/renderer';
import { generateReactPdf } from '../generate-react-pdf';

const mockPdf = jest.mocked(pdf);

let clickSpy: jest.Mock;
let createObjectURLMock: jest.Mock;
let revokeObjectURLMock: jest.Mock;

beforeEach(() => {
	mockPdf.mockClear();
	mockToBlob.mockClear();
	clickSpy = jest.fn();
	jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
		if (tag === 'a') {
			return { click: clickSpy, href: '', download: '' } as unknown as HTMLElement;
		}
		return document.createElement(tag);
	});
	jest.spyOn(document.body, 'appendChild').mockImplementation(node => node);
	jest.spyOn(document.body, 'removeChild').mockImplementation(node => node);
	createObjectURLMock = jest.fn().mockReturnValue('blob:test-url');
	revokeObjectURLMock = jest.fn();
	globalThis.URL.createObjectURL = createObjectURLMock;
	globalThis.URL.revokeObjectURL = revokeObjectURLMock;
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('generateReactPdf', () => {
	it('calls pdf() to generate the blob', async () => {
		await generateReactPdf();
		expect(mockPdf).toHaveBeenCalledTimes(1);
		expect(mockToBlob).toHaveBeenCalledTimes(1);
	});

	it('creates an object URL from the blob', async () => {
		await generateReactPdf();
		expect(createObjectURLMock).toHaveBeenCalledWith(expect.any(Blob));
	});

	it('triggers a download click', async () => {
		await generateReactPdf();
		expect(clickSpy).toHaveBeenCalledTimes(1);
	});

	it('revokes the object URL after download', async () => {
		await generateReactPdf();
		expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test-url');
	});
});
