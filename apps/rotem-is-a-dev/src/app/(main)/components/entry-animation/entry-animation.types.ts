export type EntryAnimationContextValue = {
	isShellLoaded: boolean;
	setIsShellLoaded: (value: boolean) => void;
	animationKey: number;
	triggerReplay: () => void;
}
