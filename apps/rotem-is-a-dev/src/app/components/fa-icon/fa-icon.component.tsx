import {
	byPrefixAndName,
	type IconDefinition,
} from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil } from 'es-toolkit';
import type { FaIconProps } from './fa-icon.types';

export const FaIcon = ({
	iconName,
	iconGroup = 'fas',
	className,
	size = 'lg',
	...dataAttributes
}: WithDataAttributes<FaIconProps>) => {
	const icon: Optional<IconDefinition> = byPrefixAndName[iconGroup][iconName];

	if (isNil(icon)) {
		return null;
	}

	return (
		<FontAwesomeIcon
			size={size}
			icon={icon}
			className={className}
			{...dataAttributes}
		/>
	);
};
