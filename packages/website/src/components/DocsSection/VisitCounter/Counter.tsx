import { PRODUCTION_MODE } from "../../../env";
import { createSignal } from "solid-js";

import { hit } from "countapi-js";
const [count, setCount] = createSignal("00000");

// countapi-js hit counter. It counts the number of times the website is loaded
(async () => {
  if (!PRODUCTION_MODE || !("visualViewport" in globalThis)) return;
  try {
    const { value } = await hit("bundle.js.org", "visits");
    setCount(`${value}`);
  } catch (err) {
    console.warn(
      "Visit Counter Error (please create a new issue in the repo)",
      err
    );
  }
})();

export function Counter() {
  return (<span class="inline-block" id="visit-counter">👋 <span>{count()}</span> visits</span>);
}

export default Counter;