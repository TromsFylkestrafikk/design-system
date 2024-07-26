import '@tfk-samf/tokens/css'
import './style/index.css'
import "vuetify/styles"
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from "vuetify"
import { Plugin } from 'vue'
import { SvipperDark, SvipperLight } from './vuetify/svipper-theme'

export const createTfkApp = (): Plugin => {
    const vuetify = createVuetify({
        theme: {
            defaultTheme: 'SvipperDark',
            themes: {
                SvipperDark,
                SvipperLight
            }
        },
    })

    return {
        install(app) {
            app.use(vuetify)
        }
    }
}

