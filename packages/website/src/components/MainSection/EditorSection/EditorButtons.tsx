
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

  return (
    <div class="editor-btn-container">
      <div class="editor-btn-shell" ref={shellRef} switch-mode={state.editorBtnsOpen}>
        <Button hide-btn
          class="umami--click--hide-editor-button"
          aria-label="Show/Hide Editor Buttons" title="Show/Hide Editor Buttons"
          onClick={() => setState("editorBtnsOpen", !state.editorBtnsOpen)}>
          <IconMore />
        </Button>

        <div class="editor-btns">
          <Button clear-btn
            class="umami--click--clear-editor-button"
            aria-label="Clear Code Editor" title="Clear Code Editor"
            onClick={() => !state.monaco.loading && state.monaco.editor?.setValue("")}>
            <IconDelete />
          </Button>

          <Button format-btn
            class="umami--click--format-editor-button"
            aria-label="Format Code" title="Format Code"
            onClick={() => {
              if (!state.monaco.loading) {
                (async () => {
                  const model = state.monaco.editor.getModel();
                  if (/^(js|javascript|ts|typescript)$/.test(model.getLanguageId())) {
                    try {
                      const worker = state.monaco.workers.other;
                      const thisWorker = await worker.getWorker();

                      // @ts-ignore
                      const formattedCode = await thisWorker.format(model.uri.authority, model.getValue());
                      state.monaco.editor.setValue(formattedCode);
                    } catch (e) {
                      console.warn(e);

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

          <Button reset-btn
            class="umami--click--reset-editor-button"
            aria-label="Reset Code Editor" title="Reset Code Editor"
            onClick={() => {
              if (!state.monaco.loading) {
                let modelType = getModelType();

                resetEditor(modelType);
              }
            }}>
            <IconReset />
          </Button>

          <Button copy-btn
            class="umami--click--copy-editor-button"
            aria-label="Copy Code" title="Copy Code"
            onClick={() => {
              if (!state.monaco.loading) {
                const range = state.monaco.editor.getModel().getFullModelRange();
                state.monaco.editor.setSelection(range);
                state.monaco.editor
                  .getAction("editor.action.clipboardCopyWithSyntaxHighlightingAction")
                  .run();
              }
            }}>
            <IconCopy />
          </Button>

          <Button download-btn
            class="umami--click--download-editor-button"
            aria-label="Download Code" title="Download Code"
            onClick={() => {
              if (!state.monaco.loading) {
                const model = state.monaco.editor.getModel();
                const blob = new Blob([model.getValue()], {
                  type: `${model.getLanguageId() == "typescript" ? "text/javascript" : "application/json"};charset=utf-8`
                });

                downloadBlob(blob, model?.uri?.authority ?? "download.ts");
              }
            }}>
            <IconDownload />
          </Button>

          <Button code-wrap-btn class="umami--click--codewrap-editor-button" aria-label="Toggle Code Wrap" title="Toggle Code Wrap"
            onClick={() => {
              if (!state.monaco.loading) {
                const wordWrap = state.monaco.editor.getRawOptions()["wordWrap"];
                state.monaco.editor.updateOptions({ wordWrap: wordWrap == "on" ? "off" : "on" });
              }
            }}>
            <IconCodeWrap />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditorButtons;