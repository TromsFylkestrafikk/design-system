# Component Library for Troms County

This package wraps the Vuetify package to provide components in the Troms County style as building blocks to build web applications. 

## Getting started

Create a Vue application. Install `@tfk-samf/components` using the `npm i` command

```sh
npm i @tfk-samf/components
```

Configure and use the package in your `main.ts`.


```ts
import { createTfkApp } from '@tfk-samf/components'
import "@tfk-samf/components/style"

import App from './App.vue'

const tfk = createTfkApp()

createApp(App).use(tfk).mount('#app')

```

