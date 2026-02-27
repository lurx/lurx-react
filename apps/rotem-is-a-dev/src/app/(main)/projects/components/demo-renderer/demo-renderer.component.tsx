import type { DemoRendererProps } from './demo-renderer.types';

export const DemoRenderer = ({ demo }: DemoRendererProps) => {
  const DemoComponent = demo;
	if (!DemoComponent) {
		return null;
	}
	return <DemoComponent />;
};
