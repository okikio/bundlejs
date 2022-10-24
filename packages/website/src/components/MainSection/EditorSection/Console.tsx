import type { ComponentProps } from "solid-js";
import { createEffect, createSignal, For } from "solid-js";

import { ConsoleButtons } from "./ConsoleButtons";
import { Log } from "./ConsoleLogs";
import { TASK_RUNNER } from "../../../scripts";

import { Details } from "../../Details";
import { expose } from "comlink";

export const [logsList, setLogsList] = createSignal([]);
export function addLogs(...args: unknown[]) {
  setLogsList([...logsList(), ...args]);
}

if ("visualViewport" in globalThis) {
  expose(addLogs, TASK_RUNNER);
}

export function Console(props?: ComponentProps<"div">) {
  return (
    <div class="console-container">
      <div class="console-head">
        <p>Console</p>
        <ConsoleButtons />
      </div>

      <div class="console-list">
        <For each={logsList()} fallback={
          <pre>
            <code>
              <p>No logs...</p>
            </code>
          </pre>
        }>
          {(value) => (
            <Log>{value.data}</Log>
          )}
        </For>

        {/* <Details class="inline-details log" summary="Console log">
          What do you mean?
        </Details> */}
      </div>
    </div>
  );
}

export default Console;