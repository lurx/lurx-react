import { render, screen, waitFor } from '@testing-library/react';
import { VitalsFrame } from '../vitals-frame';

const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
	useSearchParams: () => ({
		get: mockGet,
		has: jest.fn((key: string) => key === 'showVitals'),
		toString: jest.fn(() => ''),
	}),
}));

describe('VitalsFrame', () => {
	beforeEach(() => {
		mockGet.mockReturnValue(null);
		(global.fetch as jest.Mock) = jest.fn();
	});

	it('returns null when showVitals is not in URL', () => {
		// mockGet returns null from beforeEach -> show is false
		const { container } = render(<VitalsFrame />);
		expect(container.firstChild).toBeNull();
	});

	it('renders when showVitals is in URL and shows loading then vitals', async () => {
		mockGet.mockImplementation((key: string) =>
			key === 'showVitals' ? '1' : null
		);

		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				available: true,
				memory: { heapUsedMb: 50, heapTotalMb: 100, rssMb: 120, externalMb: 2 },
				system: { freememMb: 2000, totalmemMb: 8000, loadAvg: [1.5, 1.2, 1.0] },
				uptimeSeconds: 3600,
				timestamp: '2024-01-01T12:00:00Z',
			}),
		});

		render(<VitalsFrame />);

		expect(screen.getByLabelText(/processor vitals/i)).toBeInTheDocument();
		await waitFor(() => {
			expect(screen.getByText(/heap/)).toBeInTheDocument();
			expect(screen.getByText(/rss/)).toBeInTheDocument();
			expect(screen.getByText(/mem free/)).toBeInTheDocument();
		});
	});

	it('shows Unavailable when vitals.available is false', async () => {
		mockGet.mockImplementation((key: string) =>
			key === 'showVitals' ? '1' : null
		);
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({ available: false, reason: 'Processor not configured' }),
		});

		render(<VitalsFrame />);
		await waitFor(() => {
			expect(screen.getByText(/processor not configured/i)).toBeInTheDocument();
		});
	});
});
