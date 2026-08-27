import { fireEvent, render, screen } from '@testing-library/react';
import { AccessibilityWidget } from '../accessibility-widget.component';
import { ThemeProvider } from '../../theme';
import {
	BASE_FONT_SIZE_PX,
	LETTER_SPACING_STORAGE_KEY,
	LETTER_SPACING_VALUES,
	LINE_HEIGHT_STORAGE_KEY,
	LINE_HEIGHT_VALUES,
	MOBILE_BASE_FONT_SIZE_PX,
	TEXT_SCALE_STORAGE_KEY,
	THEME_ATTRIBUTE,
	THEME_STORAGE_KEY,
} from '../accessibility-widget.types';

const mockGetItem = jest.mocked(localStorage.getItem);
const mockSetItem = jest.mocked(localStorage.setItem);

beforeEach(() => {
	mockGetItem.mockReset();
	mockSetItem.mockReset();
	document.documentElement.style.removeProperty('--root-font-size');
	document.documentElement.style.removeProperty('--a11y-line-height');
	document.documentElement.style.removeProperty('--a11y-letter-spacing');
	document.documentElement.removeAttribute(THEME_ATTRIBUTE);
});

function renderWidget() {
	return render(
		<ThemeProvider>
			<AccessibilityWidget />
		</ThemeProvider>,
	);
}

function openPanel() {
	fireEvent.click(
		screen.getByRole('button', { name: 'Accessibility options' }),
	);
}

describe('AccessibilityWidget', () => {
	it('renders the accessibility button', () => {
		renderWidget();
		expect(
			screen.getByRole('button', { name: 'Accessibility options' }),
		).toBeInTheDocument();
	});

	it('does not show the panel initially', () => {
		renderWidget();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('toggles the panel on button click', () => {
		renderWidget();
		const trigger = screen.getByRole('button', {
			name: 'Accessibility options',
		});

		fireEvent.click(trigger);
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		fireEvent.click(trigger);
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('sets aria-expanded on the trigger button', () => {
		renderWidget();
		const trigger = screen.getByRole('button', {
			name: 'Accessibility options',
		});

		expect(trigger).toHaveAttribute('aria-expanded', 'false');

		fireEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('closes the panel on Escape key', () => {
		renderWidget();
		openPanel();
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		fireEvent.keyDown(document, { key: 'Escape' });
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes the panel on outside click', () => {
		render(
			<ThemeProvider>
				<div>
					<div data-testid="outside">outside</div>
					<AccessibilityWidget />
				</div>
			</ThemeProvider>,
		);
		openPanel();
		expect(screen.getByRole('dialog')).toBeInTheDocument();

		fireEvent.mouseDown(screen.getByTestId('outside'));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	describe('Text scale', () => {
		it('shows 100% as default text scale', () => {
			renderWidget();
			openPanel();
			expect(screen.getByText('100%')).toBeInTheDocument();
		});

		it('increases text scale on plus click', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);
			expect(screen.getByText('125%')).toBeInTheDocument();
		});

		it('decreases text scale on minus click', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);
			expect(screen.getByText('125%')).toBeInTheDocument();

			fireEvent.click(
				screen.getByRole('button', { name: 'Decrease text size' }),
			);
			expect(screen.getByText('100%')).toBeInTheDocument();
		});

		it('disables decrease button at minimum scale', () => {
			renderWidget();
			openPanel();

			expect(
				screen.getByRole('button', { name: 'Decrease text size' }),
			).toBeDisabled();
		});

		it('disables increase button at maximum scale', () => {
			renderWidget();
			openPanel();

			const increaseButton = screen.getByRole('button', {
				name: 'Increase text size',
			});
			fireEvent.click(increaseButton);
			fireEvent.click(increaseButton);
			fireEvent.click(increaseButton);
			fireEvent.click(increaseButton);

			expect(screen.getByText('200%')).toBeInTheDocument();
			expect(increaseButton).toBeDisabled();
		});

		it('persists text scale to localStorage on change', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);

			expect(mockSetItem).toHaveBeenCalledWith(
				TEXT_SCALE_STORAGE_KEY,
				JSON.stringify(125),
			);
		});

		it('restores text scale from localStorage on mount', () => {
			mockGetItem.mockReturnValue(JSON.stringify(150));

			renderWidget();
			openPanel();

			expect(screen.getByText('150%')).toBeInTheDocument();
		});

		it('applies --root-font-size on mount from stored value', () => {
			mockGetItem.mockReturnValue(JSON.stringify(175));

			renderWidget();

			expect(
				document.documentElement.style.getPropertyValue(
					'--root-font-size',
				),
			).toBe(`${(BASE_FONT_SIZE_PX * 175) / 100}px`);
		});
	});

	describe('Line height', () => {
		it('shows Normal as default line height', () => {
			renderWidget();
			openPanel();
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('increases line height on plus click', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);
			expect(
				screen.getByText(String(LINE_HEIGHT_VALUES[1])),
			).toBeInTheDocument();
		});

		it('decreases line height on minus click', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);
			fireEvent.click(
				screen.getByRole('button', { name: 'Decrease line height' }),
			);
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('disables decrease button at minimum level', () => {
			renderWidget();
			openPanel();

			expect(
				screen.getByRole('button', { name: 'Decrease line height' }),
			).toBeDisabled();
		});

		it('disables increase button at maximum level', () => {
			renderWidget();
			openPanel();

			const increaseButton = screen.getByRole('button', {
				name: 'Increase line height',
			});
			fireEvent.click(increaseButton);
			fireEvent.click(increaseButton);
			fireEvent.click(increaseButton);

			expect(
				screen.getByText(
					String(LINE_HEIGHT_VALUES.at(-1)),
				),
			).toBeInTheDocument();
			expect(increaseButton).toBeDisabled();
		});

		it('persists line height to localStorage on change', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);

			expect(mockSetItem).toHaveBeenCalledWith(
				LINE_HEIGHT_STORAGE_KEY,
				JSON.stringify(1),
			);
		});

		it('restores line height from localStorage on mount', () => {
			mockGetItem.mockImplementation((key: string) => {
				if (key === LINE_HEIGHT_STORAGE_KEY) return JSON.stringify(2);
				return null;
			});

			renderWidget();
			openPanel();

			expect(
				screen.getByText(String(LINE_HEIGHT_VALUES[2])),
			).toBeInTheDocument();
		});

		it('applies --a11y-line-height CSS property', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);

			expect(
				document.documentElement.style.getPropertyValue(
					'--a11y-line-height',
				),
			).toBe(String(LINE_HEIGHT_VALUES[1]));
		});

		it('removes --a11y-line-height when reset to Normal', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);
			expect(
				document.documentElement.style.getPropertyValue(
					'--a11y-line-height',
				),
			).toBe(String(LINE_HEIGHT_VALUES[1]));

			fireEvent.click(
				screen.getByRole('button', { name: 'Decrease line height' }),
			);
			expect(
				document.documentElement.style.getPropertyValue(
					'--a11y-line-height',
				),
			).toBe('');
		});
	});

	describe('Letter spacing', () => {
		it('shows Normal as default letter spacing', () => {
			renderWidget();
			openPanel();
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('increases letter spacing on plus click', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', {
					name: 'Increase letter spacing',
				}),
			);
			expect(
				screen.getByText(`${LETTER_SPACING_VALUES[1]}em`),
			).toBeInTheDocument();
		});

		it('decreases letter spacing on minus click', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', {
					name: 'Increase letter spacing',
				}),
			);
			fireEvent.click(
				screen.getByRole('button', {
					name: 'Decrease letter spacing',
				}),
			);
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('disables decrease button at minimum level', () => {
			renderWidget();
			openPanel();

			expect(
				screen.getByRole('button', {
					name: 'Decrease letter spacing',
				}),
			).toBeDisabled();
		});

		it('disables increase button at maximum level', () => {
			renderWidget();
			openPanel();

			const increaseButton = screen.getByRole('button', {
				name: 'Increase letter spacing',
			});
			fireEvent.click(increaseButton);
			fireEvent.click(increaseButton);
			fireEvent.click(increaseButton);

			expect(
				screen.getByText(
					`${LETTER_SPACING_VALUES.at(-1)}em`,
				),
			).toBeInTheDocument();
			expect(increaseButton).toBeDisabled();
		});

		it('persists letter spacing to localStorage on change', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', {
					name: 'Increase letter spacing',
				}),
			);

			expect(mockSetItem).toHaveBeenCalledWith(
				LETTER_SPACING_STORAGE_KEY,
				JSON.stringify(1),
			);
		});

		it('restores letter spacing from localStorage on mount', () => {
			mockGetItem.mockImplementation((key: string) => {
				if (key === LETTER_SPACING_STORAGE_KEY)
					return JSON.stringify(2);
				return null;
			});

			renderWidget();
			openPanel();

			expect(
				screen.getByText(`${LETTER_SPACING_VALUES[2]}em`),
			).toBeInTheDocument();
		});

		it('applies --a11y-letter-spacing CSS property', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', {
					name: 'Increase letter spacing',
				}),
			);

			expect(
				document.documentElement.style.getPropertyValue(
					'--a11y-letter-spacing',
				),
			).toBe(`${LETTER_SPACING_VALUES[1]}em`);
		});

		it('removes --a11y-letter-spacing when reset to Normal', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', {
					name: 'Increase letter spacing',
				}),
			);
			expect(
				document.documentElement.style.getPropertyValue(
					'--a11y-letter-spacing',
				),
			).toBe(`${LETTER_SPACING_VALUES[1]}em`);

			fireEvent.click(
				screen.getByRole('button', {
					name: 'Decrease letter spacing',
				}),
			);
			expect(
				document.documentElement.style.getPropertyValue(
					'--a11y-letter-spacing',
				),
			).toBe('');
		});
	});

	describe('Per-section reset', () => {
		it('resets only text size when clicking its reset button', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);
			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);

			fireEvent.click(
				screen.getByRole('button', { name: 'Reset text size' }),
			);

			expect(screen.getByText('100%')).toBeInTheDocument();
			expect(
				screen.getByText(String(LINE_HEIGHT_VALUES[1])),
			).toBeInTheDocument();
		});

		it('resets only line height when clicking its reset button', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);
			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);

			fireEvent.click(
				screen.getByRole('button', { name: 'Reset line height' }),
			);

			expect(screen.getByText('125%')).toBeInTheDocument();
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('resets only letter spacing when clicking its reset button', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);
			fireEvent.click(
				screen.getByRole('button', {
					name: 'Increase letter spacing',
				}),
			);

			fireEvent.click(
				screen.getByRole('button', {
					name: 'Reset letter spacing',
				}),
			);

			expect(screen.getByText('125%')).toBeInTheDocument();
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('disables per-section reset buttons at defaults', () => {
			renderWidget();
			openPanel();

			expect(
				screen.getByRole('button', { name: 'Reset text size' }),
			).toBeDisabled();
			expect(
				screen.getByRole('button', { name: 'Reset line height' }),
			).toBeDisabled();
			expect(
				screen.getByRole('button', { name: 'Reset letter spacing' }),
			).toBeDisabled();
		});

		it('enables per-section reset button when its setting is changed', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);

			expect(
				screen.getByRole('button', { name: 'Reset text size' }),
			).toBeDisabled();
			expect(
				screen.getByRole('button', { name: 'Reset line height' }),
			).not.toBeDisabled();
			expect(
				screen.getByRole('button', { name: 'Reset letter spacing' }),
			).toBeDisabled();
		});
	});

	describe('Edge cases and error handling', () => {
		it('falls back to default when localStorage has invalid text scale', () => {
			mockGetItem.mockReturnValue(JSON.stringify(999));
			renderWidget();
			openPanel();
			expect(screen.getByText('100%')).toBeInTheDocument();
		});

		it('falls back to default when localStorage has unparseable text scale', () => {
			mockGetItem.mockReturnValue('{{bad json');
			renderWidget();
			openPanel();
			expect(screen.getByText('100%')).toBeInTheDocument();
		});

		it('falls back to default when localStorage has invalid line height level', () => {
			mockGetItem.mockImplementation((key: string) => {
				if (key === LINE_HEIGHT_STORAGE_KEY) return JSON.stringify(99);
				return null;
			});
			renderWidget();
			openPanel();
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('falls back to default when localStorage has unparseable spacing data', () => {
			mockGetItem.mockImplementation((key: string) => {
				if (key === LETTER_SPACING_STORAGE_KEY) return '{{bad';
				return null;
			});
			renderWidget();
			openPanel();
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('ignores non-Escape keydown when panel is open', () => {
			renderWidget();
			openPanel();
			fireEvent.keyDown(document, { key: 'Enter' });
			expect(screen.getByRole('dialog')).toBeInTheDocument();
		});

		it('does not change text scale when clicking decrease at minimum', () => {
			renderWidget();
			openPanel();
			fireEvent.click(
				screen.getByRole('button', { name: 'Decrease text size' }),
			);
			expect(screen.getByText('100%')).toBeInTheDocument();
		});

		it('does not change text scale when clicking increase at maximum', () => {
			renderWidget();
			openPanel();
			const btn = screen.getByRole('button', { name: 'Increase text size' });
			fireEvent.click(btn);
			fireEvent.click(btn);
			fireEvent.click(btn);
			fireEvent.click(btn); // now at 200%
			fireEvent.click(btn); // click again at max
			expect(screen.getByText('200%')).toBeInTheDocument();
		});

		it('does not change line height when clicking decrease at minimum', () => {
			renderWidget();
			openPanel();
			fireEvent.click(
				screen.getByRole('button', { name: 'Decrease line height' }),
			);
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('does not change line height when clicking increase at maximum', () => {
			renderWidget();
			openPanel();
			const btn = screen.getByRole('button', { name: 'Increase line height' });
			fireEvent.click(btn);
			fireEvent.click(btn);
			fireEvent.click(btn); // now at max
			fireEvent.click(btn); // click again at max
			expect(
				screen.getByText(
					String(LINE_HEIGHT_VALUES.at(-1)),
				),
			).toBeInTheDocument();
		});

		it('does not change letter spacing when clicking decrease at minimum', () => {
			renderWidget();
			openPanel();
			fireEvent.click(
				screen.getByRole('button', { name: 'Decrease letter spacing' }),
			);
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('does not change letter spacing when clicking increase at maximum', () => {
			renderWidget();
			openPanel();
			const btn = screen.getByRole('button', { name: 'Increase letter spacing' });
			fireEvent.click(btn);
			fireEvent.click(btn);
			fireEvent.click(btn); // now at max
			fireEvent.click(btn); // click again at max
			expect(
				screen.getByText(
					`${LETTER_SPACING_VALUES.at(-1)}em`,
				),
			).toBeInTheDocument();
		});
	});

	describe('Mobile font size', () => {
		it('uses MOBILE_BASE_FONT_SIZE_PX when matchMedia matches mobile breakpoint', () => {
			const originalMatchMedia = globalThis.matchMedia;
			Object.defineProperty(globalThis, 'matchMedia', {
				writable: true,
				value: jest.fn().mockImplementation((query: string) => ({
					matches: true,
					media: query,
					onchange: null,
					addListener: jest.fn(),
					removeListener: jest.fn(),
					addEventListener: jest.fn(),
					removeEventListener: jest.fn(),
					dispatchEvent: jest.fn(),
				})),
			});

			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);

			const expectedFontSize = (MOBILE_BASE_FONT_SIZE_PX * 125) / 100;
			expect(
				document.documentElement.style.getPropertyValue('--root-font-size'),
			).toBe(`${expectedFontSize}px`);

			Object.defineProperty(globalThis, 'matchMedia', {
				writable: true,
				value: originalMatchMedia,
			});
		});
	});

	describe('Reset all', () => {
		it('resets all settings to defaults', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase text size' }),
			);
			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);
			fireEvent.click(
				screen.getByRole('button', {
					name: 'Increase letter spacing',
				}),
			);

			fireEvent.click(
				screen.getByRole('button', { name: 'Reset all' }),
			);

			expect(screen.getByText('100%')).toBeInTheDocument();
			expect(screen.getAllByText('Normal')).toHaveLength(2);
		});

		it('disables reset all button when all settings are at defaults', () => {
			renderWidget();
			openPanel();

			expect(
				screen.getByRole('button', { name: 'Reset all' }),
			).toBeDisabled();
		});

		it('enables reset all button when any setting is changed', () => {
			renderWidget();
			openPanel();

			fireEvent.click(
				screen.getByRole('button', { name: 'Increase line height' }),
			);

			expect(
				screen.getByRole('button', { name: 'Reset all' }),
			).not.toBeDisabled();
		});
	});
});

describe('theme control', () => {
	it('renders the three theme options', () => {
		renderWidget();
		openPanel();

		expect(screen.getByRole('button', { name: 'System' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Dark' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Light' })).toBeInTheDocument();
	});

	it('marks System as the pressed option by default', () => {
		renderWidget();
		openPanel();

		expect(screen.getByRole('button', { name: 'System' })).toHaveAttribute(
			'aria-pressed',
			'true',
		);
		expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute(
			'aria-pressed',
			'false',
		);
	});

	it('leaves the theme attribute off for the system default', () => {
		renderWidget();
		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(
			false,
		);
	});

	it('sets the theme attribute when light is chosen', () => {
		renderWidget();
		openPanel();

		fireEvent.click(screen.getByRole('button', { name: 'Light' }));

		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
			'light',
		);
		expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute(
			'aria-pressed',
			'true',
		);
	});

	it('persists the chosen theme', () => {
		renderWidget();
		openPanel();

		fireEvent.click(screen.getByRole('button', { name: 'Dark' }));

		expect(mockSetItem).toHaveBeenCalledWith(
			THEME_STORAGE_KEY,
			JSON.stringify('dark'),
		);
	});

	it('restores a stored theme on mount', () => {
		mockGetItem.mockImplementation(key =>
			key === THEME_STORAGE_KEY ? JSON.stringify('light') : null,
		);

		renderWidget();

		expect(document.documentElement.getAttribute(THEME_ATTRIBUTE)).toBe(
			'light',
		);
	});

	it('disables the theme reset until a theme is chosen', () => {
		renderWidget();
		openPanel();

		const resetTheme = screen.getByRole('button', { name: 'Reset theme' });
		expect(resetTheme).toBeDisabled();

		fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
		expect(resetTheme).toBeEnabled();
	});

	it('returns to the system default when the theme is reset', () => {
		renderWidget();
		openPanel();

		fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
		fireEvent.click(screen.getByRole('button', { name: 'Reset theme' }));

		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(
			false,
		);
	});

	it('returns to the system default when everything is reset', () => {
		renderWidget();
		openPanel();

		fireEvent.click(screen.getByRole('button', { name: 'Light' }));
		fireEvent.click(screen.getByRole('button', { name: 'Reset all' }));

		expect(document.documentElement.hasAttribute(THEME_ATTRIBUTE)).toBe(
			false,
		);
	});
});
