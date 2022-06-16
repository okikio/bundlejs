/// <reference lib="webworker" />
// export * from "../../../node_modules/monaco-editor/esm/vs/language/json/json.worker.js";
import 'monaco-editor/esm/vs/language/json/json.worker.js';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
// 'use strict';
// import { initialize } from "../util/worker-init";
// import { create } from '../../../node_modules/monaco-editor/esm/vs/language/json/json.worker.js';

// export const connect = (port) => {
//     let initialized = false;
//     port.onmessage = (e) => {
//         initialize(function (ctx, createData) {
//             return create(ctx, createData);
//         }, port, initialized);
//     };
// }

// // @ts-ignore
// self.onconnect = (e) => {
//     let [port] = e.ports;
//     connect(port);
// }

// if (!("SharedWorkerGlobalScope" in self)) {
//     connect(self);
// }

// export { };