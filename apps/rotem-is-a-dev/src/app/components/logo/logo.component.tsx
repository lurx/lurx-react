import classNames from 'classnames';
import './logo.scss';
import { ReactComponent as LogoSvg } from './logo.svg';
import type { LogoProps } from './logo.types';

export const Logo = ({ animated }: LogoProps) => {
	return <LogoSvg className={classNames('logo-svg', { animated })} />;
};
