// deno-lint-ignore-file
// deno-fmt-ignore-file
import * as dntShim from "../../_dnt.shims.js";

// @ts-nocheck
import * as A from "../lz4/mod.js";
export const source = A.decompress(
    Uint8Array.from(
        ),
        (A) => A.charCodeAt(0)
    )
);

let B, Q = null;
function E() {
    return (
        (null !== Q && Q.buffer === B.memory.buffer) ||
        (Q = new Uint8Array(B.memory.buffer)),
        Q
    );
}
let C = 0;
function g(A, B) {
    const Q = B(1 * A.length);
    return E().set(A, Q / 1), (C = A.length), Q;
}
let w = null;
function I() {
    return (
        (null !== w && w.buffer === B.memory.buffer) ||
        (w = new Int32Array(B.memory.buffer)),
        w
    );
}
function G(A, B) {
    return E().subarray(A / 1, A / 1 + B);
}
export function compress(A, Q, E, w) {
    var F = g(A, B.__wbindgen_malloc),
        D = C;
    B.compress(8, F, D, Q, E, w);
    var H = I()[2],
        U = I()[3],
        Y = G(H, U).slice();
    return B.__wbindgen_free(H, 1 * U), Y;
}
export function decompress(A, Q) {
    var E = g(A, B.__wbindgen_malloc),
        w = C;
    B.decompress(8, E, w, Q);
    var F = I()[2],
        D = I()[3],
        H = G(F, D).slice();
    return B.__wbindgen_free(F, 1 * D), H;
}
async function F(A, B) {
    if ("function" == typeof dntShim.Response && A instanceof dntShim.Response) {
        if ("function" == typeof WebAssembly.instantiateStreaming)
            try {
                return await WebAssembly.instantiateStreaming(A, B);
            } catch (B) {
                if ("application/wasm" == A.headers.get("Content-Type"))
                    throw B;
                console.warn(
                    "`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",
                    B
                );
            }
        const Q = await A.arrayBuffer();
        return await WebAssembly.instantiate(Q, B);
    }
    {
        const Q = await WebAssembly.instantiate(A, B);
        return Q instanceof WebAssembly.Instance
            ? { instance: Q, module: A }
            : Q;
    }
}
async function D(A) {
    void 0 === A && (A = import.meta.url.replace(/\.js$/, "_bg.wasm"));
    ("string" == typeof A ||
        ("function" == typeof dntShim.Request && A instanceof dntShim.Request) ||
        ("function" == typeof URL && A instanceof URL)) &&
        (A = dntShim.fetch(A));
    const { instance: Q, module: E } = await F(await A, {});
    // @ts-ignore: ...
    return (B = Q.exports), (D.__wbindgen_wasm_module = E), B;
}
export default D;