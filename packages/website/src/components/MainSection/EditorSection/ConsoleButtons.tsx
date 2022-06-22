import Button from "../../Button";

import IconUp from "~icons/fluent/arrow-up-24-regular";
import IconDown from "~icons/fluent/arrow-down-24-regular";
import IconAutoFit from "~icons/fluent/arrow-autofit-height-24-regular";
import IconDelete from "~icons/fluent/delete-24-regular";

import { SingletonToolTip } from "../../../hooks/tooltip";

export function ConsoleButtons() {
  return (
    <SingletonToolTip target="[custom-button]" class="console-btns">
      <Button console-to-top-btn aria-label="Scroll to Top" data-tippy-content="Scroll to Top">
        <IconUp />
      </Button>
      <Button console-to-bottom-btn aria-label="Scroll to Bottom" data-tippy-content="Scroll to Bottom">
        <IconDown />
      </Button>
      <Button fold-unfold-console-btn aria-label="Fold/Unfold Console" data-tippy-content="Fold/Unfold Console">
        <IconAutoFit />
      </Button>
      <Button clear-console-btn aria-label="Clear Console" data-tippy-content="Clear Console">
        <IconDelete />
      </Button>
    </SingletonToolTip>
  );
}

export default ConsoleButtons;