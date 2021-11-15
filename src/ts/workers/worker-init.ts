import { SimpleWorkerServer } from '../../../node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker.js';
import { EditorSimpleWorker } from '../../../node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker.js';
export function initialize(foreignModule, port, initialized) {
    if (initialized) {
        return;
    }
    initialized = true;
    const simpleWorker = new SimpleWorkerServer((msg) => {
        port.postMessage(msg);
    }, (host) => new EditorSimpleWorker(host, foreignModule));
    port.onmessage = (e) => {
        simpleWorker.onmessage(e.data);
    };
}