# 🎨 Design system monorepo for Troms County

Our design system monorepo contains packages related to our design system. These packages together make up our entire design system workflow and are the source of truth for our designs. The packages included are listed and described below.

- `@tfk-samf/tokens`

Contains raw design tokens that have been exported from Figma using the [Design Tokens (W3C) plugin](hhttps://www.figma.com/community/plugin/1377982390646186215/design-tokens-w3c-export) and exports their compiled counterparts to be used throughout our design portfolio as set-in-stone design desicisions. This package follows the same standard as set by Norway's OMS (Offentlig Mobilitets Samarbeid) collaboration, such that all work on our design system can be used by other OMS partners as well.

- `@tfk-samf/components`

Contains components implementing our design tokens (`@tfk-samf/tokens`) that are the concrete building blocks of our applications. These components are web components, such that they can be used across different web stacks. This package can be used by other OMS partners as well, since we are relying on the design token standard set by the collaboration.

- `@tfk-samf/figma-dtcg-plugin`

This Figma plugin exports Figma variables into separate JSON files (in the Desing Tokens (W3C) specification) per collection in a .zip file for easy download. These can then be processed further using a tool such as [Style Dictionary](https://v4.styledictionary.com)

- `@tfk-samf/figma-to-dtcg`

The underlying logic in the plugin above. This package Figma variables in the Design Tokens (W3C) spec, regardless of Figma environment it is running in.