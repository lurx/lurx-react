import { AccessibilityControls } from '@/app/components';
import { useAccessibilitySettings } from '@/app/layout/accessibility-widget/hooks/use-accessibility-settings';

export const AccessibilitySection = () => {
	const settings = useAccessibilitySettings();

	return <AccessibilityControls {...settings} />;
};
