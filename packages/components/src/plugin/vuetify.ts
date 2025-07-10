import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { Themes } from '@atb-as/theme';
import { createDarkTheme, createLightTheme } from '../theme/createTheme';

const makeVuetifyConfig = (
  themes: Themes,
  options?: Partial<Parameters<typeof createVuetify>[0]>,
) => createVuetify(
  {
    defaults: {
      global: {
        ripple: false,
      },
    },
    theme: {
      themes: {
        dark: createDarkTheme(themes),
        light: createLightTheme(themes),
      },
    },
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    ...options,
  },
);

export { makeVuetifyConfig };
