import { ComponentProps, lazy, Suspense } from "solid-js";

import Loading from "../../Loading";
import EditorButtons from "./EditorButtons";


export function Editor(props?: ComponentProps<'div'>) {
  const CodeEditor = lazy(() => import("./CodeEditor"));
  return (
    <div class="editor-container">
      {/* <Loading /> */}

      <CodeEditor />
      <EditorButtons />
    </div>
  )
}

export default Editor;