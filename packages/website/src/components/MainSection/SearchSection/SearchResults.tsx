import type { SearchResultProps } from "./Result";

import { For, createResource, onMount, createEffect, on, onCleanup } from "solid-js";

import { getQuery } from "./SearchInput";
import { SearchResult, ErrorResult } from "./Result";

import { rovingIndex } from "../../../hooks/roving-index";
import { getPackages } from "@bundle/utils/src/mod.ts";

export function SearchResults() {
  let searchContainerEl: HTMLDivElement = null;

  let ref: HTMLDivElement = null;
  let heightRef: HTMLDivElement = null;
  let contentRef: HTMLDivElement = null;

  const [data] = createResource(getQuery, async (source) => {
    if (ref) {
      const anim = heightRef.animate({
        opacity: "0"
      }, {
        duration: 300,
        easing: "ease-in-out",
        fill: "both"
      });
      await anim?.finished;
    }

    try {
      if (source == "") return [];
      const { packages } = await getPackages(source);

      return packages.map(({ package: pkg }) => pkg) ?? [];
    } catch (err) {
      return [{
        type: "error",
        name: "Error...",
        description: err?.message
      }];
    }
  });

  onMount(() => {
    const last = contentRef?.getBoundingClientRect();
    ref.animate({
      height: `${last?.height}px`
    }, {
      duration: 350,
      easing: "ease",
      fill: "both"
    });

    const overflow = heightRef.style.overflow;
    heightRef.style.overflow = "hidden";
    heightRef.animate({
      opacity: "1",
      height: `${last?.height}px`
    }, {
      duration: 300,
      easing: "ease-in-out",
      fill: "both"
    }).finished.then(() => {
      heightRef.style.overflow = overflow;
    });

    searchContainerEl = document.querySelector(".search-container");
  });

  onCleanup(() => {
    searchContainerEl = null;
  });

  createEffect(on(
    data,
    (value) => {
      if (!value?.loading) {
        if (searchContainerEl) {
          rovingIndex({
            element: searchContainerEl,
            target: "button.btn",
          });
        }

        const last = contentRef?.getBoundingClientRect();
        ref.animate({
          height: `${last?.height}px`
        }, {
          duration: 350,
          easing: "ease",
          fill: "both"
        });

        const overflow = heightRef.style.overflow;
        heightRef.style.overflow = "hidden";
        heightRef.animate({
          opacity: "1",
          height: `${last?.height}px`
        }, {
          duration: 300,
          easing: "ease-in-out",
          fill: "both"
        }).finished.then(() => {
          heightRef.style.overflow = overflow;
        });
      }
    })
  );

  return (
    <div class="results-list relative" ref={ref}>
      <div ref={heightRef}>
        <div class="divide-y divide-gray-200 dark:divide-quaternary" ref={contentRef}>
          <For
            each={data() as SearchResultProps[]}
            fallback={
              <ErrorResult />
            }>
            {(item) => {
              if (item?.type == "error")
                return <ErrorResult {...item} />;
              return <SearchResult {...item} />;
            }}
          </For>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;