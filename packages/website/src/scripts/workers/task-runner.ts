/// <reference lib="webworker" />
import { format } from "./tasks/format";
import { createFile } from "./tasks/create-file";
import { createShareURL } from "./tasks/create-share-url";
import { bundle } from "./tasks/build";
import { parseConfig } from "./tasks/parse-config";

import { EVENTS } from "@bundlejs/core/src/index";
import * as Comlink from "comlink";
import type { addLogs } from "../../components/MainSection/EditorSection/Console";

export const TaskRunner = {
  format,
  createFile,
  createShareURL,
  bundle,
  parseConfig,
};

export const connect = async (port: MessagePort | typeof globalThis) => {
  Comlink.expose(TaskRunner, port);
  const proxy = Comlink.wrap<typeof addLogs>(port);

  EVENTS.on("logger.log", (data) => {
    port.postMessage({ type: "log", data });
    proxy({ type: "log", data });
  });
};

(self as unknown as SharedWorkerGlobalScope).onconnect = (e) => {
  const [port] = e.ports;
  connect(port);
};

if (!("SharedWorkerGlobalScope" in self)) {
  connect(self);
}

export default TaskRunner;