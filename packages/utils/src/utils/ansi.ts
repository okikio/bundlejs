// Based off of @hyrious esbuild-repl https://github.com/hyrious/esbuild-repl/blob/main/src/helpers/ansi.ts
import { escape as htmlEscape } from "./html.ts";

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
} as const;

export type Escape = "0" | "1" | "4" | keyof typeof ESCAPE_TO_COLOR;
export type Color = typeof ESCAPE_TO_COLOR[keyof typeof ESCAPE_TO_COLOR];

export class AnsiBuffer {
  result = "";
  _stack: string[] = [];
  _bold = false;
  _underline = false;
  _link = false;
  text(text: string) {
    this.result += htmlEscape(text);
  }
  reset() {
    let close: string | undefined;
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
  color(color: Color) {
    let close: string | undefined;
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

export function render(ansi: string) {
  ansi = ansi.trimEnd();

  let i = 0;
  const buffer = new AnsiBuffer();
  for (const m of ansi.matchAll(/\x1B\[([\d;]+)m/g)) {
    const escape = m[1] as Escape;
    buffer.text(ansi.slice(i, m.index));
    i = m.index! + m[0].length;
    /*  */ if (escape === "0") {
      buffer.reset();
    } else if (escape === "1") {
      buffer.bold();
    } else if (escape === "4") {
      buffer.underline();
    } else if (ESCAPE_TO_COLOR[escape]) {
      buffer.color(ESCAPE_TO_COLOR[escape]);
    }
  }
  if (i < ansi.length) {
    buffer.text(ansi.slice(i));
  }
  
  /** 
   * Based on https://stackoverflow.com/questions/6038061/regular-expression-to-find-urls-within-a-string
   * Based on http://www.regexguru.com/2008/11/detecting-urls-in-a-block-of-text/
   */  
  const str = buffer.done()
    .replace(/&colon;/g, ":")
    .replace(/&period;/g, ".")
    .replace(/&sol;/g, "/")
    .replace(/&commat;/g, "@");
  return str.replace(
    /\b(?:(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[-A-Z0-9+&@#/%?=~_|$!:,.;]*[-A-Z0-9+&@#/%=~_|$]|((?:mailto:)?[A-Z0-9._%+-]+@[A-Z0-9._%-]+\.[A-Z]{2,4})\b)|"(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[^"\r\n]+"?|'(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)[^'\r\n]+'?/gi,
    (match) => `<a href="${match}" target="_blank" rel="noopener">${match}</a>`
  );
}

export { render as ansi };
export default render;