import { Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { For, render } from "solid-js/web";
import { DetailsComponent, detailsEls } from "../modules/details";
import { debounce } from "../util/debounce";

let accLength = 0;
export type TypeLog = {
  title: string | any;
  message?: string | any;
  type?: "error" | "warning" | "info";
  badge?: string;
};

export const [MAX_LOGS, SET_MAX_LOGS] = createSignal(250);
export const [getLogs, setLogs] = createSignal<TypeLog[]>([]);
export const addLogs = (logs: TypeLog[] = []) => {
  logs = logs.filter(x => x);
  accLength += logs.length;

  let newLogs = [...getLogs(), ...logs];
  if (newLogs.length > MAX_LOGS()) { 
    newLogs = [{
      title: `Logs have been truncated, showing only ${MAX_LOGS()} of ${accLength - MAX_LOGS()} logs...\nCheck the devtools console for a fully detailed log.`,
    }, ...newLogs.slice(newLogs.length - MAX_LOGS())];
  }
  setLogs(newLogs);   
}

export const clearLogs = () => { 
  accLength = 0;
  setLogs([]);
}

export const [stickToBottom, setStickToBottom] = createSignal(true);
export const Console = ({ parentEl }: { parentEl: HTMLElement }) => {
  let len = createMemo(() => getLogs().length);
  if (parentEl) { 
    parentEl?.addEventListener("scroll", debounce((e) => { 
      setStickToBottom(parentEl.scrollTop + parentEl.clientHeight >= parentEl.scrollHeight - 50);
    }, 20), { passive: true });
  }

  createEffect(() => {
    if (stickToBottom()) {
      parentEl.scrollTo(0, parentEl.scrollHeight);
    }
    return getLogs();
  });
   
  return (
    <For each={getLogs()} fallback={
      <div class="py-3">
        <div class="content">
          <p class="px-4 hljs-literal">No logs...</p>
        </div>
      </div>
    }>
      {({ title, message = "", type, badge }, index) => {
        let styleType = {
          "error": "bg-red-400/20 border border-red-400/70 text-red-500/90 dark:text-red-300/90 rounded-md font-bold dark:font-medium",
          "warning": "bg-yellow-400/20 border border-yellow-400/70 text-yellow-500/90 dark:text-yellow-300/90 rounded-md font-bold dark:font-medium",
          "info": "border-b border-gray-300/60 dark:border-gray-600/60 text-green-700/90 dark:text-green-300/90 font-bold dark:font-medium"
        };
        
        let staticClassName = "whitespace-normal overflow-auto overscroll-x-contain "; 
        let [getClassName, setClassName] = createSignal(staticClassName);
        createEffect(() => { 
          setClassName(staticClassName + (styleType[type ?? "default"] ?? (Math.abs(index() - len() - 1) > 2 ? " border-b border-gray-300/60 dark:border-gray-600/60" : "")));
        });

        let detailsEl;
        onMount(() => { 
          if (detailsEl && !detailsEls.has(detailsEl)) 
            detailsEls.set(detailsEl, new DetailsComponent(detailsEl));
        });
        onCleanup(() => {
          if (detailsEl && detailsEls.has(detailsEl)) {
            detailsEls.get(detailsEl)?.stop();
            detailsEls.delete(detailsEl);
          }
        });
        return message.length > 0 ? (
          <details class={getClassName()} ref={detailsEl}>
            <summary class="console-summary" tabindex="0">
              {/* TODO: santize inner html */}
              <p class="px-4 py-3" innerHTML={title} />
              <Show when={badge}>
                <a
                  class="px-4"
                  href={decodeURIComponent(badge)}
                  rel="noopener"
                  target="_blank"
                >
                  <span>
                    {decodeURIComponent(badge.replace("https://", ""))}
                  </span>
                  {/* <img id="build-badge" src={badge} alt="Build badge" /> */}
                </a>
              </Show>
            </summary>
            <div class="content">
              <p class="px-4 pt-2 pb-3" innerHTML={message} />
            </div>
          </details>
        ) : (
          <div class={"py-3 " + getClassName()}>
            <div class="content inline-flex flex-wrap">
              <p class="px-4" innerHTML={title} />
              <Show when={badge}>
                <a
                  class="px-4"
                  href={decodeURIComponent(badge)}
                  rel="noopener"
                  target="_blank"
                >
                  <span>
                    {decodeURIComponent(badge.replace("https://", ""))}
                  </span>
                  {/* <img id="build-badge" src={badge} alt="Build badge" /> */}
                </a>
              </Show>
            </div>
          </div>
        );
      }}
    </For>
  );
};

export const renderComponent = (parentEl: HTMLElement) => {
  return render(() => <Console parentEl={parentEl} />, parentEl);
};
