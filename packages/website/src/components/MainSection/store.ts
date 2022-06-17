import { createStore } from "solid-js/store";

import type { Editor as MonacoEditor, languages } from "../../scripts/modules/monaco";

export const [state, setState] = createStore({
  editorBtnsOpen: false,
  monaco: {
    editor: null as MonacoEditor.IStandaloneCodeEditor,
    models: [] as MonacoEditor.ITextModel[],
    languages: null as typeof languages,
    loading: true
  }
});