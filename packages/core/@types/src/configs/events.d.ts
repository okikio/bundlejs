import { EventEmitter } from "@okikio/emitter";
export declare const EVENTS_OPTS: {
    "init.start": () => void;
    "init.complete": () => void;
    "init.error": () => void;
    "init.loading": () => void;
    "logger.log": {
        (...data: any[]): void;
        (...data: any[]): void;
    };
    "logger.error": {
        (...data: any[]): void;
        (...data: any[]): void;
    };
    "logger.warn": {
        (...data: any[]): void;
        (...data: any[]): void;
    };
    "logger.info": {
        (...data: any[]): void;
        (...data: any[]): void;
    };
};
export declare const EVENTS: EventEmitter;
