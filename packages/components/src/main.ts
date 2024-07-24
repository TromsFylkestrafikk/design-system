// @ts-nocheck
// Get Svipper design tokens
import { createLightTheme, createDarkTheme } from '@fluentui/tokens'
import * as fluentui from '@fluentui/web-components';
import { colorTokens } from './theme/theme';
import { svipper } from './theme/brand';

const light = createLightTheme(svipper)
const dark = createDarkTheme(svipper)

fluentui.setTheme(dark)

const OMSDesignSystem = Object.freeze({
    prefix: "tfk",
    shadowRootMode: "open",
    registry: customElements
})

// type AvailableComponent = Exclude<keyof typeof allComponents, "register">
// fluentButton > Button
// type StripFluentPrefix<T extends AvailableComponent> = T extends `${infer _}${infer _}${infer _}${infer _}${infer _}${infer _}${infer Rest}` ? Rest : T;

type Components<T extends string> = T extends `${infer A}Definition` ? A : never
type All = Components<keyof typeof fluentui>

type ThemeProps = {
    components: Exclude<All, "accordion" | "accordionItem">[] //,
    prefix: "tfk" | "svipper"
}

const hasKey = (key: string): key is keyof typeof fluentui => key in fluentui

export const createTheme = (props: ThemeProps) => {
    props.components.forEach(component => {
        const fluentComponent = fluentui[`${component}`]
        const style = `${component}Styles`
        const template = `${component}Template`
        const kebabize = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

        // TODO: Kebab case instead of `toLowerCase`
        fluentComponent.compose({
            name: `${OMSDesignSystem.prefix}-${kebabize(component)}`,
            styles: hasKey(style) ? fluentui[style] : null,
            template: hasKey(template) ? fluentui[template] : null,
        }).define(OMSDesignSystem.registry)
    })
}