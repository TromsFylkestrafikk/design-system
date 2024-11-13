import {
  computed, ref, watch, nextTick,
} from 'vue';
import { createVuetify } from 'vuetify';

type ThemeMode = 'dark' | 'light' | 'auto'

const getCurrentMode = (classList: DOMTokenList): ThemeMode => {
  if (classList.contains('light')) {
    return 'light'
  }

  if (classList.contains('dark')) {
    return 'dark'
  }

  return 'auto'
} 

/**
 * Decides which theme should be active given the `prefers-color-scheme`
 * and `class` parameters and sets that specific theme on the
 * Vuetify instance.
 *
 * @param vuetifyInstance The Vuetify instance for this app
 * @returns Event listeners to be added in onMounted and onUnmounted hooks
 */
export const useDynamicTheme = (vuetifyInstance: ReturnType<typeof createVuetify>) => {
  // Theme setting from the documentElement
  const configuredTheme = ref<ThemeMode>(getCurrentMode(document.documentElement.classList) as ThemeMode);

  // If the user prefers color a color scheme
  const prefersColorSchemeRule = window.matchMedia('(prefers-color-scheme: dark)');
  const prefersColorScheme = ref<ThemeMode>(prefersColorSchemeRule.matches ? 'dark' : 'light');

  // Event listener for `class` attribute
  const [mode, modeOptions] = [
    new MutationObserver(() => {
      configuredTheme.value = getCurrentMode(document.documentElement.classList);
    }), {
      childList: false,
      subtree: false,
      attributes: true,
      characterData: false,
    },
  ];

  // The name of the current Vuetify theme
  const currentTheme = computed(() => {
    const theme = configuredTheme.value === 'auto' ? prefersColorScheme.value : configuredTheme.value;
    return theme === 'light' ? 'SvipperLight' : 'SvipperDark';
  });

  // When the theme changes, we want to change the Vuetify theme programmatically
  watch(currentTheme, () => {
    vuetifyInstance.theme.global.name.value = currentTheme.value;
  }, {
    immediate: true,
  });

  // Callback for when the preferred color scheme changes
  const prefersColorSchemeCallback = (event: MediaQueryListEvent) => {
    prefersColorScheme.value = event.matches ? 'dark' : 'light';
  };

  const addThemeListeners = () => {
    nextTick(() => mode.observe(document.documentElement, modeOptions));
    nextTick(() => prefersColorSchemeRule.addEventListener('change', prefersColorSchemeCallback));
  };

  const removeThemeListeners = () => {
    mode.disconnect();
    prefersColorSchemeRule.removeEventListener('change', prefersColorSchemeCallback);
  };

  return { addThemeListeners, removeThemeListeners };
};
