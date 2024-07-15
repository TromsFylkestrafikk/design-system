# Figma to Design Tokens W3C Spec

This is a composable package that exports Figma variables in the Design Tokens (W3C) spec, regardless of Figma environment it is running in.  

## Props

- `props`: `RestAPIProps` | `PluginAPIProps`

`default`: `{ api: "plugin" }`

```ts
type PluginAPIProps = {
    api?: 'plugin'
}

type RestAPIProps = {
    api?: 'rest',
    response: GetLocalVariablesResponse     // Response from Figma Rest API
}
```

Import the package into your script and provide the necessary options.

## Usage

### Inside a Figma Plugin

Configure your [Figma plugin with typings](https://www.figma.com/plugin-docs/api/typings/) and pass the Figma client to the composable.

```ts
import { useFigmaToDTCG } from '@tfk-samf/figma-to-dtcg';

const { tokens } = await useFigmaToDTCG({
    api: "plugin",
    client: figma
});
```

### Using the Figma Variables Rest API

```ts
import { useFigmaToDTCG } from "@tfk-samf/figma-to-dtcg"
import { GetLocalVariablesResponse } from "@figma/rest-api-spec"

const response = await fetch("https://api.figma.com/v1/files/:file_key/variables/local", {
    headers: {
        "X-FIGMA-TOKEN": ":figma_token",
    }
})

const { tokens } = await useFigmaToDTCG({
    name: "rest",
    response
});
```