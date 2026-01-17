import {
	validateVideoFile,
	isValidMimeType,
	formatFileSize,
	formatDuration,
	requiresServerProcessing,
	MAX_FILE_SIZE,
	RECOMMENDED_FILE_SIZE,
} from '../utils/validation';

describe('validation utilities', () => {
	describe('validateVideoFile', () => {
		it('should pass validation for valid mp4 file', () => {
			const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
			const result = validateVideoFile(file);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should pass validation for valid quicktime file', () => {
			const file = new File(['test'], 'test.mov', { type: 'video/quicktime' });
			const result = validateVideoFile(file);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should pass validation for valid webm file', () => {
			const file = new File(['test'], 'test.webm', { type: 'video/webm' });
			const result = validateVideoFile(file);

			expect(result.isValid).toBe(true);
			expect(result.errors).toHaveLength(0);
		});

		it('should fail validation for invalid mime type', () => {
			const file = new File(['test'], 'test.txt', { type: 'text/plain' });
			const result = validateVideoFile(file);

			expect(result.isValid).toBe(false);
			expect(result.errors).toContainEqual(
				expect.objectContaining({ code: 'INVALID_FORMAT' }),
			);
		});

		it('should fail validation for empty file', () => {
			const file = new File([], 'test.mp4', { type: 'video/mp4' });
			const result = validateVideoFile(file);

			expect(result.isValid).toBe(false);
			expect(result.errors).toContainEqual(
				expect.objectContaining({ code: 'EMPTY_FILE' }),
			);
		});

		it('should add warning for large files', () => {
			// Create a mock file with size > RECOMMENDED_FILE_SIZE
			const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
			Object.defineProperty(file, 'size', {
				value: RECOMMENDED_FILE_SIZE + 1,
			});

			const result = validateVideoFile(file);

			expect(result.isValid).toBe(true);
			expect(result.warnings).toContainEqual(
				expect.objectContaining({ code: 'LARGE_FILE' }),
			);
		});

		it('should fail validation for files exceeding max size', () => {
			const file = new File(['test'], 'test.mp4', { type: 'video/mp4' });
			Object.defineProperty(file, 'size', { value: MAX_FILE_SIZE + 1 });

			const result = validateVideoFile(file);

			expect(result.isValid).toBe(false);
			expect(result.errors).toContainEqual(
				expect.objectContaining({ code: 'FILE_TOO_LARGE' }),
			);
		});
	});

	describe('isValidMimeType', () => {
		it('should return true for video/mp4', () => {
			expect(isValidMimeType('video/mp4')).toBe(true);
		});

		it('should return true for video/quicktime', () => {
			expect(isValidMimeType('video/quicktime')).toBe(true);
		});

		it('should return true for video/webm', () => {
			expect(isValidMimeType('video/webm')).toBe(true);
		});

		it('should return true for video/x-msvideo', () => {
			expect(isValidMimeType('video/x-msvideo')).toBe(true);
		});

		it('should return true for any video/* type (iOS compatibility)', () => {
			expect(isValidMimeType('video/x-m4v')).toBe(true);
			expect(isValidMimeType('video/hevc')).toBe(true);
			expect(isValidMimeType('video/3gpp')).toBe(true);
		});

		it('should return false for non-video types', () => {
			expect(isValidMimeType('text/plain')).toBe(false);
			expect(isValidMimeType('audio/mp3')).toBe(false);
			expect(isValidMimeType('image/png')).toBe(false);
		});
	});

	describe('formatFileSize', () => {
		it('should format bytes correctly', () => {
			expect(formatFileSize(0)).toBe('0 Bytes');
			expect(formatFileSize(500)).toBe('500 Bytes');
		});

		it('should format KB correctly', () => {
			expect(formatFileSize(1024)).toBe('1 KB');
			expect(formatFileSize(1536)).toBe('1.5 KB');
		});

		it('should format MB correctly', () => {
			expect(formatFileSize(1024 * 1024)).toBe('1 MB');
			expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
		});

		it('should format GB correctly', () => {
			expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
		});
	});

	describe('formatDuration', () => {
		it('should format seconds only', () => {
			expect(formatDuration(30)).toBe('0:30');
			expect(formatDuration(5)).toBe('0:05');
		});

		it('should format minutes and seconds', () => {
			expect(formatDuration(90)).toBe('1:30');
			expect(formatDuration(125)).toBe('2:05');
		});

		it('should format hours, minutes, and seconds', () => {
			expect(formatDuration(3661)).toBe('1:01:01');
			expect(formatDuration(7200)).toBe('2:00:00');
		});
	});

	describe('requiresServerProcessing', () => {
		it('should return false for small files', () => {
			expect(requiresServerProcessing(100 * 1024 * 1024)).toBe(false);
		});

		it('should return true for large files', () => {
			expect(requiresServerProcessing(RECOMMENDED_FILE_SIZE + 1)).toBe(true);
		});

		it('should return false at exactly the threshold', () => {
			expect(requiresServerProcessing(RECOMMENDED_FILE_SIZE)).toBe(false);
		});
	});
});
