"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = exports.EVENTS_OPTS = void 0;
const emitter_1 = require("@okikio/emitter");
exports.EVENTS_OPTS = {
    "init.start": console.log,
    "init.complete": console.info,
    "init.error": console.error,
    "init.loading": console.warn,
    "logger.log": console.log,
    "logger.error": console.error,
    "logger.warn": console.warn,
    "logger.info": console.info
};
exports.EVENTS = new emitter_1.EventEmitter();
// @ts-ignore: ...
exports.EVENTS.on(exports.EVENTS_OPTS);
