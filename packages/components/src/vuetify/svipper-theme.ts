import type { ThemeDefinition } from 'vuetify';
import { themes } from '@tfk-samf/tokens/ts';

type Mode = 'Light' | 'Dark'

const getTextColor = (hex: string): 'black' | 'white' => {
  // Remove the hash (#) if it exists
  const hexColor = hex.replace(/^#/, '');

  // Parse the hex color
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return L > 0.179 ? 'black' : 'white';
};

// Mapping from Vuetify variable to design token
const VuetifyMap = (mode: Mode): Record<string, string> => ({
  background: themes[mode].Color.Background.Neutral[0].Background,
  surface: themes[mode].Color.Background.Accent[0].Background,
  primary: themes[mode].Color.Background.Accent[0].Background,
  secondary: themes[mode].Color.Background.Accent[0].Background,
  info: themes[mode].Color.Status.Info.Primary.Background,
  error: themes[mode].Color.Status.Error.Primary.Background,
  success: themes[mode].Color.Status.Success.Primary.Background,
  warning: themes[mode].Color.Status.Warning.Primary.Background,
});

// Generates a background-foreground pair for the specific key
const generateColorPair = (mode: Mode, key: string): Record<string, string> => ({
  [key]: VuetifyMap(mode)[key],
  [`on-${key}`]: getTextColor(VuetifyMap(mode)[key]),
});

const getVuetifyThemeVars = (mode: Mode) => {
  const keys = Object.keys(VuetifyMap(mode));

  return keys.reduce((acc, key) => ({
    ...acc, ...generateColorPair(mode, key),
  }), {} as Record<string, string>);
};

const SvipperLight: ThemeDefinition = {
  dark: false,
  colors: getVuetifyThemeVars('Light'),
};

const SvipperDark: ThemeDefinition = {
  dark: true,
  colors: getVuetifyThemeVars('Dark'),
};

export { SvipperDark, SvipperLight };
