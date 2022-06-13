import { ComponentProps } from "solid-js";
import Button from "../../Button";

import IconSettings from "~icons/fluent/settings-24-regular";
export function Tabs(props?: ComponentProps<'div'>) { 
  return (
    <div class="tab-bar">
      <div class="tab-container">
        <Button class="active" aria-label="Input Editor Tab">Input</Button>
        <Button class="umami--click--output-tab" aria-label="Output Editor Tab">Output</Button>
        <Button class="umami--click--config-tab" aria-label="Setting Configuration Tab" title="Config Tab">
          <IconSettings />
        </Button>
      </div>
    </div>
  )
} 

export default Tabs;