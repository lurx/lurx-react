export type WolverineSide = 'left' | 'right';

export type WolverineSideProp = {
  side: WolverineSide;
};

export type DemoCredits = {
	name: string;
	url: string;
	author: string;
	authorUrl: string;
}

export type DemoCreditsProps = {
	credits?: DemoCredits;
}
