
export class WebWorker implements EventTarget, AbstractWorker {
    static SharedWorkerSupported = "SharedWorker" in globalThis;
    ActualWorker: SharedWorker | Worker;
    constructor(url: string | URL, opts?: WorkerOptions) {
        if (WebWorker.SharedWorkerSupported) {
            this.ActualWorker = new SharedWorker(url, opts);
        } else {
            this.ActualWorker = new Worker(url, opts);
        }
    }

    get onmessage() {
        if (WebWorker.SharedWorkerSupported) {
            return (this.ActualWorker as SharedWorker)?.port.onmessage;
        } else {
            return (this.ActualWorker as Worker).onmessage;
        }
    }

    set onmessage(value: MessagePort["onmessage"] | Worker["onmessage"]) {
        if (WebWorker.SharedWorkerSupported) {
            (this.ActualWorker as SharedWorker).port.onmessage = value as MessagePort["onmessage"];
        } else {
            (this.ActualWorker as Worker).onmessage = value as Worker["onmessage"];
        }
    }

    get onmessageerror() {
        if (WebWorker.SharedWorkerSupported) {
            return (this.ActualWorker as SharedWorker)?.port.onmessageerror;
        } else {
            return (this.ActualWorker as Worker).onmessageerror;
        }
    }

    set onmessageerror(value: MessagePort["onmessageerror"] | Worker["onmessageerror"]) {
        if (WebWorker.SharedWorkerSupported) {
            (this.ActualWorker as SharedWorker).port.onmessageerror = value as MessagePort["onmessageerror"];
        } else {
            (this.ActualWorker as Worker).onmessageerror = value as Worker["onmessageerror"];
        }
    }

    start() {
        if (WebWorker.SharedWorkerSupported) {
            return (this.ActualWorker as SharedWorker)?.port.start();
        }
    }

    /**
     * Clones message and transmits it to worker's global environment. transfer can be passed as a list of objects that are to be transferred rather than cloned.
     */
    postMessage(message: any, transfer?: Transferable[]) {
        if (WebWorker.SharedWorkerSupported) {
            return (this.ActualWorker as SharedWorker)?.port.postMessage(message, transfer);
        } else {
            return (this.ActualWorker as Worker).postMessage(message, transfer);
        }
    }

    /**
     * Aborts worker's associated global environment.
     */
    terminate() {
        if (WebWorker.SharedWorkerSupported) {
            return (this.ActualWorker as SharedWorker)?.port.close();
        } else {
            return (this.ActualWorker as Worker).terminate();
        }
    }

    close() {
        return this.terminate();
    }

    get port() {
        return (this.ActualWorker as SharedWorker).port;
    }

    get onerror() {
        return this.ActualWorker.onerror;
    }

    set onerror(value: (this: AbstractWorker, ev: ErrorEvent) => any) {
        this.ActualWorker.onerror = value;
    }

    addEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker | SharedWorker, ev: WorkerEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        if (WebWorker.SharedWorkerSupported && type !== "error") {
            return (this.ActualWorker as SharedWorker)?.port.addEventListener(type, listener, options)
        } else {
            return this.ActualWorker.addEventListener(type, listener, options);
        }
    }

    removeEventListener<K extends keyof WorkerEventMap>(type: K, listener: (this: Worker | SharedWorker, ev: WorkerEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) {
        if (WebWorker.SharedWorkerSupported && type !== "error") {
            return (this.ActualWorker as SharedWorker)?.port.removeEventListener(type, listener, options)
        } else {
            return this.ActualWorker.removeEventListener(type, listener, options);
        }
    }

    dispatchEvent(event: Event) {
        return this.ActualWorker.dispatchEvent(event);
    }
}

export default WebWorker;