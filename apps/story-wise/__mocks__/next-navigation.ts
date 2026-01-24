export const useRouter = jest.fn(() => ({
	push: jest.fn(),
	replace: jest.fn(),
	prefetch: jest.fn(),
	back: jest.fn(),
	forward: jest.fn(),
	refresh: jest.fn(),
	pathname: '/',
	query: {},
	asPath: '/',
}));

export const usePathname = jest.fn(() => '/');

export const useSearchParams = jest.fn(() => ({
	get: jest.fn((key: string) => null),
	has: jest.fn(() => false),
	toString: jest.fn(() => ''),
}));

export const useParams = jest.fn(() => ({}));
