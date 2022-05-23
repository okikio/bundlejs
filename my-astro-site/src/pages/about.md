---
layout: ../layouts/ContentLayout.astro
title: About - bundlejs
description: Details about how bundle was made as well, as a list of links, sources, and tools used to make bundlejs.
---
## About

**bundlejs** is a quick and easy way to bundle your projects, minify and see their gzip and brotli size. It's an online tool similar to [bundlephobia](https://bundlephobia.com), but **bundlejs** does all the bundling locally on you browser and can treeshake and bundle multiple packages (both commonjs and esm) together, all without having to install any npm packages and with typescript support.  
  

I used [monaco-editor](https://github.com/microsoft/monaco-editor) for the code-editor, [esbuild](https://github.com/evanw/esbuild) as bundler and treeshaker respectively, [denoflate](https://github.com/hazae41/denoflate) as a wasm port of gzip, [deno\_brotli](https://github.com/denosaurs/deno_brotli) as a wasm port of brotli, [deno\_lz4](https://github.com/denosaurs/deno_lz4) as a wasm port of lz4, [bytes](https://github.com/visionmedia/bytes.js) to convert the compressed size to human readable values, [esbuild-visualizer](https://github.com/btd/esbuild-visualizer) to visualize and analyze your esbuild bundle to see which modules are taking up space, [umami](https://github.com/mikecao/umami) for private, publicly available analytics and general usage stats all without cookies, and [countapi-js](https://github.com/mlomb/countapi-js) to keep track of the number of page visits, in a private and secure way.  
  
This project was greatly influenced by [@hardfists](https://github.com/hardfist) [neo-tools](https://github.com/hardfist/neo-tools) and [@mizchi's](https://github.com/mizchi) [uniroll](https://github.com/mizchi/uniroll) project.  
  

> Some of bundlejs's latest features were inspired by [egoist/play-esbuild](https://github.com/egoist/play-esbuild) and [hyrious/esbuild-repl](https://github.com/hyrious/esbuild-repl), check them out they each use esbuild in different ways.

The project isn't perfect, I am still working on an autocomplete, better mobile support and the high memory usage of **esbuild** and **monaco** as well as some edge case packages, e.g. **monaco-editor.**  
  
If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it. You can contribute to this project at [okikio/bundle.](https://github.com/okikio/bundle)  
  
**bundle** uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, and the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.  
  
You can join the discussion on [github discussions](https://github.com/okikio/bundle/discussions).