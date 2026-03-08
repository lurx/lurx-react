export type UserAvatarProps = WithAriaAttributes<
	WithDataAttributes<{
		photoURL: Nullable<string>;
		displayName: Nullable<string>;
		provider: string;
		size?: number;
	}>
>;
