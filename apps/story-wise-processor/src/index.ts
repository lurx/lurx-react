import express from 'express';
import cors from 'cors';
import { getConfig } from './config';
import { StorageClient } from './r2-client';
import { VideoProcessor } from './processor';
import { jobStore } from './job-store';

const config = getConfig();
const app = express();

// Initialize services
const storage = new StorageClient(config);
const processor = new VideoProcessor(config, storage);

// Middleware
app.use(express.json());
app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl)
			if (!origin) return callback(null, true);

			if (config.allowedOrigins.includes(origin) || config.allowedOrigins.includes('*')) {
				callback(null, true);
			} else {
				callback(new Error('Not allowed by CORS'));
			}
		},
		credentials: true,
	})
);

// API key authentication middleware
const authenticate = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	// Skip auth if no API key is configured (for development)
	if (!config.apiKey) {
		return next();
	}

	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ error: 'Missing authorization header' });
	}

	const token = authHeader.slice(7);
	if (token !== config.apiKey) {
		return res.status(403).json({ error: 'Invalid API key' });
	}

	next();
};

// Health check endpoint
app.get('/health', async (_req, res) => {
	try {
		const ffmpegAvailable = await processor.checkFFmpeg();

		res.json({
			status: ffmpegAvailable ? 'healthy' : 'degraded',
			ffmpeg: ffmpegAvailable,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		res.status(500).json({
			status: 'unhealthy',
			error: error instanceof Error ? error.message : 'Unknown error',
			timestamp: new Date().toISOString(),
		});
	}
});

// Process video endpoint - now async, returns job ID immediately
app.post('/process', authenticate, async (req, res) => {
	try {
		const {
			sessionId,
			segmentDuration = config.processing.defaultSegmentDuration,
			outputFormat = config.processing.outputFormat,
			quality = config.processing.quality,
		} = req.body;

		if (!sessionId) {
			return res.status(400).json({ error: 'sessionId is required' });
		}

		console.log('[API] Process request:', { sessionId, segmentDuration, outputFormat, quality });

		// Create job and return immediately
		const job = jobStore.create(sessionId);

		// Process in background
		(async () => {
			try {
				jobStore.updateStatus(job.id, 'processing');

				const result = await processor.process({
					sessionId,
					segmentDuration,
					outputFormat,
					quality,
					onProgress: (progress) => {
						jobStore.updateProgress(job.id, progress);
					},
				});

				jobStore.setResult(job.id, {
					success: true,
					duration: result.duration,
					totalSegments: result.totalSegments,
					segments: result.segments.map((seg) => ({
						index: seg.index,
						startTime: seg.startTime,
						endTime: seg.endTime,
						duration: seg.duration,
					})),
				});
			} catch (error) {
				console.error('[API] Process error:', error);
				jobStore.setError(job.id, error instanceof Error ? error.message : 'Unknown error');
			}
		})();

		// Return job ID immediately
		res.status(202).json({
			jobId: job.id,
			status: 'pending',
			message: 'Processing started',
		});
	} catch (error) {
		console.error('[API] Process error:', error);
		res.status(500).json({
			error: 'Failed to start processing',
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Get job status endpoint
app.get('/jobs/:jobId', authenticate, async (req, res) => {
	try {
		const { jobId } = req.params;
		const job = jobStore.get(jobId);

		if (!job) {
			return res.status(404).json({ error: 'Job not found' });
		}

		res.json({
			jobId: job.id,
			sessionId: job.sessionId,
			status: job.status,
			progress: job.progress,
			result: job.result,
			error: job.error,
			createdAt: job.createdAt.toISOString(),
			updatedAt: job.updatedAt.toISOString(),
		});
	} catch (error) {
		console.error('[API] Job status error:', error);
		res.status(500).json({
			error: 'Failed to get job status',
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Get signed download URL for a segment
app.get('/download/:sessionId/:segmentIndex', authenticate, async (req, res) => {
	try {
		const { sessionId, segmentIndex } = req.params;
		const format = (req.query.format as string) || 'mp4';

		const keys = storage.generateKeys(sessionId);
		const segmentKey = keys.segmentKey(parseInt(segmentIndex, 10), format);

		const signedUrl = await storage.getSignedUrl(segmentKey, 3600);

		res.json({ url: signedUrl });
	} catch (error) {
		console.error('[API] Download URL error:', error);
		res.status(500).json({
			error: 'Failed to generate download URL',
			message: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// Start server
app.listen(config.port, () => {
	console.log(`
╔════════════════════════════════════════════════════════════╗
║           Story Wise Processor Service                     ║
╠════════════════════════════════════════════════════════════╣
║  Port:     ${String(config.port).padEnd(45)}║
║  Origins:  ${config.allowedOrigins.slice(0, 2).join(', ').padEnd(45)}║
║  Auth:     ${(config.apiKey ? 'Enabled' : 'Disabled').padEnd(45)}║
╚════════════════════════════════════════════════════════════╝
`);
});
