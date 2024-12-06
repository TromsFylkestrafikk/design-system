import type { ThemeDefinition } from "vuetify";
import type { Themes, Mode, ContrastColor, Theme } from "@atb-as/theme";

const VUETIFY_THEME_KEYS = [
  "background",
  "surface",
  "surface-bright",
  "surface-light",
  "surface-variant",
  "primary",
  "info",
  "error",
  "success",
  "warning",
];

// Mapping from Vuetify variable to design token
// TODO: Replace hardcoded colors with variables from `theme` when available
const VuetifyMap = (theme: Theme): Record<string, ContrastColor> => ({
  background: theme.color.background.neutral[0],
  surface: theme.color.background.neutral[0],
  "surface-bright": theme.color.background.neutral[1],
  "surface-light": theme.color.background.neutral[3],
  "surface-variant": theme.color.background.accent[2],
  primary: theme.color.brand.primary,
  secondary: theme.color.brand.secondary,
  info: theme.color.status.info.primary,
  error: theme.color.status.error.primary,
  success: theme.color.status.valid.primary,
  warning: theme.color.status.warning.primary,
});

// Generates a background-foreground pair for the specific key
const generateColorPair = (
  theme: Theme,
  key: string
): Record<string, string> => ({
  [key]: VuetifyMap(theme)[key].background,
  [`on-${key}`]: VuetifyMap(theme)[key].foreground.primary,
});

const getVuetifyThemeVars = <T extends Themes>(themes: T, mode: Mode) =>
  VUETIFY_THEME_KEYS.reduce(
    (acc, key) => ({
      ...acc,
      ...generateColorPair(themes[mode], key),
    }),
    {} as Record<string, string>
  );

const createLightTheme = <T extends Themes>(themes: T) =>
  ({
    dark: false,
    colors: getVuetifyThemeVars(themes, "light"),
  } as ThemeDefinition);

const createDarkTheme = <T extends Themes>(themes: T) =>
  ({
    dark: true,
    colors: getVuetifyThemeVars(themes, "dark"),
  } as ThemeDefinition);

export { createLightTheme, createDarkTheme };
