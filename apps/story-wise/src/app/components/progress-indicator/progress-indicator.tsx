'use client';

import { useStoryWise } from '../../context/story-wise-context';

/**
 * ProgressIndicator - Display processing progress
 */
export function ProgressIndicator() {
	const { processingStatus, processingProgress, processingMode, cancelProcessing } =
		useStoryWise();

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
				{processingMode === 'cloud' && (
					<div className="badge badge-success gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
						</svg>
						Cloud processing (fast)
					</div>
				)}
				{processingMode === 'client' && (
					<div className="badge badge-info gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						Processing in your browser
					</div>
				)}
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
				{processingMode === 'cloud' && (
					<p className="text-xs text-base-content/50 text-center max-w-xs">
						Video uploaded to cloud for fast processing. Files are automatically deleted after 7 days.
					</p>
				)}
				{processingMode === 'client' && (
					<p className="text-xs text-base-content/50 text-center max-w-xs">
						Your video never leaves your device. All processing happens locally.
					</p>
				)}
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
