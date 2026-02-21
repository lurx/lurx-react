import type { PropsWithChildren } from 'react';

const textScaleScript = `(function(){try{var s=localStorage.getItem('accessibility-text-scale');if(s){var v=JSON.parse(s);if([100,125,150,175,200].indexOf(v)!==-1&&v!==100){document.documentElement.style.setProperty('--root-font-size',14*v/100+'px')}}}catch(e){}})()`;

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en">
			<head>
				<script dangerouslySetInnerHTML={{ __html: textScaleScript }} />
			</head>
			<body>{children}</body>
		</html>
	);
}
