import { ComponentProps, createSignal } from "solid-js";
import Button from "../../Button";
import Loading from "../../Loading";

import IconLayer from "~icons/fluent/layer-24-regular";
import IconShare from "~icons/fluent/share-24-regular";

import { state } from "../store";

export function Activity(props?: ComponentProps<'div'>) {
  let shareRef: HTMLButtonElement = null;

  let initialTextValue = "Share";
  let [innerText, setInnerText] = createSignal(initialTextValue);

  // https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript#asynchronous-clipboard-api
  async function copyToClipboard(str: string) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return await navigator.clipboard.writeText(str);
    }
    return await Promise.reject('The Clipboard API is not available.');
  }

  async function getShareableURL() {
    if (!state.monaco.loading) {
      const model = state.monaco.models.input;
      try {
        const worker = state.monaco.workers.other;
        const thisWorker = await worker.getWorker();

        // @ts-ignore
        return await thisWorker.getShareableURL(model.uri.authority, model.getValue());
      } catch (e) {
        console.warn(e)
      }
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'bundlejs',
          text: '',
          url: await getShareableURL(),
        });
      } else {
        await copyToClipboard(await getShareableURL());
      }

      setInnerText("Shared!");
      setTimeout(() => {
        setInnerText(initialTextValue);
      }, 600);
    } catch (error) {
      console.log('Error sharing', error);
    }
  }

  return (
    <div class="activity-section">
      <div class="activity-container">
        <Button class="umami--click--bundle-build-button">
          <IconLayer />
          Build
        </Button>
        <Button class="umami--click--bundle-share-button" ref={shareRef} onClick={() => !state.monaco.loading && share()}>
          <IconShare />
          <span>{innerText()}</span>
        </Button>
        <div class="bundle-results" title="Uncompressed -&gt; Compressed">
          {/* <Loading size="md" /> */}
          11.34KB (gzip)
        </div>
      </div>
    </div>
  )
}

export default Activity;