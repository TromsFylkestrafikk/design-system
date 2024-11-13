import type { ThemeDefinition } from 'vuetify';
import { createThemesFor, ThemeVariant } from '@atb-as/theme';

const themes = createThemesFor(ThemeVariant.Troms, {
  useFigmaStructure: true
})

type Mode = 'light' | 'dark'

// Mapping from Vuetify variable to design token
const VuetifyMap = (mode: Mode): Record<string, {
    background: string,
    foreground: {
      primary: string
    }
  }> => ({
  background: themes[mode].color.background.neutral[0],
  surface: themes[mode].color.background.neutral[0],
  'surface-bright': themes[mode].color.background.neutral[1],
  'surface-light': themes[mode].color.background.neutral[3],
  'surface-variant': themes[mode].color.background.accent[2],
  primary: themes[mode].color.background.accent[0],
  secondary: themes[mode].color.transport.city.secondary,
  info: themes[mode].color.status.info.primary,
  error: themes[mode].color.status.error.primary,
  success: themes[mode].color.status.valid.primary,
  warning: themes[mode].color.status.warning.primary,
});

// Generates a background-foreground pair for the specific key
const generatecolorPair = (mode: Mode, key: string): Record<string, string> => ({
  [key]: VuetifyMap(mode)[key].background,
  [`on-${key}`]: VuetifyMap(mode)[key].foreground.primary,
});

const getVuetifyThemeVars = (mode: Mode) => {
  const keys = Object.keys(VuetifyMap(mode));

  return keys.reduce((acc, key) => ({
    ...acc, ...generatecolorPair(mode, key),
  }), {} as Record<string, string>);
};

const SvipperLight: ThemeDefinition = {
  dark: false,
  colors: getVuetifyThemeVars('light'),
};

const SvipperDark: ThemeDefinition = {
  dark: true,
  colors: getVuetifyThemeVars('dark'),
};

export { SvipperDark, SvipperLight };
