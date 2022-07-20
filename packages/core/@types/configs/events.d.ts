import { EventEmitter } from "@okikio/emitter";
export declare const EVENTS_OPTS: {
    "init.start": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    "init.complete": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    "init.error": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    "init.loading": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    "logger.log": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    "logger.error": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    "logger.warn": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    "logger.info": {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
};
export declare const EVENTS: EventEmitter;
