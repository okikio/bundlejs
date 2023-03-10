import { Octokit } from "npm:octokit";
import { dispatchEvent, LOGGER_ERROR, LOGGER_WARN } from "@bundlejs/core/src/index.ts";
import { Velo } from "https://deno.land/x/velo/mod.ts";

export const GIST_CACHE = Velo.builder<string, string>().capacity(10).lru().ttl(120_000).build();
export const octokit = new Octokit({
  auth: Deno.env.get('GITHUB_AUTH_TOKEN')
})

export const BUNDLE_FILE_PATH = "index.js";
export async function setFile(url: string, text: string) {
  const newUrl = new URL(url);
  newUrl.hostname = "deno.bundlejs.dev";

  try {
    const fileId = (
      await octokit.request('POST /gists', {
        description: `Result of ${newUrl.href}`,
        'public': true,
        files: {
          [BUNDLE_FILE_PATH]: {
            content: text
          },
          'README.md': {
            content: `Hey 👋, this is a gist which stores the final bundle results of the bundlejs api, learn more on the website https://bundlejs.com. This is the result of ${newUrl.href}.`
          }
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        },
      })
    ).data.id;
    if (fileId) GIST_CACHE.set(fileId, text);
    return fileId;
  } catch(e) {
    dispatchEvent(LOGGER_ERROR, e);
  }
}

export async function listFiles(page = 0) {
  return ( 
    await octokit.request('GET /gists/public', {
      page,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  ).data
}

export async function getFile(id: string) {
  const rawFile = GIST_CACHE.get(id);
  if (rawFile) return rawFile;
  const req = await octokit.request('GET /gists/{gist_id}', {
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
}

export function deleteFile(id: string) {
  const rawFile = GIST_CACHE.has(id);
  if (rawFile) GIST_CACHE.remove(id);
  return octokit.request('DELETE /gists/{gist_id}', {
    gist_id: id,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
}

export async function clearFiles() {
  let page = 0;
  while (true) {
    try {
      const files = await listFiles(page);
      if (files.length <= 0) break;

      for (const file of files) {
        await deleteFile(file.id)
      }

      page ++;
    } catch (e) {
      dispatchEvent(LOGGER_WARN, e);

      break;
    }
  }
}