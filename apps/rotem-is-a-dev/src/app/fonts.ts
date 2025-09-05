import { Fira_Code, Inter, Poppins } from 'next/font/google';

// Primary font - Inter (modern, readable sans-serif)
export const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-inter',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// Secondary font - Poppins (professional, elegant sans-serif)
export const poppins = Poppins({
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-poppins',
});

// Monospace font - Fira Code (code and technical content)
export const firaCode = Fira_Code({
	subsets: ['latin'],
	display: 'swap',
	variable: '--font-fira-code',
	weight: ['300', '400', '500', '600', '700'],
});
