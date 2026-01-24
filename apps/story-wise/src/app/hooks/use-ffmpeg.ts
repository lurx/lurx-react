'use client';

import { useState, useCallback, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { VideoMetadata, VideoSegment } from '@lurx-react/video-processing';
import {
	buildSegmentArgs,
	generateSegmentFilename,
	parseDuration,
	parseDimensions,
	parseFrameRate,
	createDefaultMetadata,
} from '@lurx-react/video-processing';

/**
 * Options for splitting a video
 */
interface SplitVideoOptions {
	inputFile: File;
	segmentDuration: number;
	outputFormat: 'mp4' | 'webm';
	quality: 'high' | 'medium' | 'low';
	onProgress?: (
		progress: number,
		currentSegment: number,
		totalSegments: number,
	) => void;
}

/**
 * Return type for the useFFmpeg hook
 */
interface UseFFmpegReturn {
	/** Whether FFmpeg is loaded and ready */
	isLoaded: boolean;
	/** Whether FFmpeg is currently loading */
	isLoading: boolean;
	/** Error that occurred during loading */
	loadError: Error | null;
	/** Current progress (0-100) */
	progress: number;
	/** Load FFmpeg.wasm */
	load: () => Promise<void>;
	/** Split a video into segments */
	splitVideo: (options: SplitVideoOptions) => Promise<VideoSegment[]>;
	/** Get video metadata */
	getMetadata: (file: File) => Promise<VideoMetadata>;
	/** Terminate FFmpeg */
	terminate: () => void;
}

/**
 * Hook for FFmpeg.wasm integration
 */
export function useFFmpeg(): UseFFmpegReturn {
	const ffmpegRef = useRef<FFmpeg | null>(null);
	const isLoadedRef = useRef(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState<Error | null>(null);
	const [progress, setProgress] = useState(0);

	const load = useCallback(async () => {
		if (ffmpegRef.current && isLoadedRef.current) {
			return;
		}

		setIsLoading(true);
		setLoadError(null);

		try {
			const ffmpeg = new FFmpeg();
			ffmpegRef.current = ffmpeg;

			ffmpeg.on('progress', ({ progress: p }) => {
				setProgress(Math.round(p * 100));
			});

			// Log FFmpeg messages for debugging
			ffmpeg.on('log', ({ message }) => {
				console.log('[FFmpeg]', message);
			});

			// Load FFmpeg.wasm from CDN using UMD version (more compatible)
			const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

			console.log('[FFmpeg] Loading from CDN...');
			await ffmpeg.load({
				coreURL: `${baseURL}/ffmpeg-core.js`,
				wasmURL: `${baseURL}/ffmpeg-core.wasm`,
			});

			console.log('[FFmpeg] Loaded successfully');
			isLoadedRef.current = true;
			setIsLoaded(true);
		} catch (error) {
			console.error('[FFmpeg] Load error:', error);
			setLoadError(
				error instanceof Error ? error : new Error('Failed to load FFmpeg'),
			);
			throw error;
		} finally {
			setIsLoading(false);
		}
	}, []);

	const getMetadata = useCallback(
		async (file: File): Promise<VideoMetadata> => {
			if (!ffmpegRef.current || !isLoadedRef.current) {
				throw new Error('FFmpeg is not loaded');
			}

			const ffmpeg = ffmpegRef.current;
			const metadata = createDefaultMetadata();

			// Write input file
			await ffmpeg.writeFile('input', await fetchFile(file));

			// Get metadata using ffprobe-like approach
			// We'll use a quick conversion to extract info
			let output = '';
			ffmpeg.on('log', ({ message }) => {
				output += message + '\n';
			});

			try {
				// Run a quick probe by attempting to get file info
				await ffmpeg.exec(['-i', 'input', '-f', 'null', '-']);
			} catch {
				// FFmpeg returns non-zero for probe, but output contains the info
			}

			// Parse duration
			const durationMatch = output.match(/Duration:\s*(\d{2}:\d{2}:\d{2}\.\d+)/);
			if (durationMatch) {
				metadata.duration = parseDuration(durationMatch[1]);
			}

			// Parse dimensions
			const dimensions = parseDimensions(output);
			if (dimensions) {
				metadata.width = dimensions.width;
				metadata.height = dimensions.height;
			}

			// Parse frame rate
			metadata.frameRate = parseFrameRate(output);

			// Check for audio
			metadata.hasAudio = output.toLowerCase().includes('audio:');

			// Clean up
			await ffmpeg.deleteFile('input');

			return metadata;
		},
		[],
	);

	const splitVideo = useCallback(
		async (options: SplitVideoOptions): Promise<VideoSegment[]> => {
			if (!ffmpegRef.current || !isLoadedRef.current) {
				throw new Error('FFmpeg is not loaded');
			}

			const { inputFile, segmentDuration, outputFormat, quality, onProgress } =
				options;
			const ffmpeg = ffmpegRef.current;
			const segments: VideoSegment[] = [];

			console.log('[FFmpeg] Writing input file...');
			// Write input file
			await ffmpeg.writeFile('input', await fetchFile(inputFile));

			// Get metadata to calculate segments
			console.log('[FFmpeg] Getting metadata...');
			const metadata = await getMetadata(inputFile);
			console.log('[FFmpeg] Metadata:', metadata);
			const totalSegments = Math.ceil(metadata.duration / segmentDuration);
			console.log('[FFmpeg] Total segments to create:', totalSegments);

			// Re-write input file since getMetadata deleted it
			await ffmpeg.writeFile('input', await fetchFile(inputFile));

			// Set up progress handler for granular updates
			let currentSegmentIndex = 0;
			const progressHandler = ({ progress: p }: { progress: number }) => {
				if (onProgress && totalSegments > 0) {
					// Calculate overall progress: completed segments + current segment progress
					const completedProgress = (currentSegmentIndex / totalSegments) * 100;
					const currentSegmentProgress = (p * 100) / totalSegments;
					const overallProgress = Math.min(99, completedProgress + currentSegmentProgress);
					onProgress(overallProgress, currentSegmentIndex + 1, totalSegments);
				}
			};
			ffmpeg.on('progress', progressHandler);

			// Process each segment
			for (let i = 0; i < totalSegments; i++) {
				currentSegmentIndex = i;
				const startTime = i * segmentDuration;
				const actualDuration = Math.min(
					segmentDuration,
					metadata.duration - startTime,
				);
				const outputName = generateSegmentFilename(i, outputFormat);

				// Build FFmpeg arguments
				const args = buildSegmentArgs({
					startTime,
					segmentDuration: actualDuration,
					outputFormat,
					quality,
					outputName,
				});

				console.log('[FFmpeg] Executing segment', i + 1, 'with args:', args);

				// Execute FFmpeg
				await ffmpeg.exec(args);

				// Read output file
				const data = await ffmpeg.readFile(outputName);
				const uint8Array =
					data instanceof Uint8Array ? data : new Uint8Array();

				console.log('[FFmpeg] Segment', i + 1, 'size:', uint8Array.length);

				// Create blob URL
				const blob = new Blob([uint8Array], {
					type: outputFormat === 'mp4' ? 'video/mp4' : 'video/webm',
				});
				const blobUrl = URL.createObjectURL(blob);

				// Create segment
				const segment: VideoSegment = {
					id: `segment-${i}`,
					index: i,
					startTime,
					endTime: startTime + actualDuration,
					duration: actualDuration,
					data: uint8Array,
					blobUrl,
					status: 'ready',
					fileSize: uint8Array.length,
				};

				segments.push(segment);

				// Clean up output file
				await ffmpeg.deleteFile(outputName);

				// Report segment completion
				if (onProgress) {
					onProgress(((i + 1) / totalSegments) * 100, i + 1, totalSegments);
				}
			}

			// Remove progress handler
			ffmpeg.off('progress', progressHandler);

			// Clean up input file
			await ffmpeg.deleteFile('input');

			console.log('[FFmpeg] Split complete, created', segments.length, 'segments');
			return segments;
		},
		[getMetadata],
	);

	const terminate = useCallback(() => {
		if (ffmpegRef.current) {
			ffmpegRef.current.terminate();
			ffmpegRef.current = null;
			isLoadedRef.current = false;
			setIsLoaded(false);
			setProgress(0);
		}
	}, []);

	return {
		isLoaded,
		isLoading,
		loadError,
		progress,
		load,
		splitVideo,
		getMetadata,
		terminate,
	};
}
