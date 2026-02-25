import { render } from '@testing-library/react';
import { SimpleLoader } from '../simple-loader.component';

describe('SimpleLoader', () => {
	it('renders with data-testid', () => {
		const { getByTestId } = render(<SimpleLoader />);
		expect(getByTestId('simple-loader')).toBeInTheDocument();
	});
});
