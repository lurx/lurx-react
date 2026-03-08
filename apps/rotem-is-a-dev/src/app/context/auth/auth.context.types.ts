import type { AUTH_PROVIDERS } from './auth.constants';

type AuthProviders = ExtractObjectValues<typeof AUTH_PROVIDERS>;

export type AuthUser = {
	uid: string;
	displayName: Nullable<string>;
	email: Nullable<string>;
	photoURL: Nullable<string>;
	provider: AuthProviders;
};

export type AuthContextValue = {
	user: Nullable<AuthUser>;
	isLoading: boolean;
	signInWithGoogle: () => Promise<void>;
	signInWithGitHub: () => Promise<void>;
	signOut: () => Promise<void>;
};
