import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import merge from 'deepmerge';
import { SvipperDark, SvipperLight } from '../theme/svipper';
import { nno } from '../translations/nno';

// Treeshakable icons
import 'vuetify/styles';

const makeVuetifyConfig = (options?: Partial<Parameters<typeof createVuetify>[0]>) => createVuetify(
  merge(options, {
    theme: {
      themes: {
        SvipperDark,
        SvipperLight,
      },
    },
    locale: {
      locale: 'no',
      messages: {
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
  }),
);

export { makeVuetifyConfig };
