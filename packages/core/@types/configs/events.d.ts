import { EventEmitter } from "@okikio/emitter";
export declare const EVENTS_OPTS: {
    "init.start": (...data: any[]) => void;
    "init.complete": (...data: any[]) => void;
    "init.error": (...data: any[]) => void;
    "init.loading": (...data: any[]) => void;
    "logger.log": (...data: any[]) => void;
    "logger.error": (...data: any[]) => void;
    "logger.warn": (...data: any[]) => void;
    "logger.info": (...data: any[]) => void;
};
export declare const EVENTS: EventEmitter;
