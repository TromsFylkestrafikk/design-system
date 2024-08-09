import { createVuetify } from 'vuetify';
import { no } from 'vuetify/locale';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import merge from 'deepmerge';
import { SvipperDark, SvipperLight } from '../theme/svipper';
import { nno } from '../translations/nno';

import 'vuetify/styles';

const makeVuetifyConfig = (options?: Partial<Parameters<typeof createVuetify>[0]>) => createVuetify(
  merge({
    defaults: {
      global: {
        ripple: false,
      },
    },
    theme: {
      themes: {
        SvipperDark,
        SvipperLight,
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
  }, options),
);

export { makeVuetifyConfig };
