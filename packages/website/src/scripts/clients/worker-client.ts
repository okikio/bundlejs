import type { IWorker, IWorkerCallback, IWorkerFactory } from '../utils/monaco-workers/simple-workers';
import { SimpleWorkerClient, logOnceWebWorkerWarning } from '../utils/monaco-workers/simple-workers';
import { Disposable } from '../utils/monaco-workers/lifecycle';
import * as types from '../utils/monaco-workers/types';

export const channel = new MessageChannel();

function isPromiseLike<T>(obj: any): obj is PromiseLike<T> {
	if (typeof obj.then === 'function') {
		return true;
	}
	return false;
}

/**
 * A worker that uses HTML5 web workers so that is has
 * its own global scope and its own thread.
 */
class WebWorker implements IWorker {

	private id: number;
	private worker: Promise<Worker> | null;

	constructor(moduleId: string, id: number, worker: Worker | Promise<Worker>, onMessageCallback: IWorkerCallback, onErrorCallback: (err: any) => void) {
		this.id = id;
		const workerOrPromise = worker;
		if (isPromiseLike(workerOrPromise)) {
			this.worker = workerOrPromise;
		} else {
			this.worker = Promise.resolve(workerOrPromise);
		}
		this.postMessage(moduleId, []);
		this.worker.then((w) => {
			w.onmessage = function (ev) {
				onMessageCallback(ev.data);
			};
			w.onmessageerror = onErrorCallback;
			if (typeof w.addEventListener === 'function') {
				w.addEventListener('error', onErrorCallback);
			}
		});
	}

	public getId(): number {
		return this.id;
	}

	public postMessage(message: any, transfer: Transferable[]): void {
		if (this.worker) {
			this.worker.then(w => w.postMessage(message, transfer));
		}
	}

	public dispose(): void {
		if (this.worker) {
			this.worker.then(w => w.terminate());
		}
		this.worker = null;
	}
}

export class DefaultWorkerFactory implements IWorkerFactory {
	private static LAST_WORKER_ID = 0;

	private _worker: Worker | undefined;
	private _webWorkerFailedBeforeError: any;

	constructor(worker: Worker | undefined) {
		this._worker = worker;
		this._webWorkerFailedBeforeError = false;
	}

	public create(moduleId: string, onMessageCallback: IWorkerCallback, onErrorCallback: (err: any) => void): IWorker {
		const workerId = (++DefaultWorkerFactory.LAST_WORKER_ID);

		if (this._webWorkerFailedBeforeError) {
			throw this._webWorkerFailedBeforeError;
		}

		return new WebWorker(moduleId, workerId, this._worker, onMessageCallback, (err) => {
			logOnceWebWorkerWarning(err);
			this._webWorkerFailedBeforeError = err;
			onErrorCallback(err);
		});
	}
}

export interface IWorkerClient<W> {
	getProxyObject(): Promise<W>;
	dispose(): void;
}

export class WorkerClient<T = {}> extends Disposable {
	protected _worker: IWorkerClient<T> | null;
	protected readonly _workerFactory: DefaultWorkerFactory;

	// private readonly _foreignModuleId: string = "other-ts.ts";
	private readonly _foreignModuleHost: { [method: string]: Function } | null = null;
	private _foreignModuleCreateData: any | null = {};
	private _foreignProxy: Promise<T> | null = null;

	constructor(worker: Worker, private readonly _foreignModuleId: string = "other-ts.ts") {
		super();
		this._worker = null;
		this._workerFactory = new DefaultWorkerFactory(
			worker
		);
		this._getOrCreateWorker();
	}

	_getOrCreateWorker() {
		if (!this._worker) {
			try {
				// @ts-ignore
				this._worker = this._register(new SimpleWorkerClient(
					this._workerFactory,
					"other-ts-client.ts",
					this
				));
			} catch (err) {
				logOnceWebWorkerWarning(err);
				throw err;
			}
		}
		return this._worker;
	}

	// foreign host request
	public fhr(method: string, args: any[]): Promise<T> {
		if (!this._foreignModuleHost || typeof this._foreignModuleHost[method] !== 'function') {
			return Promise.reject(new Error('Missing method ' + method + ' or missing main thread foreign host.'));
		}

		try {
			return Promise.resolve(this._foreignModuleHost[method].apply(this._foreignModuleHost, args));
		} catch (e) {
			return Promise.reject(e);
		}
	}

	private _getForeignProxy(): Promise<T> {
		if (!this._foreignProxy) {
			this._foreignProxy = this._getProxy().then((proxy) => {
				const foreignHostMethods = this._foreignModuleHost ? types.getAllMethodNames(this._foreignModuleHost) : [];
				// @ts-ignore
				return proxy.loadForeignModule(this._foreignModuleId, this._foreignModuleCreateData, foreignHostMethods).then((foreignMethods) => {
					this._foreignModuleCreateData = null;

					const proxyMethodRequest = (method: string, args: any[]): Promise<T> => {
						// @ts-ignore
						return proxy.fmr(method, args);
					};

					const createProxyMethod = (method: string, proxyMethodRequest: (method: string, args: any[]) => Promise<T>): () => Promise<T> => {
						return function () {
							const args = Array.prototype.slice.call(arguments, 0);
							return proxyMethodRequest(method, args);
						};
					};

					const foreignProxy = {};
					for (const foreignMethod of foreignMethods) {
						(<any>foreignProxy)[foreignMethod] = createProxyMethod(foreignMethod, proxyMethodRequest);
					}

					return foreignProxy;
				});
			});
		}
		return this._foreignProxy;
	}

	protected async _getProxy(): Promise<T> {
		// @ts-ignore
		try {
			await this._getOrCreateWorker().getProxyObject();
		} catch (err) {
			logOnceWebWorkerWarning(err);
			return await this._getOrCreateWorker().getProxyObject();
		}
	}

	public getProxy(): Promise<T> {
		return this._getForeignProxy();
	}
	
	async getWorker() { 
		return await this.getProxy();
	}
}
