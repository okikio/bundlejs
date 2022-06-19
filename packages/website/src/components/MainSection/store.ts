import { createStore } from "solid-js/store";

import type { Editor as MonacoEditor, languages } from "../../scripts/modules/monaco";
import type { OtherTSWorkerClient } from "../../scripts/clients/other-ts-client";

export const initial = {
  editorBtnsOpen: false,
  monaco: {
    editor: null as MonacoEditor.IStandaloneCodeEditor,
    workers: {
      other: null as OtherTSWorkerClient
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