/// <reference lib="webworker" />
import { initialize, transform } from "esbuild-wasm";
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

let $port: MessagePort;

const configs = new Map<string, string>();
export const onmessage = (port: MessagePort) => {
  return async function ({ data }: MessageEvent<string>) {
      try {
        if (!_initialized)
          await initPromise;

        const config = configs.has(data) ? configs.get(data) : (
          await transform(data, {
            loader: 'ts',
            format: 'iife',
            globalName: 'std_global',
            treeShaking: true
          })
        ).code;

        configs.set(data, config);

        const result = await Function('"use strict";' + config + 'return (std_global)')();
        // const result = (0, eval)(config + ' std_global');
        port.postMessage(result.default ?? result);
      } catch (e) {
        console.warn(e);
        port.postMessage({});
      }
  }
}

const msg = onmessage(self as unknown as MessagePort);
self.onmessage = ({ data }) => {
  if (data?.port) {
    const { port } = data;
    $port = port;
    $port.start();
    $port.onmessage = onmessage($port);
  } else {
    msg({ data } as MessageEvent<string>);
  }
};

export { };