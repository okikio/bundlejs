/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DisposableStore, IDisposable, toDisposable } from './lifecycle';
import { onUnexpectedError } from './errors';
import { LinkedList } from './linkedList';
import { StopWatch } from './stopwatch';

/**
 * To an event a function with one or zero parameters
 * can be subscribed. The event is the subscriber function itself.
 */
export interface Event<T> {
	(listener: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore): IDisposable;
}

export namespace Event {
  /**
   * Given an event, returns another event which only fires once.
   */
  export function once<T>(event: Event<T>): Event<T> {
    return (listener, thisArgs = null, disposables?) => {
      // we need this, in case the event fires during the listener call
      let didFire = false;
      let result: IDisposable;
      result = event(e => {
        if (didFire) {
          return;
        } else if (result) {
          result.dispose();
        } else {
          didFire = true;
        }

        return listener.call(thisArgs, e);
      }, null, disposables);

      if (didFire) {
        result.dispose();
      }

      return result;
    };
  }

  /**
   * Given an event, returns the same event but typed as `Event<void>`.
   */
  export function signal<T>(event: Event<T>): Event<void> {
    return event as Event<any> as Event<void>;
  }
}

export interface EmitterOptions {
	onFirstListenerAdd?: Function;
	onFirstListenerDidAdd?: Function;
	onListenerDidAdd?: Function;
	onLastListenerRemove?: Function;
	leakWarningThreshold?: number;

	/** ONLY enable this during development */
	_profName?: string;
}


class EventProfiling {

	private static _idPool = 0;

	private _name: string;
	private _stopWatch?: StopWatch;
	private _listenerCount: number = 0;
	private _invocationCount = 0;
	private _elapsedOverall = 0;

	constructor(name: string) {
		this._name = `${name}_${EventProfiling._idPool++}`;
	}

	start(listenerCount: number): void {
		this._stopWatch = new StopWatch(true);
		this._listenerCount = listenerCount;
	}

	stop(): void {
		if (this._stopWatch) {
			const elapsed = this._stopWatch.elapsed();
			this._elapsedOverall += elapsed;
			this._invocationCount += 1;

			console.info(`did FIRE ${this._name}: elapsed_ms: ${elapsed.toFixed(5)}, listener: ${this._listenerCount} (elapsed_overall: ${this._elapsedOverall.toFixed(2)}, invocations: ${this._invocationCount})`);
			this._stopWatch = undefined;
		}
	}
}

let _globalLeakWarningThreshold = -1;
export function setGlobalLeakWarningThreshold(n: number): IDisposable {
	const oldValue = _globalLeakWarningThreshold;
	_globalLeakWarningThreshold = n;
	return {
		dispose() {
			_globalLeakWarningThreshold = oldValue;
		}
	};
}

class LeakageMonitor {

	private _stacks: Map<string, number> | undefined;
	private _warnCountdown: number = 0;

	constructor(
		readonly customThreshold?: number,
		readonly name: string = Math.random().toString(18).slice(2, 5),
	) { }

	dispose(): void {
		if (this._stacks) {
			this._stacks.clear();
		}
	}

	check(stack: Stacktrace, listenerCount: number): undefined | (() => void) {

		let threshold = _globalLeakWarningThreshold;
		if (typeof this.customThreshold === 'number') {
			threshold = this.customThreshold;
		}

		if (threshold <= 0 || listenerCount < threshold) {
			return undefined;
		}

		if (!this._stacks) {
			this._stacks = new Map();
		}
		const count = (this._stacks.get(stack.value) || 0);
		this._stacks.set(stack.value, count + 1);
		this._warnCountdown -= 1;

		if (this._warnCountdown <= 0) {
			// only warn on first exceed and then every time the limit
			// is exceeded by 50% again
			this._warnCountdown = threshold * 0.5;

			// find most frequent listener and print warning
			let topStack: string | undefined;
			let topCount: number = 0;
			for (const [stack, count] of this._stacks) {
				if (!topStack || topCount < count) {
					topStack = stack;
					topCount = count;
				}
			}

			console.warn(`[${this.name}] potential listener LEAK detected, having ${listenerCount} listeners already. MOST frequent listener (${topCount}):`);
			console.warn(topStack!);
		}

		return () => {
			const count = (this._stacks!.get(stack.value) || 0);
			this._stacks!.set(stack.value, count - 1);
		};
	}
}

class Stacktrace {

	static create() {
		return new Stacktrace(new Error());
	}

	private constructor(private readonly _error: Error) { }

	get value() {
		// only access the stack late
		return this._error.stack ?? '';
	}

	print() {
		console.warn(this.value.split('\n').slice(2).join('\n'));
	}
}

export class SafeDisposable implements IDisposable {

	private static _noop = () => { };

	dispose: () => void = SafeDisposable._noop;

	unset: () => void = SafeDisposable._noop;

	set(disposable: IDisposable) {
		let actual: IDisposable | undefined = disposable;
		this.unset = () => actual = undefined;
		this.dispose = () => actual?.dispose();
		return this;
	}
}

class Listener<T> {

	readonly subscription = new SafeDisposable();

	constructor(
		readonly callback: (e: T) => void,
		readonly callbackThis: any | undefined,
		readonly stack: Stacktrace | undefined
	) { }

	invoke(e: T) {
		this.callback.call(this.callbackThis, e);
	}
}

/**
 * The Emitter can be used to expose an Event to the public
 * to fire it from the insides.
 * Sample:
	class Document {
		private readonly _onDidChange = new Emitter<(value:string)=>any>();
		public onDidChange = this._onDidChange.event;
		// getter-style
		// get onDidChange(): Event<(value:string)=>any> {
		// 	return this._onDidChange.event;
		// }
		private _doIt() {
			//...
			this._onDidChange.fire(value);
		}
	}
 */
export class Emitter<T> {
	private readonly _options?: EmitterOptions;
	private readonly _leakageMon?: LeakageMonitor;
	private readonly _perfMon?: EventProfiling;
	private _disposed: boolean = false;
	private _event?: Event<T>;
	private _deliveryQueue?: LinkedList<[Listener<T>, T]>;
	protected _listeners?: LinkedList<Listener<T>>;

	constructor(options?: EmitterOptions) {
		this._options = options;
		this._leakageMon = _globalLeakWarningThreshold > 0 ? new LeakageMonitor(this._options && this._options.leakWarningThreshold) : undefined;
		this._perfMon = this._options?._profName ? new EventProfiling(this._options._profName) : undefined;
	}

	/**
	 * For the public to allow to subscribe
	 * to events from this Emitter
	 */
	get event(): Event<T> {
		if (!this._event) {
			this._event = (callback: (e: T) => any, thisArgs?: any, disposables?: IDisposable[] | DisposableStore) => {
				if (!this._listeners) {
					this._listeners = new LinkedList();
				}

				const firstListener = this._listeners.isEmpty();

				if (firstListener && this._options?.onFirstListenerAdd) {
					this._options.onFirstListenerAdd(this);
				}

				let removeMonitor: Function | undefined;
				let stack: Stacktrace | undefined;
				if (this._leakageMon) {
					// check and record this emitter for potential leakage
					stack = Stacktrace.create();
					removeMonitor = this._leakageMon.check(stack, this._listeners.size + 1);
				}

				const listener = new Listener(callback, thisArgs, stack);
				const removeListener = this._listeners.push(listener);

				if (firstListener && this._options?.onFirstListenerDidAdd) {
					this._options.onFirstListenerDidAdd(this);
				}

				if (this._options?.onListenerDidAdd) {
					this._options.onListenerDidAdd(this, callback, thisArgs);
				}

				const result = listener.subscription.set(toDisposable(() => {
					if (removeMonitor) {
						removeMonitor();
					}
					if (!this._disposed) {
						removeListener();
						if (this._options && this._options.onLastListenerRemove) {
							const hasListeners = (this._listeners && !this._listeners.isEmpty());
							if (!hasListeners) {
								this._options.onLastListenerRemove(this);
							}
						}
					}
				}));

				if (disposables instanceof DisposableStore) {
					disposables.add(result);
				} else if (Array.isArray(disposables)) {
					disposables.push(result);
				}

				return result;
			};
		}
		return this._event;
	}

	/**
	 * To be kept private to fire an event to
	 * subscribers
	 */
	fire(event: T): void {
		if (this._listeners) {
			// put all [listener,event]-pairs into delivery queue
			// then emit all event. an inner/nested event might be
			// the driver of this

			if (!this._deliveryQueue) {
				this._deliveryQueue = new LinkedList();
			}

			for (let listener of this._listeners) {
				this._deliveryQueue.push([listener, event]);
			}

			// start/stop performance insight collection
			this._perfMon?.start(this._deliveryQueue.size);

			while (this._deliveryQueue.size > 0) {
				const [listener, event] = this._deliveryQueue.shift()!;
				try {
					listener.invoke(event);
				} catch (e) {
					onUnexpectedError(e);
				}
			}

			this._perfMon?.stop();
		}
	}

	dispose() {
		if (!this._disposed) {
			this._disposed = true;

			// It is bad to have listeners at the time of disposing an emitter, it is worst to have listeners keep the emitter
			// alive via the reference that's embedded their disposables. Therefore we loop over all remaining listeners and
			// unset their subscriptions/disposables
			if (this._listeners) {
				for (const listener of this._listeners) {
					// we dispose AND unset the subscription. In theory dispose isn't needed but
					// than the disposable is reported as leaked...
					listener.subscription.dispose();
					listener.subscription.unset();

					// enable this to blame listeners that are still here
					// listener.stack?.print();
				}
				this._listeners.clear();
			}
			this._deliveryQueue?.clear();
			this._options?.onLastListenerRemove?.();
			this._leakageMon?.dispose();
		}
	}
}

