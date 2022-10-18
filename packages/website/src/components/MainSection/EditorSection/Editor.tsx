import type { ComponentProps } from "solid-js";
import type { TaskRunner as Tasks } from '../../../scripts/workers/task-runner';

import { onCleanup, createEffect, createResource } from "solid-js";
import { debounce } from "@bundlejs/core/src/util";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

import { state, setState, initial } from "../../../scripts/utils/store";
import { WorkerClient } from "../../../scripts/clients/worker-client";

import { getShareURLValues } from "../../../scripts/utils/get-initial";
import { createShareURL } from "../../../scripts/utils/share";

import { SharedWorkerPolyfill as SharedWorker } from "@okikio/sharedworker";
import { USE_SHAREDWORKER } from "../../../env";

const { configValue: configInitialValue } = "document" in globalThis && getShareURLValues();
const [monaco] = "document" in globalThis ? createResource(() => {
  return import("../../../scripts/modules/monaco");
}) : [];

const TASK_RUNNER = "document" in globalThis && (
  USE_SHAREDWORKER ?
    new SharedWorker(new URL('../../../scripts/workers/task-runner.ts', import.meta.url), { name: "task-runner", type: 'module' }) :
    new Worker(new URL('../../../scripts/workers/task-runner.ts', import.meta.url), { name: "task-runner", type: 'module' })
);

export function Editor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  const taskRunner = "document" in globalThis && new WorkerClient<Tasks>(TASK_RUNNER, "task-runner");

  createEffect(async () => {
    if (monaco?.loading) return;
    const { build, languages, inputModelResetValue, outputModelResetValue } = monaco();
    const [editor, input, output, config, getModelType] = build(ref);

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

        globalThis.history.replaceState(null, null, await createShareURL());
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