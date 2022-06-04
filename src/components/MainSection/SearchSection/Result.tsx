
import type { ComponentProps } from "solid-js";

// import { EventEmitter } from "@okikio/emitter";
// import { timeline, animate } from "@okikio/animate";

// export const ResultEvents = new EventEmitter();
// export const [getState, setState] = createSignal([]);
// export const [isInitial, setIsInitial] = createSignal(true);

// export const [pending, start] = useTransition();
// export const updateState = (state: any[]) => () => start(() => setState(state));

export const toLocaleDateString = (date: string | number | Date) => {
  return new Date(date)
    .toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
}

export interface SearchResultProps extends ComponentProps<'div'> {
  name?: string;
  description?: string;
  date?: string;
  publisher?: { username?: string; };
  version?: string;
}

export function SearchResult(props?: SearchResultProps) {
  let _name = props?.name;
  let _description = props?.description;
  let _date = props?.date ? toLocaleDateString(props?.date) : null;
  let _author = props?.publisher?.username;
  let _version = props?.version ? "@" + props?.version : "";

  let _package = `${_name}${_version}`;
  let _packageHref = `https://www.npmjs.com/${_package}`;
  let _authorHref = `https://www.npmjs.com/~${_author}`;

  let btnTextEl: HTMLElement;
  let btnEl: HTMLButtonElement;

  // When user clicks the "Add Module button" give the user some feedback
  let onclick = () => {
    let text = btnTextEl.innerText;
    let opts = {
      target: btnTextEl,
      duration: 400,
      fillMode: "forwards"
    };

    // timeline()
    //     .add({
    //         ...opts,
    //         opacity: [1, 0],
    //         onfinish() {
    //             btnTextEl.innerText = "Added!";
    //             ResultEvents.emit("add-module", `export * from "${_package}";`);
    //         }
    //     })
    //     .add({
    //         ...opts,
    //         opacity: [0, 1],
    //     })
    //     .add({
    //         ...opts,
    //         opacity: [1, 0],
    //         onfinish: () => { btnTextEl.innerText = text; }
    //     })
    //     .add({
    //         ...opts,
    //         opacity: [0, 1],
    //         onfinish: () => { ResultEvents.emit("complete"); }
    //     });
  };

  return (
    <div class="result">
      <div class="content">
        <h2 class="font-semibold text-lg">
          <a href={_packageHref} target="_blank">{_name}</a>
        </h2>
        <div>
          <p>{_description}</p>
          <p class="updated-time">
            {_date && `Updated ${_date} `}
            {_author && (<>
              by <a href={_authorHref} target="_blank" rel="noopener">@{_author}</a>.
            </>)}
          </p>
        </div>
      </div>
      <div class="add">
        <button ref={btnEl} class="btn" onClick={onclick}>
          <span class="btn-text" ref={btnTextEl}>Add Module</span>
        </button>
      </div>
    </div>
  );
}

export function ErrorResult(props?: SearchResultProps) {
  let _name = props?.name ?? "No results...";
  let _description = props?.description ?? "";

  return (
    <div class="result error">
      <div class="content">
        <h2 class="font-semibold text-lg">
          <div class="text-center">{_name}</div>
        </h2>

        <p class={"text-center" + (_description == "" ? " hidden" : "")}>{_description}</p>
      </div>
    </div>
  );
}

export default SearchResult;