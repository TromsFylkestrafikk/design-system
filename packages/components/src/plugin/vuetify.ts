import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import { SvipperDark, SvipperLight } from '../theme/svipper';
import { nno } from '../translations/nno';

// Treeshakable icons
import 'vuetify/styles';

export const vuetify = createVuetify({
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
});
