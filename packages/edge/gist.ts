import { Octokit } from "npm:octokit";

export const octokit = new Octokit({
  auth: Deno.env.get('GITHUB_AUTH_TOKEN')
})

export const BUNDLE_FILE_PATH = "index.js";
export async function setFile(url: string, text: string) {
  const newUrl = new URL(url);
  newUrl.hostname = "deno.bundlejs.dev";

  console.log({ url, text })
  return (
    await octokit.request('POST /gists', {
      description: `Result of ${newUrl.href}`,
      'public': true,
      files: {
        'README.md': {
          content: `Hey 👋, this is a gist which stores the final bundle results of the bundlejs api, learn more on the website https://bundlejs.com. This is the result of ${newUrl.href}.`
        },
        [BUNDLE_FILE_PATH]: {
          content: text
        }
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  ).data.id
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
      console.warn(e);

      break;
    }
  }
}