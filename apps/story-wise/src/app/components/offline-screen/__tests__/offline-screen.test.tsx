import { render, screen, fireEvent } from '@testing-library/react';
import { OfflineScreen } from '../offline-screen';

describe('OfflineScreen', () => {
	it('renders Temporarily Offline heading', () => {
		render(<OfflineScreen />);
		expect(screen.getByRole('heading', { name: /temporarily offline/i })).toBeInTheDocument();
	});

	it('uses default message when no message prop', () => {
		render(<OfflineScreen />);
		expect(screen.getByText(/we've reached our usage limit/i)).toBeInTheDocument();
	});

	it('uses custom message when provided', () => {
		render(<OfflineScreen message="Custom offline message" />);
		expect(screen.getByText(/custom offline message/i)).toBeInTheDocument();
	});

	it('shows Try Again button that calls window.location.reload', () => {
		Object.defineProperty(window, 'location', {
			value: { reload: jest.fn() },
			writable: true,
		});
		render(<OfflineScreen />);
		fireEvent.click(screen.getByRole('button', { name: /try again/i }));
		expect(window.location.reload).toHaveBeenCalled();
	});

	it('lists when service will be back', () => {
		render(<OfflineScreen />);
		expect(screen.getByText(/the service will be back when/i)).toBeInTheDocument();
		expect(screen.getByText(/the monthly quota resets/i)).toBeInTheDocument();
		expect(screen.getByText(/or capacity is increased/i)).toBeInTheDocument();
	});
});
