import {
  computed, ref, watch, nextTick,
} from 'vue';
import { createVuetify } from 'vuetify';

type ThemeMode = 'dark' | 'light' | 'auto';

/**
 * Decides which theme should be active given the `prefers-color-scheme`
 * and `data-theme="..."` parameters and sets that specific theme on the
 * Vuetify instance.
 *
 * @param vuetifyInstance The Vuetify instance for this app
 * @returns Event listeners to be added in onMounted and onUnmounted hooks
 */
export const useDynamicTheme = (
  vuetifyInstance: ReturnType<typeof createVuetify>,
) => {
  // Theme setting from the documentElement
  const dataTheme = ref<ThemeMode>(
    document.documentElement.getAttribute('data-theme') as ThemeMode,
  );

  // If the user prefers color a color scheme
  const prefersColorSchemeRule = window.matchMedia(
    '(prefers-color-scheme: dark)',
  );
  const prefersColorScheme = ref<ThemeMode>(
    prefersColorSchemeRule.matches ? 'dark' : 'light',
  );

  // Event listener for `data-theme` attribute
  const [mode, modeOptions] = [
    new MutationObserver((mutationList) => {
      if (mutationList[0].attributeName !== 'data-theme') return;
      dataTheme.value = document.documentElement.getAttribute(
        'data-theme',
      ) as ThemeMode;
    }),
    {
      childList: false,
      subtree: false,
      attributes: true,
      characterData: false,
    },
  ];

  // The name of the current Vuetify theme
  const currentTheme = computed(() => {
    const theme = dataTheme.value === 'auto' ? prefersColorScheme.value : dataTheme.value;
    return theme === 'light' ? 'light' : 'dark';
  });

  // When the theme changes, we want to change the Vuetify theme programmatically
  watch(
    currentTheme,
    () => {
      vuetifyInstance.theme.change(currentTheme.value);
    },
    {
      immediate: true,
    },
  );

  // Callback for when the preferred color scheme changes
  const prefersColorSchemeCallback = (event: MediaQueryListEvent) => {
    prefersColorScheme.value = event.matches ? 'dark' : 'light';
  };

  const addThemeListeners = () => {
    nextTick(() => {
      mode.observe(document.documentElement, modeOptions);
      prefersColorSchemeRule.addEventListener(
        'change',
        prefersColorSchemeCallback,
      );
    });
  };

  const removeThemeListeners = () => {
    mode.disconnect();
    prefersColorSchemeRule.removeEventListener(
      'change',
      prefersColorSchemeCallback,
    );
  };

  return { addThemeListeners, removeThemeListeners };
};
