'use client';

interface OfflineScreenProps {
	message?: string;
}

/**
 * OfflineScreen - Shown when service is temporarily unavailable
 */
export function OfflineScreen({ message }: OfflineScreenProps) {
	return (
		<main className="min-h-screen flex items-center justify-center p-8 bg-base-100">
			<div className="text-center max-w-md">
				<div className="mb-8">
					<svg
						className="w-24 h-24 mx-auto text-base-content/30"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={1.5}
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
						/>
					</svg>
				</div>
				<h1 className="text-3xl font-bold text-base-content mb-4">
					Temporarily Offline
				</h1>
				<p className="text-lg text-base-content/60 mb-6">
					{message || "We've reached our usage limit for this period. Please check back soon!"}
				</p>
				<div className="flex flex-col gap-3 text-sm text-base-content/50">
					<p>The service will be back when:</p>
					<ul className="list-disc list-inside text-left">
						<li>The monthly quota resets</li>
						<li>Or capacity is increased</li>
					</ul>
				</div>
				<div className="mt-8">
					<button
						type="button"
						className="btn btn-outline"
						onClick={() => window.location.reload()}
					>
						Try Again
					</button>
				</div>
			</div>
		</main>
	);
}
