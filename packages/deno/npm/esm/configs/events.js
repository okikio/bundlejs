import { EventEmitter } from "@okikio/emitter";
export const EVENTS_OPTS = {
    "init.start": console.log,
    "init.complete": console.info,
    "init.error": console.error,
    "init.loading": console.warn,
    "logger.log": console.log,
    "logger.error": console.error,
    "logger.warn": console.warn,
    "logger.info": console.info
};
export const EVENTS = new EventEmitter();
// @ts-ignore: ...
EVENTS.on(EVENTS_OPTS);
