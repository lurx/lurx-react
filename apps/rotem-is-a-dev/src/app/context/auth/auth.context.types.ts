import type { AUTH_PROVIDERS } from './auth.constants';

export type AuthProvider = ExtractObjectValues<typeof AUTH_PROVIDERS>;

export type AuthUser = {
	uid: string;
	displayName: Nullable<string>;
	email: Nullable<string>;
	photoURL: Nullable<string>;
	provider: AuthProvider;
};

export type AuthContextValue = {
	user: Nullable<AuthUser>;
	isLoading: boolean;
	signInWithGoogle: () => Promise<void>;
	signInWithGitHub: () => Promise<void>;
	signOut: () => Promise<void>;
	deleteUser: () => Promise<void>;
};
