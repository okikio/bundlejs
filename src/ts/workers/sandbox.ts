/// <reference lib="webworker" />
import { initialize, transform } from "esbuild-wasm";
import { DefaultConfig } from "../configs/bundle-options";
export let _initialized = false;

const initPromise = (async () => {
  try {
    if (!_initialized) {
      await initialize({
        worker: false,
        wasmURL: `./esbuild.wasm`
      });

      _initialized = true;
    }
  } catch (error) {
    console.warn("Sandbox", error)
  }
})();

const configs = new Map<string, string>();

/**
 * Contains the entire esbuild worker script
 * 
 * @param port The Shared Worker port to post messages on
 */
export const start = async (port: MessagePort) => {
  let $port: MessagePort;

  const onmessage = (_port: MessagePort) => {
    return async function ({ data: arr }: MessageEvent<[string, boolean, boolean, boolean, string | boolean | null, boolean, string | undefined]>) {
      try {
        await initPromise;

        const [data, analysis, polyfill, tsx, sourcemap, minify, format] = arr; 
        const config = configs.has(data) ? configs.get(data) : (
          await transform(data, {
            loader: 'ts',
            format: 'iife',
            globalName: 'std_global',
            treeShaking: true
          })
        ).code;
        
        console.log({
          data,
          sourcemap,
          config
        })

        const result = await Function('"use strict";return (async function () { "use strict";' + config + 'return (await std_global?.default); })()')();
        // const result = (0, eval)(config + ' std_global');
        result.analysis = analysis || result.analysis;
        result.polyfill = polyfill ?? result.polyfill ?? DefaultConfig.polyfill;
        result.tsx = tsx ?? result.tsx ?? DefaultConfig.tsx;

        if (!result.esbuild) result.esbuild ??= {};
        result.esbuild.sourcemap = sourcemap ?? result.esbuild.sourcemap ?? DefaultConfig.esbuild.sourcemap;
        result.esbuild.minify = minify ?? result.esbuild.minify ?? DefaultConfig.esbuild.minify;
        result.esbuild.format = format ?? result.esbuild.format ?? DefaultConfig.esbuild.format;

        configs.set(data, config);

        console.log({ result })

        _port.postMessage(result);
      } catch (e) {
        console.warn(e);
        _port.postMessage({});
      }
    }
  }

  const msg = onmessage(port as unknown as MessagePort);
  port.onmessage = ({ data }) => {
    if (data?.port) {
      const { port: $$port } = data;
      $port = $$port;
      $port.start();
      $port.onmessage = onmessage($port);
    } else {
      msg({ data } as MessageEvent<[string, boolean, boolean, boolean, string | boolean | null, boolean, string | undefined]>);
    }
  };
}

// @ts-ignore
(self as SharedWorkerGlobalScope).onconnect = (e) => {
  let [port] = e.ports;
  start(port);
}

// If the script is running in a normal webworker then don't worry about the Shared Worker message ports 
if (!("SharedWorkerGlobalScope" in self))
  start(self as typeof self & MessagePort);

export { };