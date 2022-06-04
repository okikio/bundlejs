import type { ComponentProps } from "solid-js";
import ConsoleButtons from "./ConsoleButtons";

export function Console(props?: ComponentProps<'div'>) {
  return (
    <div class="console-container">
      <div class="console-head">
        <p>Console</p>
        <ConsoleButtons />
      </div>

      <pre>
        <code>
          <p>No logs...</p>
        </code>
      </pre>
    </div>
  )
}

export default Console;