'use client';

import React, {
	createContext,
	useContext,
	useCallback,
	useState,
	useRef,
	useEffect,
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
	StoryWiseContextType,
	ProcessingStatus,
	ProcessingMode,
	ServiceStatus,
} from '../types/story-wise.types';
import { DEFAULT_SEGMENT_DURATION } from '../types/story-wise.types';
import { useFFmpeg } from '../hooks/use-ffmpeg';

const StoryWiseContext = createContext<StoryWiseContextType | undefined>(
	undefined,
);

/**
 * Provider for the story wise context
 */
export function StoryWiseProvider({ children }: PropsWithChildren) {
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
	const [processingMode, setProcessingMode] = useState<ProcessingMode>(null);
	const [segments, setSegments] = useState<VideoSegment[]>([]);
	const [segmentDuration, setSegmentDurationState] = useState(
		DEFAULT_SEGMENT_DURATION,
	);
	const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(
		null,
	);
	const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
		online: true,
	});

	// Ref for cancellation
	const cancelledRef = useRef(false);
	// Track if user manually changed segment duration
	const userChangedDurationRef = useRef(false);
	// Cloud session ID for cleanup
	const cloudSessionIdRef = useRef<string | null>(null);
	// Track downloaded segments for cleanup after all downloaded
	const downloadedSegmentsRef = useRef<Set<string>>(new Set());

	// Cleanup cloud session files
	const cleanupCloudSession = useCallback((sessionId: string | null) => {
		if (!sessionId) return;

		console.log('[Client] Cleaning up cloud session:', sessionId);

		// Use sendBeacon for reliability (works even when page is closing)
		const cleanupUrl = `/api/cleanup/${sessionId}`;
		const sent = navigator.sendBeacon(cleanupUrl);

		if (!sent) {
			// Fallback to fetch if sendBeacon fails
			fetch(cleanupUrl, { method: 'POST', keepalive: true }).catch(() => {
				// Ignore errors during cleanup
			});
		}
	}, []);

	// Cleanup on page unload
	useEffect(() => {
		const handleBeforeUnload = () => {
			if (cloudSessionIdRef.current) {
				cleanupCloudSession(cloudSessionIdRef.current);
				cloudSessionIdRef.current = null;
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			// Also cleanup on unmount
			if (cloudSessionIdRef.current) {
				cleanupCloudSession(cloudSessionIdRef.current);
			}
		};
	}, [cleanupCloudSession]);

	// Check service status on mount
	useEffect(() => {
		const checkStatus = async () => {
			try {
				const response = await fetch('/api/status');
				const status = await response.json();
				if (!status.online) {
					setServiceStatus({
						online: false,
						reason: status.reason || 'maintenance',
						message: status.message,
					});
				}
			} catch {
				// If status check fails, assume online
			}
		};
		checkStatus();
	}, []);

	// Helper to detect quota exceeded errors
	const isQuotaError = useCallback((error: unknown): boolean => {
		if (error instanceof Error) {
			const message = error.message.toLowerCase();
			return (
				message.includes('quota') ||
				message.includes('limit') ||
				message.includes('exceeded') ||
				message.includes('too many requests') ||
				message.includes('rate limit')
			);
		}
		return false;
	}, []);

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

		// Reset user changed flag when loading new video
		userChangedDurationRef.current = false;

		// Get video duration from the video element
		const video = document.createElement('video');
		video.preload = 'metadata';
		video.onloadedmetadata = () => {
			const duration = video.duration;
			setSourceDuration(duration);

			// Smart segment duration: if video is shorter than default,
			// calculate duration for 2 segments (unless user changed it)
			if (!userChangedDurationRef.current && duration < DEFAULT_SEGMENT_DURATION) {
				// For short videos, split into 2 segments (minimum 1 second each)
				const smartDuration = Math.max(1, Math.floor(duration / 2));
				setSegmentDurationState(smartDuration);
			} else if (!userChangedDurationRef.current) {
				// Reset to default for longer videos
				setSegmentDurationState(DEFAULT_SEGMENT_DURATION);
			}
		};
		video.src = url;
	}, [sourceUrl]);

	// Cloud processing function
	const processWithCloud = useCallback(async (file: File): Promise<void> => {
		console.log('[Client] Starting cloud processing...', { fileName: file.name, fileSize: file.size });

		// Upload video
		setProcessingStatus('analyzing');
		setProcessingProgress({
			stage: 'analyzing',
			progress: 0,
			message: 'Uploading video...',
		});

		console.log('[Client] Uploading to R2...');
		const formData = new FormData();
		formData.append('video', file);

		const uploadStartTime = Date.now();
		const uploadResponse = await fetch('/api/upload', {
			method: 'POST',
			body: formData,
		});

		if (!uploadResponse.ok) {
			const error = await uploadResponse.json();
			console.error('[Client] ✗ Upload failed:', error);
			throw new Error(error.error || 'Upload failed');
		}

		const uploadResult = await uploadResponse.json();
		const uploadDuration = Date.now() - uploadStartTime;
		console.log('[Client] ✓ Upload complete:', { sessionId: uploadResult.sessionId, duration: `${uploadDuration}ms` });

		const { sessionId } = uploadResult;

		// Store session ID for cleanup
		cloudSessionIdRef.current = sessionId;
		downloadedSegmentsRef.current = new Set();

		if (cancelledRef.current) return;

		// Process video
		setProcessingStatus('splitting');
		setProcessingProgress({
			stage: 'splitting',
			progress: 10,
			message: 'Processing video...',
		});

		console.log('[Client] Starting video processing...', { sessionId, segmentDuration });
		const processStartTime = Date.now();
		const processResponse = await fetch('/api/process', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				sessionId,
				segmentDuration,
				outputFormat: 'mp4',
				quality: 'medium',
			}),
		});

		if (!processResponse.ok) {
			const error = await processResponse.json();
			console.error('[Client] ✗ Processing failed:', error);
			throw new Error(error.error || error.message || 'Processing failed');
		}

		const processResult = await processResponse.json();
		const processDuration = Date.now() - processStartTime;
		console.log('[Client] ✓ Processing complete:', {
			totalSegments: processResult.totalSegments,
			duration: processResult.duration,
			processingTime: `${processDuration}ms`
		});

		if (cancelledRef.current) return;

		// Convert to VideoSegment format
		const newSegments: VideoSegment[] = processResult.segments.map(
			(seg: { index: number; startTime: number; endTime: number; duration: number; downloadUrl: string }) => ({
				id: `segment-${seg.index}`,
				index: seg.index,
				startTime: seg.startTime,
				endTime: seg.endTime,
				duration: seg.duration,
				data: undefined, // Cloud segments don't have data, use downloadUrl
				blobUrl: seg.downloadUrl,
				status: 'ready' as const,
				fileSize: undefined,
			}),
		);

		setSegments(newSegments);
		setSourceDuration(processResult.duration);
		setProcessingStatus('complete');
		setProcessingProgress({
			stage: 'finalizing',
			progress: 100,
			totalSegments: processResult.totalSegments,
			message: `Created ${processResult.totalSegments} segments`,
		});

		console.log('[Client] ✓ All segments ready:', { count: newSegments.length });
	}, [segmentDuration]);

	// Client-side processing function
	const processWithClient = useCallback(async (file: File): Promise<void> => {
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

		const metadata = await getMetadata(file);
		setSourceMetadata(metadata);
		setSourceDuration(metadata.duration);

		if (cancelledRef.current) return;

		// Split video
		setProcessingStatus('splitting');
		const totalSegments = Math.ceil(metadata.duration / segmentDuration);

		const newSegments = await splitVideo({
			inputFile: file,
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
	}, [isLoaded, load, getMetadata, splitVideo, segmentDuration]);

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
			// Try cloud processing first (fast, server-side FFmpeg)
			// Falls back to client-side FFmpeg.wasm if cloud is unavailable
			try {
				setProcessingMode('cloud');
				console.log('[Client] Attempting cloud processing...');
				await processWithCloud(sourceFile);
				console.log('[Client] ✓ Cloud processing successful');
			} catch (cloudError) {
				// Check if this is a quota error
				if (isQuotaError(cloudError)) {
					console.error('[Client] ✗ Quota exceeded, going offline');
					setServiceStatus({
						online: false,
						reason: 'quota_exceeded',
						message: 'Free usage limit reached. Please try again later.',
					});
					setProcessingStatus('idle');
					setProcessingMode(null);
					return;
				}

				console.warn('[Client] Cloud processing failed, falling back to client-side:', cloudError);
				setProcessingMode('client');
				console.log('[Client] Starting client-side processing with FFmpeg.wasm...');
				await processWithClient(sourceFile);
				console.log('[Client] ✓ Client-side processing successful');
			}
		} catch (error) {
			console.error('[Client] ✗ Processing failed:', error);

			// Check if this is a quota error
			if (isQuotaError(error)) {
				setServiceStatus({
					online: false,
					reason: 'quota_exceeded',
					message: 'Free usage limit reached. Please try again later.',
				});
				setProcessingStatus('idle');
				setProcessingMode(null);
				return;
			}

			if (!cancelledRef.current) {
				setProcessingStatus('error');
				setProcessingMode(null);
				setProcessingError({
					code: 'PROCESSING_FAILED',
					message:
						error instanceof Error ? error.message : 'Processing failed',
					recoverable: true,
					suggestion: 'Try with a smaller file or different format',
				});
			}
		}
	}, [sourceFile, processWithCloud, processWithClient, isQuotaError]);

	const cancelProcessing = useCallback(() => {
		cancelledRef.current = true;
		terminate();
		setProcessingStatus('idle');
		setProcessingProgress(null);
		setProcessingMode(null);
	}, [terminate]);

	const downloadSegment = useCallback(
		async (segmentId: string) => {
			const segment = segments.find(s => s.id === segmentId);
			if (!segment) return;

			// If segment has data (client-side), download directly
			if (segment.data) {
				const blob = new Blob([segment.data], { type: 'video/mp4' });
				const filename = sourceFile
					? `${sourceFile.name.replace(/\.[^/.]+$/, '')}_${formatDuration(segment.startTime)}-${formatDuration(segment.endTime)}.mp4`
					: `segment_${segment.index + 1}.mp4`;

				saveAs(blob, filename);
				return;
			}

			// If segment has blobUrl (cloud), fetch and download
			if (segment.blobUrl) {
				try {
					const response = await fetch(segment.blobUrl);
					const blob = await response.blob();
					const filename = sourceFile
						? `${sourceFile.name.replace(/\.[^/.]+$/, '')}_${formatDuration(segment.startTime)}-${formatDuration(segment.endTime)}.mp4`
						: `segment_${segment.index + 1}.mp4`;

					saveAs(blob, filename);

					// Track download for cloud cleanup
					if (cloudSessionIdRef.current) {
						downloadedSegmentsRef.current.add(segmentId);

						// If all segments downloaded, cleanup cloud storage
						if (downloadedSegmentsRef.current.size === segments.length) {
							console.log('[Client] All segments downloaded, cleaning up cloud storage...');
							cleanupCloudSession(cloudSessionIdRef.current);
							cloudSessionIdRef.current = null;
						}
					}
				} catch (error) {
					console.error('Download error:', error);
					setProcessingError({
						code: 'PROCESSING_FAILED',
						message: 'Failed to download segment',
						recoverable: true,
					});
				}
			}
		},
		[segments, sourceFile, cleanupCloudSession],
	);

	const downloadAllSegments = useCallback(async () => {
		for (let index = 0; index < segments.length; index++) {
			const segment = segments[index];

			// If segment has data (client-side), download directly
			if (segment.data) {
				const blob = new Blob([segment.data], { type: 'video/mp4' });
				const filename = sourceFile
					? `${sourceFile.name.replace(/\.[^/.]+$/, '')}_part${index + 1}.mp4`
					: `segment_${index + 1}.mp4`;

				// Add slight delay between downloads to prevent browser blocking
				setTimeout(() => saveAs(blob, filename), index * 500);
				continue;
			}

			// If segment has blobUrl (cloud), fetch and download
			if (segment.blobUrl) {
				try {
					const response = await fetch(segment.blobUrl);
					const blob = await response.blob();
					const filename = sourceFile
						? `${sourceFile.name.replace(/\.[^/.]+$/, '')}_part${index + 1}.mp4`
						: `segment_${index + 1}.mp4`;

					// Add slight delay between downloads
					setTimeout(() => saveAs(blob, filename), index * 500);
				} catch (error) {
					console.error(`Download error for segment ${index}:`, error);
				}
			}
		}

		// Cleanup cloud storage after all downloads initiated
		if (cloudSessionIdRef.current) {
			// Wait for downloads to complete before cleanup
			setTimeout(() => {
				if (cloudSessionIdRef.current) {
					console.log('[Client] All downloads initiated, cleaning up cloud storage...');
					cleanupCloudSession(cloudSessionIdRef.current);
					cloudSessionIdRef.current = null;
				}
			}, segments.length * 500 + 1000);
		}
	}, [segments, sourceFile, cleanupCloudSession]);

	const setSegmentDuration = useCallback((duration: number) => {
		userChangedDurationRef.current = true;
		setSegmentDurationState(duration);
	}, []);

	const selectSegment = useCallback((segmentId: string | null) => {
		setSelectedSegmentId(segmentId);
	}, []);

	const reset = useCallback(() => {
		// Cleanup cloud session if exists
		if (cloudSessionIdRef.current) {
			cleanupCloudSession(cloudSessionIdRef.current);
			cloudSessionIdRef.current = null;
		}
		downloadedSegmentsRef.current = new Set();

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
		setProcessingMode(null);
		setSegments([]);
		setSegmentDurationState(DEFAULT_SEGMENT_DURATION);
		userChangedDurationRef.current = false;
		setSelectedSegmentId(null);
		cancelledRef.current = false;
	}, [sourceUrl, segments, cleanupCloudSession]);

	const contextValue: StoryWiseContextType = {
		// State
		sourceFile,
		sourceUrl,
		sourceDuration,
		sourceMetadata,
		processingStatus,
		processingProgress,
		processingError,
		processingMode,
		segments,
		segmentDuration,
		selectedSegmentId,
		serviceStatus,
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
		<StoryWiseContext.Provider value={contextValue}>
			{children}
		</StoryWiseContext.Provider>
	);
}

/**
 * Hook to access the story wise context
 */
export function useStoryWise(): StoryWiseContextType {
	const context = useContext(StoryWiseContext);
	if (!context) {
		throw new Error(
			'useStoryWise must be used within a <StoryWiseProvider>',
		);
	}
	return context;
}
