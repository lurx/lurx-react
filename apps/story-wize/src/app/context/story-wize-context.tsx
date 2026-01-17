'use client';

import React, {
	createContext,
	useContext,
	useCallback,
	useState,
	useRef,
	type PropsWithChildren,
} from 'react';
import { saveAs } from 'file-saver';
import type {
	VideoMetadata,
	VideoSegment,
	ProcessingProgress,
	ProcessingError,
} from '@lurx-react/video-processing';
import { validateVideoFile, formatDuration } from '@lurx-react/video-processing';
import type {
	StoryWizeContextType,
	ProcessingStatus,
} from '../types/story-wize.types';
import { DEFAULT_SEGMENT_DURATION } from '../types/story-wize.types';
import { useFFmpeg } from '../hooks/use-ffmpeg';

const StoryWizeContext = createContext<StoryWizeContextType | undefined>(
	undefined,
);

/**
 * Provider for the story wize context
 */
export function StoryWizeProvider({ children }: PropsWithChildren) {
	// FFmpeg hook
	const { load, splitVideo, getMetadata, isLoaded, terminate } = useFFmpeg();

	// State
	const [sourceFile, setSourceFileState] = useState<File | null>(null);
	const [sourceUrl, setSourceUrl] = useState<string | null>(null);
	const [sourceDuration, setSourceDuration] = useState(0);
	const [sourceMetadata, setSourceMetadata] = useState<VideoMetadata | null>(
		null,
	);
	const [processingStatus, setProcessingStatus] =
		useState<ProcessingStatus>('idle');
	const [processingProgress, setProcessingProgress] =
		useState<ProcessingProgress | null>(null);
	const [processingError, setProcessingError] =
		useState<ProcessingError | null>(null);
	const [segments, setSegments] = useState<VideoSegment[]>([]);
	const [segmentDuration, setSegmentDurationState] = useState(
		DEFAULT_SEGMENT_DURATION,
	);
	const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
		null,
	);

	// Ref for cancellation
	const cancelledRef = useRef(false);

	const setSourceFile = useCallback((file: File) => {
		// Validate file
		const validation = validateVideoFile(file);
		if (!validation.isValid) {
			setProcessingError({
				code: 'INVALID_FORMAT',
				message: validation.errors[0]?.message || 'Invalid file',
				recoverable: true,
			});
			return;
		}

		// Revoke previous URL
		if (sourceUrl) {
			URL.revokeObjectURL(sourceUrl);
		}

		// Create new URL
		const url = URL.createObjectURL(file);
		setSourceFileState(file);
		setSourceUrl(url);
		setProcessingError(null);
		setSegments([]);
		setProcessingStatus('idle');

		// Get video duration from the video element
		const video = document.createElement('video');
		video.preload = 'metadata';
		video.onloadedmetadata = () => {
			setSourceDuration(video.duration);
		};
		video.src = url;
	}, [sourceUrl]);

	const startProcessing = useCallback(async () => {
		if (!sourceFile) {
			setProcessingError({
				code: 'PROCESSING_FAILED',
				message: 'No file selected',
				recoverable: true,
			});
			return;
		}

		cancelledRef.current = false;
		setProcessingError(null);
		setSegments([]);

		try {
			// Load FFmpeg if not loaded
			if (!isLoaded) {
				setProcessingStatus('loading-ffmpeg');
				setProcessingProgress({
					stage: 'loading',
					progress: 0,
					message: 'Loading video processor...',
				});
				await load();
			}

			if (cancelledRef.current) return;

			// Analyze video
			setProcessingStatus('analyzing');
			setProcessingProgress({
				stage: 'analyzing',
				progress: 0,
				message: 'Analyzing video...',
			});

			const metadata = await getMetadata(sourceFile);
			setSourceMetadata(metadata);
			setSourceDuration(metadata.duration);

			if (cancelledRef.current) return;

			// Split video
			setProcessingStatus('splitting');
			const totalSegments = Math.ceil(metadata.duration / segmentDuration);

			const newSegments = await splitVideo({
				inputFile: sourceFile,
				segmentDuration,
				outputFormat: 'mp4',
				quality: 'medium',
				onProgress: (progress, currentSegment, total) => {
					if (!cancelledRef.current) {
						setProcessingProgress({
							stage: 'splitting',
							progress,
							currentSegment,
							totalSegments: total,
							message: `Processing segment ${currentSegment} of ${total}...`,
						});
					}
				},
			});

			if (cancelledRef.current) {
				// Clean up segments if cancelled
				newSegments.forEach(segment => {
					if (segment.blobUrl) {
						URL.revokeObjectURL(segment.blobUrl);
					}
				});
				return;
			}

			setSegments(newSegments);
			setProcessingStatus('complete');
			setProcessingProgress({
				stage: 'finalizing',
				progress: 100,
				totalSegments,
				message: `Created ${totalSegments} segments`,
			});
		} catch (error) {
			if (!cancelledRef.current) {
				setProcessingStatus('error');
				setProcessingError({
					code: 'PROCESSING_FAILED',
					message:
						error instanceof Error ? error.message : 'Processing failed',
					recoverable: true,
					suggestion: 'Try with a smaller file or different format',
				});
			}
		}
	}, [sourceFile, isLoaded, load, getMetadata, splitVideo, segmentDuration]);

	const cancelProcessing = useCallback(() => {
		cancelledRef.current = true;
		terminate();
		setProcessingStatus('idle');
		setProcessingProgress(null);
	}, [terminate]);

	const downloadSegment = useCallback(
		(segmentId: string) => {
			const segment = segments.find(s => s.id === segmentId);
			if (!segment || !segment.data) return;

			const blob = new Blob([segment.data], { type: 'video/mp4' });
			const filename = sourceFile
				? `${sourceFile.name.replace(/\.[^/.]+$/, '')}_${formatDuration(segment.startTime)}-${formatDuration(segment.endTime)}.mp4`
				: `segment_${segment.index + 1}.mp4`;

			saveAs(blob, filename);
		},
		[segments, sourceFile],
	);

	const downloadAllSegments = useCallback(() => {
		segments.forEach((segment, index) => {
			if (segment.data) {
				const blob = new Blob([segment.data], { type: 'video/mp4' });
				const filename = sourceFile
					? `${sourceFile.name.replace(/\.[^/.]+$/, '')}_part${index + 1}.mp4`
					: `segment_${index + 1}.mp4`;

				// Add slight delay between downloads to prevent browser blocking
				setTimeout(() => saveAs(blob, filename), index * 500);
			}
		});
	}, [segments, sourceFile]);

	const setSegmentDuration = useCallback((duration: number) => {
		setSegmentDurationState(duration);
	}, []);

	const selectSegment = useCallback((segmentId: string | null) => {
		setSelectedSegmentId(segmentId);
	}, []);

	const reset = useCallback(() => {
		// Revoke URLs
		if (sourceUrl) {
			URL.revokeObjectURL(sourceUrl);
		}
		segments.forEach(segment => {
			if (segment.blobUrl) {
				URL.revokeObjectURL(segment.blobUrl);
			}
		});

		// Reset state
		setSourceFileState(null);
		setSourceUrl(null);
		setSourceDuration(0);
		setSourceMetadata(null);
		setProcessingStatus('idle');
		setProcessingProgress(null);
		setProcessingError(null);
		setSegments([]);
		setSelectedSegmentId(null);
		cancelledRef.current = false;
	}, [sourceUrl, segments]);

	const contextValue: StoryWizeContextType = {
		// State
		sourceFile,
		sourceUrl,
		sourceDuration,
		sourceMetadata,
		processingStatus,
		processingProgress,
		processingError,
		segments,
		segmentDuration,
		selectedSegmentId,
		// Actions
		setSourceFile,
		startProcessing,
		cancelProcessing,
		downloadSegment,
		downloadAllSegments,
		setSegmentDuration,
		selectSegment,
		reset,
	};

	return (
		<StoryWizeContext.Provider value={contextValue}>
			{children}
		</StoryWizeContext.Provider>
	);
}

/**
 * Hook to access the story wize context
 */
export function useStoryWize(): StoryWizeContextType {
	const context = useContext(StoryWizeContext);
	if (!context) {
		throw new Error(
			'useStoryWize must be used within a <StoryWizeProvider>',
		);
	}
	return context;
}
