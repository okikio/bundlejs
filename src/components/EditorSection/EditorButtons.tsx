import Button from "../Button";

import IconMore from "~icons/fluent/more-24-regular";
import IconDelete from "~icons/fluent/delete-24-regular";
import IconFormat from "~icons/fluent/paint-brush-24-regular";
import IconReset from "~icons/fluent/arrow-counterclockwise-24-regular";
import IconCopy from "~icons/fluent/copy-24-regular";
import IconCodeWrap from "~icons/fluent/text-wrap-24-regular";

export function EditorButtons() {
  return (
    <div class="editor-btn-container">
      <Button hide-btn class="umami--click--hide-editor-button" aria-label="Show/Hide Editor Buttons" title="Show/Hide Editor Buttons">
        <IconMore />
      </Button>

      <div class="editor-btns">
        <Button clear-btn class="umami--click--clear-editor-button" aria-label="Clear Code Editor" title="Clear Code Editor">
          <IconDelete />
        </Button>

        <Button format-btn class="umami--click--format-editor-button" aria-label="Format Code" title="Format Code">
          <IconFormat />
        </Button>

        <Button reset-btn class="umami--click--reset-editor-button" aria-label="Reset Code Editor" title="Reset Code Editor">
          <IconReset />
        </Button>

        <Button copy-btn class="umami--click--copy-editor-button" aria-label="Copy Code" title="Copy Code">
          <IconCopy />
        </Button>

        <Button code-wrap-btn class="umami--click--codewrap-editor-button" aria-label="Toggle Code Wrap" title="Toggle Code Wrap">
          <IconCodeWrap />
        </Button>
      </div>
    </div>
  );
}

export default EditorButtons;