import type { IconGroupName } from '@/app/types';
import {
	byPrefixAndName,
	type IconDefinition,
} from '@awesome.me/kit-1d40de302b/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNil } from 'es-toolkit';

interface FaIconProps {
	iconName: string;
	iconGroup?: IconGroupName;
}

export const FaIcon = ({ iconName, iconGroup = 'fas' }: FaIconProps) => {
	const icon: IconDefinition | undefined = byPrefixAndName[iconGroup][iconName];

	if (isNil(icon)) {
		return null;
	}

	return <FontAwesomeIcon icon={icon} />;
};
