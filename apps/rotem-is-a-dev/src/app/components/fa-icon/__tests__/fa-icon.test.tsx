import { render } from '@testing-library/react';
import { FaIcon } from '../fa-icon.component';

jest.mock('@awesome.me/kit-1d40de302b/icons', () => ({
	byPrefixAndName: {
		fas: {
			check: { prefix: 'fas', iconName: 'check', icon: [512, 512, [], '', 'M'] },
		},
		fab: {},
	},
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
	FontAwesomeIcon: (props: Record<string, unknown>) => (
		<svg data-testid="fa-icon" data-size={props.size} data-class={props.className} />
	),
}));

describe('FaIcon', () => {
	it('renders the icon when it exists', () => {
		const { container } = render(<FaIcon iconName="check" iconGroup="fas" />);
		expect(container.querySelector('[data-testid="fa-icon"]')).toBeInTheDocument();
	});

	it('renders nothing when the icon is not found', () => {
		const { container } = render(<FaIcon iconName="nonexistent" iconGroup="fas" />);
		expect(container).toBeEmptyDOMElement();
	});

	it('renders nothing when the icon group does not exist', () => {
		const { container } = render(<FaIcon iconName="check" iconGroup="fab" />);
		expect(container).toBeEmptyDOMElement();
	});

	it('passes size prop with default value lg', () => {
		const { container } = render(<FaIcon iconName="check" iconGroup="fas" />);
		expect(container.querySelector('[data-size="lg"]')).toBeInTheDocument();
	});

	it('passes custom size prop', () => {
		const { container } = render(<FaIcon iconName="check" iconGroup="fas" size="sm" />);
		expect(container.querySelector('[data-size="sm"]')).toBeInTheDocument();
	});

	it('passes className prop', () => {
		const { container } = render(
			<FaIcon iconName="check" iconGroup="fas" className="my-icon" />,
		);
		expect(container.querySelector('[data-class="my-icon"]')).toBeInTheDocument();
	});

	it('uses fas as default iconGroup', () => {
		const { container } = render(<FaIcon iconName="check" />);
		expect(container.querySelector('[data-testid="fa-icon"]')).toBeInTheDocument();
	});
});
