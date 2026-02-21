import type { IconGroupName } from '@/app/cv/types';
import {
	byPrefixAndName,
	type IconDefinition,
} from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil } from 'es-toolkit';
export interface FaIconProps {
	iconName: string;
	iconGroup?: IconGroupName;
	className?: string;
}

export const FaIcon = ({
	iconName,
	iconGroup = 'fas',
	className,
	...dataAttributes
}: WithDataAttributes<FaIconProps>) => {
	const icon: IconDefinition | undefined = byPrefixAndName[iconGroup][iconName];

	if (isNil(icon)) {
		return null;
	}

	return (
		<FontAwesomeIcon
			size="lg"
			icon={icon}
			className={className}
			{...dataAttributes}
		/>
	);
};
