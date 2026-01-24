import {
	PROCESSING_MODES,
	PROCESSING_STATES,
	SERVICE_STATUS_REASONS,
	DEFAULT_SEGMENT_DURATION,
	MIN_SEGMENT_DURATION_SEC,
	SHORT_VIDEO_MIN_SEGMENTS,
	SEGMENT_DURATION_INPUT,
	OUTPUT_FORMAT,
	QUALITY,
	PROGRESS_COMPLETE,
	CLOUD_PROGRESS,
} from '../video-processing.constants';

describe('video-processing.constants', () => {
	it('PROCESSING_MODES has client and cloud', () => {
		expect(PROCESSING_MODES.CLIENT).toBe('client');
		expect(PROCESSING_MODES.CLOUD).toBe('cloud');
	});

	it('PROCESSING_STATES has expected keys', () => {
		expect(PROCESSING_STATES.IDLE).toBe('idle');
		expect(PROCESSING_STATES.LOADING_FFMPEG).toBe('loading-ffmpeg');
		expect(PROCESSING_STATES.ANALYZING).toBe('analyzing');
		expect(PROCESSING_STATES.SPLITTING).toBe('splitting');
		expect(PROCESSING_STATES.COMPLETE).toBe('complete');
		expect(PROCESSING_STATES.ERROR).toBe('error');
	});

	it('SERVICE_STATUS_REASONS has maintenance and quota_exceeded', () => {
		expect(SERVICE_STATUS_REASONS.MAINTENANCE).toBe('maintenance');
		expect(SERVICE_STATUS_REASONS.QUOTA_EXCEEDED).toBe('quota_exceeded');
	});

	it('DEFAULT_SEGMENT_DURATION is 59', () => {
		expect(DEFAULT_SEGMENT_DURATION).toBe(59);
	});

	it('MIN_SEGMENT_DURATION_SEC is 1', () => {
		expect(MIN_SEGMENT_DURATION_SEC).toBe(1);
	});

	it('SHORT_VIDEO_MIN_SEGMENTS is 2', () => {
		expect(SHORT_VIDEO_MIN_SEGMENTS).toBe(2);
	});

	it('SEGMENT_DURATION_INPUT has MIN, MAX, FALLBACK', () => {
		expect(SEGMENT_DURATION_INPUT.MIN).toBe(5);
		expect(SEGMENT_DURATION_INPUT.MAX).toBe(120);
		expect(SEGMENT_DURATION_INPUT.FALLBACK).toBe(45);
	});

	it('OUTPUT_FORMAT and QUALITY are strings', () => {
		expect(OUTPUT_FORMAT).toBe('mp4');
		expect(QUALITY).toBe('medium');
	});

	it('PROGRESS_COMPLETE is 100', () => {
		expect(PROGRESS_COMPLETE).toBe(100);
	});

	it('CLOUD_PROGRESS has BASE and SCALE', () => {
		expect(CLOUD_PROGRESS.BASE).toBe(10);
		expect(CLOUD_PROGRESS.SCALE).toBe(0.9);
	});
});
