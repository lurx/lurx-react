'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useStoryWise } from '../../context/story-wise-context';

/**
 * VideoUploader - Drag and drop video file upload component
 */
export function VideoUploader() {
	const { setSourceFile, processingStatus, processingError } =
		useStoryWise();
	const [isPicking, setIsPicking] = useState(false);

	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			setIsPicking(false);
			if (acceptedFiles.length > 0) {
				setSourceFile(acceptedFiles[0]);
			}
		},
		[setSourceFile],
	);

	const onFileDialogOpen = useCallback(() => {
		setIsPicking(true);
	}, []);

	const onFileDialogCancel = useCallback(() => {
		setIsPicking(false);
	}, []);

	const { getRootProps, getInputProps, isDragActive, isDragReject } =
		useDropzone({
			onDrop,
			onFileDialogOpen,
			onFileDialogCancel,
			accept: {
				// Use video/* for better iOS compatibility (HEVC videos may report unusual MIME types)
				'video/*': ['.mp4', '.m4v', '.mov', '.webm', '.avi', '.mkv'],
			},
			maxFiles: 1,
			disabled: isPicking || (processingStatus !== 'idle' && processingStatus !== 'error'),
		});

	const isDisabled =
		isPicking || (processingStatus !== 'idle' && processingStatus !== 'error');

	const dropzoneClasses = [
		'flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-base-200 cursor-pointer transition-all',
		isDragActive && 'border-primary bg-base-300',
		isDragReject && 'border-error bg-error/10',
		isDisabled && 'opacity-50 cursor-not-allowed',
		isPicking && 'border-primary bg-base-300',
		!isDragActive && !isDragReject && !isDisabled && 'border-base-content/20 hover:border-primary hover:bg-base-300',
	].filter(Boolean).join(' ');

	return (
		<div className="w-full">
			<div {...getRootProps()} className={dropzoneClasses}>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center gap-4 text-center">
					{isPicking ? (
						<>
							<span className="loading loading-spinner loading-lg text-primary"></span>
							<p className="text-lg text-base-content">Loading video...</p>
							<p className="text-sm text-base-content/60">
								This may take a moment for large files
							</p>
						</>
					) : (
						<>
							<svg
								className="w-12 h-12 text-base-content/40"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
								<polyline points="17 8 12 3 7 8" />
								<line x1="12" y1="3" x2="12" y2="15" />
							</svg>
							{isDragActive ? (
								<p className="text-lg text-base-content">Drop your video here...</p>
							) : (
								<>
									<p className="text-lg text-base-content">
										Drag and drop your video here, or click to select
									</p>
									<p className="text-sm text-base-content/60">
										Supports MP4, MOV, WebM, AVI (max 2GB)
									</p>
								</>
							)}
						</>
					)}
				</div>
			</div>
			{processingError && (
				<div className="alert alert-error mt-4">
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
		</div>
	);
}
