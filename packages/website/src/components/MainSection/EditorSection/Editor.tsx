import type { ComponentProps } from "solid-js";
import type { TaskRunner as Tasks } from '../../../scripts/workers/task-runner';

import { onMount, createSignal, Show, onCleanup, createEffect, createResource } from "solid-js";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";

import { state, setState, initial } from "../store";
import { WorkerClient } from "../../../scripts/clients/worker-client";

import TaskRunner from '../../../scripts/workers/task-runner.ts?worker';

export const taskRunner = "document" in globalThis && new WorkerClient<Tasks>(new TaskRunner(), "task-runner");

export function Editor(props?: ComponentProps<'div'>) {
  let ref: HTMLDivElement = null;
  let loadingRef: HTMLDivElement = null;

  const [monaco] = createResource(() => {
    return import("../../../scripts/modules/monaco");
  });

  createEffect(async () => {
    if (monaco.loading) return;
    const { build, languages, inputModelResetValue, outputModelResetValue, configModelResetValue } = monaco();
    const [editor, input, output, config] = build(ref);

    setState("monaco", {
      loading: false,
      editor,
      languages,
      workers: { taskRunner },
      initialValue: {
        input: inputModelResetValue,
        output: outputModelResetValue,
        config: configModelResetValue,
      },
      models: {
        input,
        output,
        config
      }
    });
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