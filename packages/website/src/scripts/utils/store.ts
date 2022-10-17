import { createStore } from "solid-js/store";

import type { TaskRunner as Tasks } from '../workers/task-runner';
import type { Editor as MonacoEditor, languages } from "../modules/monaco";
import type { WorkerClient } from "../clients/worker-client";

export const initial = {
  editorBtnsOpen: false,
  monaco: {
    editor: null as MonacoEditor.IStandaloneCodeEditor,
    workers: {
      taskRunner: null as WorkerClient<Tasks>
    },
    initialValue: {
      input: null as string,
      output: null as string,
      config: null as string,
    },
    models: {
      input: null as MonacoEditor.ITextModel,
      output: null as MonacoEditor.ITextModel,
      config: null as MonacoEditor.ITextModel,
    },
    languages: null as typeof languages,
    loading: true
  },

  bundleSize: "..." as string,
  bundling: false,
};

export const [state, setState] = createStore(initial);