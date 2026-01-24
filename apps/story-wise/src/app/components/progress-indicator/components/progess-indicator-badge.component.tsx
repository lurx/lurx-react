import type { ProcessingMode, Nullable } from '../../../types';

type ProcessIndicatorBadgeProps = {
	processingMode: Nullable<ProcessingMode>;
};

export const ProcessIndicatorBadge = ({
	processingMode,
}: ProcessIndicatorBadgeProps) => {
	const isCloud = processingMode === 'cloud';
	const badgeColor = isCloud ? 'badge-success' : 'badge-info';
	const badgeText = isCloud
		? 'Cloud processing (fast)'
		: 'Processing in your browser';
	const svgD = isCloud
		? 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z'
		: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';

    return (
		<div className={`badge ${badgeColor} gap-2`}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				className="w-4 h-4 stroke-current"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="2"
					d={svgD}
				/>
			</svg>
			{badgeText}
		</div>
	);
};
