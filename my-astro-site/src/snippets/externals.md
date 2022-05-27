---
title: Externals
id: externals
priority: 2
---
Externals allow you to mark certain modules as modules to exclude from resolving, loading, and bundling, you use it the way you'd use the esbuild externals config option, e.g. 
```ts
{
  "esbuild": {
    "external": ["react", "react-dom"],
  }
}
``` 

> You can try it out below, [`bundlejs.com/?config={"esbuild":{"external":["@okikio/animate"]}}`](https://bundlejs.com/?config={"esbuild":{"external":["@okikio/animate"]}})

> Check out a complex example of using the external config
[`bundlejs.com/?q=@babel/core&config={"esbuild":{"external":[...]}}`](https://bundlejs.com/?q=@babel/core&config={%22esbuild%22:{%22external%22:[%22debug%22,%22@babel/types%22,%22@babel/parser%22,%22@babel/generator%22,%22@babel/traverse%22,%22@babel/template%22,%22@babel/helper%22,%22semver%22,%22gensync%22,%22@babel/code-frame%22,%22json5%22,%22caniuse-lite%22,%22source-map%22,%22@ampproject/remapping%22,%22@babel/helper-compilation-targets%22,%22@babel/helper-validator-option%22,%22browserslist%22,%22@jridgewell/trace-mapping%22,%22convert-source-map%22,%22@babel/helpers%22,%22@babel/compat-data%22,%22@babel/helper-environment-visitor%22,%22@babel/helper-module-imports%22,%22@babel/helper-module-transforms%22,%22@babel/helper-validator-identifier%22,%22node-releases%22,%22@jridgewell/resolve-uri%22,%22@jridgewell/sourcemap-codec%22,%22electron-to-chromium%22]}})