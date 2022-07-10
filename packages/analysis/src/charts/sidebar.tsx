import { SizeKey } from "../types/types";
import { LABELS } from "./sizes";
import { Component, createSignal, JSX } from "solid-js";

export interface SideBarProps {
  availableSizeProperties: SizeKey[];
  sizeProperty: SizeKey;
  setSizeProperty: (key: SizeKey) => void;
  onExcludeChange: (value: string) => void;
  onIncludeChange: (value: string) => void;
}

export const SideBar: Component<SideBarProps> = ({
  availableSizeProperties,
  sizeProperty,
  setSizeProperty,
  onExcludeChange,
  onIncludeChange,
}) => {
  const [includeValue, setIncludeValue] = createSignal("");
  const [excludeValue, setExcludeValue] = createSignal("");

  const handleSizePropertyChange = (sizeProp: SizeKey) => () => {
    if (sizeProp !== sizeProperty) {
      setSizeProperty(sizeProp);
    }
  };
  
  const handleIncludeChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    const value = event.currentTarget.value;
    setIncludeValue(value);
    onIncludeChange(value);
  };

  const handleExcludeChange: JSX.EventHandlerUnion<HTMLInputElement, Event> = (event) => {
    const value = event.currentTarget.value;
    setExcludeValue(value);
    onExcludeChange(value);
  };

  return (
    <aside class="sidebar">
      <div class="size-selectors">
        {availableSizeProperties.length > 1 &&
          availableSizeProperties.map((sizeProp) => {
            const id = `selector-${sizeProp}`;
            return (
              <div class="size-selector">
                <input
                  type="radio"
                  id={id}
                  checked={sizeProp === sizeProperty}
                  onChange={handleSizePropertyChange(sizeProp)}
                />
                <label for={id}>{LABELS[sizeProp]}</label>
              </div>
            );
          })}
      </div>
      <div class="module-filters">
        <div class="module-filter">
          <label for="module-filter-exclude">Exclude</label>
          <input type="text" id="module-filter-exclude" value={excludeValue()} onInput={handleExcludeChange} />
        </div>
        <div class="module-filter">
          <label for="module-filter-include">Include</label>
          <input type="text" id="module-filter-include" value={includeValue()} onInput={handleIncludeChange} />
        </div>
      </div>
    </aside>
  );
};
