// export * from "../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as edworker from './editor';
import { TypeScriptWorker } from '../../../node_modules/monaco-editor/esm/vs/language/typescript/tsWorker.js';

const connect = (port) => {
    let initialized = false;
    port.onmessage = (e) => {
        // ignore the first message
        edworker.initialize(function (ctx, createData) {
            return new TypeScriptWorker(ctx, createData);
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
