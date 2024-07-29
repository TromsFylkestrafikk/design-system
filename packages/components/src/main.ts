import '@tfk-samf/tokens/css';
import './style/index.css';

import type { Plugin } from 'vue';

import { useDynamicTheme } from './theme/useDynamicTheme';
import { vuetify } from './plugin/vuetify';

// Re-export everything from Vuetify for consistent
export * from 'vuetify/components';
export * from 'vuetify';
export * from 'vuetify/directives';

export const createTfkApp = (): Plugin => {
  const { addThemeListeners, removeThemeListeners } = useDynamicTheme(vuetify);

  return {
    install(app) {
      app.use(vuetify);

      const { mount } = app;

      // When the app is mounted
      app.mount = (...options) => {
        addThemeListeners();
        return mount.call(app, ...options);
      };

      // When the app is unmounted
      const { unmount } = app;
      app.unmount = (...options) => {
        removeThemeListeners();
        return unmount.call(app, ...options);
      };
    },
  };
};
