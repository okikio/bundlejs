/// <reference lib="webworker" />
import { initialize } from '../util/worker-init.ts';
import { JSONWorker } from 'monaco-editor/esm/vs/language/json/jsonWorker.js';

export const connect = (port) => {
    let initialized = false;
    port.onmessage = (e) => {
      initialize(function (ctx, createData) {
        return new JSONWorker(ctx, createData);
      }, port, initialized);
    };
}

// @ts-ignore
self.onconnect = (e) => {
    let [port] = e.ports;
    connect(port);
}

if (!("SharedWorkerGlobalScope" in self)) {
    connect(self);
}

export { };