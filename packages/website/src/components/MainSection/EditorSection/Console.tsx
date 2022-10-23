import type { ComponentProps } from "solid-js";
import { createEffect, createSignal } from "solid-js";

import { ConsoleButtons } from "./ConsoleButtons";
import { Log } from "./ConsoleLogs";
import { TASK_RUNNER } from "../../../scripts";

import { Details } from "../../Details";
import { expose } from "comlink";

export const [logsList, setLogsList] = createSignal([]);
export function addLogs(...args: unknown[]) {
  setLogsList([...logsList(), ...args]);
}

if ("document" in globalThis) {
  expose(addLogs, TASK_RUNNER);
}

export function Console(props?: ComponentProps<"div">) {
  createEffect(() => {
    if ("document" in globalThis) {
      console.log(logsList());
    }
  });

  return (
    <div class="console-container">
      <div class="console-head">
        <p>Console</p>
        <ConsoleButtons />
      </div>

      {/* <pre>
        <code>
          <p>No logs...</p>
        </code>
      </pre> */}

      <div class="console-list">
        <Log>Class</Log>

        {/* <Details class="inline-details log" summary="Console log">
          What do you mean?
        </Details> */}
      </div>
    </div>
  );
}

export default Console;