import Button from "../../Button";

import IconUp from "~icons/fluent/arrow-up-24-regular";
import IconDown from "~icons/fluent/arrow-down-24-regular";
import IconAutoFit from "~icons/fluent/arrow-autofit-height-24-regular";
import IconDelete from "~icons/fluent/delete-24-regular";

export function ConsoleButtons() {
  return (
    <div class="console-btns">
      <Button console-to-top-btn aria-label="Scroll to Top" title="Scroll to Top">
        <IconUp />
      </Button>
      <Button console-to-bottom-btn aria-label="Scroll to Bottom" title="Scroll to Bottom">
        <IconDown />
      </Button>
      <Button fold-unfold-console-btn aria-label="Fold/Unfold Console" title="Fold/Unfold Console">
        <IconAutoFit />
      </Button>
      <Button clear-console-btn aria-label="Clear Console" title="Clear Console">
        <IconDelete />
      </Button>
    </div>
  );
}

export default ConsoleButtons;