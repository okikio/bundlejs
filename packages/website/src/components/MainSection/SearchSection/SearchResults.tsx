import type { SearchResultProps } from "./Result.tsx";
import type { ResourceReturn } from "solid-js";

import { createResource, createEffect, onCleanup, onMount, on, For, Show, useTransition, } from "solid-js";
import { SearchResult, ErrorResult } from "./Result.tsx";
import { useSearchContext } from "./search-context.ts";

import { rovingIndex } from "../../../hooks/roving-index.ts";
import { getPackages } from "@bundle/utils/utils/npm-search.ts";
import { debounce, delay } from "@bundle/utils/utils/async.ts";

const animOpts: KeyframeAnimationOptions = {
  duration: 350,
  easing: "ease-in-out",
  fill: "both",
}

export function SearchResults() {
  let searchContainerEl: HTMLDivElement | undefined | null;

  let ref: HTMLDivElement | undefined | null;
  let heightRef: HTMLDivElement | undefined | null;
  let contentRef: HTMLDivElement | undefined | null;

  const [ctx] = useSearchContext();
  
  // Use useTransition for smooth updates
  const [isPending, startTransition] = useTransition();

  onMount(async () => {
    searchContainerEl = document.querySelector(".search-container") as
      | HTMLDivElement
      | null
      | undefined;

    const last = contentRef?.getBoundingClientRect?.();
    if (!last) return;
      
    const heightAnim = ref?.animate?.({ height: `${last?.height}px` }, animOpts);

    const overflow = heightRef?.style?.overflow;
    if (heightRef?.style) {
      heightRef.style.overflow = "hidden";
    }

    const anim = heightRef?.animate?.({ 
      opacity: "1", 
      height: `${last?.height}px`, 
    }, animOpts);
    await Promise.allSettled([
      anim?.finished, 
      heightAnim?.finished
    ]);

    if (heightRef?.style && overflow)
      { heightRef.style.overflow = overflow; }
  });

  createEffect(
    on(
      () => ctx.loading,
      async (loading) => {
        if (!("document" in globalThis)) return;

        // Start a transition when the loading state changes
        startTransition(async () => {
          if (isPending()) await delay(+(animOpts.duration ?? 300));
          const anim = heightRef?.animate?.({ 
            opacity: loading ? "0" : "1", 
          }, animOpts);
          await anim?.finished;
        });
      }
    )
  );

  createEffect(
    on(
      () => ctx.result,
      async (value) => {
        if (!("document" in globalThis)) return;
        if (searchContainerEl) {
          rovingIndex({
            element: searchContainerEl,
            target: "button.btn",
          });
        }

        const last = contentRef?.getBoundingClientRect?.();
        if (!last) return;

        startTransition(async () => {
          if (isPending()) await delay(+(animOpts.duration ?? 300));

          const heightAnim = ref?.animate?.({ height: `${last?.height}px` }, animOpts);

          const overflow = heightRef?.style?.overflow;
          if (heightRef?.style) heightRef.style.overflow = "hidden";

          const anim = heightRef?.animate?.(
            { height: `${last?.height}px` },
            animOpts
          );
          await Promise.allSettled([
            anim?.finished, 
            heightAnim?.finished
          ]);

          if (heightRef?.style && overflow) 
            { heightRef.style.overflow = overflow; }
        })
      }
    )
  );

  createEffect(
    on(
      () => ctx.error,
      async (value) => {
        if (!("document" in globalThis)) return;

        // Only animate when necessary and ensure not to trigger during pending updates
        if (!ctx.error) return;

        const last = contentRef?.getBoundingClientRect?.();
        if (!last) return;

        startTransition(async () => {
          if (isPending()) await delay(+(animOpts.duration ?? 300));
          const heightAnim = ref?.animate?.({ height: `${last?.height}px` }, animOpts);

          const overflow = heightRef?.style?.overflow;
          if (heightRef?.style) heightRef.style.overflow = "hidden";

          const anim = heightRef?.animate?.(
            { height: `${last?.height}px` },
            animOpts
          );
          await Promise.allSettled([anim?.finished, heightAnim?.finished]);

          if (heightRef?.style && overflow) {
            heightRef.style.overflow = overflow;
          }
        });
      }
    )
  );

  onCleanup(() => {
    searchContainerEl = null;

    ref = null;
    heightRef = null;
    contentRef = null;
  });

  return (
    <div class="results-list relative" ref={(el) => (ref = el)}>
      <div ref={(el) => (heightRef = el)}>
        <div
          class="divide-y divide-gray-200 dark:divide-quaternary"
          ref={(el) => (contentRef = el)}
        >
          <Show
            when={!ctx.error}
            fallback={
              <ErrorResult
                type="error"
                name="Error..."
                description={ctx.error?.message ?? "Missing error?..."}
              />
            }
          >
            <For
              each={ctx.result as SearchResultProps[]}
              fallback={<ErrorResult />}
            >
              {(item) => {
                return <SearchResult {...item} />;
              }}
            </For>
          </Show>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;