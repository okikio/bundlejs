import { type ComponentProps, type Accessor, For, createResource, Show } from "solid-js";
import { SearchResult, ErrorResult, type SearchResultProps } from "./Result";
import Loading from "../Loading";

import { getPackages } from "@bundlejs/core";
export function SearchResults(props?: ComponentProps<'dialog'> & {
  query?: Accessor<string>;
}) {
  const [data] = createResource(props?.query, async (source) => {
    if (source == "") return [];

    try {
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

  return (
    <div class="results-list divide-y divide-gray-200 dark:divide-quaternary">
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
  );
}

export default SearchResults;