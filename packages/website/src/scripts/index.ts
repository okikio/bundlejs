import type { TaskRunner as Tasks } from "./workers/task-runner";

import { setState } from "./utils/store";
import { USE_SHAREDWORKER } from "../env";
import { SharedWorkerPolyfill as SharedWorker } from "@okikio/sharedworker";

import * as Comlink from "comlink";

import "./utils/transferhandle";

export const TS_WORKER = "visualViewport" in globalThis && (
  USE_SHAREDWORKER ?
    new SharedWorker(new URL("./workers/typescript.ts", import.meta.url), { name: "typescript", type: "module" }) :
    new Worker(new URL("./workers/typescript.ts", import.meta.url), { name: "typescript", type: "module" })
);

export const EDITOR_WORKER = "visualViewport" in globalThis && (
  USE_SHAREDWORKER ?
    new SharedWorker(new URL("./workers/editor.ts", import.meta.url), { name: "editor", type: "module" }) :
    new Worker(new URL("./workers/editor.ts", import.meta.url), { name: "editor", type: "module" })
);
EDITOR_WORKER?.terminate?.();

export const TASK_RUNNER = "visualViewport" in globalThis && (
  USE_SHAREDWORKER ?
    new SharedWorker(new URL("./workers/task-runner.ts", import.meta.url), { name: "task-runner", type: "module" }) :
    new Worker(new URL("./workers/task-runner.ts", import.meta.url), { name: "task-runner", type: "module" })
);

export const taskRunner = "visualViewport" in globalThis && Comlink.wrap<typeof Tasks>(TASK_RUNNER);
setState("workers", { tasks: taskRunner });

globalThis?.addEventListener?.("pagehide", (event) => {
  if (!event.persisted) {
    /* the page is being discarded, so it can't be reused later */
    taskRunner[Comlink.releaseProxy]();
  }
}, false);
