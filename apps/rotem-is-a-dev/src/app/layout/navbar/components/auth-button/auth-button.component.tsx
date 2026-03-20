'use client';

import { FaIcon } from '@/app/components';
import { SignInDialog } from '@/app/components/sign-in-dialog';
import { UserSettingsDialog } from '@/app/components/user-settings-dialog';
import { useAuth } from '@/app/context/auth';
import { useOnClickOutside } from '@/hooks';
import { useCallback, useRef, useState } from 'react';
import { NavItem } from '../nav-item.component';
import { AUTH_BUTTON_STRINGS } from './auth-button.constants';
import styles from './auth-button.module.scss';
import { AuthAvatar, AuthButtonLoading, AuthDropdown } from './components';

export const AuthButton = () => {
	const { user, isLoading, signOut } = useAuth();

	const [isSignInOpen, setIsSignInOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

	const openSettings = useCallback(() => {
		setIsDropdownOpen(false);
		setIsSettingsOpen(true);
	}, []);

	const closeSettings = useCallback(() => {
		setIsSettingsOpen(false);
	}, []);

	const handleSignOut = useCallback(async () => {
		closeDropdown();
		await signOut();
	}, [closeDropdown, signOut]);

	useOnClickOutside(dropdownRef, closeDropdown, 'mousedown');

	if (isLoading)
		return (
			<div
				ref={dropdownRef}
				className={styles.auth}
			>
				<AuthButtonLoading />
			</div>
		);

	if (!user) {
		return (
			<>
				<NavItem
					label={AUTH_BUTTON_STRINGS.SIGN_IN}
					icon={
						<FaIcon
							iconName="arrow-right-to-bracket"
							iconGroup="fal"
						/>
					}
					iconOnly
					onClick={openSignIn}
					className={styles.auth}
					active={false}
				/>
				<SignInDialog
					isOpen={isSignInOpen}
					onCloseAction={closeSignIn}
				/>
			</>
		);
	}

	return (
		<div
			ref={dropdownRef}
			className={styles.auth}
		>
			<AuthAvatar
				isDropdownOpen={isDropdownOpen}
				onClick={toggleDropdown}
			/>
			<AuthDropdown
				isOpen={isDropdownOpen}
				openSettings={openSettings}
				onSignOutAction={handleSignOut}
			/>
			<UserSettingsDialog
				isOpen={isSettingsOpen}
				onCloseAction={closeSettings}
			/>
		</div>
	);
};
