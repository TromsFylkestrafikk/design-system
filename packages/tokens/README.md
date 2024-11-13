> ⚠️ This package will soon be deprecated since `@atb-as/theme` now 
> provides the same features in the same formats.

# Design Tokens

Design tokens are the source of truth for design decisions. This package exports compiled design tokens for different stacks in the form of variables, such as CSS Custom Properties and TypeScript objects.

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