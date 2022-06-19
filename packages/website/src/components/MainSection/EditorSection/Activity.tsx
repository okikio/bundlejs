import { ComponentProps, createSignal } from "solid-js";
import Button from "../../Button";
import Loading from "../../Loading";

import IconLayer from "~icons/fluent/layer-24-regular";
import IconShare from "~icons/fluent/share-24-regular";

import { setState, state } from "../store";
import { createTextSwitch } from "../../../hooks/text-switch";

export function Activity(props?: ComponentProps<'div'>) {
  let shareRef: HTMLButtonElement = null;
  let shareText = createTextSwitch("Share");
  let buildText = createTextSwitch("Build");

  // https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript#asynchronous-clipboard-api
  async function copyToClipboard(str: string) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return await navigator.clipboard.writeText(str);
    }
    return await Promise.reject('The Clipboard API is not available.');
  }

  async function getShareableURL() {
    if (!state.monaco.loading) {
      const inputModel = state.monaco.models.input;
      const configModel = state.monaco.models.config;
      try {
        const worker = state.monaco.workers.other;
        const thisWorker = await worker.getWorker();

        // @ts-ignore
        return await thisWorker.getShareableURL(
          inputModel.uri.authority,
          inputModel.getValue(),
          configModel.getValue()
        );
      } catch (e) {
        console.warn(e)
      }
    }
  }

  async function share() {
    try {
      if (navigator.share) {
        shareText.set("Shared!");
        await navigator.share({
          title: 'bundlejs',
          text: '',
          url: await getShareableURL(),
        });
      } else {
        shareText.set("Copied!");
        await copyToClipboard(await getShareableURL());
      }

      shareText.delayReset(600);
    } catch (error) {
      console.log('Error sharing', error);
    }
  }

  async function build() {
    if (!state.monaco.loading) {
      const inputModel = state.monaco.models.input;
      const configModel = state.monaco.models.config;

      try {
        const worker = state.monaco.workers.other;
        const thisWorker = await worker.getWorker();

        setState("bundling", true);
        buildText.set("Building!");

        // @ts-ignore
        let result = await thisWorker.build(
          inputModel.uri.authority,
          inputModel.getValue(),
          configModel.getValue()
        );

        console.log(result?.outputFiles)
        state.monaco?.models?.output.setValue(result?.outputFiles[0].text);
        setState("bundleSize", result.size);
      } catch (e) {
        console.warn(e);
        setState("bundleSize", "ERROR!");
      }

      buildText.delayReset(600);
      setState("bundling", false);
    }
  }

  return (
    <div class="activity-section">
      <div class="activity-container">
        <Button class="umami--click--bundle-build-button" onClick={() => !state.monaco.loading && build()} disabled={state.bundling}>
          <IconLayer />
          <span class="build-text">{buildText.get()}</span>
        </Button>
        <Button class="umami--click--bundle-share-button" ref={shareRef} onClick={() => !state.monaco.loading && share()}>
          <IconShare />
          <span class="share-text">{shareText.get()}</span>
        </Button>
        <div class="bundle-results" title="Compressed Size">
          <Loading size="md" show={state.bundling} />
          {state.bundleSize}
        </div>
      </div>
    </div>
  )
}

export default Activity;