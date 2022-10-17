import type { ComponentProps } from "solid-js";

import { onMount } from "solid-js";

import Button from "../../Button";
import Loading from "../../Loading";

import IconLayer from "~icons/fluent/layer-24-regular";
import IconShare from "~icons/fluent/share-24-regular";

import { state } from "../../../scripts/utils/store";
import { share } from "../../../scripts/utils/share";

import { createTextSwitch } from "../../../hooks/text-switch";

import { ToolTip } from "../../../hooks/tooltip";
import { build } from "../../../scripts/utils/build";

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

  return (
    <div class="activity-section">
      <div class="activity-container">
        <div class="flex-grow"></div>

        <ToolTip
          mobile="(min-width: 700px)"
          content={"Build"}
        >
          <Button 
            ref={buildRef} 
            class="umami--click--bundle-build-button"
            onClick={async () => {
              if (!state.monaco.loading) {
                try {
                  BuildText.switch("next");

                  await build();
                } catch (e) { }

                BuildText.switch("initial", 50);
              }
            }}
            aria-label="Build"
          >
            <IconLayer />
            <BuildText.render class="build-text lt-sm:hidden" />
          </Button>
        </ToolTip>
        
        <ToolTip
          mobile="(min-width: 700px)"
          content={"Share"}
        >
          <Button 
            custom-button
            ref={shareRef}
            class="umami--click--bundle-share-button"
            onClick={async () => {
              if (!state.monaco.loading) {
                try {
                  ShareText.setNext(navigator.share ? "Sharing!" : "Copying!");
                  ShareText.switch("next");

                  await share();
                } catch (e) { }

                await ShareText.switch("initial", 600);
              }
            }}
            aria-label="Share"
          >
            <IconShare />
            <ShareText.render class="share-text lt-sm:hidden" />
          </Button>
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