import { createSignal, onMount } from "solid-js";

import { hit } from "countapi-js";
import { PRODUCTION_MODE } from "../../../env";

export function HitCounter() {
  let [count, setCount] = createSignal("00000");
  onMount(() => {
    // countapi-js hit counter. It counts the number of times the website is loaded
    (async () => {
      if (!PRODUCTION_MODE) return;
      try {
        let { value } = await hit("bundle.js.org", "visits");
        setCount(`${value}`);
      } catch (err) {
        console.warn(
          "Visit Counter Error (please create a new issue in the repo)",
          err
        );
      }
    })();
  });

  return (<span class="inline-block" id="visit-counter">👋 {count()} visits</span>)
}

export default HitCounter;