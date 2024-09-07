// @deno-types="npm:@octokit/rest"
import { Octokit } from "@octokit/rest";

// @deno-types="npm:@octokit/plugin-throttling"
import { throttling } from "@octokit/plugin-throttling";

import { Velo } from "velo";
import { ESBUILD } from "@bundle/core/src/types.ts";

import { encodeBase64 } from "@std/encoding/base64";
import { extname } from "@std/path";

export const GIST_CACHE = Velo.builder<string, string>().capacity(10).lru().ttl(30_000).build();
export const CustomOctokit = Octokit.plugin(throttling);

export const octokit = new CustomOctokit({
  auth: Deno.env.get('GITHUB_AUTH_TOKEN'),
  throttle: {
    timeout: 1000 * 5,
    onRateLimit: (retryAfter: any, options: { method: any; url: any; }, octokit: { log: { warn: (arg0: string) => void; info: (arg0: string) => void; }; }, retryCount: number) => {
      console.log({
        GIST: options
      })
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (retryCount < 1) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (retryAfter: any, options: { method: any; url: any; }, octokit: { log: { warn: (arg0: string) => void; }; }) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      );
    },
    onAbuseLimit: (retryAfter: any, options: { method: any; url: any; }) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `Abuse detected for request ${options.method} ${options.url}`
      );
    },
  },
})

export const BUNDLE_FILE_PATH = "index.js";
export async function setFile(url: string, files: ESBUILD.OutputFile[]) {
  const newUrl = new URL(url);
  newUrl.hostname = "deno.bundlejs.com";

  try {
    const filesObj = Object.fromEntries(
      files.map(x => {
        const path = x.path.replace(/^\.|\//g, "").replace(/[^\w-_.]/g, "");
        return [
          path,
          {
            content: (
              /\.(wasm|png|jpg|jpeg)$/.exec(extname(path)) ?
                encodeBase64(x.contents) :
                x.text
            ) || "[bundlejs] Empty file..."
          }
        ]
      })
    );

    const result = (
      // 'POST /gists', 
      await octokit.rest.gists.create({
        description: `Result of ${newUrl.href}`.slice(0, 255),
        'public': false,
        files: {
          ...filesObj,
          'README.md': {
            content: `Hey 👋, this is a gist which stores the final bundle results of the bundlejs api, learn more on the website https://bundlejs.com. This is the result of ${newUrl.href}.`
          }
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        },
      })
    ).data;

    const fileId = result.id;
    const fileUrl = result.url;
    const fileHTMLUrl = result.html_url;
    if (fileId) GIST_CACHE.set(fileId, filesObj[BUNDLE_FILE_PATH].content);
    return {
      fileId,
      fileUrl,
      fileHTMLUrl
    };
  } catch (e) {
    console.warn('gist set: ', e);
  }
}

export function listFiles() {
  // 'GET /gists'
  const list = octokit.paginate.iterator(octokit.rest.gists.list, {
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  return list;
}

export async function getFile(id: string) {
  const rawFile = GIST_CACHE.get(id);
  if (rawFile) return rawFile;

  try {
    //'GET /gists/{gist_id}'
    const req = await octokit.rest.gists.get({
      gist_id: id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    const data = req.data;
    const result = data.files![BUNDLE_FILE_PATH]!;
    if (result.truncated && result.raw_url) {
      return await fetch(result.raw_url).then(res => res.text());
    }

    return result?.content;
  } catch (e) {
    console.warn(`gist get: `, e)
  }
}

export async function deleteFile(id: string) {
  try {
    if (GIST_CACHE.has(id)) GIST_CACHE.remove(id);

    // 'DELETE /gists/{gist_id}'
    const result = await octokit.rest.gists.delete({
      gist_id: id,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    return result
  } catch (e) {
    console.warn(`gist delete: `, e);
  }
}