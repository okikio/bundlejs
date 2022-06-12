"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.debounce = void 0;
// Based on https://davidwalsh.name/javascript-debounce-function
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
const debounce = (func, wait = 300, immediate) => {
    let timeout;
    return function (...args) {
        let context = this;
        let later = () => {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        // @ts-ignore
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
};
exports.debounce = debounce;