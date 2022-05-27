---
title: Aliases
id: aliases
priority: 3
---
Aliases act as a redirect for modules, they are for replacing packages with different ones, e.g. replace `fs` with `memfs`, so, it can work on the web, etc..  
  
You use aliases like this:

```ts
{
  "alias": {
    "@okikio/animate": "react-dom"
  }
}
```

> You can try out an example of using aliases, [`bundlejs.com/?config={"alias":{"@okikio/animate":"react-dom"}}`](https://bundlejs.com/?config={"alias":{"@okikio/animate":"react-dom"}})

> ⚠️ Warning: aliases currently don't care about the original packages version, e.g. `@okikio/animate@beta` will be redirected to `react-dom` regardless of the package version in use.