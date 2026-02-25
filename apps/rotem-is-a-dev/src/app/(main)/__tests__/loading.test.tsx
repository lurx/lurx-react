import { render } from '@testing-library/react';
import MainLoading from '../loading';

jest.mock('@/app/components/loaders/animated-loader', () => ({
	AnimatedLoader: () => <div data-testid="animated-loader" />,
}));

describe('MainLoading', () => {
	it('renders AnimatedLoader centered on the page', () => {
		const { getByTestId } = render(<MainLoading />);
		const loader = getByTestId('animated-loader');
		expect(loader).toBeInTheDocument();

		const wrapper = loader.parentElement!;
		expect(wrapper.style.display).toBe('flex');
		expect(wrapper.style.justifyContent).toBe('center');
		expect(wrapper.style.alignItems).toBe('center');
		expect(wrapper.style.height).toBe('100%');
	});
});
