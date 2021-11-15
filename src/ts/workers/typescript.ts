// export * from "../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// 'use strict';
import { initialize } from "./worker-init";
import { create } from '../../../node_modules/monaco-editor/esm/vs/language/typescript/tsWorker.js';

export const connect = (port) => {
    let initialized = false;
    port.onmessage = (e) => {
        // ignore the first message
        initialize(function (ctx, createData) {
            return create(ctx, createData);
        }, port, initialized);
    };
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