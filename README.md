# 🎨 Design system for Troms Fylkeskommune

Our design system repository will contain both raw and compiled design tokens, turning them into variables that can be used across different stacks. This package can then be included in for example a component library for each stack to provide buildings blocks to build Troms Fylkeskommune applications for these stacks.

- `/tokens`

Contains raw design tokens that have been exported from Figma using the [Design Tokens (W3C) plugin](https://github.com/TromsFylkestrafikk/figma-design-tokens). 

## Usage

### CSS

To use the CSS tokens, import `@tfk-samf/tokens/css` into your project. For example in the `main.ts` file of your Vue web application.

```ts
// main.ts

// Import tokens
import '@tfk-samf/tokens/css'

// Import local CSS
import './assets/main.css'

// Initialize your app
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

The tokens become available in your application once you opt-in to the design system by adding the `data-theme` attribute to the root `<html>` tag of your page (web application). The `data-theme` attribute supports three values:

1. `data-theme="auto"`      The theme follows the system default (`prefers-color-scheme` from the user-agent)
2. `data-theme="light"`     Force a light theme, regardless of `prefers-color-scheme`
2. `data-theme="dark"`      Force a dark theme, regardless of `prefers-color-scheme`