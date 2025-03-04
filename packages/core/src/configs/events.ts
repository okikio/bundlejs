export const EVENT_NAME_PREFIX = "bundlejs";
export function EventName<T extends string>(name: T) {
  return `${EVENT_NAME_PREFIX}.${name}` as const;
}

export const INIT_START = EventName("init.start");
export const INIT_COMPLETE = EventName("init.complete");
export const INIT_ERROR = EventName("init.error");
export const INIT_LOADING = EventName("init.loading");

export const LOGGER_LOG = EventName("logger.log");
export const LOGGER_ERROR = EventName("logger.error");
export const LOGGER_WARN = EventName("logger.warn");
export const LOGGER_INFO = EventName("logger.info");

export const BUILD_ERROR = EventName("build.error");
export const TRANSFORM_ERROR = EventName("transform.error");

export interface IEVENT_MAP {
  [INIT_START]: never,
  [INIT_COMPLETE]: void,
  [INIT_ERROR]: Error,
  [INIT_LOADING]: unknown,

  [LOGGER_LOG]: unknown,
  [LOGGER_ERROR]: Error,
  [LOGGER_WARN]: unknown,
  [LOGGER_INFO]: unknown,

  [BUILD_ERROR]: Error,
  [TRANSFORM_ERROR]: Error,
}

export const EVENT_TARGET = new EventTarget();

export class CustomEvent<T = unknown> extends Event {
  readonly detail: T;
  constructor(type: string, options?: CustomEventInit<T>) {
    super(type, options)
    this.detail = Object(options).detail
  }
}

/**
 * Registers an event listener in the global scope, which will be called synchronously whenever the event type is dispatched.
 */
export function addEventListener<K extends keyof IEVENT_MAP>(
  type: K,
  listener: ((this: typeof globalThis, ev: CustomEvent<IEVENT_MAP[K]>) => unknown) | EventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  return EVENT_TARGET.addEventListener(type, listener as EventListenerOrEventListenerObject, options);
}

/**
 * Registers an event listener in the global scope, which will be called synchronously whenever the event type is dispatched.
 */
export function removeEventListener<K extends keyof IEVENT_MAP>(
  type: K,
  listener: ((this: typeof globalThis, ev: CustomEvent<IEVENT_MAP[K]>) => any) | EventListenerObject,
  options?: boolean | AddEventListenerOptions,
) {
  return EVENT_TARGET.removeEventListener(type, listener as EventListenerOrEventListenerObject, options);
}

/**
 * Dispatches an event in the global scope, synchronously invoking any registered event listeners for this event in the appropriate order. 
 * Returns false if event is cancelable and at least one of the event handlers which handled this event called Event.preventDefault(). 
 * Otherwise it returns true.
 */
export function dispatchEvent<K extends keyof IEVENT_MAP, A extends IEVENT_MAP[K] = any>(
  event: K | (string & {}) | CustomEvent<IEVENT_MAP[K]>, 
  args?: A
) {
  return EVENT_TARGET.dispatchEvent(
    typeof event === "string" ? 
      new CustomEvent(event, { detail: args }) : 
      event
  );
}

addEventListener(INIT_START, (e) => { 
  console.time(INIT_COMPLETE); 
  console.log(INIT_START, e.detail);
});
addEventListener(INIT_COMPLETE, (e) => console.info(INIT_COMPLETE, e.detail));
addEventListener(INIT_LOADING, (e) => console.log(INIT_LOADING, e.detail));
addEventListener(INIT_ERROR, (e) => console.error(INIT_ERROR, e.detail));
addEventListener(LOGGER_LOG, (e) => { 
  if (!e.detail) console.log(LOGGER_LOG, e.detail);
  console.log(e.detail);
});
addEventListener(LOGGER_ERROR, (e) => console.error(LOGGER_ERROR, e.detail));
addEventListener(LOGGER_WARN, (e) => console.warn(LOGGER_WARN, e.detail));
addEventListener(LOGGER_INFO, (e) => console.info(LOGGER_INFO, e.detail));
addEventListener(BUILD_ERROR, (e) => console.error(BUILD_ERROR, e.detail));