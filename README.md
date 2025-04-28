# [bundlejs](https://bundlejs.com)

> ✨ WOOOOOOH!! ✨ The bundlejs api is now out at [deno.bundlejs.com](https://deno.bundlejs.com) and/or [edge.bundlejs.com](https://edge.bundlejs.com), bundle your code and get a badge. 
> 
> Check out the [announcement tweet](https://twitter.com/jsbundle/status/1634455567321255936?s=20)

> I see a badge, you see a badge, we all see badges!!!
> 
> [![spring-easing's badge](https://deno.bundlejs.com/?q=spring-easing&badge=detailed&badge-style=for-the-badge)](https://bundlejs.com/?q=spring-easing)
> 

> To create a badge just replace the domain `bundlejs.com` domain with `deno.bundlejs.com` and add `/?badge`, yeah, that simple

<a href="https://www.producthunt.com/posts/bundle-6?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-bundle-6" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=300568&theme=dark" alt="bundle - An online npm package bundle size checker | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a> [![Open In Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/okikio/bundle/blob/main/README.md)

A small online tool for checking the minified gzip/brotli size of npm packages.

I used [monaco-editor](https://github.com/microsoft/monaco-editor) for the code-editor, [esbuild](https://github.com/evanw/esbuild) as bundler and treeshaker respectively, [denoflate](https://github.com/hazae41/denoflate) as a wasm port of gzip, [deno\_brotli](https://github.com/denosaurs/deno_brotli) as a wasm port of brotli, [deno\_lz4](https://github.com/denosaurs/deno_lz4) as a wasm port of lz4, [bytes](https://github.com/visionmedia/bytes.js) to convert the compressed size to human readable values, [esbuild-visualizer](https://github.com/btd/esbuild-visualizer) to visualize and analyze your esbuild bundle to see which modules are taking up space and, [umami](https://github.com/mikecao/umami) for private, publicly available analytics and general usage stats all without cookies.  
  
This project was greatly influenced by [@hardfists](https://github.com/hardfist) [neo-tools](https://github.com/hardfist/neo-tools) and [@mizchi's](https://github.com/mizchi) [uniroll](https://github.com/mizchi/uniroll) projects.  

**bundlejs** is a quick and easy way to bundle your projects, minify and see it's gzip size. It's an online tool similar to [bundlephobia](https://bundlephobia.com), but **bundle** does all the bundling locally on you browser and can treeshake and bundle multiple packages (both commonjs and esm) together, all without having to install any npm packages and with typescript support.

The project isn't perfect, and I am still working on an autocomplete, hover intellisence, better mobile support and the high memory usage of **esbuild** and **monaco** as well as some edge case packages, e.g. **monaco-editor**.

If there is something I missed, a mistake, or a feature you would like added please create an issue or a pull request and I'll try to get to it. You can contribute to this project at [okikio/bundle](https://github.com/okikio/bundle).

**bundle** uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) as the style of commit, and the [Commitizen CLI](http://commitizen.github.io/cz-cli/) to make commits easier.

You can join the discussion on [github discussions](https://github.com/okikio/bundle/discussions).

> Some of bundlejs.com's latest features were inspired by [egoist/play-esbuild](https://github.com/egoist/play-esbuild) and [hyrious/esbuild-repl](https://github.com/hyrious/esbuild-repl), check them out they each use esbuild in different ways.

## URL Queries & Shareable Links

You can now use search queries in **bundle**, all you need to do is add this to the url  
`?q={packages}&treeshake={methods to treeshake}`  

e.g.  
You want `react`, `react-dom`, `vue`, and `@okikio/animate`, but only want the `Animate` and `toStr` methods exported from `@okikio/animate`.  

You would add this to the url [bundlejs.com/?q=react,react-dom,vue,@okikio/animate&treeshake=[\*],[\*],[\*],[{Animate,toStr}]](https://bundlejs.com/?q=react,react-dom,vue,@okikio/animate&treeshake=[*],[*],[*],[{Animate,toStr}])  

If you only want a couple packages and don't care to treeshake, then all you need is something like this, [bundlejs.com?q=react,react-dom,vue,@okikio/animate](https://bundlejs.com/?q=react,react-dom,vue,@okikio/animate)

There is another way to share a reproduciable bundle, the sharable link. Shareble links look like this [/?share=PTAEGEB...](https://bundlejs.com/?share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA) with the string value of the input code editor being compressed into a string and placed into the URL. 

In order to create a shareble link, you click the `Share` button, it copies the share url to your clipboard, and from there you can paste where you wish. 

> If you would like to bundle your code when the share URL is loaded, add `bundle` to the url, e.g. [/?bundle&q=@okikio/animate](https://bundlejs.com/?q=@okikio/animate&bundle) or [/?bundle&share=PTAEGEBs...](https://bundlejs.com/?bundle&share=PTAEGEBsEsGMGtQCUCuA7UAzA9gJ1AC4AWApqAELoAmkJVoA1KALLRrSbR2OgDiAXtAAOQ7kICGCcQHMyAZ2j8SAKBIAPIXgKgAVFlzYAtqABEAAWzxoV7MHHtD4giRMBuIA)


## Badges

You can also add bundle badges, they look like this,

[![Open Bundle](./src/assets/badge-light.svg)](https://bundlejs.com/) [![Open Bundle](./src/assets/badge-dark.svg)](https://bundlejs.com/)

All you need to do is to add this to your `README.md`
```md
# Light Mode Badge 
[![Open Bundle](https://bundlejs.com/badge-light.svg)](https://bundlejs.com/)

# Dark Mode Badge 
[![Open Bundle](https://bundlejs.com/badge-dark.svg)](https://bundlejs.com/)
```

Another options is to use the API, e.g.

[![spring-easing's badge](https://deno.bundlejs.com/?q=spring-easing&badge=detailed&badge-style=for-the-badge)](https://bundlejs.com/?q=spring-easing)

```md
[![spring-easing's badge](https://deno.bundlejs.com/?q=spring-easing&badge=detailed&badge-style=for-the-badge)](https://bundlejs.com/?q=spring-easing)
```

You can use the [URL Queries & Shareable Links](#url-queries--shareable-links) above, to create unique bundles, when users clicks on the badge.

## How does Bundlejs work?

**Docs:** https://deepwiki.com/okikio/bundlejs/

### Overview****
This document provides a comprehensive introduction to bundlejs, an online tool for checking npm package bundle sizes. bundlejs runs entirely in the browser, performing bundling, minification, and compression locally to accurately determine package sizes without server-side processing.

For specific components of the system architecture, see [System Architecture](https://deepwiki.com/okikio/bundlejs/2-system-architecture). For details on how bundling works, see [Core Bundling Process](https://deepwiki.com/okikio/bundlejs/5-core-bundling-process).


### What is bundlejs?****

bundlejs is a browser-based tool that allows developers to:

- Check the bundled, minified, and compressed size of npm packages
- Bundle multiple packages together (both CommonJS and ESM formats)
- Visualize bundle composition with treemap, sunburst, and network views
- Tree-shake packages to see optimized sizes
- Share bundle configurations via URLs and embed size badges in documentation

The tool uses [`esbuild-wasm`](https://github.com/okikio/bundlejs/blob/aba9dead/esbuild-wasm) for bundling and provides accurate size measurements using Gzip, Brotli, and LZ4 compression algorithms.

Sources: [`README.md16-22`](https://github.com/okikio/bundlejs/blob/aba9dead/README.md#L16-L22) [`package.json2-4`](https://github.com/okikio/bundlejs/blob/aba9dead/package.json#L2-L4) [`src/pug/about.pug14-20`](https://github.com/okikio/bundlejs/blob/aba9dead/src/pug/about.pug#L14-L20)


### Core Features****

bundlejs provides several key features that differentiate it from similar tools:

| Feature                  | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| Local Processing         | All bundling and analysis happens in the browser using WebAssembly |
| Multiple Package Support | Bundle and analyze multiple packages together                      |
| Tree Shaking             | Analyze only the specific exports you need from a package          |
| TypeScript Support       | Built-in support for TypeScript and JSX                            |
| Compression Options      | View sizes with Gzip, Brotli, and LZ4 compression                  |
| Bundle Visualization     | Analyze bundle composition with interactive visualizations         |
| Shareable URLs           | Create and share bundle configurations via URL parameters          |
| Size Badges              | Generate badges to display package sizes in documentation          |
| Monaco Editor            | Full-featured code editor with syntax highlighting and formatting  |

Sources: [`README.md17-24`](https://github.com/okikio/bundlejs/blob/aba9dead/README.md#L17-L24) [`src/pug/faq.pug23-63`](https://github.com/okikio/bundlejs/blob/aba9dead/src/pug/faq.pug#L23-L63)

### Core Components****

#### BundleEvents System

The event system serves as the central communication hub for bundlejs. It coordinates actions between the UI, web workers, and other components. The main event emitter is `BundleEvents`, defined in [`src/ts/index.ts39`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L39-L39)

Key events include:

- `bundle`: Triggers the bundling process
- `result`: Returns bundling results
- `chart`: Returns visualization data
- `log/info/warning/error`: Handles various message types

Sources: [`src/ts/index.ts153-271`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L153-L271) [`src/ts/index.ts353-452`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L353-L452)


#### Web Workers

bundlejs employs multiple web workers to handle different tasks without blocking the main thread:

| Worker            | Purpose                                           | Source                                                                                                            |
| ----------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Bundle Worker     | Performs bundling using esbuild-wasm              | [`src/ts/index.ts56-58`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L56-L58)                |
| Sandbox Worker    | Processes configuration safely                    | [`src/ts/index.ts61-62`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L61-L62)                |
| TypeScript Worker | Handles code formatting and TypeScript operations | [`src/ts/modules/monaco.ts41`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/modules/monaco.ts#L41-L41) |

Sources: [`src/ts/index.ts60-73`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L60-L73) [`src/ts/index.ts81-91`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L81-L91)


#### Monaco Editor Integration

bundlejs integrates the Monaco editor to provide a full-featured code editing experience. The editor is configured with TypeScript support, syntax highlighting, and code formatting capabilities.

Key editor features:

- TypeScript language support
- Multiple editor models (input, output, settings)
- Code formatting
- Custom hover providers for package information
- Shareable URL generation

Sources: [`src/ts/modules/monaco.ts78-283`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/modules/monaco.ts#L78-L283) [`src/ts/index.ts456-512`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L456-L512)

#### Compression Algorithms

bundlejs uses multiple compression algorithms to provide accurate size measurements:

1. Gzip - Standard web compression used by most servers
2. Brotli - More efficient compression algorithm with better compression ratios
3. LZ4 - Fast compression algorithm with lower compression ratios but quicker decompression

The compression is performed in the Bundle Worker and the results are sent back to the UI for display.

Sources: [`README.md18`](https://github.com/okikio/bundlejs/blob/aba9dead/README.md#L18-L18) [`src/pug/about.pug30-35`](https://github.com/okikio/bundlejs/blob/aba9dead/src/pug/about.pug#L30-L35)


### Build System****

bundlejs uses Gulp for its build system, with tasks for processing HTML, CSS, JavaScript, and other assets. The build process is responsible for:

1. Processing Pug templates into HTML
2. Compiling SCSS with Tailwind CSS
3. Bundling JavaScript with esbuild
4. Optimizing assets
5. Generating service worker for offline capabilities

Sources: [`gulpfile.js1-589`](https://github.com/okikio/bundlejs/blob/aba9dead/gulpfile.js#L1-L589)


### URL Parameters and Sharing****

bundlejs supports various URL parameters for configuring bundles and sharing:

| Parameter               | Description                  | Example                             |
| ----------------------- | ---------------------------- | ----------------------------------- |
| `q` or `query`          | Specify package(s) to bundle | `?q=react,react-dom`                |
| `treeshake`             | Specify exports to include   | `?treeshake=[{useState,useEffect}]` |
| `share`                 | Encoded editor content       | `?share=PTAEGEBs...`                |
| `bundle`                | Auto-build when loaded       | `?bundle`                           |
| `config`                | Bundle configuration         | `?config={"minify":true}`           |
| `analysis` or `analyze` | Enable bundle analysis       | `?analysis`                         |
| `minify`                | Enable/disable minification  | `?minify=true`                      |
| `sourcemap`             | Control sourcemap generation | `?sourcemap=true`                   |

Additionally, bundlejs provides an API for generating size badges that can be embedded in documentation:

    https://deno.bundlejs.com/?q=packageName&badge=detailed

Sources: [`README.md34-57`](https://github.com/okikio/bundlejs/blob/aba9dead/README.md#L34-L57) [`README.md69-76`](https://github.com/okikio/bundlejs/blob/aba9dead/README.md#L69-L76) [`src/ts/index.ts174-225`](https://github.com/okikio/bundlejs/blob/aba9dead/src/ts/index.ts#L174-L225)


### Key Dependencies****

bundlejs relies on several key dependencies:

| Dependency                                   | Purpose                                                   |
| -------------------------------------------- | --------------------------------------------------------- |
| `esbuild-wasm`                               | WebAssembly version of esbuild for browser-based bundling |
| `monaco-editor`                              | Code editor with syntax highlighting and language support |
| `@okikio/emitter`                            | Event emitter for system communication                    |
| `@dprint/formatter` and `@dprint/typescript` | Code formatting capabilities                              |
| `d3` and related packages                    | Visualization libraries for bundle analysis               |
| `solid-js`                                   | UI component framework                                    |
| `workbox-window`                             | Progressive Web App capabilities                          |

Sources: [`package.json54-81`](https://github.com/okikio/bundlejs/blob/aba9dead/package.json#L54-L81) [`src/pug/about.pug25-40`](https://github.com/okikio/bundlejs/blob/aba9dead/src/pug/about.pug#L25-L40)


## Backers & Sponsors

Backers & Sponsors are awesome people and organizations who use, enjoy, and donate to the project. The list of backers who love and support this project are,

<!---
<a href="https://opencollective.com/bundle"><img src="https://opencollective.com/bundle/individuals.svg?width=890"></a>
<a href="https://opencollective.com/bundle"><img src="https://opencollective.com/bundle/organizations.svg?width=890"></a>
<object type="image/svg+xml" data="https://opencollective.com/collective/tiers/backers.svg?avatarHeight=36&width=600"></object>
-->

<a href="https://upstash.com?utm_source=github&utm_medium=github&utm_campaign=bundlejs">
  <img src="./src/assets/sponsors/upstash-long.svg" height="64" />
</a>

<a href="https://vercel.com?utm_source=github&utm_medium=github&utm_campaign=bundlejs">
  <img src="./src/assets/sponsors/vercel-long.svg" height="64" />
</a>

<a href="https://sheetjs.com/?utm_source=opencollective&utm_medium=github&utm_campaign=bundle"><img src="https://opencollective.com/bundle/organization/0/avatar.svg?avatarHeight=128"></a>
<a href="https://opencollective.com/bundle/individuals/0/website"><img src="https://opencollective.com/bundle/individuals/0/avatar.svg"></a>
<a href="https://opencollective.com/bundle/organization/1/website"><img src="https://opencollective.com/bundle/organization/1/avatar.svg"></a>
