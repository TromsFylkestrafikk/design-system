import type { Plugin } from 'vue';

import { createVuetify } from 'vuetify';
import { Themes } from '@atb-as/theme';
import { useDynamicTheme } from './theme/useDynamicTheme';
import { makeVuetifyConfig } from './plugin/vuetify';

import './style/index.css';

export const createOmsApp = (
  themes: Themes,
  options: Parameters<typeof createVuetify>[0],
): Plugin => {
  const vuetify = makeVuetifyConfig(themes, options);
  const { addThemeListeners, removeThemeListeners } = useDynamicTheme(vuetify);

  return {
    install(app) {
      app.use(vuetify);

      const { mount } = app;

      // When the app is mounted
      app.mount = (...params) => {
        addThemeListeners();
        return mount.call(app, ...params);
      };

      // When the app is unmounted
      const { unmount } = app;
      app.unmount = (...params) => {
        removeThemeListeners();
        return unmount.call(app, ...params);
      };
    },
  };
};
