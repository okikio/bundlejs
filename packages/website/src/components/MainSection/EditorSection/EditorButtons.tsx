import type { Placement } from "tippy.js";

import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

import toast from '../../SolidToast/index';

import Button from "../../Button";

import IconMore from "~icons/fluent/more-24-regular";
import IconDelete from "~icons/fluent/delete-24-regular";
import IconFormat from "~icons/fluent/paint-brush-24-regular";
import IconReset from "~icons/fluent/arrow-counterclockwise-24-regular";
import IconCopy from "~icons/fluent/copy-24-regular";
import IconDownload from "~icons/fluent/arrow-download-24-regular";
import IconCodeWrap from "~icons/fluent/text-wrap-24-regular";

import { state, setState } from "../store";

import { ToolTip, SingletonToolTip } from "../../../hooks/tooltip";

// export const SandboxWorkerConfig = [SANDBOX_WORKER_URL, { name: 'sandbox' } as WorkerOptions] as const;
// export const SANDBOX_WORKER = USE_SHAREDWORKER ? new WebWorker(...SandboxWorkerConfig) : new Worker(...SandboxWorkerConfig) as WebWorker;

// try {
//   SANDBOX_WORKER?.start?.();
//   channel.port1.start();
//   channel.port2.start();
//   SANDBOX_WORKER.postMessage({ port: channel.port1 }, [channel.port1]);
//   BundleWorker.postMessage({ port: channel.port2 }, [channel.port2]);
// } catch (err) {
//   console.log(err);
// }

export function EditorButtons() {
  let shellRef: HTMLDivElement = null;

  function getModelType() {
    if (!state.monaco.loading) {
      if (state.monaco.editor.getModel() == state.monaco.models.input) return "input";
      else if (state.monaco.editor.getModel() == state.monaco.models.output) return "output";
      else return "config";
    }

    return null;
  }

  function resetEditor(editorModel = "input") {
    if (!state.monaco.loading) {
      let resetValue: string;
      switch (editorModel) {
        case "input":
          resetValue = state.monaco.initialValue.input;
          break;
        case "output":
          resetValue = state.monaco.initialValue.output;
          break;
        default:
          resetValue = state.monaco.initialValue.config;
          break;
      }

      state.monaco.editor.setValue(resetValue);
    }
  }

  function downloadBlob(blob: Blob, name = 'file.txt') {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    // Remove link from body
    document.body.removeChild(link);
  }

  let media = ("document" in globalThis) && globalThis?.matchMedia("(max-width: 410px)");

  let [placement, setPlacement] = createSignal<Placement>(media?.matches ? "bottom" : "top");
  function mediaQueryRun(e?: MediaQueryListEvent) {
    setPlacement(e?.matches ? "bottom" : "top");
  }

  onMount(() => {
    mediaQueryRun(media as unknown as MediaQueryListEvent);
    media?.addEventListener?.("change", mediaQueryRun);
  });

  onCleanup(() => {
    media?.removeEventListener?.("change", mediaQueryRun);
  });

  return (
    <div class="editor-btn-container">
      <SingletonToolTip target="[custom-button]">
        <div
          ref={shellRef}
          class="editor-btn-shell"
          switch-mode={state.editorBtnsOpen}
        >
          <div class="hide-btn-container">
            <Button
              aria-label={"Show/Hide Editor Buttons"}
              data-tippy-content={"Show/Hide Editor Buttons"}
              data-tippy-placement={placement()}
              hide-btn
              class="umami--click--hide-editor-button"
              onClick={() => setState("editorBtnsOpen", !state.editorBtnsOpen)}>
              <IconMore />
            </Button>
          </div>

          <div class="editor-btns">
            <Button
              aria-label={"Clear Code Editor"}
              data-tippy-content={"Clear Code Editor"}
              clear-btn
              tabIndex={state.editorBtnsOpen ? 0 : -1}
              class="umami--click--clear-editor-button"
              onClick={() => {
                if (!state.monaco.loading) {
                  state.monaco.editor?.setValue("");
                  toast("Cleared Editor");
                }
              }}>
              <IconDelete />
            </Button>

            <Button
              aria-label={"Format Code"}
              data-tippy-content={"Format Code"}
              format-btn
              tabIndex={state.editorBtnsOpen ? 0 : -1}
              class="umami--click--format-editor-button"
              onClick={() => {
                if (!state.monaco.loading) {
                  (async () => {
                    const model = state.monaco.editor.getModel();
                    if (/^(js|javascript|ts|typescript)$/.test(model.getLanguageId())) {
                      try {
                        const worker = state.monaco.workers.taskRunner;
                        const thisWorker = await worker.getWorker();

                        const formattedCode = await thisWorker.format(model.uri.authority, model.getValue());
                        state.monaco.editor.setValue(formattedCode);
                        toast(`Formatted ${getModelType()} code editor`);
                      } catch (e) {
                        console.warn(e);
                        toast.error(`Error formatting ${getModelType()} code, falling back to built-in formatter.`);

                        await state.monaco.editor.getAction("editor.action.formatDocument").run();
                      }
                    } else {
                      await state.monaco.editor.getAction("editor.action.formatDocument").run();
                    }
                  })();
                }
              }}>
              <IconFormat />
            </Button>

            <Button
              aria-label={"Reset Code Editor"}
              data-tippy-content={"Reset Code Editor"}
              reset-btn
              tabIndex={state.editorBtnsOpen ? 0 : -1}
              class="umami--click--reset-editor-button"
              onClick={() => {
                if (!state.monaco.loading) {
                  let modelType = getModelType();

                  resetEditor(modelType);
                  toast(`Reset ${modelType}`);
                }
              }}>
              <IconReset />
            </Button>

            <Button
              aria-label={"Copy Code"}
              data-tippy-content={"Copy Code"}
              copy-btn
              tabIndex={state.editorBtnsOpen ? 0 : -1}
              class="umami--click--copy-editor-button"
              onClick={() => {
                if (!state.monaco.loading) {
                  const range = state.monaco.editor.getModel().getFullModelRange();
                  state.monaco.editor.setSelection(range);
                  state.monaco.editor
                    .getAction("editor.action.clipboardCopyWithSyntaxHighlightingAction")
                    .run();
                  toast(`Copy ${getModelType()}`);
                }
              }}>
              <IconCopy />
            </Button>

            <Button
              aria-label={"Download Code"}
              data-tippy-content={"Download Code"}
              download-btn
              tabIndex={state.editorBtnsOpen ? 0 : -1}
              class="umami--click--download-editor-button"
              onClick={() => {
                if (!state.monaco.loading) {
                  const model = state.monaco.editor.getModel();
                  const blob = new Blob([model.getValue()], {
                    type: `${model.getLanguageId() == "typescript" ? "text/javascript" : "application/json"};charset=utf-8`
                  });

                  downloadBlob(blob, model?.uri?.authority ?? "download.ts");
                  toast(`Download ${getModelType()}`);
                }
              }}>
              <IconDownload />
            </Button>

            <Button
              aria-label={"Toggle Code Wrap"}
              data-tippy-content={"Toggle Code Wrap"}
              code-wrap-btn
              tabIndex={state.editorBtnsOpen ? 0 : -1}
              class="umami--click--codewrap-editor-button"
              onClick={() => {
                if (!state.monaco.loading) {
                  const wordWrap = state.monaco.editor.getRawOptions()["wordWrap"];
                  state.monaco.editor.updateOptions({ wordWrap: wordWrap == "on" ? "off" : "on" });
                  toast(`${wordWrap == "on" ? "Unwrap" : "Wrap"} ${getModelType()}`);
                }
              }}>
              <IconCodeWrap />
            </Button>
          </div>
        </div>
      </SingletonToolTip>
    </div>
  );
}

export default EditorButtons;