import type { PropsWithChildren } from 'react';

const textScaleScript = `(function(){try{var s=localStorage.getItem('accessibility-text-scale');if(s){var v=JSON.parse(s);if([100,125,150,175,200].indexOf(v)!==-1&&v!==100){document.documentElement.style.setProperty('--root-font-size',14*v/100+'px')}}var lh=localStorage.getItem('accessibility-line-height');if(lh){var l=JSON.parse(lh);if([1,2,3].indexOf(l)!==-1){var lv=['Normal',1.5,1.75,2.0][l];document.documentElement.style.setProperty('--a11y-line-height',String(lv))}}var ls=localStorage.getItem('accessibility-letter-spacing');if(ls){var t=JSON.parse(ls);if([1,2,3].indexOf(t)!==-1){var tv=['Normal',0.05,0.1,0.15][t];document.documentElement.style.setProperty('--a11y-letter-spacing',tv+'em')}}}catch(e){}})()`;

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
