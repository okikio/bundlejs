// export * from "./esbuild";
// export * from "./configs/options";

// export * from "./utils/ansi";
// export * from "./utils/brotli-wasm";
export * from "./utils/debounce";
// export * from "./utils/deep-equal";
// export * from "./utils/encode-decode";
export * from "./utils/fetch-and-cache";
// export * from "./utils/filesystem";
// export * from "./utils/loader";
// export * from "./utils/parse-query";


export const parseInput = (value: string) => {
    // const host = "https://registry.npmjs.com/-/v1/search?text";
    const host = "https://api.npms.io/v2/search?q";
    let urlScheme = `${host}=${encodeURIComponent(
      value
    )}&size=30`; // &popularity=0.5
    let version = "";
  
    let exec = /([\S]+)@([\S]+)/g.exec(value);
    if (exec) {
      let [, pkg, ver] = exec;
      version = ver;
      urlScheme = `${host}=${encodeURIComponent(
        pkg
      )}&size=30`; // &popularity=0.5
    }
  
    return { url: urlScheme, version };
  };
// export * from "./utils/path";
// export * from "./utils/resolve-imports";
// export * from "./utils/treeshake";
// export * from "./utils/util-cdn";

// export * from "./plugins/analyzer/index";
// export * from "./plugins/alias";
// export * from "./plugins/cdn";
// export * from "./plugins/external";
// export * from "./plugins/http";

// export * as brotli from "./deno/brotli/mod";
// export * as denoflate from "./deno/denoflate/mod";
// export * as lz4 from "./deno/lz4/mod";
// export * as path from "./deno/path/mod";