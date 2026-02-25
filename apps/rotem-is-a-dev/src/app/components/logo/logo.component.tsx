import classNames from 'classnames';
import { DEFAULT_LOGO_SIZE, LOGO_SIZE_OBJECTS } from './logo.constants';
import './logo.scss';
import { ReactComponent as LogoSvg } from './logo.svg';
import type { LogoProps } from './logo.types';

export const Logo = ({ size, animated }: LogoProps) => {
	const logoSize = LOGO_SIZE_OBJECTS[size ?? DEFAULT_LOGO_SIZE];

	return (
		<LogoSvg
			className={classNames('logo-svg', { animated })}
			{...logoSize}
		/>
	);
};
