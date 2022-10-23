/// <reference lib="webworker" />
// export * from "../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// 'use strict';
import { create } from "monaco-editor/esm/vs/language/typescript/ts.worker.js";

import { SimpleWorkerServer } from "monaco-editor/esm/vs/base/common/worker/simpleWorker.js";
import { EditorSimpleWorker } from "monaco-editor/esm/vs/editor/common/services/editorSimpleWorker.js";
export function initialize(foreignModule, port, initialized) {
  if (initialized) return;
  initialized = true;
  const simpleWorker = new SimpleWorkerServer((msg) => {
    port.postMessage(msg);
  }, (host) => new EditorSimpleWorker(host, foreignModule));
  port.onmessage = (e) => {
    simpleWorker.onmessage(e.data);
  };
}
const connect = (port) => {
  const initialized = false;
  port.onmessage = () => {
    initialize(function (ctx, createData) {
      return create(ctx, createData);
    }, port, initialized);
  };
};

(self as unknown as SharedWorkerGlobalScope).onconnect = (e) => {
  const [port] = e.ports;
  connect(port);
};

if (!("SharedWorkerGlobalScope" in self)) {
  connect(self);
}