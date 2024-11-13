import '@atb-as/theme/lib/generated/themes-fs/troms-theme/theme.css';
import './style/index.css';

import type { Plugin } from 'vue';

import { createVuetify } from 'vuetify';
import { useDynamicTheme } from './theme/useDynamicTheme';
import { makeVuetifyConfig } from './plugin/vuetify';

// Re-export everything from Vuetify for consistent
export * from 'vuetify/components';
export * from 'vuetify';
export * from 'vuetify/directives';

export const createTfkApp = (options: Parameters<typeof createVuetify>[0]): Plugin => {
  const vuetify = makeVuetifyConfig(options);
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
