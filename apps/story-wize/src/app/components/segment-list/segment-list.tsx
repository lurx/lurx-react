'use client';

import { formatDuration, formatFileSize } from '@lurx-react/video-processing';
import { useStoryWize } from '../../context/story-wize-context';

/**
 * SegmentList - Display list of video segments with download options
 */
export function SegmentList() {
	const {
		segments,
		selectedSegmentId,
		selectSegment,
		downloadSegment,
		downloadAllSegments,
		processingStatus,
	} = useStoryWize();

	if (segments.length === 0) {
		return null;
	}

	return (
		<div className="w-full">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-xl font-semibold text-base-content">
					Segments ({segments.length})
				</h2>
				<button
					type="button"
					className="btn btn-primary btn-sm gap-2"
					onClick={downloadAllSegments}
					disabled={processingStatus !== 'complete'}
				>
					<svg
						className="w-4 h-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					Download All
				</button>
			</div>
			<ul className="flex flex-col gap-2">
				{segments.map(segment => (
					<li
						key={segment.id}
						className={`flex items-center gap-2 p-3 rounded-lg bg-base-200 border transition-all ${
							selectedSegmentId === segment.id
								? 'border-primary bg-base-300'
								: 'border-base-content/10 hover:border-primary'
						}`}
					>
						<button
							type="button"
							className="flex-1 flex items-center justify-between p-0 border-none bg-transparent text-inherit cursor-pointer text-left"
							onClick={() =>
								selectSegment(
									selectedSegmentId === segment.id ? null : segment.id,
								)
							}
						>
							<div className="flex flex-col gap-1">
								<span className="font-semibold text-base-content">
									Part {segment.index + 1}
								</span>
								<span className="text-sm text-base-content/60 tabular-nums">
									{formatDuration(segment.startTime)} -{' '}
									{formatDuration(segment.endTime)}
								</span>
							</div>
							<div className="flex flex-col items-end gap-1">
								<span className="text-sm font-medium text-base-content tabular-nums">
									{formatDuration(segment.duration)}
								</span>
								{segment.fileSize && (
									<span className="text-xs text-base-content/60">
										{formatFileSize(segment.fileSize)}
									</span>
								)}
							</div>
						</button>
						<button
							type="button"
							className="btn btn-ghost btn-square btn-sm"
							onClick={() => downloadSegment(segment.id)}
							disabled={segment.status !== 'ready'}
							aria-label={`Download segment ${segment.index + 1}`}
						>
							<svg
								className="w-5 h-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="7 10 12 15 17 10" />
								<line x1="12" y1="15" x2="12" y2="3" />
							</svg>
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
