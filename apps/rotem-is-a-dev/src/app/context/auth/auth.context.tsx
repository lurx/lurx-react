'use client';

import { auth } from '@/lib/firebase';
import {
  signOut as firebaseSignOut,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AUTH_PROVIDERS } from './auth.constants';
import type { AuthContextValue, AuthUser } from './auth.context.types';

const authContext = createContext<Nullable<AuthContextValue>>(null);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const mapFirebaseUser = (firebaseUser: import('firebase/auth').User): AuthUser => {
	const providerId = firebaseUser.providerData[0]?.providerId;

	return {
		uid: firebaseUser.uid,
		displayName: firebaseUser.displayName,
		email: firebaseUser.email,
		photoURL: firebaseUser.photoURL,
		provider: providerId === 'github.com' ? AUTH_PROVIDERS.GITHUB : AUTH_PROVIDERS.GOOGLE,
	};
};

export const AuthProvider = ({ children }: Readonly<PropsWithChildren>) => {
	const [user, setUser] = useState<Nullable<AuthUser>>(null);
	const [isLoading, setIsLoading] = useState(true);

	const signInWithGoogle = useCallback(async () => {
		await signInWithPopup(auth, googleProvider);
	}, []);

	const signInWithGitHub = useCallback(async () => {
		await signInWithPopup(auth, githubProvider);
	}, []);

	const signOut = useCallback(async () => {
		await firebaseSignOut(auth);
	}, []);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
			setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
			setIsLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = useMemo(
		() => ({ user, isLoading, signInWithGoogle, signInWithGitHub, signOut }),
		[user, isLoading, signInWithGoogle, signInWithGitHub, signOut],
	);

	return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
	const ctx = useContext(authContext);
	if (!ctx) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return ctx;
};
