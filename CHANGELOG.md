# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.4](https://github.com/okikio/bundle/compare/v0.0.3...v0.0.4) (2021-09-22)


### Features

* add css env(inset-*); monaco ts types supprt; ([8bfb5e3](https://github.com/okikio/bundle/commit/8bfb5e39554a83b6214b7d7f23854b06acf5a5f4))


### Bug Fixes

* add navigationPreload to sw; preload css fonts ([d644b4e](https://github.com/okikio/bundle/commit/d644b4e2048c4cc8e6ac70c44b0349c51d8a4fd4))
* hit counter counting on all pages; ([cd3d718](https://github.com/okikio/bundle/commit/cd3d718488b4727e10841226b9674c46b61e56b0))
* proper fix for release process ([f2631c1](https://github.com/okikio/bundle/commit/f2631c1fe65d72ea4b99085aba4aac4a96718ee2))
* reduce sw.js max-age header ([dd7837d](https://github.com/okikio/bundle/commit/dd7837de3a785ccd7db9536e1cde4555e20bd397))
* use stale-while-revalidate cache headers; ([1b458e5](https://github.com/okikio/bundle/commit/1b458e560b7712c12f514e1d3ab064f659a1463d))
* use WebWorker polyfill to fix terminate error; ([90932c9](https://github.com/okikio/bundle/commit/90932c96005bfc80710893a415f4d2597f234055))

### [0.0.3](https://github.com/okikio/bundle/compare/v0.0.2...v0.0.3) (2021-09-20)


### Bug Fixes

* update release process ([8f693dd](https://github.com/okikio/bundle/commit/8f693dd27b591d63dc9142c8834707a1e03cad5e))

### [0.0.2](https://github.com/okikio/bundle/compare/v0.0.1...v0.0.2) (2021-09-20)


### Features

* add copy, wrap, format & reset btns; ([faaf924](https://github.com/okikio/bundle/commit/faaf924cb1c081d1f0e7a358c8b337de43cd888c))
* add PWA screenshots; add sharing to PWA ([4e50e04](https://github.com/okikio/bundle/commit/4e50e043ba3b3fd382db358df2b3d10e6bc8d87b))
* add sw for PWA; detect offline/online mode ([473c098](https://github.com/okikio/bundle/commit/473c098f10729f538b4853f0faa648bfb40e992a))
* faster preloading & prefetching ([3882c11](https://github.com/okikio/bundle/commit/3882c11eedbaae7a179021ed0e84fe1ead26cf56))
* prefetch workers ([dbe1287](https://github.com/okikio/bundle/commit/dbe1287a92d589db49a8784aec1f76169e916e97))
* preload monaco.min.js for faster perfs; ([0222b70](https://github.com/okikio/bundle/commit/0222b706a807e28e4bd5ce22e99d8bb9b45f640d))
* PWA support for js/ts files ([987984b](https://github.com/okikio/bundle/commit/987984bfef601337a96eb058ebb71d7a4257ec71))
* update deps; better seo ([3c4ab38](https://github.com/okikio/bundle/commit/3c4ab38683b827ac45c800d342b06fbd2efb8846))


### Bug Fixes

* editor styles on mobile; update deps ([407d216](https://github.com/okikio/bundle/commit/407d216e5dbf788f776b5a672932701811c71d4e))
* ensure all preloads are in order ([a5bece7](https://github.com/okikio/bundle/commit/a5bece755b8eab4e5d9c19d9bc124a97222766d3))
* reorder preloads and prefetch ([d31d40f](https://github.com/okikio/bundle/commit/d31d40f48df95fa0757f064956316e69ce766a2e))
* seo social image previews bug ([ed82939](https://github.com/okikio/bundle/commit/ed82939bcd40cc369ed46669d4a2e8181e049278))
* social media preview ([10e295c](https://github.com/okikio/bundle/commit/10e295c83b8f17a8abc149d0d003073ffb899a6e))
* unsafe-eval CSP issue ([16db273](https://github.com/okikio/bundle/commit/16db2736236c3e90fca85628090a77ac51198b38))
* update sw.js caching algorithm ([061205c](https://github.com/okikio/bundle/commit/061205c747e6340a852f36e3568303bf0c934829))
* use a new image for social media cards ([2e9b301](https://github.com/okikio/bundle/commit/2e9b301fe308711913214008b2dffa66c85c4cfb))

### [0.0.1](https://github.com/okikio/bundle/compare/v0.0.0...v0.0.1) (2021-09-16)


### Features

* add a new monaco-editor for resulting bundle ([40e7915](https://github.com/okikio/bundle/commit/40e79150e1e310c983ac363b880c53a58dd5a35f))

## 0.0.0 (2021-09-16)


### Features

* :recycle: switch to an editor model using monaco ([3c2fbfc](https://github.com/okikio/bundle/commit/3c2fbfc79fc1c8e7b5ab3d61ffb8a72a0bce1cf0))
* :zap: move to only one worker; ([2f66612](https://github.com/okikio/bundle/commit/2f66612a242a87a81c132b50c26b3f5feaa70fa9))
* add bundle.js.org into CNAME  ([e716b29](https://github.com/okikio/bundle/commit/e716b292661ee08517fb29701d60072a41fdf55b))
* add frontend for bundler, ([7d1f557](https://github.com/okikio/bundle/commit/7d1f557c48e389257f280b0f902d4241f63a1f69))
* add search parameters e.g. bundle.js.org?exports=useState&from=react ([40874cb](https://github.com/okikio/bundle/commit/40874cb0dfd79b594fe9047e8e067379822372ae))
* add solid js for ui, ([51051f4](https://github.com/okikio/bundle/commit/51051f4af1c1657085e370d9ef26c59b06a9e5ce))
* add support for esbuild and gzip, ([898d882](https://github.com/okikio/bundle/commit/898d88222d9f80f8680b7358045535cc5bcccf3b))
* **demo:** :sparkles: update deps; using uniroll create a rollup based bundler; replace esbuild-wasm ([46eeb8b](https://github.com/okikio/bundle/commit/46eeb8b82b648fd377efcb06fae3b794a586d068))
* **docs:** :bug: add json support to the cdn namespace ([509c663](https://github.com/okikio/bundle/commit/509c6636b5f095949d1cfeb23e4137aabc4f1a1b))
* **docs:** :sparkles: add run btn; ([049016a](https://github.com/okikio/bundle/commit/049016a254f2a4a93fddfe64c754e4157b1f664e))
* use counterapi to determing bundle js usage ([1466a1c](https://github.com/okikio/bundle/commit/1466a1ce44c5bac4b9f80269e07f4fdaab0d423e))


### Bug Fixes

* :bug: fix bugs, remove solid js ([9de0145](https://github.com/okikio/bundle/commit/9de01458ad9b66ccec0cc4d01c0792ca5435cb86))
* :bug: WIP rollup ([ec9d099](https://github.com/okikio/bundle/commit/ec9d099dd688d12008685994d516917f0fdc8194))
* :fire: fix bugs from winidicss ([f71d692](https://github.com/okikio/bundle/commit/f71d6929895a70dd526c2e6ae3c5a18cd1d04ef9))
* add rel="noopener" to footer link ([53b56b2](https://github.com/okikio/bundle/commit/53b56b27e625d2f2c8acfd32e730486ce923db95))
* add terser and fix @babel/core ([c883c36](https://github.com/okikio/bundle/commit/c883c36a8c870b5a36a5c065ad703ebec7a3dd62))
* fix CNAME bug ([e3bb629](https://github.com/okikio/bundle/commit/e3bb629b9dc55a5cdf1d2008bff3a15badbac9de))
* fix gitpod bug ([2eb48ec](https://github.com/okikio/bundle/commit/2eb48ec6fa42486725d6fc0809246c15f5ce2d79))
* fix pnpm install errors ([36a6c80](https://github.com/okikio/bundle/commit/36a6c8087f1eae2440e778915f8ef324a29b0b2b))
* **header:** correct capitalisation of GitHub ([c7cb9bf](https://github.com/okikio/bundle/commit/c7cb9bfa6c30f0ebb0fbc4e8d1d086f82c0119cd))
* support firefox/safari 14 by bundling workers to iife ([510cd11](https://github.com/okikio/bundle/commit/510cd1110cea20bdf2b1b957254a774d3af668cc))
