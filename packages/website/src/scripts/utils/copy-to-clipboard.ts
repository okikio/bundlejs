  // https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript#asynchronous-clipboard-api
export async function copyToClipboard(str: string) {
  if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
    return await navigator.clipboard.writeText(str);
  }
  return await Promise.reject('The Clipboard API is not available.');
}