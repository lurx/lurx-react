import { LOGO_SIZES } from '@/app/components/logo/logo.constants';
import { render } from '@testing-library/react';
import { AnimatedLoader } from '../animated-loader.component';

jest.mock('../../logo/logo.component', () => ({
	Logo: (props: Record<string, unknown>) => (
		<div data-testid="logo" data-animated={String(props.animated)} data-size={String(props.size)} />
	),
}));

describe('AnimatedLoader', () => {
	it('renders the Logo with animated prop and LOADER size', () => {
		const { getByTestId } = render(<AnimatedLoader />);
		const logo = getByTestId('logo');
		expect(logo).toHaveAttribute('data-animated', 'true');
		expect(logo).toHaveAttribute('data-size', LOGO_SIZES.LOADER);
	});
});
