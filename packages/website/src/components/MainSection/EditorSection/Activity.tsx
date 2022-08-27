import type { ComponentProps } from "solid-js";

import { createSignal, onMount } from "solid-js";

import toast from '../../SolidToast/index';

import Button from "../../Button";
import Loading from "../../Loading";

import IconLayer from "~icons/fluent/layer-24-regular";
import IconShare from "~icons/fluent/share-24-regular";

import { setState, state } from "../store";
import { createTextSwitch } from "../../../hooks/text-switch";

import { ToolTip, SingletonToolTip } from "../../../hooks/tooltip";

const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

export function Activity(props?: ComponentProps<'div'>) {
  let shareRef: HTMLButtonElement = null;
  let buildRef: HTMLButtonElement = null;

  let ShareText = createTextSwitch(["Share", "Shared!"]);
  let BuildText = createTextSwitch(["Build", "Building!"]);

  onMount(() => {
    // toast("Hey, that's cool", { duration: Infinity });
    // toast.loading("Hey, that's cool", { duration: Infinity });
    // toast.error("Hey, that's cool", { duration: Infinity });
    // toast.success("Hey, that's cool", { duration: Infinity });
  });

  // https://www.30secondsofcode.org/articles/s/copy-text-to-clipboard-with-javascript#asynchronous-clipboard-api
  async function copyToClipboard(str: string) {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return await navigator.clipboard.writeText(str);
    }
    return await Promise.reject('The Clipboard API is not available.');
  }

  async function getShareURL() {
    if (!state.monaco.loading) {
      const inputModel = state.monaco.models.input;
      const configModel = state.monaco.models.config;
      try {
        const worker = state.monaco.workers.taskRunner;
        const thisWorker = await worker.getWorker();

        // @ts-ignore
        return await thisWorker.getShareURL(
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
    if (!state.monaco.loading) {
      try {
        ShareText.setNext(navigator.share ? "Sharing!" : "Copying!");
        ShareText.switch("next");
        
        await toast.promise(
          (async () => {
            if (navigator.share) {
              await navigator.share({
                title: 'bundlejs',
                text: '',
                url: await getShareURL(),
              });
            } else {
              await copyToClipboard(await getShareURL());
            }
          })(),
          {
            loading: "Sharing...",
            success: (val) => <>{navigator.share ? "Shared!" : "Copied!"}</>,
            error: 'Share Error'
          }
        );
      } catch (error) {
        console.log('Error sharing', error);
      }

      await ShareText.switch("initial", 600);
    }
  }

  async function build() {
    if (!state.monaco.loading) {
      const inputModel = state.monaco.models.input;
      const configModel = state.monaco.models.config;

      setState("bundling", true);

      // const toastId = toast.loading("Building!");
      BuildText.switch("next");

      try {
        const worker = state.monaco.workers.taskRunner;
        const thisWorker = await worker.getWorker();

        const start = Date.now();
        let end;

        let result;
        await toast.promise(
          (async () => {
            // @ts-ignore
            result = await thisWorker.build(
              inputModel.uri.authority,
              inputModel.getValue(),
              configModel.getValue()
            );
            end = Date.now();
            return result;
          })(),
          {
            loading: "Building...",
            success: (val) => <>Build Done with a size of {result.size} {timeFormatter.format((end - start) / 1000, "seconds")}</>,
            error: 'Build Error'
          }
        );

        console.log(result?.outputFiles, { size: result })
        if (result?.outputFiles) {
          state.monaco?.models?.output.setValue(result?.outputFiles[0].text);
        }

        if (result?.size) {
          setState("bundleSize", result.size);
        }
      } catch (e) {
        console.warn(e);
        setState("bundleSize", "ERROR!");
      }

      BuildText.switch("initial", 50);
      setState("bundling", false);
    }
  }

  return (
    <div class="activity-section">
      <div class="activity-container">
        <div class="flex-grow"></div>

        <ToolTip
          as={Button}
          ref={buildRef}

          mobile="(min-width: 700px)"
          allowHTML={true}
          content={
            <div class="build-text">
              Build
            </div>
          }

          aria-label="Build"

          class="umami--click--bundle-build-button"
          onClick={() => !state.monaco.loading && build()}
        >
          <IconLayer />
          <BuildText.render class="build-text lt-sm:hidden" />
        </ToolTip>

        <ToolTip
          as={Button}
          ref={shareRef}

          mobile="(min-width: 700px)"
          allowHTML={true}
          content={
            <div class="share-text">
              Share
            </div>
          }

          aria-label="Share"

          class="umami--click--bundle-share-button"
          onClick={() => !state.monaco.loading && share()}
        >
          <IconShare />
          <ShareText.render class="share-text lt-sm:hidden" />
        </ToolTip>

        <div class="bundle-results" title="Compressed Size">
          <Loading size="md" show={state.bundling} background={false} />
          <span class="bundle-size-text">{state.bundleSize}</span>
        </div>
      </div>
    </div>
  )
}

export default Activity;