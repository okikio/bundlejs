import type { ComponentProps } from "solid-js";
import { createEffect, createSignal, For } from "solid-js";
import { ansi } from "@bundlejs/core/src/utils/ansi";

import { ConsoleButtons } from "./ConsoleButtons";
import { Log } from "./ConsoleLogs";
import { TASK_RUNNER } from "../../../scripts";

import { Details } from "../../Details";
import { expose } from "comlink";

export interface ILog { 
  type: string, 
  detail: string 
}

export const [logsList, setLogsList] = createSignal<ILog[]>([]);
export function addLogs<T extends ILog>(...args: T[]) {
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
        <For
          each={logsList()}
          fallback={
            <pre>
              <code>
                <p>No logs...</p>
              </code>
            </pre>
          }
        >
          {(value) => { 
            const [title, ...detail] = value.detail.split(/\n/);
            return detail.length > 0 ? (
              <Details class="inline-details log" summary={title}>
                <Log innerHTML={ansi(detail.join("\n"))} />
              </Details>
            ) : (
              <Log innerHTML={ansi(title)} />
            );
          }}
        </For>

        {/* <Details class="inline-details log" summary="Console log">
          What do you mean?
         */}
      </div>
    </div>
  );
}

export default Console;