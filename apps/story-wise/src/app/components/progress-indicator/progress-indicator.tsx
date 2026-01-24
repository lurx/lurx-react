'use client';

import { CLEANUP_DISPLAY_DAYS } from '../../constants/cleanup.constants';
import { useStoryWise } from '../../context/story-wise-context';
import { ProcessIndicatorBadge } from './components/progess-indicator-badge.component';

/**
 * ProgressIndicator - Display processing progress
 */
export function ProgressIndicator() {
	const {
		processingStatus,
		processingProgress,
		processingMode,
		cancelProcessing,
	} = useStoryWise();

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
				<ProcessIndicatorBadge processingMode={processingMode} />
				<span className="loading loading-spinner loading-lg text-primary"></span>
				<div className="flex flex-col items-center gap-3 w-full max-w-xs">
					<p className="text-base text-base-content text-center">{message}</p>
					<progress
						className="progress progress-primary w-full"
						value={progress}
						max="100"
					/>
					<p className="text-sm font-semibold text-base-content/60 tabular-nums">
						{Math.round(progress)}%
					</p>
				</div>
				{processingMode === 'cloud' && (
					<p className="text-xs text-base-content/50 text-center max-w-xs">
						{`Video uploaded to cloud for fast processing. Files are automatically deleted after ${CLEANUP_DISPLAY_DAYS} days.`}
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
