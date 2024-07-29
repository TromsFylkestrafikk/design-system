import '@tfk-samf/tokens/css'
import './style/index.css'

import { createVuetify } from "vuetify"
import { computed, nextTick, Plugin, ref, watch } from 'vue'
import { SvipperDark, SvipperLight } from './vuetify/svipper-theme'
import { nno } from './vuetify/nno'

import "vuetify/styles"
// Treeshakable icons
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

// Re-export everything from Vuetify for consistent
export * from "vuetify/components"
export * from "vuetify"
export * from "vuetify/directives"

type Theme = "dark" | "light" | "auto"

export const createTfkApp = (): Plugin => {
    const dataTheme = ref<Theme>(document.documentElement.getAttribute("data-theme") as Theme)

    const prefersThemeRule = window.matchMedia('(prefers-color-scheme: dark)')
    const prefersTheme = ref<Theme>(prefersThemeRule.matches ? "dark" : "light")

    const mode = new MutationObserver((mutationList) => {
        if (mutationList[0].attributeName !== "data-theme") return
        dataTheme.value = document.documentElement.getAttribute("data-theme") as Theme
    })

    // const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')

    const elem = document.documentElement

    const mutationOptions = {
        childList: false,
        subtree: false,
        attributes: true,
        characterData: false
    }

    const currentTheme = computed(() => {
        const t = dataTheme.value === "auto" ? prefersTheme.value : dataTheme.value
        const newT =  t === "light" ? "SvipperLight" : "SvipperDark"

        return newT
    })


    const vuetify = createVuetify({
        theme: {
            defaultTheme: currentTheme.value,
            themes: {
                SvipperDark,
                SvipperLight
            }
        },
        locale: {
            locale: "no",
            messages: {
                nno
            }
        },
        icons: {
            defaultSet: 'mdi',
            aliases,
            sets: {
                mdi,
            },
        },
    })
    
    watch(currentTheme, () => {
        //Side effect
        vuetify.theme.global.name.value = currentTheme.value
    })

    return {
        install(app) {
            app.use(vuetify)

            const mount = app.mount
            const unmount = app.unmount

            app.mount = (...options) => {
                nextTick(() => mode.observe(elem, mutationOptions))

                nextTick(() => prefersThemeRule.addEventListener("change", (val) => {
                    prefersTheme.value = val.matches ? "dark" : "light"
                }))

                // watchEffect(() => {
                //     let theme = dataTheme.value === "auto" ? prefersTheme.value : dataTheme.value
            
                //     uTheme.global.name.value = theme === "light" ? "SvipperLight" : "SvipperDark"
                    
                // })

                return mount.call(app, ...options)
            }

            app.unmount = (...options) => {
                mode.disconnect()

                return unmount.call(app, ...options)
            }


        }
    }
}

