# Component Library for Troms County

This package provides components as building blocks to build web applications. Components are based on the [Shoelace](https://shoelace.style) web components.

## Integration with Vuetify

A legacy mode is provided in form of a Vuetify theme located at `@tfk-samf/components/vuetify`. This can be enabled by importing it into Vuetify in your `App.vue`.

```ts
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Import the themes
import { SvipperDark, SvipperLight } from '@tfk-samf/components/vuetify'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    // Register the themes
    defaultTheme: 'SvipperDark',
    themes: {
      SvipperDark,
      SvipperLight
    }
  },
})
```

