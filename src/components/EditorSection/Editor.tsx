import { ComponentProps } from "solid-js";
import Loading from "../Loading";

export function Editor(props?: ComponentProps<'div'>) {
  return (
    <div class="editor-container">
      <Loading />
      <div class="editor"></div>
    </div>
  )
}

export default Editor;