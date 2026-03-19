import { render } from '@testing-library/react';
import MainLoading from '../loading';

jest.mock('@/app/components', () => ({
	AnimatedLoader: () => <div data-testid="animated-loader" />,
}));

describe('MainLoading', () => {
	it('renders AnimatedLoader centered on the page', () => {
		const { getByTestId } = render(<MainLoading />);
		const loader = getByTestId('animated-loader');
		expect(loader).toBeInTheDocument();

		expect(loader.parentElement).toBeInTheDocument();
		expect(loader.parentElement).toHaveStyle({
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			height: '100%',
		});
	});
});
