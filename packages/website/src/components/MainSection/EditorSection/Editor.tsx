import type { ComponentProps } from "solid-js";
import type { TaskRunner as Tasks } from '../../../scripts/workers/task-runner';

import { onCleanup, createEffect, createResource } from "solid-js";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

import { state, setState, initial } from "../../../scripts/utils/store";
import { WorkerClient } from "../../../scripts/clients/worker-client";

import TaskRunner from '../../../scripts/workers/task-runner.ts?worker';
import { generateConfigValue, getShareURLValues } from "../../../scripts/utils/get-initial";
import { debounce, deepAssign } from "@bundlejs/core/src/util";
import { createShareURL } from "../../../scripts/utils/share";
import { EasyDefaultConfig } from "../../../scripts/configs/options";

export const taskRunner = "document" in globalThis && new WorkerClient<Tasks>(new TaskRunner(), "task-runner");

export function Editor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  const { config: configQuery } = "document" in globalThis && getShareURLValues();

  const [monaco] = createResource(() => {
    return import("../../../scripts/modules/monaco");
  });

  createEffect(async () => {
    if (monaco.loading) return;
    const { build, languages, inputModelResetValue, outputModelResetValue, configModelResetValue } = monaco();
    const [editor, input, output, config, getModelType] = build(ref);

    const configInitialValue = configQuery ? generateConfigValue(
      deepAssign({}, EasyDefaultConfig, JSON.parse(configQuery))
    ) : configModelResetValue;
    setState("monaco", {
      loading: false,
      editor,
      languages,
      workers: { taskRunner },
      initialValue: {
        input: inputModelResetValue,
        output: outputModelResetValue,
        config: configInitialValue
      },
      models: {
        input,
        output,
        config
      }
    });

    config.setValue(configInitialValue);

    // Update the URL share query every time user makes a change 
    editor.onDidChangeModelContent(
      debounce(async () => {
        const modelType = getModelType();
        if (modelType == "output") return;

        let config = "{}";
        try {
          // Set the max log limit for the virtual console, using the esbuild logLimit config option 
          if (modelType == "config") {
            // let config = JSON.parse(editor.getValue()) as BundleConfigOptions;
            // if (config?.esbuild?.logLimit) {
            //   SET_MAX_LOGS(config?.esbuild?.logLimit);
            // }
          }
        } catch (e) { }

        console.log({
          shareUrl: await createShareURL()
        })

        globalThis.navigation.navigate(
          await createShareURL(),
          { history: "replace" }
        );
      }, 1000)
    );
  });

  onCleanup(() => {
    state.monaco.editor?.dispose?.();
    state.monaco.workers?.taskRunner?.dispose?.();
    setState(initial);
  });

  return (
    <div class="editor-container">
      <div ref={ref} id="editor" custom-code-editor></div>
      <EditorButtons />

      <Loading ref={loadingRef} show={state.monaco.loading} />
    </div>
  )
}

export default Editor;