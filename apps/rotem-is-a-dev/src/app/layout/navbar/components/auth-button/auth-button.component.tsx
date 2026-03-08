'use client';

import { FaIcon, UserAvatar } from '@/app/components';
import { SignInDialog } from '@/app/components/sign-in-dialog';
import { useAuth } from '@/app/context/auth';
import { useOnClickOutside, useResponsive } from '@/hooks';
import { useCallback, useRef, useState } from 'react';
import { NavItem } from '../nav-item.component';
import { AUTH_BUTTON_STRINGS } from './auth-button.constants';
import styles from './auth-button.module.scss';

export const AuthButton = () => {
	const { user, isLoading, signOut } = useAuth();
	const { isMobile } = useResponsive();

	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = useCallback(() => {
		setIsDropdownOpen(prev => !prev);
	}, []);

	const closeDropdown = useCallback(() => {
		setIsDropdownOpen(false);
	}, []);

	const openSignIn = useCallback(() => {
		setIsSignInOpen(true);
	}, []);

	const closeSignIn = useCallback(() => {
		setIsSignInOpen(false);
	}, []);

	const handleSignOut = useCallback(async () => {
		closeDropdown();
		await signOut();
	}, [closeDropdown, signOut]);

	useOnClickOutside(dropdownRef, closeDropdown, 'mousedown');

	if (isMobile || isLoading) return null;

	if (!user) {
		return (
			<>
				<NavItem
					label={AUTH_BUTTON_STRINGS.SIGN_IN}
					icon={<FaIcon iconName="right-to-bracket" iconGroup="fal" />}
					onClick={openSignIn}
					className={styles.auth}
					active={false}
				/>
				<SignInDialog isOpen={isSignInOpen} onClose={closeSignIn} />
			</>
		);
	}

	const renderAvatar = () => (
		<button
			type="button"
			onClick={toggleDropdown}
			className={styles.avatarButton}
			aria-expanded={isDropdownOpen}
			aria-label={AUTH_BUTTON_STRINGS.DROPDOWN_LABEL}
		>
			<UserAvatar photoURL={user.photoURL} displayName={user.displayName} provider={user.provider} />
		</button>
	);

	const renderDropdown = () => (
		<div className={styles.dropdown} role="menu">
			<div className={styles.userInfo}>
				<span className={styles.displayName}>{user.displayName}</span>
				<span className={styles.email}>{user.email}</span>
			</div>
			<button
				type="button"
				className={styles.signOutButton}
				onClick={handleSignOut}
				role="menuitem"
			>
				<FaIcon iconName="right-from-bracket" iconGroup="fal" size="sm" />
				{AUTH_BUTTON_STRINGS.SIGN_OUT}
			</button>
		</div>
	);

	return (
		<div ref={dropdownRef} className={styles.auth}>
			{renderAvatar()}
			{isDropdownOpen && renderDropdown()}
		</div>
	);
};
