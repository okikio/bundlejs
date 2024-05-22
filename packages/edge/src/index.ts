import { TextEncoder as Encoder, TextDecoder as Decoder } from 'text-encoding-shim';

type EncoderType = typeof globalThis.TextEncoder;
type DecoderType = typeof globalThis.TextDecoder;

globalThis.performance = globalThis.performance ?? { now: Date.now } as Performance;
globalThis.TextEncoder = globalThis.TextEncoder ?? Encoder as unknown as EncoderType;
globalThis.TextDecoder = globalThis.TextDecoder ?? Decoder as unknown as DecoderType;
globalThis.location = globalThis.location ?? new URL("http://localhost:3000/") as unknown as Location;

import type { BuildConfig, CompressConfig } from "@bundle/core/src/index.ts";
import { build, setFile, deepAssign, useFileSystem, createConfig, bytes } from "@bundle/core/lib/index.mjs";

import { parseShareURLQuery, parseConfig } from "./_parse-query.ts";
import wasmUrl from "../../core/lib/esbuild.wasm?url";

const timeFormatter = new Intl.RelativeTimeFormat("en", {
	style: "narrow",
	numeric: "auto",
});

const inputModelResetValue = [
	'export * from "@okikio/animate";'
].join("\n");

const FileSystem = useFileSystem();
export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		try {
			const fs = await FileSystem;
			const start = performance.now();

			const url = new URL(request.url);
			const initialValue = parseShareURLQuery(url) || inputModelResetValue;
			const { init: _, entryPoints: _2, ascii: _3, ...initialConfig } = parseConfig(url) || {};

			setFile(fs, "/index.tsx", initialValue);
			
			const configObj: BuildConfig & CompressConfig = deepAssign({}, initialConfig, {
				entryPoints: ["/index.tsx"],
				esbuild: {
					treeShaking: true,
					metafile: url.searchParams.has("analysis") ||
						url.searchParams.has("metafile") ||
						Boolean(initialConfig?.analysis)
				},
				init: {
					platform: "browser",
					worker: false,
					// wasmModule
					wasmURL: wasmUrl
				},
			} as BuildConfig);
			console.log({ configObj })
			const result = await build(configObj, FileSystem);

			if (url.searchParams.has("file")) {
				const fileBundle = result.contents[0];
				return new Response(fileBundle.contents, {
					status: 200,
					headers: [
						['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
						['Content-Type', 'text/javascript']
					],
				})
			}

			// const size = await compress(result.contents.map(x => x.contents), configObj);
			const uncompressedSize = bytes.format(
				result.contents.reduce((acc, content) => acc + content.contents.byteLength, 0)
			) as string;
			
			const cs = new CompressionStream('gzip');
			const compressedStream = new Blob(result.contents.map(x => x.contents.buffer)).stream().pipeThrough(cs);
			const compressedSize = bytes.format(new Uint8Array(await new Response(compressedStream).arrayBuffer()).byteLength);

			if (url.searchParams.has("badge")) {
				const urlQuery = encodeURIComponent(`https://bundlejs.com/${url.search}`);
				const imgShield = await fetch(`https://img.shields.io/badge/bundlejs-${encodeURIComponent(compressedSize)}-blue?link=${urlQuery}&link=${urlQuery}`).then(res => res.text());
				return new Response(imgShield, {
					status: 200,
					headers: [
						['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
						['Content-Type', 'image/svg+xml']
					],
				})
			}

			const end = performance.now();
			const { init: _init, ...printableConfig } = createConfig("build", configObj);
			return new Response(JSON.stringify({
				query: url.search,
				config: printableConfig,
				input: initialValue,
				size: {
					type: "gzip",

					uncompressedSize,
					compressedSize,
				},
				time: timeFormatter.format((end - start) / 1000, "seconds"),
				rawTime: (end - start) / 1000,
			}), {
				status: 200,
				headers: [
					['Cache-Control', 'max-age=8640, s-maxage=86400, public'],
					['Content-Type', 'application/json']
				],
			})
		} catch (e) {
			console.error(e)

			return new Response(
				JSON.stringify({ error: (e as Error).toString() }),
				{ status: 400, }
			)
		}
	},
};


/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

