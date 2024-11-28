import { createVuetify } from 'vuetify';
import { no } from 'vuetify/locale';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import merge from 'deepmerge';
import { Themes } from '@atb-as/theme';
import { nno } from '../translations/nno';
import { createDarkTheme, createLightTheme } from '../theme/createTheme';

const makeVuetifyConfig = (
  themes: Themes,
  options?: Partial<Parameters<typeof createVuetify>[0]>,
) => createVuetify(
  merge(
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
      locale: {
        locale: 'no',
        messages: {
          no,
          nno,
        },
      },
      icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
          mdi,
        },
      },
    },
    options,
  ),
);

export { makeVuetifyConfig };
