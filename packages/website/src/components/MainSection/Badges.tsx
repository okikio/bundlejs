import { ComponentProps, For, Show, createSignal } from "solid-js";
import Details from "../Details";
import { createShareURLQuery } from "../../scripts/utils/share";

const BADGE_ENDPOINT = "https://deno.bundlejs.com/";

type BadgeOptions = {
  type: "detailed" | "minified" | "uncompressed";
  style: "flat" | "plastic" | "flat-square" | "for-the-badge" | "social";
  raster: boolean;
};

function createBadgeURL(query: string, { type, style, raster }: BadgeOptions) {
  return `${BADGE_ENDPOINT}?${query}&badge=${type}&badge-style=${style}&badge-raster=${raster}`;
}

function createBadgeLinkURL(query: string) {
  return `${location.origin}/?${query}`;
}

function copyToClipboard(text: string) {
  const el = document.createElement("textarea");
  el.value = text;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
}

type OptionsProps = {
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
};

function Options(props: OptionsProps) {
  return (
    <div>
      <For each={props.options}>
        {(option) => (
          <div class="flex gap-2">
            <input
              id={`option-${option.value}`}
              type="radio"
              name={props.value}
              value={option.value}
              checked={props.value === option.value}
              onChange={() => props.onChange(option.value)}
            />
            <label for={`option-${option.value}`}>{option.label}</label>
          </div>
        )}
      </For>
    </div>
  );
}

export function Badges(props?: ComponentProps<"details">) {
  const [generating, setGenerating] = createSignal(false);
  const [badgeUrl, setBadgeUrl] = createSignal<string>();
  const [linkUrl, setLinkUrl] = createSignal<string>();
  const [type, setType] = createSignal("detailed");
  const [style, setStyle] = createSignal("flat");
  const [raster, setRaster] = createSignal(false);

  let timeout: ReturnType<typeof setTimeout> | undefined;
  const [showCopied, setShowCopied] = createSignal<"image" | "markdown">();
  function displayShowCopied(type: "image" | "markdown") {
    if (timeout) clearTimeout(timeout);
    setShowCopied(type);
    timeout = setTimeout(() => setShowCopied(undefined), 1000);
  }

  function copy(text: string, type: "image" | "markdown") {
    copyToClipboard(text);
    displayShowCopied(type);
  }

  async function updateBadgeUrl() {
    setGenerating(true);
    const params = await createShareURLQuery();
    setBadgeUrl(
      createBadgeURL(params, {
        type: type() as BadgeOptions["type"],
        style: style() as BadgeOptions["style"],
        raster: raster() as BadgeOptions["raster"],
      })
    );
    setLinkUrl(createBadgeLinkURL(params));
    setGenerating(false);
  }

  const markdownCode = () =>
    `[![Open in bundlejs.com](${badgeUrl()})](${linkUrl()})`;

  return (
    <div class="details-section">
      <Details
        class="inline-details umami--toggle--analysis-accordian"
        summary="Generate a dynamic badge"
        contentClass="pr-5"
      >
        {props.children}
        <div class="relative w-full">
          <p>Share a badge with the computed size of the current query!</p>
          <div class="my-4 sm:flex gap-4">
            <div class="grow">
              <p class="my-2 font-bold">Badge type</p>
              <Options
                value={type()}
                onChange={(value) => setType(value)}
                options={[
                  { value: "detailed", label: "Detailed" },
                  { value: "minified", label: "Minified" },
                  { value: "uncompressed", label: "Uncompressed" },
                ]}
              />
            </div>
            <div class="grow">
              <p class="my-2 font-bold">Badge style</p>
              <Options
                value={style()}
                onChange={(value) => setStyle(value)}
                options={[
                  { value: "flat", label: "Flat" },
                  { value: "plastic", label: "Plastic" },
                  { value: "flat-square", label: "Flat square" },
                  { value: "for-the-badge", label: "For the badge" },
                  { value: "social", label: "Social" },
                ]}
              />
            </div>
            <div class="grow">
              <p class="my-2 font-bold">Image type</p>
              <Options
                value={raster() ? "true" : "false"}
                onChange={(value) => setRaster(Boolean(value))}
                options={[
                  { value: "true", label: "PNG" },
                  { value: "false", label: "SVG" },
                ]}
              />
            </div>
          </div>
          <Show when={!generating()} fallback={"Generating badge..."}>
            <div class="flex gap-2">
              <button onClick={updateBadgeUrl}>
                {badgeUrl() ? "Update badge" : "Create badge"}
              </button>
              <Show when={badgeUrl()}>
                <span> • </span>
                <button onClick={() => copy(badgeUrl(), "image")}>
                  {showCopied() === "image" ? "Copied!" : "Copy image URL"}
                </button>
              </Show>
            </div>
          </Show>
          <Show when={badgeUrl()} keyed>
            {(badgeUrl) => (
              <div class="space-y-4">
                <div class="mt-4">
                  <img src={badgeUrl} />
                </div>
                <div>
                  <div class="mb-4 flex gap-4">
                    <p class="font-bold">Mardown code</p>
                    <button onClick={() => copy(markdownCode(), "markdown")}>
                      {showCopied() === "markdown" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <textarea class="rounded w-full h-[8rem] resize-none font-mono px-4 py-2 dark:bg-elevated border border-solid border-black/40 dark:border-white">
                    {markdownCode()}
                  </textarea>
                </div>
              </div>
            )}
          </Show>
        </div>
      </Details>
    </div>
  );
}

export default Badges;
