/// <reference lib="webworker" />
import { start } from 'monaco-editor/esm/vs/editor/editor.worker.start.js';

// import { initialize } from 'monaco-editor/esm/vs/base/common/worker/webWorkerBootstrap.js';
import { EditorWorker } from 'monaco-editor/esm/vs/editor/common/services/editorWebWorker.js';
import { EditorWorkerHost } from 'monaco-editor/esm/vs/editor/common/services/editorWorkerHost.js';

import { WebWorkerServer } from 'monaco-editor/esm/vs/base/common/worker/webWorker.js';

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
function init(factory, port: MessagePort, alreadyInitialized = false) {
    if (alreadyInitialized) {
        throw new Error('WebWorker already initialized!');
    }
    alreadyInitialized = true;
    const webWorkerServer = new WebWorkerServer(msg => port.postMessage(msg), (workerServer) => factory(workerServer));
    port.onmessage = (e) => {
        webWorkerServer.onmessage(e.data);
    };
    return webWorkerServer;
}

export { init };

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/**
 * Used by `monaco-editor` to hook up web worker rpc.
 * @skipMangle
 * @internal
 */
function start(createClient, port: MessagePort) {
    let client;
    const webWorkerServer = init((workerServer) => {
        const editorWorkerHost = EditorWorkerHost.getChannel(workerServer);
        const host = new Proxy({}, {
            get(target, prop, receiver) {
                if (prop === 'then') {
                    // Don't forward the call when the proxy is returned in an async function and the runtime tries to .then it.
                    return undefined;
                }
                if (typeof prop !== 'string') {
                    throw new Error(`Not supported`);
                }
                return (...args) => {
                    return editorWorkerHost.$fhr(prop, args);
                };
            }
        });
        const ctx = {
            host: host,
            getMirrorModels: () => {
                return webWorkerServer.requestHandler.getModels();
            }
        };
        client = createClient(ctx);
        return new EditorWorker(client);
    }, port);
    return client;
}

export { start };

function initialize(callback, port: MessagePort, alreadyInitialized = false) {
  alreadyInitialized = true;
  port.onmessage = (m) => {
    start((ctx) => {
      return callback(ctx, m.data);
    }, port);
  };
}

export { initialize };
// export { isWorkerInitialized };
