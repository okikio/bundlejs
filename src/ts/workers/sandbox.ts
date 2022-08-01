/// <reference lib="webworker" />
// import { initialize, transform } from "esbuild-wasm";
// export let _initialized = false;

export const configChannel = new MessageChannel();
configChannel.port1.start();

let $port: MessagePort;

export const onmessage = (port: MessagePort) => {
  const getTransform = async (input: string) => {
    return new Promise(resolve => {
      $port.postMessage({ type: "transform", data: input });
      configChannel.port1.onmessage = function ({ data }: MessageEvent<string>) {
        resolve(data);
      };
    });
  }

  return async function ({ data: $data }: MessageEvent<{ type: string, data: any }>) {
    const { type, data } = $data;
    if (type === "config") {
      try {
        const config = await getTransform(data);
        const result = await Function('"use strict";' + config + 'return (std_global)')();
        port.postMessage({ type: "config", data: result.default ?? result });
      } catch (e) {
        console.warn(e)
        port.postMessage({ type: "config", data: {} });
      }
    } else if (type === "transform") {
      configChannel.port2.postMessage(data);
    }
  }
}

const msg = onmessage(self as unknown as MessagePort);
self.onmessage = ({ data }) => {
  // "use strict";
  if (data?.port) {
    const { port } = data;
    $port = port;
    $port.start();
    $port.addEventListener("message", onmessage($port));
  } else {
    msg({ data } as MessageEvent<{ type: string, data: any }>);
  }
};

export { };