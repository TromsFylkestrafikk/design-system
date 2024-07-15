# Export Design Tokens (W3C) from Figma

This plugin exports Figma variables into separate JSON files per collection and modes grouped in a .zip file for easy download. 

## Background
This plugin has been created for managing the design system of the public mobility collaboration (Offentlig Mobilitetssamarbeid [OMS]) in Norway. This project creates whitelabel software for the public transport sector, which can then be shared across the entire country. This means that multiple organisations are creating multiple themes using this design system. To manage the complexity, Figma variables are considered the source of truth for design decisions.

## Flow
The design system is structured in multiple layers.

1. Base layer
   
  _The base layer defines color palettes and other scales that are not used directly, but define a coherent system of colors and values that will be used to define the rest of the design system._  
  
2. Semantic layer

  _The sementic layer adds meaning to the variables from the `Base layer`. Semantic variables always reference to a variable in the base layer. Semantic variables are exported and will be used in implementations of products._
  
3. Implementation layer

  _Using this plugin, variables are exported from Figma and imported into a Node project. [Amazon's Style Dictionary project](https://amzn.github.io/style-dictionary/) can parse these files and format them in any desired format, such as CSS Custom Properties of TypeScript variables. These variables can then be used directly in your web or native project._

<img width="3184" alt="Flow of the design system, from color definition, definition of meaning for those colors and the use of those colors." src="https://github.com/TromsFylkestrafikk/figma-design-tokens/assets/162139399/bdd81e95-2704-4025-81db-7ab43872d94c">

## Set-up variable collections
Collections are a way to structure a group of variables in Figma. Each layer in this design system structure can contain multiple collections, which can be linked together.

<img width="156" alt="Collections in Figma named base colors, colors, border, spacing and typography." src="https://github.com/TromsFylkestrafikk/figma-design-tokens/assets/162139399/69ec42b8-4a7a-4fce-babe-15ccbea52ed9">

### Base colors
This collection contains the color palette for each organization. It defines all shades of the colors in the palette, such as grey, orange, etcetera. 

<img width="843" alt="Color collection in Figma defining HEX values for the used color palette." src="https://github.com/TromsFylkestrafikk/figma-design-tokens/assets/162139399/7cfd4b50-5dc1-4622-afd3-95d7ac5f039f">

### Colors
In this collection, meaning is defined to the base colors by referencing them and giving them a new name (an alias). This is where the dark and light themes per organization are built. 

<img width="641" alt="Color collection in Figma with foreground, background, border, status and interaction colors." src="https://github.com/TromsFylkestrafikk/figma-design-tokens/assets/162139399/f9de1805-b7ff-469e-9104-e87d668128cf">

### Border
The border collection defines characteristics of the borders used throughout applications regardless of theme and organization. Note that border colors are defined in the `Colors` collection, since the colors are dependent on theme and organization.

<img width="641" alt="Border collection in Figma with border radius and width values." src="https://github.com/TromsFylkestrafikk/figma-design-tokens/assets/162139399/13b027bf-dcbd-4b3b-8334-836451c7eab7">

### Divide and conquer
Collections are not limited to the ones described here. Any set of variables where a certain scale should be enforced is a candidate for the `Base layer`. Splitting the semantic layer up in ccollections can be particularly useful when we want to share variables across themes or organizations. They do not need to be redefined for each theme per organization, as per our `Border` collection.

## Style Dictionary scripts
_Coming soon..._

## Usage with REST API
_Coming soon..._
