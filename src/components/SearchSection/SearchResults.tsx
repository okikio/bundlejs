import { type ComponentProps, type Accessor, createSignal, For, onMount, createResource, ResourceFetcher, createComputed, ErrorBoundary } from "solid-js";
import { SearchResult, ErrorResult, type SearchResultProps } from "./Result";

import { debounce, getRequest, parseInput } from "@bundlejs/core";
export function SearchResults(props?: ComponentProps<'dialog'> & {
  query?: Accessor<string>;
}) {
  let [getResults, setResults] = createSignal([]);
  const [data] = createResource(props?.query, async (source) => {
    if (source == "") return [];
    let { url, version } = parseInput(source);
    let response = await getRequest(url);
    let result = await response.json();
    console.log(result);

    // result?.results   ->   api.npms.io
    // result?.objects   ->   registry.npmjs.com
    return result?.results.map((obj) => {
      const { publisher, ...rest } = obj.package;
      return {
        ...rest,
        version,
        author: publisher?.username,
      };
    }) ?? [];
  });
  return (
    <dialog class="search-results" custom-search-results>
      <ErrorBoundary fallback={(err) =>
        <ErrorResult name="Error..." description={err?.message} />
      }>
        <For
          each={data() as SearchResultProps[]}
          fallback={
            <ErrorResult />
          }>
          {(item) => <SearchResult {...item} />}
        </For>
      </ErrorBoundary>
    </dialog>
  );
}

export default SearchResults;