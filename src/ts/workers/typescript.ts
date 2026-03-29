/// <reference lib="webworker" />
// export * from "../../../node_modules/monaco-editor/esm/vs/language/typescript/ts.worker.js";

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// 'use strict';

// import { initialize, create } from 'monaco-editor/esm/vs/language/typescript/ts.worker.js';

import { initialize } from '../util/worker-init.ts';
import * as typescriptServices from 'monaco-editor/esm/vs/language/typescript/lib/typescriptServices.js';
export { typescriptServices as ts };
import { create } from 'monaco-editor/esm/vs/language/typescript/tsWorker.js';
export { TypeScriptWorker } from 'monaco-editor/esm/vs/language/typescript/tsWorker.js';
export { libFileMap } from 'monaco-editor/esm/vs/language/typescript/lib/lib.js';

export { create, initialize };

export const connect = (port) => {
    let initialized = false;
    port.onmessage = (e) => {
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