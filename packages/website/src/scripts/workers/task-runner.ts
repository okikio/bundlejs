/// <reference lib="webworker" />
import * as types from '../utils/monaco-workers/types';
import { SimpleWorkerServer } from '../utils/monaco-workers/simple-workers';

import { format } from "../tasks/format";
import { createFile } from "../tasks/create-file";
import { getShareURL } from "../tasks/get-share-url";
import { build } from "../tasks/build";

export class TaskRunner<H = object> {
  _requestHandlerBrand: "TaskRunner";
  _host: H;

  constructor(host: H) {
    this._host = host;
  }

  public format = format;
  public createFile = createFile;
  public getShareURL = getShareURL;
  public build = build;

  loadForeignModule() {
    const allMethods = [...types.getAllMethodNames(this), ...Object.keys(this)]
    const uniqueMethods = [...new Set(allMethods)].filter(key => typeof this[key] == "function");
    return Promise.resolve(uniqueMethods);
  }

  fmr(method: string, args: unknown[]) {
    if (typeof this[method] !== 'function') {
      return Promise.reject(new Error('Missing requestHandler or method: ' + method));
    }

    try {
      return Promise.resolve(this[method].apply(this, args));
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export const connect = (port: MessagePort | typeof globalThis) => {
  let initialized = false;
  port.onmessage = (e) => {
    if (initialized) return;
    initialized = true;

    const simpleWorker = new SimpleWorkerServer(
      (msg) => port.postMessage(msg),
      (host) => new TaskRunner(host)
    );
    port.onmessage = (e) => {
      simpleWorker.onmessage(e.data);
    };
  };
}

(self as unknown as SharedWorkerGlobalScope).onconnect = (e) => {
  let [port] = e.ports;
  connect(port)
}

if (!("SharedWorkerGlobalScope" in self)) {
  connect(self);
}

export default TaskRunner;