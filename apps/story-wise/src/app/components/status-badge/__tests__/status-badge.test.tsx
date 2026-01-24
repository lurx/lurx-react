import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { StatusBadge } from '../status-badge';

describe('StatusBadge', () => {
	beforeEach(() => {
		(global.fetch as jest.Mock) = jest.fn();
	});

	it('shows Checking... while loading', () => {
		(global.fetch as jest.Mock).mockImplementation(
			() => new Promise(() => {})
		);
		render(<StatusBadge />);
		expect(screen.getByText(/checking/i)).toBeInTheDocument();
	});

	it('shows Cloud Ready when healthy and cloud connected', async () => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				status: 'healthy',
				cloud: { enabled: true, connected: true },
				processor: { configured: true },
				mode: 'cloud',
				timestamp: new Date().toISOString(),
			}),
		});
		render(<StatusBadge />);
		await waitFor(() => {
			expect(screen.getByText(/cloud ready/i)).toBeInTheDocument();
		});
	});

	it('shows Client Mode when client-only and cloud not enabled', async () => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				status: 'healthy',
				cloud: { enabled: false, connected: false },
				processor: { configured: false },
				mode: 'client-only',
				timestamp: new Date().toISOString(),
			}),
		});
		render(<StatusBadge />);
		await waitFor(() => {
			expect(screen.getByText(/client mode/i)).toBeInTheDocument();
		});
	});

	it('shows Client Fallback when degraded', async () => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				status: 'degraded',
				cloud: { enabled: true, connected: false },
				processor: { configured: false },
				mode: 'client-only',
				timestamp: new Date().toISOString(),
			}),
		});
		render(<StatusBadge />);
		await waitFor(() => {
			expect(screen.getByText(/client fallback/i)).toBeInTheDocument();
		});
	});

	it('toggles expanded details on click', async () => {
		(global.fetch as jest.Mock).mockResolvedValue({
			ok: true,
			json: async () => ({
				status: 'healthy',
				cloud: { enabled: false, connected: false },
				processor: { configured: false },
				mode: 'client-only',
				timestamp: new Date().toISOString(),
			}),
		});
		render(<StatusBadge />);
		await waitFor(() => {
			expect(screen.getByText(/client mode/i)).toBeInTheDocument();
		});

		expect(screen.queryByText(/mode:/i)).not.toBeInTheDocument();

		fireEvent.click(screen.getByRole('button'));
		await waitFor(() => {
			expect(screen.getByText(/mode:/i)).toBeInTheDocument();
		});
	});
});
