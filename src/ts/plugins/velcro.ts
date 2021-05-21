///<reference lib="dom" />///<reference types="node" />
import { PackageMainField, resolve, Uri } from '@velcro/common';
import { Resolver } from '@velcro/resolver';
import { CdnStrategy } from '@velcro/strategy-cdn';
import { CompoundStrategy } from '@velcro/strategy-compound';
import { FsStrategy } from '@velcro/strategy-fs';
import type { OnResolveArgs, OnResolveResult, Plugin } from 'esbuild';

const BARE_MODULE_RX = /^((@[^/]+\/[^/@]+|[^./@][^/@]*)(?:@([^/]+))?)(.*)?$/;
const DEFAULT_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const DEFAULT_MAIN_FIELDS: PackageMainField[] = ['module', 'main'];

export interface VelcroPluginOptions {
  /**
   * The current working directory relative to the supplied filesystem.
   */
  cwd?: string;

  /**
   * An array of fallback extensions that will be attempted when trying to resolve URIs
   * if the provided URI doesn't already resolve.
   */
  extensions?: string[];

  /**
   * The set of module specs that should be treated as external.
   *
   * Modules treated as external will not be included in any bundle. This can be useful
   * for things like node core modules when targeting Node.js.
   */
  external?: string[];

  /**
   * A filesystem-like object that implements a subset of the Node.js 'fs' package's
   * interface.
   */
  fs: FsStrategy.FsInterface;

  /**
   * An ordered list of `package.json` fields to consult when trying to find an npm
   * module's main entrypoint.
   */
  packageMain?: PackageMainField[];

  /**
   * A function that, given a url, will return a Promise that resolves to the contents
   * of the file at that location as an `ArrayBuffer`.
   *
   * In a Node.js environment, you might supply something based on the `http`, `https` or
   * `http2` standard libraries. In a browser environment, you might supply something
   * based on `fetch`.
   */
  readUrlFn: CdnStrategy.UrlContentFetcher;
}

export function createPlugin(options: VelcroPluginOptions): Plugin {
  const readUrlFn = options.readUrlFn;
  const externals = new Set(options.external);

  return {
    name,
    setup(build) {
      const maybeCwd = options.cwd ?? build.initialOptions.absWorkingDir;
      if (!maybeCwd) {
        throw new Error(`A .cwd option must be specified if esbuild is not configured with an absWorkingDir option`);
      }
      // Re-alias so that TypeScript can infer that it will always be set
      const cwd = maybeCwd;

      const fsStrategy = new FsStrategy({
        // The FsStrategy can work with non-native 'fs'-compatible libraries and doesn't
        // assume the presence of the node 'fs' library. As a result, a library must be
        // passed in.
        fs: options.fs,
        // We'll treat the root of the FsStrategy as the (changed) working directory.
        // The FsStrategy will refuse to read anything 'above' the rootUri, effectively
        // sandboxing the fs to the given rootUri and below.
        rootUri: Uri.file(cwd),
      });

      // We will set up a strategy whose sole purpose is to resolve npm modules and
      // their files and dependencies.
      const cdnStrategy = CdnStrategy.forJsDelivr(readUrlFn);

      // The compound strategy used here creates a union of the file-system-based
      // FsStrategy and the http-based CdnStrategy. Calls are delegated to the
      // child strategies based on the requested uri and the strategies' .rootUri
      // properties.
      const compoundStrategy = new CompoundStrategy({
        strategies: [fsStrategy, cdnStrategy],
      });
      const resolver = new Resolver(compoundStrategy, {
        extensions: options.extensions || DEFAULT_EXTENSIONS,
        packageMain: options.packageMain || DEFAULT_MAIN_FIELDS,
      });

      async function onResolve({ importer, path }: OnResolveArgs): Promise<OnResolveResult> {
        // A `data:` URI typically already contains whatever is needed so we
        // treat it as an 'external' to leave it as-is.
        if (path.startsWith('data:')) {
          return {
            external: true,
          };
        }

        if (externals.has(path)) {
          return {
            external: true,
          };
        }

        const resolveResult = importer
          ? await resolver.resolve(path, Uri.parse(importer))
          : await resolver.resolve(Uri.file(resolve(cwd, path)));

        if (!resolveResult.found || !resolveResult.uri) {
          throw new Error(`Unable to resolve ${path} from ${importer}`);
        }

        return {
          namespace,
          path: resolveResult.uri.toString(),
        };
      }

      // Hook into bare modules matching our gnarly regex up top
      build.onResolve({ filter: BARE_MODULE_RX }, onResolve);

      // Hook into any resolve calls from things already marked as part of the
      // 'velcro' namespace.
      build.onResolve({ filter: /.*/, namespace }, onResolve);

      // Note that we're restricting `onLoad` hooks to the 'velcro' namespace.
      build.onLoad({ filter: /.*/, namespace }, async ({ path }) => {
        const readResult = await resolver.readFileContent(Uri.parse(path));

        return {
          contents: Buffer.from(readResult.content),
          loader: 'default',
        };
      });
    },
  };
}

export const name = 'velcro';
export const namespace = 'velcro';

export interface VelcroBrowserPluginOptions extends Omit<VelcroPluginOptions, 'readUrlFn'> {

  /**
   * A function that, given a url, will return a Promise that resolves to the contents
   * of the file at that location as an `ArrayBuffer`.
   *
   * In a Node.js environment, you might supply something based on the `http`, `https` or
   * `http2` standard libraries. In a browser environment, you might supply something
   * based on `fetch`.
   */
  readUrlFn?: VelcroPluginOptions['readUrlFn'];
}

export function createBrowserPlugin(options: VelcroBrowserPluginOptions) {
  return createPlugin({
    ...options,
    readUrlFn:
      options.readUrlFn ??
      // In the browser, we can delegate this work to fetch. Browsers that don't
      // support fetch will have to have polyfills supplied
      async function (href: string): Promise<ArrayBuffer> {
        return fetch(href).then(res => res.arrayBuffer());
      },
  });
}