import { ComponentProps, onMount } from "solid-js";
import Button from "../../Button";

import IconSettings from "~icons/fluent/settings-24-regular";
import { state } from "../store";

import { ToolTip, SingletonToolTip } from "../../../hooks/tooltip";

export function Tabs(props?: ComponentProps<'div'>) {
  let inputRef: HTMLButtonElement = null;
  let outputRef: HTMLButtonElement = null;
  let configRef: HTMLButtonElement = null;

  let activeEl: HTMLButtonElement;

  onMount(() => {
    activeEl = inputRef;
  });

  function isTarget(el: HTMLElement, target: EventTarget) {
    return target &&
      (
        el == (target as HTMLElement) ||
        el?.contains?.(target as HTMLElement)
      );
  }

  function getRefByModelId(model: string) {
    let list = {
      "input": inputRef,
      "output": outputRef,
      "config": configRef
    };

    return list[model];
  }

  function onClick(e: MouseEvent) {
    let modelId: string = null;

    if (!state.monaco.loading) {
      if (isTarget(inputRef, e?.target)) { modelId = "input"; }
      else if (isTarget(outputRef, e?.target)) { modelId = "output"; }
      else if (isTarget(configRef, e?.target)) { modelId = "config"; }
      else { return; }

      let model = state.monaco.models?.[modelId];
      state.monaco?.editor?.setModel(model);

      let tabRef = getRefByModelId(modelId);
      activeEl?.classList?.remove("active");
      tabRef?.classList?.add("active");

      activeEl = tabRef;
    }
  }

  return (
    <div class="tab-bar">
      <SingletonToolTip target="[custom-button]" >
        <div class="tab-container" onClick={onClick}>
        <Button data-tippy-content={"Input Editor Tab"} data-tippy-placement="top" data-model="input" class="active" ref={inputRef}>Input</Button>
        <Button data-tippy-content={"Output Editor Tab"} data-tippy-placement="top" data-model="output" class="umami--click--output-tab" ref={outputRef}>Output</Button>
        <Button data-tippy-content={"Config Editor Tab"} data-tippy-placement="top" data-model="config" class="umami--click--config-tab" ref={configRef} aria-label={"Config Editor Tab"}>
          <IconSettings />
        </Button>
        </div>
      </SingletonToolTip>
    </div>
  )
}

export default Tabs;