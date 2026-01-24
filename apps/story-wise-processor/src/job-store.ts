/**
 * In-memory job store for tracking processing jobs
 * In production, consider using Redis for persistence across restarts
 */

export type JobStatus = 'pending' | 'processing' | 'complete' | 'error';

export interface JobProgress {
	currentSegment: number;
	totalSegments: number;
	percent: number;
	stage: 'downloading' | 'processing' | 'uploading';
}

export interface Job {
	id: string;
	sessionId: string;
	status: JobStatus;
	progress: JobProgress | null;
	result: JobResult | null;
	error: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface JobResult {
	success: boolean;
	duration: number;
	totalSegments: number;
	segments: Array<{
		index: number;
		startTime: number;
		endTime: number;
		duration: number;
	}>;
}

class JobStore {
	private jobs: Map<string, Job> = new Map();
	private cleanupInterval: NodeJS.Timeout | null = null;

	constructor() {
		// Clean up old jobs every 10 minutes
		this.cleanupInterval = setInterval(() => this.cleanup(), 10 * 60 * 1000);
	}

	create(sessionId: string): Job {
		const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
		const job: Job = {
			id,
			sessionId,
			status: 'pending',
			progress: null,
			result: null,
			error: null,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		this.jobs.set(id, job);
		console.log('[JobStore] Created job:', id);
		return job;
	}

	get(id: string): Job | undefined {
		return this.jobs.get(id);
	}

	updateStatus(id: string, status: JobStatus): void {
		const job = this.jobs.get(id);
		if (job) {
			job.status = status;
			job.updatedAt = new Date();
		}
	}

	updateProgress(id: string, progress: JobProgress): void {
		const job = this.jobs.get(id);
		if (job) {
			job.progress = progress;
			job.updatedAt = new Date();
		}
	}

	setResult(id: string, result: JobResult): void {
		const job = this.jobs.get(id);
		if (job) {
			job.status = 'complete';
			job.result = result;
			job.updatedAt = new Date();
			console.log('[JobStore] Job complete:', id);
		}
	}

	setError(id: string, error: string): void {
		const job = this.jobs.get(id);
		if (job) {
			job.status = 'error';
			job.error = error;
			job.updatedAt = new Date();
			console.log('[JobStore] Job error:', id, error);
		}
	}

	private cleanup(): void {
		const maxAge = 60 * 60 * 1000; // 1 hour
		const now = Date.now();
		let cleaned = 0;

		for (const [id, job] of this.jobs.entries()) {
			if (now - job.updatedAt.getTime() > maxAge) {
				this.jobs.delete(id);
				cleaned++;
			}
		}

		if (cleaned > 0) {
			console.log('[JobStore] Cleaned up', cleaned, 'old jobs');
		}
	}

	destroy(): void {
		if (this.cleanupInterval) {
			clearInterval(this.cleanupInterval);
		}
	}
}

// Singleton instance
export const jobStore = new JobStore();
