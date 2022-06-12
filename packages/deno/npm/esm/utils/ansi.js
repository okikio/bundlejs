// Based off of @hyrious esbuild-repl https://github.com/hyrious/esbuild-repl/blob/main/src/helpers/ansi.ts
// https://github.com/evanw/esbuild/blob/master/internal/logger/logger.go
export const ESCAPE_TO_COLOR = {
    "37": "dim",
    "31": "red",
    "32": "green",
    "34": "blue",
    "36": "cyan",
    "35": "magenta",
    "33": "yellow",
    "41;31": "red-bg-red",
    "41;97": "red-bg-white",
    "42;32": "green-bg-green",
    "42;97": "green-bg-white",
    "44;34": "blue-bg-blue",
    "44;97": "blue-bg-white",
    "46;36": "cyan-bg-cyan",
    "46;30": "cyan-bg-black",
    "45;35": "magenta-bg-magenta",
    "45;30": "magenta-bg-black",
    "43;33": "yellow-bg-yellow",
    "43;30": "yellow-bg-black",
};
// https://github.com/sindresorhus/escape-goat
export function htmlEscape(string) {
    return string
        .replace(/\<br\>/g, "\n")
        .replace(/\&/g, "&amp;")
        .replace(/\"/g, "&quot;")
        .replace(/\'/g, "&#39;")
        .replace(/\</g, "&lt;")
        .replace(/\>/g, "&gt;");
}
export class AnsiBuffer {
    constructor() {
        Object.defineProperty(this, "result", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "_stack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_bold", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_underline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_link", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    text(text) {
        this.result += htmlEscape(text);
    }
    reset() {
        let close;
        while ((close = this._stack.pop())) {
            this.result += close;
        }
    }
    bold() {
        if (!this._bold) {
            this._bold = true;
            this.result += "<strong>";
            this._stack.push("</strong>");
        }
    }
    underline() {
        if (!this._underline) {
            this._underline = true;
            this.result += "<ins>";
            this._stack.push("</ins>");
        }
    }
    last() {
        return this._stack[this._stack.length - 1];
    }
    color(color) {
        let close;
        while ((close = this.last()) === "</span>") {
            this._stack.pop();
            this.result += close;
        }
        this.result += `<span class="color-${color}">`;
        this._stack.push("</span>");
    }
    done() {
        this.reset();
        return this.result;
    }
}
export function render(ansi) {
    ansi = ansi.trimEnd();
    let i = 0;
    const buffer = new AnsiBuffer();
    for (let m of ansi.matchAll(/\x1B\[([\d;]+)m/g)) {
        const escape = m[1];
        buffer.text(ansi.slice(i, m.index));
        i = m.index + m[0].length;
        /*  */ if (escape === "0") {
            buffer.reset();
        }
        else if (escape === "1") {
            buffer.bold();
        }
        else if (escape === "4") {
            buffer.underline();
        }
        else if (ESCAPE_TO_COLOR[escape]) {
            buffer.color(ESCAPE_TO_COLOR[escape]);
        }
    }
    if (i < ansi.length) {
        buffer.text(ansi.slice(i));
    }
    return buffer.done();
}
export { render as ansi };
export default render;
