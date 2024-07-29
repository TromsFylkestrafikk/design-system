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
import { createApp } from 'vue'

const tfk = createTfkApp()

createApp(App).use(tfk).mount('#app')

```

## Using icons in your app

By default, only the icons required by Vuetify are bundled in the package. If you want to add your own icons, you can do so by installing Material Design Icons (MDI) as a dev dependency locally. Install the ES Module version of MDI like so.

`npm install @mdi/js -D`

Then import the individual icon in your Vue component and use it in `<v-icon>`

```vue
<script setup>
    import { VIcon } from '@tfk-samf/components'
    import { mdiAccount } from '@mdi/js'
</script>

<template>
    <v-icon :icon="mdiAccount" />
</template>
```