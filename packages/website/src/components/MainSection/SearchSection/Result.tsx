import type { ComponentProps } from "solid-js";

import { toLocaleDateString } from "../../../scripts/utils/locale-date-string";

import { state } from "../../../scripts/utils/store";

import toast from "../../SolidToast/index";
import { createTextSwitch } from "../../../hooks/text-switch";

import Anchor from "../../../components/Anchor";
import Button from "../../../components/Button";
import { inputModelResetValue } from "../../../scripts/utils/get-initial";

export interface SearchResultProps extends ComponentProps<"div"> {
  type?: string;
  name?: string;
  description?: string;
  date?: string;
  publisher?: { username?: string; };
  version?: string;
}

export function SearchResult(props?: SearchResultProps) {
  const _name = props?.name;
  const _description = props?.description;
  const _date = props?.date ? toLocaleDateString(props?.date) : null;
  const _author = props?.publisher?.username;
  const _version = props?.version ? "@" + props?.version : "";

  const _package = `${_name}${_version}`;
  const _packageHref = `https://www.npmjs.com/${_name}`;
  const _authorHref = `https://www.npmjs.com/~${_author}`;

  const BtnText = createTextSwitch(["Add Module", "Added!"]);

  // When user clicks the "Add Module button" give the user some feedback
  async function onClick() {
    toast.success(`Added ${_package}`);
    await BtnText.switch("next");

    const inputValue = state.monaco.models.input.getValue();
    const inputInitialValue = state.monaco.initialValue.input ?? inputModelResetValue;

    // Ths initial values starting comment
    const startingComment = inputInitialValue.split("\n")[0];

    console.log({ _package })

    state.monaco.models.input.setValue(
      // If the input model has change from it's initial value then
      // add the module under the rest of the code
      // Otherwise, replace the input model value with the new export
      (inputValue !== inputInitialValue ? inputValue : startingComment)?.trim() +
      `\nexport * from "${_package}";`
    );

    await BtnText.switch("initial", 500);
  }

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
  const _name = props?.name ?? "No results...";
  const _description = props?.description ?? "";

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