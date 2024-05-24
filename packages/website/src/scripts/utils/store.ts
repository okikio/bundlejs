import type { TaskRunner as Tasks } from "../workers/task-runner";
import type { Editor as MonacoEditor, languages } from "../modules/monaco";
import type { wrap } from "comlink";

import { createStore } from "solid-js/store";

export interface UnifiedWebBundleConfig {
  editorBtnsOpen: boolean,
  workers: {
    tasks: ReturnType<typeof wrap<typeof Tasks>> | null,
  },

  monaco: {
    editor: MonacoEditor.IStandaloneCodeEditor | null,
    initialValue: {
      input: string | null,
      output: string | null,
      config: string | null,
    },
    models: {
      input: MonacoEditor.ITextModel | null,
      output: MonacoEditor.ITextModel | null,
      config: MonacoEditor.ITextModel | null,
    },
    languages: typeof languages | null,
    loading: boolean
  },

  bundleSize: string | "...",
  bundling: boolean,
}

export const initial: UnifiedWebBundleConfig = {
  editorBtnsOpen: false,
  workers: {
    tasks: null,
  },
  
  monaco: {
    editor: null,
    initialValue: {
      input: null,
      output: null,
      config: null,
    },
    models: {
      input: null,
      output: null,
      config: null,
    },
    languages: null,
    loading: true
  },

  bundleSize: "..." as string,
  bundling: false,
};

export const [state, setState] = createStore(initial);