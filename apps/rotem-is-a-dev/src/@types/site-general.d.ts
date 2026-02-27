type Technology =
	| 'react'
	| 'typescript'
	| 'html'
	| 'css'
	| 'scss'
	| 'svg';



type IconGroupName =
	| 'fab' // brands
	| 'fal' // light
	| 'far' // regular
	| 'fas' // solid
	| 'fass'; // sharp solid

type IconData = {
  iconName: string;
	iconGroup?: IconGroupName;
}
