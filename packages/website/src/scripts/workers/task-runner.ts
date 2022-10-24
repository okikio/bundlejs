/// <reference lib="webworker" />
import type { addLogs } from "../../components/MainSection/EditorSection/Console";

import { format } from "./tasks/format";
import { createFile } from "./tasks/create-file";
import { createShareURL } from "./tasks/create-share-url";
import { bundle } from "./tasks/build";
import { parseConfig } from "./tasks/parse-config";

import { EVENTS } from "@bundlejs/core/src/index";
import * as Comlink from "comlink";

import "../utils/transferhandle";

export const TaskRunner = {
  format,
  createFile,
  createShareURL,
  bundle,
  parseConfig,
};

export const connect = async (port: MessagePort | typeof globalThis) => {
  Comlink.expose(TaskRunner, port);

  const addLog = Comlink.wrap<typeof addLogs>(port);
  EVENTS.on("init.complete", (data) => {
    addLog({ type: "info", data: "Initialized 🚀✨" });
  });

  EVENTS.on("logger.info", (data) => {
    addLog({ type: "log", data });
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