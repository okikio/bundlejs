
import type { ComponentProps } from "solid-js";

import { createSignal } from "solid-js";
import { toLocaleDateString } from "../../../scripts/utils/locale-date-string";

import { state } from "../store";

import toast from "../../SolidToast/index";
import { createTextSwitch } from "../../../hooks/text-switch";

import Anchor from "../../../components/Anchor";
import Button from "../../../components/Button";

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
  let _packageHref = `https://www.npmjs.com/${_name}`;
  let _authorHref = `https://www.npmjs.com/~${_author}`;

  let BtnText = createTextSwitch(["Add Module", "Added!"]);

  // When user clicks the "Add Module button" give the user some feedback
  function onClick() {
    (async () => {
      toast.success(`Added ${_package}`)
      await BtnText.switch("next");

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

      await BtnText.switch("initial", 500);
    })();
  };

  return (
    <div class="result">
      <div class="content">
        <h2 class="font-semibold text-lg">
          <Anchor href={_packageHref}>{_name}</Anchor>
        </h2>
        <div>
          <p>{_description}</p>
          <p class="updated-time">
            {_date && `Updated ${_date} `}
            {_author && (<>
              by <Anchor href={_authorHref}>@{_author}</Anchor>.
            </>)}
          </p>
        </div>
      </div>
      <div class="add">
        <Button type="button" class="btn" onClick={onClick}>
          <span class="btn-text">
            <BtnText.render />
          </span>
        </Button>
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