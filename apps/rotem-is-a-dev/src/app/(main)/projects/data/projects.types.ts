import type { ComponentType } from 'react';

export type ProjectExternalUrl = {
	origin: string;
	url: string;
	iconName?: string;
}

export type Project = {
	id: number;
	number: number;
	slug: string;
	description: string;
	technologies: Technology[];
	externalUrl?: ProjectExternalUrl;
	demo?: ComponentType;
}
