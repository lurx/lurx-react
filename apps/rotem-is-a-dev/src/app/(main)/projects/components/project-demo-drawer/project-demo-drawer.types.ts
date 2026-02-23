import type { PropsWithChildren } from 'react';
import type { Project } from '../../data/projects.data';

export interface ProjectDemoDrawerProps extends PropsWithChildren {
	project: Nullable<Project>;
	onClose: () => void;
}
