import type { Platform } from "./configs/platform.ts";
import type * as ESBUILD from "esbuild-wasm/esm/browser.d.ts";

import type { IFileSystem, useFileSystem } from "./utils/filesystem.ts";
import type { getState, setState } from "./configs/state.ts";

export type { ESBUILD };
export type CommonConfigOptions = {
  /**
   * Configures how esbuild-wasm is initialized 
   */
  init?: ESBUILD.InitializeOptions & { platform?: Platform, version?: string }
};

/**
 * A “person” is an object with a “name” field and optionally “url” and “email”. Or you can shorten that all into a single string, and npm will parse it for you.
 */
export type PackageJsonPerson =
  | string
  | {
      name: string;
      email?: string;
      url?: string;
    };

export interface PackageJson {
  /**
     * The name is what your thing is called.
     * Some rules:

         - The name must be less than or equal to 214 characters. This includes the scope for scoped packages.
         - The name can’t start with a dot or an underscore.
         - New packages must not have uppercase letters in the name.
         - The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can’t contain any non-URL-safe characters.

     */
  name?: string;
  /**
   * Version must be parseable by `node-semver`, which is bundled with npm as a dependency. (`npm install semver` to use it yourself.)
   */
  version?: string;
  /**
   * Put a description in it. It’s a string. This helps people discover your package, as it’s listed in `npm search`.
   */
  description?: string;
  /**
   * Put keywords in it. It’s an array of strings. This helps people discover your package as it’s listed in `npm search`.
   */
  keywords?: string[];
  /**
   * The url to the project homepage.
   */
  homepage?: string;

  /**
   * The url to your project’s issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.
   */
  bugs?:
    | string
    | {
        url?: string;
        email?: string;
      };
  /**
   * You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you’re placing on it.
   */
  license?: string;
  /**
   * Specify the place where your code lives. This is helpful for people who want to contribute. If the git repo is on GitHub, then the `npm docs` command will be able to find you.
   * For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for npm install:
   */
  repository?:
    | string
    | {
        type: string;
        url: string;
        /**
         * If the `package.json` for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives:
         */
        directory?: string;
      };
  scripts?: Record<string, string>;
  /**
   * If you set `"private": true` in your package.json, then npm will refuse to publish it.
   */
  private?: boolean;
  /**
   * The “author” is one person.
   */
  author?: PackageJsonPerson;
  /**
   * “contributors” is an array of people.
   */
  contributors?: PackageJsonPerson[];
  /**
   * The optional `files` field is an array of file patterns that describes the entries to be included when your package is installed as a dependency. File patterns follow a similar syntax to `.gitignore`, but reversed: including a file, directory, or glob pattern (`*`, `**\/*`, and such) will make it so that file is included in the tarball when it’s packed. Omitting the field will make it default to `["*"]`, which means it will include all files.
   */
  files?: string[];
  /**
   * The main field is a module ID that is the primary entry point to your program. That is, if your package is named `foo`, and a user installs it, and then does `require("foo")`, then your main module’s exports object will be returned.
   * This should be a module ID relative to the root of your package folder.
   * For most modules, it makes the most sense to have a main script and often not much else.
   */
  main?: string;
  /**
   * If your module is meant to be used client-side the browser field should be used instead of the main field. This is helpful to hint users that it might rely on primitives that aren’t available in Node.js modules. (e.g. window)
   */
  browser?: string | Record<string, string | false>;
  /**
   * A map of command name to local file name. On install, npm will symlink that file into `prefix/bin` for global installs, or `./node_modules/.bin/` for local installs.
   */
  bin?: string | Record<string, string>;
  /**
   * Specify either a single file or an array of filenames to put in place for the `man` program to find.
   */
  man?: string | string[];
  /**
   * Dependencies are specified in a simple object that maps a package name to a version range. The version range is a string which has one or more space-separated descriptors. Dependencies can also be identified with a tarball or git URL.
   */
  dependencies?: Record<string, string>;
  /**
   * If someone is planning on downloading and using your module in their program, then they probably don’t want or need to download and build the external test or documentation framework that you use.
   * In this case, it’s best to map these additional items in a `devDependencies` object.
   */
  devDependencies?: Record<string, string>;
  /**
   * If a dependency can be used, but you would like npm to proceed if it cannot be found or fails to install, then you may put it in the `optionalDependencies` object. This is a map of package name to version or url, just like the `dependencies` object. The difference is that build failures do not cause installation to fail.
   */
  optionalDependencies?: Record<string, string>;
  /**
   * In some cases, you want to express the compatibility of your package with a host tool or library, while not necessarily doing a `require` of this host. This is usually referred to as a plugin. Notably, your module may be exposing a specific interface, expected and specified by the host documentation.
   */
  peerDependencies?: Record<string, string>;
  /**
   * TypeScript typings, typically ending by .d.ts
   */
  types?: string;
  typings?: string;
  /**
   * Non-Standard Node.js alternate entry-point to main.
   * An initial implementation for supporting CJS packages (from main), and use module for ESM modules.
   */
  module?: string;
  /**
   * Make main entry-point be loaded as an ESM module, support "export" syntax instead of "require"
   *
   * Docs:
   * - https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_package_json_type_field
   *
   * @default 'commonjs'
   * @since Node.js v14
   */
  type?: "module" | "commonjs";
  /**
   * Alternate and extensible alternative to "main" entry point.
   *
   * When using `{type: "module"}`, any ESM module file MUST end with `.mjs` extension.
   *
   * Docs:
   * - https://nodejs.org/docs/latest-v14.x/api/esm.html#esm_exports_sugar
   *
   * @default 'commonjs'
   * @since Node.js v14
   */
  exports?:
    | string
    | Record<
        "import" | "require" | "." | "node" | "browser" | string,
        string | Record<"import" | "require" | string, string>
      >;
  workspaces?: string[];
  [key: string]: any;
}

/**
 * Local state available to all plugins
 */
export interface LocalState<T = unknown> {
  filesystem?: IFileSystem<T>,
  
  /**
   * Versions
   */
  versions?: Map<string, string>,

  /**
   * Assets are files during the build process that esbuild can't handle natively, 
   * e.g. fetching web workers using the `new URL("...", import.meta.url)`
   */
  assets?: ESBUILD.OutputFile[],

  /**
   * Array storing the [getter, setter] of the global state
   */
  GLOBAL?: [typeof getState, typeof setState],

  [key: PropertyKey]: unknown
}

export type BuildConfig = CommonConfigOptions & {
  /** esbuild config options https://esbuild.github.io/api/#build-api */
  esbuild?: ESBUILD.BuildOptions,

  /**
   * The package.json to use when trying to bundle files
   */
  "package.json"?: PackageJson;

  /**
   * Enables or disables polyfill
   */
  polyfill?: boolean;

  /** The default CDN to import packages from */
  cdn?: "https://unpkg.com" | "https://esm.run" | "https://cdn.esm.sh" | "https://cdn.esm.sh" | "https://cdn.skypack.dev" | "https://cdn.jsdelivr.net/npm" | "https://cdn.jsdelivr.net/gh" | "https://deno.land/x" | "https://raw.githubusercontent.com" | "unpkg" | "esm.run" | "esm.sh" | "esm" | "skypack" | "jsdelivr" | "jsdelivr.gh" | "github" | "deno" | (string & object),

  /** Aliases for replacing packages with different ones, e.g. replace "fs" with "memfs", so, it can work on the web, etc... */
  alias?: Record<string, string>,

  /**
   * Enables converting ansi logs to HTML so virtual consoles can handle the logs and print with color
   */
  ansi?: "html" | "html-and-ansi" | "ansi",

  /**
   * Documentation: https://esbuild.github.io/api/#entry-points
   */
  entryPoints?: ESBUILD.BuildOptions["entryPoints"]
};
