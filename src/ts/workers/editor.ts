/// <reference lib="webworker" />
// export * from "../../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// import { initialize } from "../util/worker-init";

// The Editor worker is really not nesscary, so, I set it up to be self terminating 
const connect = (port) => {
    console.log('Empty Editor Worker');
    self.close();

    // let initialized = false;
    // port.onmessage = (e) => {
    //     // Ignore first message in this case and initialize if not yet initialized
    //     if (!initialized) {
    //         initialize(null, port, initialized);
    //     }
    // };
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