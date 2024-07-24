import { svipper as brand } from './brand'
import { themes } from '@tfk-samf/tokens/ts'

const theme = themes["Light"]
type Layer = "Background" | "Foreground"

const whiteAlpha = {
    '5': 'rgba(255, 255, 255, 0.05)',
    '10': 'rgba(255, 255, 255, 0.1)',
    '20': 'rgba(255, 255, 255, 0.2)',
    '30': 'rgba(255, 255, 255, 0.3)',
    '40': 'rgba(255, 255, 255, 0.4)',
    '50': 'rgba(255, 255, 255, 0.5)',
    '60': 'rgba(255, 255, 255, 0.6)',
    '70': 'rgba(255, 255, 255, 0.7)',
    '80': 'rgba(255, 255, 255, 0.8)',
    '90': 'rgba(255, 255, 255, 0.9)'
};

const blackAlpha = {
    '5': 'rgba(0, 0, 0, 0.05)',
    '10': 'rgba(0, 0, 0, 0.1)',
    '20': 'rgba(0, 0, 0, 0.2)',
    '30': 'rgba(0, 0, 0, 0.3)',
    '40': 'rgba(0, 0, 0, 0.4)',
    '50': 'rgba(0, 0, 0, 0.5)',
    '60': 'rgba(0, 0, 0, 0.6)',
    '70': 'rgba(0, 0, 0, 0.7)',
    '80': 'rgba(0, 0, 0, 0.8)',
    '90': 'rgba(0, 0, 0, 0.9)'
};

const generateColorPairs = ["Background", "Foreground"].reduce((acc, layer) => {
    const _layer = layer as Layer

    type Token = {
        Background: string
        Foreground: {
            Primary: string,
            Secondary: string,
            Disabled: string
        }
    }

    const get = (value: Token, layer: Layer, type?: "Primary" | "Secondary" | "Disabled") => {
        let response = value[layer]
        const isForeground = (_: Token[typeof layer]): _ is Token["Foreground"] => layer === "Foreground"

        return isForeground(response) ? response[type!] : response
    }

    return {
        ...acc,
        [`colorNeutral${layer}1`]: get(theme.Color.Interactive[2].Default, _layer, "Primary"),
        [`colorNeutral${layer}1Hover`]: get(theme.Color.Interactive[2].Hover, _layer, "Primary"),
        [`colorNeutral${layer}1Pressed`]: get(theme.Color.Interactive[2].Active, _layer, "Primary"),
        [`colorNeutral${layer}1Selected`]: get(theme.Color.Interactive[2].Active, _layer, "Primary"),
        [`colorNeutral${layer}2`]: get(theme.Color.Background.Neutral[1], _layer, "Primary"),
        [`colorNeutral${layer}2Hover`]: get(theme.Color.Background.Neutral[1], _layer, "Primary"),
        [`colorNeutral${layer}2Pressed`]: get(theme.Color.Background.Neutral[1], _layer, "Primary"),
        [`colorNeutral${layer}2Selected`]: get(theme.Color.Background.Neutral[1], _layer, "Primary"),
        [`colorNeutral${layer}2BrandHover`]: get(theme.Color.Background.Accent[1], _layer, "Primary"),
        [`colorNeutral${layer}2BrandPressed`]: get(theme.Color.Background.Accent[1], _layer, "Primary"),
        [`colorNeutral${layer}2BrandSelected`]: get(theme.Color.Background.Accent[1], _layer, "Primary"),
        [`colorNeutral${layer}3`]: get(theme.Color.Background.Neutral[2], _layer, "Primary"),
        [`colorNeutral${layer}3Hover`]: get(theme.Color.Background.Neutral[2], _layer, "Primary"),
        [`colorNeutral${layer}3Pressed`]: get(theme.Color.Background.Neutral[2], _layer, "Primary"),
        [`colorNeutral${layer}3Selected`]: get(theme.Color.Background.Neutral[2], _layer, "Primary"),
        [`colorNeutral${layer}3BrandHover`]: get(theme.Color.Background.Accent[2], _layer, "Primary"),
        [`colorNeutral${layer}3BrandPressed`]: get(theme.Color.Background.Accent[2], _layer, "Primary"),
        [`colorNeutral${layer}3BrandSelected`]: get(theme.Color.Background.Accent[2], _layer, "Primary"),
        [`colorNeutral${layer}4`]: get(theme.Color.Background.Neutral[3], _layer, "Primary"),
        [`colorNeutral${layer}Disabled`]: get(theme.Color.Background.Neutral[3], _layer, "Disabled"),

        [`colorNeutral${layer}InvertedDisabled`]: get(theme.Color.Background.Neutral[3], _layer, "Primary"),
        [`colorBrand${layer}Link`]: brand[70],
        [`colorBrand${layer}LinkHover`]: brand[60],
        [`colorBrand${layer}LinkPressed`]: brand[40],
        [`colorBrand${layer}LinkSelected`]: brand[70],
        [`colorNeutral${layer}2Link`]: get(theme.Color.Background.Accent[3], _layer, "Primary"),
        [`colorNeutral${layer}2LinkHover`]: get(theme.Color.Background.Accent[3], _layer, "Primary"),
        [`colorNeutral${layer}2LinkPressed`]: get(theme.Color.Background.Accent[3], _layer, "Primary"),
        [`colorNeutral${layer}2LinkSelected`]: get(theme.Color.Background.Accent[3], _layer, "Primary"),
        [`colorCompoundBrand${layer}1`]: brand[80],
        [`colorCompoundBrand${layer}1Hover`]: brand[70],
        [`colorCompoundBrand${layer}1Pressed`]: brand[60],
        [`colorBrand${layer}1`]: brand[80],
        [`colorBrand${layer}2`]: brand[70],
        [`colorBrand${layer}2Hover`]: brand[60],
        [`colorBrand${layer}2Pressed`]: brand[30],
        [`colorNeutral${layer}1Static`]: get(theme.Color_palette.Gray[900], _layer, "Primary"),
        [`colorNeutral${layer}StaticInverted`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}Inverted`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}InvertedHover`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}InvertedPressed`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}InvertedSelected`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}Inverted2`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}OnBrand`]: get(theme.Color_palette.Gray[1000], _layer, "Primary"),
        [`colorNeutral${layer}InvertedLink`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}InvertedLinkHover`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}InvertedLinkPressed`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorNeutral${layer}InvertedLinkSelected`]: get(theme.Color_palette.Gray[0], _layer, "Primary"),
        [`colorBrand${layer}Inverted`]: brand[100],
        [`colorBrand${layer}InvertedHover`]: brand[110],
        [`colorBrand${layer}InvertedPressed`]: brand[100],
        [`colorBrand${layer}OnLight`]: brand[80],
        [`colorBrand${layer}OnLightHover`]: brand[70],
        [`colorBrand${layer}OnLightPressed`]: brand[50],
        [`colorBrand${layer}OnLightSelected`]: brand[60],
    }
}, {})

// import { black, blackAlpha, grey, white, whiteAlpha } from '../global/colors';
export const generateColorTokens = () => ({
    ...generateColorPairs,
    colorNeutralBackground4: theme.Color.Background.Neutral[3].Background,
    colorNeutralBackground4Hover: theme.Color.Background.Neutral[3].Background,
    colorNeutralBackground4Pressed: theme.Color.Background.Neutral[3].Background,
    colorNeutralBackground4Selected: theme.Color.Background.Neutral[3].Background,
    colorNeutralBackground5: theme.Color.Background.Accent[3].Background,
    colorNeutralBackground5Hover: theme.Color.Background.Accent[3].Background,
    colorNeutralBackground5Pressed: theme.Color.Background.Accent[3].Background,
    colorNeutralBackground5Selected: theme.Color.Background.Accent[3].Background,
    colorNeutralBackground6: theme.Color.Background.Neutral[1].Background,
    colorNeutralBackgroundStatic: theme.Color.Background.Neutral[2].Background,
    colorNeutralBackgroundAlpha: whiteAlpha[50],
    colorNeutralBackgroundAlpha2: whiteAlpha[80],
    colorSubtleBackground: 'transparent',
    colorSubtleBackgroundHover: theme.Color.Interactive[0].Default.Background,
    colorSubtleBackgroundPressed: theme.Color.Interactive[0].Active.Background,
    colorSubtleBackgroundSelected: theme.Color.Interactive[0].Active.Background,
    colorSubtleBackgroundLightAlphaHover: whiteAlpha[70],
    colorSubtleBackgroundLightAlphaPressed: whiteAlpha[50],
    colorSubtleBackgroundLightAlphaSelected: 'transparent',
    colorSubtleBackgroundInverted: 'transparent',
    colorSubtleBackgroundInvertedHover: blackAlpha[10],
    colorSubtleBackgroundInvertedPressed: blackAlpha[30],
    colorSubtleBackgroundInvertedSelected: blackAlpha[20],

    colorTransparentBackground: 'transparent',
    colorTransparentBackgroundHover: 'transparent',
    colorTransparentBackgroundPressed: 'transparent',
    colorTransparentBackgroundSelected: 'transparent',

    colorNeutralStencil1: theme.Color.Background.Neutral[1].Background,
    colorNeutralStencil2: theme.Color.Background.Neutral[2].Background,
    colorNeutralStencil1Alpha: blackAlpha[10],
    colorNeutralStencil2Alpha: blackAlpha[5],

    colorBackgroundOverlay: blackAlpha[40],
    colorScrollbarOverlay: blackAlpha[50],

    colorBrandBackground: theme.Color.Interactive[0].Default.Background,
    colorBrandBackgroundHover: theme.Color.Interactive[0].Hover.Background,
    colorBrandBackgroundPressed: theme.Color.Interactive[0].Active.Background,
    colorBrandBackgroundSelected: theme.Color.Interactive[0].Active.Background,
    colorCompoundBrandBackground: theme.Color.Interactive[3].Default.Background,
    colorCompoundBrandBackgroundHover: theme.Color.Interactive[3].Hover.Background,
    colorCompoundBrandBackgroundPressed: theme.Color.Interactive[3].Active.Background,
    colorBrandBackgroundStatic: theme.Color.Background.Accent[3].Background,

    colorBrandBackground3Static: theme.Color.Background.Accent[4].Background,
    colorBrandBackground4Static: theme.Color.Background.Accent[0].Background,


    colorBrandBackgroundInvertedSelected: theme.Color.Background.Accent[5].Background,
    colorNeutralCardBackground: theme.Color.Interactive[2].Default.Background,
    colorNeutralCardBackgroundHover: theme.Color.Interactive[2].Hover.Background,
    colorNeutralCardBackgroundPressed: theme.Color.Interactive[2].Active.Background,
    colorNeutralCardBackgroundSelected: theme.Color.Interactive[2].Active.Background,
    colorNeutralCardBackgroundDisabled: theme.Color.Interactive[2].Disabled.Background,

    colorNeutralStrokeAccessible: theme.Color.Interactive[0].Outline.Background,
    colorNeutralStrokeAccessibleHover: theme.Color.Interactive[0].Outline.Background,
    colorNeutralStrokeAccessiblePressed: theme.Color.Interactive[0].Outline.Background,
    colorNeutralStrokeAccessibleSelected: theme.Color.Interactive[0].Outline.Background,
    colorNeutralStroke1: theme.Color.Interactive[1].Outline.Background,
    colorNeutralStroke1Hover: theme.Color.Interactive[1].Outline.Background,
    colorNeutralStroke1Pressed: theme.Color.Interactive[1].Outline.Background,
    colorNeutralStroke1Selected: theme.Color.Interactive[1].Outline.Background,
    colorNeutralStroke2: theme.Color.Interactive[2].Outline.Background,
    colorNeutralStroke3: theme.Color.Interactive[3].Outline.Background,
    colorNeutralStrokeSubtle: theme.Color.Interactive[3].Outline.Background,
    colorNeutralStrokeOnBrand: theme.Color_palette.Gray[0].Background,
    colorNeutralStrokeOnBrand2: theme.Color_palette.Gray[0].Background,
    colorNeutralStrokeOnBrand2Hover: theme.Color_palette.Gray[0].Background,
    colorNeutralStrokeOnBrand2Pressed: theme.Color_palette.Gray[0].Background,
    colorNeutralStrokeOnBrand2Selected: theme.Color_palette.Gray[0].Background,
    colorBrandStroke1: brand[80],
    colorBrandStroke2: brand[140],
    colorBrandStroke2Hover: brand[120],
    colorBrandStroke2Pressed: brand[80],
    colorBrandStroke2Contrast: brand[140],
    colorCompoundBrandStroke: brand[80],
    colorCompoundBrandStrokeHover: brand[70],
    colorCompoundBrandStrokePressed: brand[60],

    colorNeutralStrokeDisabled: theme.Color.Interactive[3].Outline.Background,
    colorNeutralStrokeInvertedDisabled: whiteAlpha[40],
    colorTransparentStroke: 'transparent',
    colorTransparentStrokeInteractive: 'transparent',
    colorTransparentStrokeDisabled: 'transparent',
    colorNeutralStrokeAlpha: blackAlpha[5],
    colorNeutralStrokeAlpha2: whiteAlpha[20],
    colorStrokeFocus1: theme.Color_palette.Gray[0].Background,
    colorStrokeFocus2: theme.Color_palette.Gray[1000].Background,
    colorNeutralShadowAmbient: 'rgba(0,0,0,0.12)',
    colorNeutralShadowKey: 'rgba(0,0,0,0.14)',
    colorNeutralShadowAmbientLighter: 'rgba(0,0,0,0.06)',
    colorNeutralShadowKeyLighter: 'rgba(0,0,0,0.07)',
    colorNeutralShadowAmbientDarker: 'rgba(0,0,0,0.20)',
    colorNeutralShadowKeyDarker: 'rgba(0,0,0,0.24)',
    colorBrandShadowAmbient: 'rgba(0,0,0,0.30)',
    colorBrandShadowKey: 'rgba(0,0,0,0.25)'
});

export const statusColorMapping: Record<string, "Success" | "Warning" | "Error"> = {
    success: 'Success',
    warning: 'Warning',
    danger: 'Error'
};

export const colorStatusTokens = Object.entries(statusColorMapping).reduce((acc, [statusColor, ourKey])=>{
    const color = statusColor.slice(0, 1).toUpperCase() + statusColor.slice(1);
    // TODO: double check the mapping with design
    const statusColorTokens = {
        [`colorStatus${color}Background1`]: theme.Color.Status[ourKey].Primary.Background,
        [`colorStatus${color}Background2`]: theme.Color.Status[ourKey].Secondary.Background,
        [`colorStatus${color}Background3`]: theme.Color.Status[ourKey].Secondary.Background,
        [`colorStatus${color}Foreground1`]: theme.Color.Status[ourKey].Primary.Foreground.Primary,
        [`colorStatus${color}Foreground2`]: theme.Color.Status[ourKey].Secondary.Foreground.Primary,
        [`colorStatus${color}Foreground3`]: theme.Color.Status[ourKey].Secondary.Foreground.Primary,
        [`colorStatus${color}ForegroundInverted`]: theme.Color.Status[ourKey].Primary.Background,
        [`colorStatus${color}BorderActive`]: theme.Color.Status[ourKey].Primary.Background,
        [`colorStatus${color}Border1`]: theme.Color.Status[ourKey].Secondary.Background,
        [`colorStatus${color}Border2`]: theme.Color.Status[ourKey].Secondary.Background,
    };
    return Object.assign(acc, statusColorTokens);
}, {});

export const colorTokens = {
    ...generateColorTokens(),
    ...colorStatusTokens
}

