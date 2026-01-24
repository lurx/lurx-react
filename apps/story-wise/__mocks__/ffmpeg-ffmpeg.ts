export class FFmpeg {
	load = jest.fn().mockResolvedValue(undefined);
	writeFile = jest.fn().mockResolvedValue(undefined);
	readFile = jest.fn().mockResolvedValue(new Uint8Array(0));
	exec = jest.fn().mockResolvedValue(undefined);
	deleteFile = jest.fn().mockResolvedValue(undefined);
	terminate = jest.fn();
	on = jest.fn();
	off = jest.fn();
}
