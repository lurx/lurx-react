'use client';

import { useRef, useEffect, useState } from 'react';
import { formatDuration } from '@lurx-react/video-processing';
import { useStoryWise } from '../../context/story-wise-context';

type AspectRatio = 'landscape' | 'portrait' | 'square';

/**
 * VideoPreview - Video player with preview functionality
 */
export function VideoPreview() {
	const { sourceUrl, sourceDuration, segments, selectedSegmentId } =
		useStoryWise();
	const videoRef = useRef<HTMLVideoElement>(null);
	const [currentTime, setCurrentTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [aspectRatio, setAspectRatio] = useState<AspectRatio>('landscape');

	// Get the video URL to display
	const selectedSegment = segments.find(s => s.id === selectedSegmentId);
	const videoUrl = selectedSegment?.blobUrl ?? sourceUrl;
	const duration = selectedSegment?.duration ?? sourceDuration;

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		const handleTimeUpdate = () => {
			setCurrentTime(video.currentTime);
		};

		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);
		const handleEnded = () => setIsPlaying(false);

		const handleLoadedMetadata = () => {
			const { videoWidth, videoHeight } = video;
			if (videoWidth && videoHeight) {
				const ratio = videoWidth / videoHeight;
				if (ratio < 0.9) {
					setAspectRatio('portrait');
				} else if (ratio > 1.1) {
					setAspectRatio('landscape');
				} else {
					setAspectRatio('square');
				}
			}
		};

		video.addEventListener('timeupdate', handleTimeUpdate);
		video.addEventListener('play', handlePlay);
		video.addEventListener('pause', handlePause);
		video.addEventListener('ended', handleEnded);
		video.addEventListener('loadedmetadata', handleLoadedMetadata);

		return () => {
			video.removeEventListener('timeupdate', handleTimeUpdate);
			video.removeEventListener('play', handlePlay);
			video.removeEventListener('pause', handlePause);
			video.removeEventListener('ended', handleEnded);
			video.removeEventListener('loadedmetadata', handleLoadedMetadata);
		};
	}, []);

	// Reset video when URL changes
	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.load();
			setCurrentTime(0);
			setIsPlaying(false);
		}
	}, [videoUrl]);

	const handlePlayPause = () => {
		if (!videoRef.current) return;

		if (isPlaying) {
			videoRef.current.pause();
		} else {
			videoRef.current.play();
		}
	};

	const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = parseFloat(e.target.value);
		if (videoRef.current) {
			videoRef.current.currentTime = time;
			setCurrentTime(time);
		}
	};

	if (!videoUrl) {
		return null;
	}

	// Determine container classes based on aspect ratio
	const containerClasses = {
		landscape: 'aspect-video',
		portrait: 'aspect-[9/16] max-h-[70vh]',
		square: 'aspect-square max-h-[50vh]',
	};

	return (
		<div className={`bg-base-200 rounded-xl overflow-hidden ${aspectRatio === 'portrait' ? 'max-w-sm mx-auto' : 'w-full'}`}>
			<div className={`relative bg-black flex items-center justify-center ${containerClasses[aspectRatio]}`}>
				<video
					ref={videoRef}
					className="w-full h-full object-contain"
					src={videoUrl}
					playsInline
				/>
			</div>
			<div className="flex items-center gap-4 p-4 bg-base-300">
				<button
					type="button"
					className="btn btn-circle btn-primary btn-sm"
					onClick={handlePlayPause}
					aria-label={isPlaying ? 'Pause' : 'Play'}
				>
					{isPlaying ? (
						<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
							<rect x="6" y="4" width="4" height="16" />
							<rect x="14" y="4" width="4" height="16" />
						</svg>
					) : (
						<svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
							<polygon points="5,3 19,12 5,21" />
						</svg>
					)}
				</button>
				<input
					type="range"
					className="range range-primary range-xs flex-1"
					min={0}
					max={duration || 100}
					step={0.1}
					value={currentTime}
					onChange={handleSeek}
				/>
				<span className="text-sm text-base-content/60 tabular-nums whitespace-nowrap">
					{formatDuration(currentTime)} / {formatDuration(duration)}
				</span>
			</div>
			{selectedSegment && (
				<div className="px-4 py-3 text-sm text-base-content/60 bg-base-200 border-t border-base-300">
					Previewing: Segment {selectedSegment.index + 1} (
					{formatDuration(selectedSegment.startTime)} -{' '}
					{formatDuration(selectedSegment.endTime)})
				</div>
			)}
		</div>
	);
}
