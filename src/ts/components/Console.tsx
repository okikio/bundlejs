import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { For, render } from "solid-js/web";
import { Accordion, detailsEls } from "../modules/accordion";
import { debounce } from "../util/debounce";

export const [getLogs, setLogs] = createSignal<{ title: string | any, message: string | any, type?: "error" | "warning" }[]>([]);
export const Console = ({ parentEl }: { parentEl: HTMLElement }) => {
  let len = createMemo(() => getLogs().length);
  let [stickToBottom, setStickToBottom] = createSignal(true);
  if (parentEl) { 
    parentEl?.addEventListener("scroll", debounce((e) => { 
      setStickToBottom(parentEl.scrollTop + parentEl.clientHeight >= parentEl.scrollHeight - 50);
    }, 50), { passive: true });
  }

  createEffect(() => {
    if (stickToBottom()) {
      parentEl.scrollTo(0, parentEl.scrollHeight);
    }
    return getLogs();
  });
   
  return (
    <For each={getLogs()} fallback={
      <div class={"py-3 "}>
        <div class="content">
          <p class="px-4 hljs-literal">No logs...</p>
        </div>
      </div>
    }>
      {({ title, message, type }, index) => {
        let styleType = {
          "error": "bg-red-400/20 border border-red-400/70 text-red-500/90 dark:text-red-300/90 rounded-md",
          "warn": "bg-yellow-400/20 border border-yellow-400/70 text-yellow-500/90 dark:text-yellow-300/90 rounded-md"
        };
        
        let staticClassName = "whitespace-normal overflow-auto overscroll-x-contain "; 
        let [getClassName, setClassName] = createSignal(staticClassName);
        createEffect(() => { 
          setClassName(staticClassName + (styleType[type ?? "default"] ?? (Math.abs(index() - len() - 1) > 2 ? " border-b border-gray-300/60 dark:border-gray-600/60" : "")));
        });

        let detailsEl;
        onMount(() => { 
          if (detailsEl && !detailsEls.has(detailsEl)) 
            detailsEls.set(detailsEl, new Accordion(detailsEl));
        });
        onCleanup(() => {
          if (detailsEl && detailsEls.has(detailsEl)) {
            detailsEls.get(detailsEl)?.stop();
            detailsEls.delete(detailsEl);
          }
        });
        return (
          message.length > 0 ?
            <details class={getClassName()} ref={detailsEl}>
              <summary class="console-summary" tabindex="0">
                <p class="px-4 py-3" innerHTML={title} />
              </summary>
              <div class="content">
                <p class="px-4 pt-2 pb-3" innerHTML={message} />
              </div>
            </details> :
            <div class={"py-3 " + getClassName()}>
              <div class="content">
                <p class="px-4" innerHTML={title} />
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
