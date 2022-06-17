
import { createEffect, onMount } from "solid-js";

import Button from "../../Button";

import IconMore from "~icons/fluent/more-24-regular";
import IconDelete from "~icons/fluent/delete-24-regular";
import IconFormat from "~icons/fluent/paint-brush-24-regular";
import IconReset from "~icons/fluent/arrow-counterclockwise-24-regular";
import IconCopy from "~icons/fluent/copy-24-regular";
import IconDownload from "~icons/fluent/arrow-download-24-regular";
import IconCodeWrap from "~icons/fluent/text-wrap-24-regular";

import { state, setState } from "../store";

export function EditorButtons() {
  let shellRef: HTMLDivElement = null;
  let btnsListRef: HTMLDivElement = null;

  let expandBtnRef: HTMLButtonElement = null;

  const opts: KeyframeAnimationOptions = {
    duration: 500,
    easing: "ease",
    fill: "both"
  };

  function onEffect() {
    if (state.editorBtnsOpen) {
      shellRef.animate({
        transform: "translateX(0%)"
      }, opts);

      btnsListRef.animate({
        opacity: 1
      }, opts);

      expandBtnRef.animate({
        transform: "translateX(0%)"
      }, opts);
    } else {
      shellRef.animate({
        transform: "translateX(100%)",
      }, opts);

      btnsListRef.animate({
        opacity: 0
      }, opts);

      expandBtnRef.animate({
        transform: "translateX(-100%)"
      }, opts);
    }
  }

  createEffect(onEffect);
  onMount(() => {
    onEffect();
  });

  return (
    <div class="editor-btn-container">
      <div class="editor-btn-shell" ref={shellRef}>
        <Button hide-btn class="umami--click--hide-editor-button" aria-label="Show/Hide Editor Buttons" title="Show/Hide Editor Buttons" ref={expandBtnRef}
          onClick={() => setState("editorBtnsOpen", !state.editorBtnsOpen)}>
          <IconMore />
        </Button>

        <div class="editor-btns" ref={btnsListRef}>
          <Button clear-btn class="umami--click--clear-editor-button" aria-label="Clear Code Editor" title="Clear Code Editor"
            onClick={() => !state.monaco.loading && state.monaco.editor?.setValue("")}>
            <IconDelete />
          </Button>

          <Button format-btn class="umami--click--format-editor-button" aria-label="Format Code" title="Format Code"
            onClick={() => {
              if (!state.monaco.loading) {
                state.monaco.editor.getAction("editor.action.formatDocument").run();
                // const model = state.monaco.editor.getModel();
                // if (/^(js|javascript|ts|typescript)/.test(model.getLanguageId())) {
                //   try {
                //     (async () => {
                //       const worker = await state.monaco.languages.typescript.getTypeScriptWorker();
                //       const thisWorker = await worker(model.uri);

                //       // @ts-ignore
                //       const formattedCode = await thisWorker.format(model.uri.toString());
                //       state.monaco.editor.setValue(formattedCode);
                //     })();
                //   } catch (e) {
                //     console.warn(e)
                //   }
                // }
              }
            }}>
            <IconFormat />
          </Button>

          <Button reset-btn class="umami--click--reset-editor-button" aria-label="Reset Code Editor" title="Reset Code Editor">
            <IconReset />
          </Button>

          <Button copy-btn class="umami--click--copy-editor-button" aria-label="Copy Code" title="Copy Code">
            <IconCopy />
          </Button>

          <Button download-btn class="umami--click--download-editor-button" aria-label="Download Code" title="Download Code">
            <IconDownload />
          </Button>

          <Button code-wrap-btn class="umami--click--codewrap-editor-button" aria-label="Toggle Code Wrap" title="Toggle Code Wrap">
            <IconCodeWrap />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditorButtons;