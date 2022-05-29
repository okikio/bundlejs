// import { createSignal, useTransition } from "solid-js";
// import { For } from "solid-js/web";

import { type ComponentProps, createSignal, For } from "solid-js";
import { SearchResult, ErrorResult } from "./Result";

// import { EventEmitter } from "@okikio/emitter";
// import { timeline, animate } from "@okikio/animate";

// export const ResultEvents = new EventEmitter();
// export const [getState, setState] = createSignal([]);
// export const [isInitial, setIsInitial] = createSignal(true);

// export const [pending, start] = useTransition();
// export const updateState = (state: any[]) => () => start(() => setState(state));


// export const SearchResults = () => {
//     return (
//         <div class={`search-results`}>
//             {getState().length == 0 && (
//                 <ErrorCard 
//                     name="No results..."
//                     description=""
//                 ></ErrorCard>
//             )}
//             <For each={getState()}>
//                 {({ name, description, version, author, date, type }) => {
//                     return (type == "error" ? 
//                         <ErrorCard 
//                             name={name}
//                             description={description}
//                         ></ErrorCard> :
//                         <Card
//                             name={name}
//                             description={description}
//                             author={author}
//                             date={date}
//                             version={version}
//                         ></Card>
//                     );
//                 }}
//             </For>
//         </div>
//     );
// };

export const [getSearchResults, setSearchResults] = createSignal([]);
export function SearchResults() {
  return (
    <dialog class="search-results" custom-search-results>
      <For
        each={getSearchResults()}
        fallback={<ErrorResult />}
      >
        {(item) => {
          if (item.type === "error")
            return <ErrorResult {...item} />;

          return <SearchResult {...item} />;
        }}
      </For>
    </dialog>
  );
}

export default SearchResults;