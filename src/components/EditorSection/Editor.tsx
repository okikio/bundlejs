import type { ComponentProps } from "solid-js";
import Loading from "../Loading";
import EditorButtons from "./EditorButtons";

export function Editor(props?: ComponentProps<'div'>) {
  return (
    <div class="editor-container">
      <Loading />
      <div class="editor"></div>
      <EditorButtons />
    </div>
  )
}

export default Editor;