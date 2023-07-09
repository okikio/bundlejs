// import type { CommonConfigOptions, ESBUILD } from "./types.ts";

// import { VIRTUAL_FS } from "./plugins/virtual-fs.ts";
// import { EXTERNAL } from "./plugins/external.ts";
// import { ALIAS } from "./plugins/alias.ts";
// import { HTTP } from "./plugins/http.ts";
// import { CDN } from "./plugins/cdn.ts";

// import { EVENTS } from "./configs/events.ts";
// import { createConfig } from "./configs/config.ts";
// import { PLATFORM_AUTO } from "./configs/platform.ts";
// import { createState, getState, setState } from "./configs/state.ts";

// import { getFile, setFile, getResolvedPath, useFileSystem } from "./utils/filesystem.ts";
// import { createNotice } from "./utils/create-notice.ts";
// import { DEFAULT_CDN_HOST } from "./utils/util-cdn.ts";
// import { init } from "./init.ts";

// import type { BuildConfig, LocalState } from "./build.ts";

// export interface BuildContext<SpecificOptions extends ESBUILD.BuildOptions = ESBUILD.BuildOptions> extends ESBUILD.BuildContext<SpecificOptions> {
//   outputs: ESBUILD.OutputFile[];
//   contents: ESBUILD.OutputFile[];
// };

// export async function context<T extends BuildConfig>(opts?: T, filesystem = useFileSystem(EVENTS)): Promise<BuildContext<T>> {
//   if (!getState("initialized"))
//     EVENTS.emit("init.loading");

//   const CONFIG = createConfig("build", opts);
//   const STATE = createState<LocalState>({ assets: [], GLOBAL: [getState, setState] });
//   const [get] = STATE;

//   const { platform, ...initOpts } = CONFIG.init ?? {};
//   const { context } = await init(platform, initOpts);
//   const { define = {}, ...esbuildOpts } = CONFIG.esbuild ?? {};

//   // Stores content from all external outputed files, this is for checking the gzip size when dealing with CSS and other external files
//   let outputs: ESBUILD.OutputFile[] = [];
//   let contents: ESBUILD.OutputFile[] = [];
//   let result: ESBUILD.BuildContext<T> = null;

//   try {
//     try {
//       const key = "p.env.NODE_ENV".replace("p.", "process.");
//       result = await context({
//         entryPoints: CONFIG?.entryPoints ?? [],
//         loader: {
//           ".png": "file",
//           ".jpeg": "file",
//           ".ttf": "file",
//           ".svg": "text",
//           ".html": "text",
//           ".scss": "css"
//         },
//         define: {
//           "__NODE__": "false",
//           [key]: "\"production\"",
//           ...define
//         },
//         write: false,
//         outdir: "/",
//         plugins: [
//           ALIAS(EVENTS, STATE, CONFIG),
//           EXTERNAL(EVENTS, STATE, CONFIG),
//           HTTP(EVENTS, STATE, CONFIG),
//           CDN(EVENTS, STATE, CONFIG),
//           VIRTUAL_FS(EVENTS, STATE, CONFIG),
//         ],
//         ...esbuildOpts,
//       });
//     } catch (e) {
//       if (e.errors) {
//         // Log errors with added color info. to the virtual console
//         const asciMsgs = [...await createNotice(e.errors, "error", false)];
//         const htmlMsgs = [...await createNotice(e.errors, "error")];

//         EVENTS.emit("logger.error", asciMsgs, htmlMsgs);

//         const message = (htmlMsgs.length > 1 ? `${htmlMsgs.length} error(s) ` : "") + "(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";
//         EVENTS.emit("logger.error", message);
//         return;
//       } else throw e;
//     }

//     // Create an array of assets and actual output files, this will later be used to calculate total file size
//     outputs = await Promise.all(
//       [...get()["assets"]]
//         .concat(result?.outputFiles as ESBUILD.OutputFile[])
//     );

//     contents = await Promise.all(
//       outputs
//         ?.map(({ path, text, contents }): ESBUILD.OutputFile => {
//           if (/\.map$/.test(path))
//             return null;

//           // For debugging reasons, if the user chooses verbose, print all the content to the Shared Worker console
//           if (esbuildOpts?.logLevel === "verbose") {
//             const ignoreFile = /\.(wasm|png|jpeg|webp)$/.test(path);
//             if (ignoreFile) {
//               EVENTS.emit("logger.log", "Output File: " + path);
//             } else {
//               EVENTS.emit("logger.log", "Output File: " + path + "\n" + text);
//             }
//           }

//           return { path, text, contents };
//         })

//         // Remove null output files
//         ?.filter(x => ![undefined, null].includes(x))
//     );

//     // Ensure a fresh filesystem on every run
//     FileSystem.clear();

//     return {
//       /** 
//        * The output and asset files without unnecessary croft, e.g. `.map` sourcemap files 
//        */
//       contents,

//       /**
//        * The output and asset files with `.map` sourcemap files 
//        */
//       outputs,

//       ...result
//     };
//   } catch (e) { 
//     EVENTS.emit("build.error", e);
//   }
// }

export {};