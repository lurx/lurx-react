const IS_DEV = process.env.NODE_ENV === 'development';
const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';

export const IS_PREVIEW_ENV = IS_DEV || IS_PREVIEW;
