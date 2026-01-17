'use client';

import { useVideoTrimmer } from '../../context/video-trimmer-context';

/**
 * ProgressIndicator - Display processing progress
 */
export function ProgressIndicator() {
	const { processingStatus, processingProgress, cancelProcessing } =
		useVideoTrimmer();

	if (
		processingStatus === 'idle' ||
		processingStatus === 'complete' ||
		processingStatus === 'error'
	) {
		return null;
	}

	const progress = processingProgress?.progress ?? 0;
	const message = processingProgress?.message ?? 'Processing...';

	return (
		<div className="w-full p-8 rounded-xl bg-base-200 border border-base-content/10">
			<div className="flex flex-col items-center gap-6">
				<span className="loading loading-spinner loading-lg text-primary"></span>
				<div className="flex flex-col items-center gap-3 w-full max-w-xs">
					<p className="text-base text-base-content text-center">{message}</p>
					<progress
						className="progress progress-primary w-full"
						value={progress}
						max="100"
					></progress>
					<p className="text-sm font-semibold text-base-content/60 tabular-nums">
						{Math.round(progress)}%
					</p>
				</div>
				<button
					type="button"
					className="btn btn-outline btn-sm"
					onClick={cancelProcessing}
				>
					Cancel
				</button>
			</div>
		</div>
	);
}
