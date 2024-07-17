# Figma to Design Tokens W3C Spec

This is a composable package that exports Figma variables in the Design Tokens (W3C) spec, regardless of Figma environment it is running in.


## Usage

Import the package into your script and provide the necessary options.

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
    api: "rest",
    response
});
```

## Props

- `props`: `RestAPIProps` | `PluginAPIProps`

```ts
type PluginAPIProps = {
    api?: 'plugin'
    client: PluginAPI   // Reference to the Plugin API instance
}

type RestAPIProps = {
    api?: 'rest',
    response: GetLocalVariablesResponse     // Response from Figma Rest API
}
```

## Under the hood

Figma Variables are accessed using either the Figma Plugin API or the REST API. This results in the data structure below.

```json
// Figma `GetLocalVariablesResponse` from the REST API. the Plugin API deals with the same file structure under the hood.

{
        "status": 200,
        "error": false,
        "meta": {
            "variableCollections": {
                "VariableCollectionId:1": {
                    "id": "VariableCollectionId:1",
                    "name": "Border",
                    "hiddenFromPublishing": false,
                    "key": "VariableCollectionId1",
                    "defaultModeId": "1",
                    "modes": [
                        {
                            "name":"Scale",
                            "modeId":"1"
                        }
                    ],
                    "remote":false,
                    "variableIds": [ "VariableID:1" ]
                }
        },
        "variables": {
            "VariableID:1": {
                "id":"VariableID:1",
                "name":"Radius/Small",
                "description":"",
                "variableCollectionId": "VariableCollectionId:1",
                "key": "VariableId1",
                "remote": false,
                "resolvedType": "FLOAT",
                "valuesByMode": { "1": 4 },
                "scopes":["CORNER_RADIUS"],
                "hiddenFromPublishing": false,
                "codeSyntax": {}
            }
        }
    }    
}
```

This package links up the variables collections and individual variables and modes, to then outputs the simple JSON structure below in the [design tokens format](https://tr.designtokens.org/format/#design-token-0).

```json
{
  "Radius": {
    "Small": {
      "value": 4,
      "type": "number",
      "prefix": "border"
    }
  }
}
```

This design tokens specification can be consumed by your favorite tool to connect design and code using design tokens. We provide an implementation [example for Style Dictionary](https://github.com/TromsFylkestrafikk/design-system/blob/main/packages/tokens/scripts/parse-tokens.ts).

