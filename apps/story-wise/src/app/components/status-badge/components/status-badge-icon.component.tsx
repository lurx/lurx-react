import type { PropsWithChildren } from 'react';
import type { HealthStatus } from '../../../api/health/route';

const initialSvgD =
	'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z';
const healthySvgD =
	'M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z';
const clientOnlySvgD =
	'M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.321A1 1 0 0113.315 17H6.685a1 1 0 01-.632-1.74l.804-.321.123-.489H5a2 2 0 01-2-2V5zm2 0h10v8H5V5z';

type StatusBadgeIconProps = {
	health: HealthStatus;
};

const IconContainer = ({ children }: PropsWithChildren) => {
	return (
		<svg
			className="w-3 h-3"
			fill="currentColor"
			viewBox="0 0 20 20"
		>
			{children}
		</svg>
	);
};

export const StatusBadgeIcon = ({ health }: StatusBadgeIconProps) => {
	const isHealthy = health.status === 'healthy' && health.cloud.connected;
	const isClientOnly = health.mode === 'client-only';
	let svgD = initialSvgD;

	if (isHealthy) {
		svgD = healthySvgD;
	} else if (isClientOnly) {
		svgD = clientOnlySvgD;
	}

	return (
		<IconContainer>
			<path
				fillRule="evenodd"
				d={svgD}
				clipRule="evenodd"
			/>
		</IconContainer>
	);
};
