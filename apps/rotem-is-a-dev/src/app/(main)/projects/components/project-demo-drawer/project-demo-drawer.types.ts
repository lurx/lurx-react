import type { PropsWithChildren } from 'react';
import type { Project } from '../../data/projects.data';

export type ProjectDemoDrawerProps = PropsWithChildren & {
	project: Nullable<Project>;
	onCloseAction: () => void;
	scrollToComments?: boolean;
}
