import type { ThemeDefinition } from 'vuetify';
import { themes } from '@tfk-samf/tokens/ts';

type Mode = 'Light' | 'Dark'

// Mapping from Vuetify variable to design token
const VuetifyMap = (mode: Mode): Record<string, {
    Background: string,
    Foreground: {
      Primary: string
    }
  }> => ({
  background: themes[mode].Color.Background.Neutral[0],
  surface: themes[mode].Color.Background.Neutral[0],
  'surface-bright': themes[mode].Color.Background.Neutral[1],
  'surface-light': themes[mode].Color.Background.Neutral[3],
  'surface-variant': themes[mode].Color.Background.Accent[2],
  primary: themes[mode].Color_palette.Orange[500],
  'primary-darken-1': themes[mode].Color_palette.Orange[900],
  secondary: themes[mode].Color_palette.Blue[400],
  'secondary-darken-1': themes[mode].Color_palette.Blue[700],
  info: themes[mode].Color.Status.Info.Primary,
  error: themes[mode].Color.Status.Error.Primary,
  success: themes[mode].Color.Status.Success.Primary,
  warning: themes[mode].Color.Status.Warning.Primary,
});

// Generates a background-foreground pair for the specific key
const generateColorPair = (mode: Mode, key: string): Record<string, string> => ({
  [key]: VuetifyMap(mode)[key].Background,
  [`on-${key}`]: VuetifyMap(mode)[key].Foreground.Primary,
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
