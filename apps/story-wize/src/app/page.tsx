'use client';

import { useStoryWize } from './context/story-wize-context';
import { VideoUploader } from './components/video-uploader/video-uploader';
import { VideoPreview } from './components/video-preview/video-preview';
import { SegmentList } from './components/segment-list/segment-list';
import { ProgressIndicator } from './components/progress-indicator/progress-indicator';
import { formatDuration } from '@lurx-react/video-processing';

export default function StoryWizePage() {
	const {
		sourceFile,
		sourceUrl,
		sourceDuration,
		processingStatus,
		processingError,
		segments,
		segmentDuration,
		setSegmentDuration,
		startProcessing,
		reset,
	} = useStoryWize();

	const isProcessing =
		processingStatus === 'loading-ffmpeg' ||
		processingStatus === 'analyzing' ||
		processingStatus === 'splitting';

	const hasVideo = sourceUrl !== null;
	const hasSegments = segments.length > 0;

	return (
		<main className="min-h-screen p-8 bg-base-100">
			<div className="max-w-5xl mx-auto">
				<header className="text-center mb-12">
					<h1 className="text-4xl font-bold text-base-content mb-2">
						Story Wize
					</h1>
					<p className="text-lg text-base-content/60">
						Split your videos into 45-second clips for stories
					</p>
				</header>

				{!hasVideo && !isProcessing && (
					<section className="max-w-xl mx-auto">
						<VideoUploader />
					</section>
				)}

				{hasVideo && !isProcessing && !hasSegments && (
					<section className="flex flex-col gap-6 max-w-3xl mx-auto">
						<VideoPreview />
						{processingError && (
							<div className="alert alert-error">
								<svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								<div>
									<p>{processingError.message}</p>
									{processingError.suggestion && (
										<p className="text-sm opacity-70">{processingError.suggestion}</p>
									)}
								</div>
							</div>
						)}
						<div className="card bg-base-200 p-6">
							<div className="form-control mb-4">
								<label htmlFor="segmentDuration" className="label">
									<span className="label-text font-medium">Segment Duration</span>
								</label>
								<div className="flex items-center gap-2">
									<input
										id="segmentDuration"
										type="number"
										min={5}
										max={120}
										value={segmentDuration}
										onChange={e =>
											setSegmentDuration(parseInt(e.target.value) || 45)
										}
										className="input input-bordered w-24 tabular-nums"
									/>
									<span className="text-sm text-base-content/60">seconds</span>
								</div>
							</div>
							<div className="flex flex-wrap gap-4 text-sm text-base-content/60 mb-6">
								<p>
									Video duration: <strong className="text-base-content">{formatDuration(sourceDuration)}</strong>
								</p>
								<p>
									Will create{' '}
									<strong className="text-base-content">
										{Math.ceil(sourceDuration / segmentDuration)} segments
									</strong>
								</p>
							</div>
							<div className="flex flex-wrap gap-4 justify-end">
								<button
									type="button"
									className="btn btn-outline"
									onClick={reset}
								>
									Choose Different Video
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={startProcessing}
								>
									Split Video
								</button>
							</div>
						</div>
					</section>
				)}

				{isProcessing && (
					<section className="max-w-xl mx-auto">
						<ProgressIndicator />
					</section>
				)}

				{hasSegments && processingStatus === 'complete' && (
					<section className="flex flex-col gap-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
							<div className="min-w-0">
								<VideoPreview />
							</div>
							<div className="min-w-0">
								<SegmentList />
							</div>
						</div>
						<div className="flex justify-center">
							<button
								type="button"
								className="btn btn-outline"
								onClick={reset}
							>
								Start Over
							</button>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}
