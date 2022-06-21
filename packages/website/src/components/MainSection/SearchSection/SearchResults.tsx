import { type ComponentProps, type Accessor, For, createResource, onMount, createEffect, on, onCleanup } from "solid-js";
import { SearchResult, ErrorResult, type SearchResultProps } from "./Result";

import { getPackages } from "@bundlejs/core";
import { rovingIndex } from '../../../hooks/roving-index';

export function SearchResults(props?: ComponentProps<'dialog'> & {
  query?: Accessor<string>;
}) {
  let searchContainerEl: HTMLDivElement = null;

  let ref: HTMLDivElement = null;
  let heightRef: HTMLDivElement = null;

  const [data] = createResource(props?.query, async (source) => {
    if (ref) {
      let anim = heightRef.animate({
        opacity: "0"
      }, {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'both'
      });
      await anim?.finished;
    }

    try {
        if (source == "") return [];
      let { packages } = await getPackages(source);

      // @ts-ignore
      return packages.map(({ package: pkg }) => pkg) ?? [];
    } catch (err) {
      return [{
        type: "error",
        name: "Error...",
        description: err?.message
      }]
    }
  });

  onMount(() => {
    let last = heightRef?.getBoundingClientRect();
    heightRef.animate({
      opacity: "1"
    }, {
      duration: 300,
      easing: 'ease-in-out',
      fill: 'both'
    });

    ref.animate({
      height: `${last?.height}px`
    }, {
      duration: 350,
      easing: 'ease',
      fill: 'both'
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
            target: 'button.btn',
          });
        }

        let last = heightRef?.getBoundingClientRect();
        heightRef.animate({
          opacity: "1"
        }, {
          duration: 300,
          easing: 'ease-in-out',
          fill: 'both'
        });

        ref.animate({
          height: `${last?.height}px`
        }, {
          duration: 350,
          easing: 'ease',
          fill: 'both'
        });
      }
    })
  );

  return (
    <div class="results-list relative" ref={ref}>
      <div class="divide-y divide-gray-200 dark:divide-quaternary" ref={heightRef}>
        <For
          each={data() as SearchResultProps[]}
          fallback={
            <ErrorResult />
          }>
          {(item) => {
            // @ts-ignore
            if (item?.type == "error")
              return <ErrorResult {...item} />
            return <SearchResult {...item} />;
          }}
        </For>
      </div>
    </div>
  );
}

export default SearchResults;