import { type ComponentProps, type Accessor, createSignal, For, createResource } from "solid-js";
import { SearchResult, ErrorResult, type SearchResultProps } from "./Result";

import { getRequest, parseInput } from "@bundlejs/core";
export function SearchResults(props?: ComponentProps<'dialog'> & {
  query?: Accessor<string>;
}) {
  const [data] = createResource(props?.query, async (source) => {
    if (source == "") return [];
    
    try { 
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
    } catch (err) { 
      return [{
        type: "error",
        name: "Error...",
        description: err?.message 
      }]
    }
  });
  
  return (
    <dialog class="search-results" custom-search-results>
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
    </dialog>
  );
}

export default SearchResults;