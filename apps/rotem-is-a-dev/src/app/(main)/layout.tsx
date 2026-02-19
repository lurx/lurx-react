import { Fira_Code } from 'next/font/google';
import './styles/global.scss';

const firaCode = Fira_Code({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	variable: '--font-mono',
});

export default function MainLayout({ children }: { children: React.ReactNode }) {
	return <div className={`${firaCode.variable} ${firaCode.className}`}>{children}</div>;
}
