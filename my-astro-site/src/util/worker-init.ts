/// <reference lib="webworker" />
import { SimpleWorkerServer } from 'monaco-editor/esm/vs/base/common/worker/simpleWorker';
import { EditorSimpleWorker } from 'monaco-editor/esm/vs/editor/common/services/editorSimpleWorker';
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