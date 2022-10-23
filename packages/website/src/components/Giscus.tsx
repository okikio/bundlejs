import { runTheme } from "../scripts/theme";

function handleMessage(event: MessageEvent) {
  if (event.origin !== "https://giscus.bundlejs.com") return;
  if (!(typeof event.data === "object" && event.data.giscus)) return;

  // Do whatever you want with it, e.g. `console.log(giscusData)`.
  // You'll need to make sure that `giscusData` contains the message you're
  // expecting, e.g. by using `if ('discussion' in giscusData)`.
  const html = document.querySelector("html");
  if (html) runTheme(html);

  globalThis?.removeEventListener?.("message", handleMessage);
}

export function Giscus() {
  globalThis?.addEventListener?.("message", handleMessage);

  return (
    <script   
      src="https://giscus.bundlejs.com/client.js"
      data-repo="okikio/bundlejs"
      data-repo-id="MDEwOlJlcG9zaXRvcnkzNjE4NjgyNTM="
      data-mapping="number"
      data-term="20"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      data-input-position="bottom"
      data-theme="preferred_color_scheme"
      data-lang="en"
      data-loading="lazy"
      crossorigin="anonymous"
      defer

      // @ts-ignore
      fetchpriority="low" 
    ></script>
  );
}

export default Giscus;