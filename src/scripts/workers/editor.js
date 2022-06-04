/// <reference lib="webworker" />
// export * from "monaco-editor/esm/vs/editor/editor.worker.js";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// import { initialize } from "./worker-init";

// The Editor worker is really not nesscary, so, I set it up to be self terminating 
const connect = (port) => {
    console.log('Empty Editor Worker');
    self.close();
}

// @ts-ignore
self.onconnect = (e) => {
    let [port] = e.ports;
    connect(port)
}

if (!("SharedWorkerGlobalScope" in self)) {
    connect(self);
}

export { };