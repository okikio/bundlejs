import type { Plugin } from 'esbuild-wasm';
import type { BundleConfigOptions } from '../configs/options';
import type { EVENTS } from '../configs/events';
/** External Plugin Namespace */
export declare const EXTERNALS_NAMESPACE = "external-globals";
/** An empty export as a Uint8Array */
export declare const EMPTY_EXPORT: Uint8Array;
/** List of polyfillable native node modules, you should now use aliases to polyfill features */
export declare const PolyfillMap: {
    console: string;
    constants: string;
    crypto: string;
    http: string;
    buffer: string;
    Dirent: string;
    vm: string;
    zlib: string;
    assert: string;
    child_process: string;
    cluster: string;
    dgram: string;
    dns: string;
    domain: string;
    events: string;
    https: string;
    module: string;
    net: string;
    path: string;
    punycode: string;
    querystring: string;
    readline: string;
    repl: string;
    stream: string;
    string_decoder: string;
    sys: string;
    timers: string;
    tls: string;
    tty: string;
    url: string;
    util: string;
    _shims: string;
    _stream_duplex: string;
    _stream_readable: string;
    _stream_writable: string;
    _stream_transform: string;
    _stream_passthrough: string;
    process: string;
    fs: string;
    os: string;
    v8: string;
    "node-inspect": string;
    _linklist: string;
    _stream_wrap: string;
};
/** Array of native node packages (that are polyfillable) */
export declare const PolyfillKeys: string[];
/** API's & Packages that were later removed from nodejs */
export declare const DeprecatedAPIs: string[];
/** Packages `bundle` should ignore, including deprecated apis, and polyfillable API's */
export declare const ExternalPackages: string[];
/** Based on https://github.com/egoist/play-esbuild/blob/7e34470f9e6ddcd9376704cd8b988577ddcd46c9/src/lib/esbuild.ts#L51 */
export declare const isExternal: (id: string, external?: string[]) => string;
/**
 * Esbuild EXTERNAL plugin
 *
 * @param external List of packages to marks as external
 */
export declare const EXTERNAL: (events: typeof EVENTS, config: BundleConfigOptions) => Plugin;
