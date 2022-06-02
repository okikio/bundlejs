import { ComponentProps } from "solid-js";
import Button from "../Button";
import Loading from "../Loading";

import IconLayer from "~icons/fluent/layer-24-regular";
import IconShare from "~icons/fluent/share-24-regular";

export function Activity(props?: ComponentProps<'div'>) {
  return (
    <div class="activity-section">
      <div class="activity-container">
        <Button class="umami--click--bundle-build-button">
          <IconLayer />
          Build
        </Button>
        <Button class="umami--click--bundle-share-button">
          <IconShare />
          Share
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