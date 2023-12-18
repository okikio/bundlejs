/// <reference lib="webworker" />
import type { addLogs } from "../../components/MainSection/EditorSection/Console";

import { format } from "./tasks/format";
import { createFile } from "./tasks/create-file";
import { createShareURL, createShareURLParams } from "./tasks/create-share-url";
import { bundle } from "./tasks/build";
import { parseConfig } from "./tasks/parse-config";

import {
  addEventListener,
  INIT_COMPLETE,
  LOGGER_INFO,
} from "@bundle/core/src/index.ts";
import * as Comlink from "comlink";

import "../utils/transferhandle";

export const TaskRunner = {
  format,
  createFile,
  createShareURL,
  createShareURLParams,
  bundle,
  parseConfig,
};

export const connect = async (port: MessagePort | typeof globalThis) => {
  Comlink.expose(TaskRunner, port);

  const addLog = Comlink.wrap<typeof addLogs>(port);
  addEventListener(INIT_COMPLETE, () => {
    addLog({ type: "info", detail: "Initialized 🚀✨" });
  });

  addEventListener(LOGGER_INFO, (e) => {
    addLog({ type: "log", detail: e.detail });
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
