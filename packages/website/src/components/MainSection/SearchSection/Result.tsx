
import { ComponentProps, createSignal } from "solid-js";
import { toLocaleDateString } from "../../../scripts/utils/locale-date-string";

import { state } from "../store";

import IconArrowUpRight from "~icons/fluent/arrow-up-right-24-regular";
import { createTextSwitch } from "../../../hooks/text-switch";

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

  let btnTextRef: HTMLElement;
  let btnText = createTextSwitch("Add Module");

  // When user clicks the "Add Module button" give the user some feedback
  function onClick() {
    let opts: KeyframeAnimationOptions = {
      duration: 400,
      fill: "forwards",
      easing: "ease"
    };

    (async () => {
      await btnTextRef.animate({
        opacity: [1, 0]
      }, opts).finished;

      btnText.set("Added!");

      await btnTextRef.animate({
        opacity: [0, 1]
      }, opts).finished;

      let inputValue = state.monaco.models.input.getValue();
      let inputInitialValue = state.monaco.initialValue.input;

      // Ths initial values starting comment
      let startingComment = inputInitialValue.split("\n")[0];

      state.monaco.models.input.setValue(
        // If the input model has change from it's initial value then
        // add the module under the rest of the code
        // Otherwise, replace the input model value with the new export
        (inputValue !== inputInitialValue ? inputValue : startingComment)?.trim() +
        `\nexport * from "${_package}";`
      );

      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 500);
      });

      await btnTextRef.animate({
        opacity: [1, 0]
      }, opts).finished;

      btnText.reset();

      await btnTextRef.animate({
        opacity: [0, 1]
      }, opts).finished;
    })();
  };

  return (
    <div class="result">
      <div class="content">
        <h2 class="font-semibold text-lg">
          <a href={_packageHref} target="_blank" rel="noopener">{_name}<IconArrowUpRight rehype-icon="arrow-up-right-24-regular" /></a>
        </h2>
        <div>
          <p>{_description}</p>
          <p class="updated-time">
            {_date && `Updated ${_date} `}
            {_author && (<>
              by <a href={_authorHref} target="_blank" rel="noopener">@{_author}<IconArrowUpRight rehype-icon="arrow-up-right-24-regular" /></a>.
            </>)}
          </p>
        </div>
      </div>
      <div class="add">
        <button class="btn" onClick={onClick}>
          <span class="btn-text" ref={btnTextRef}>{btnText.get()}</span>
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