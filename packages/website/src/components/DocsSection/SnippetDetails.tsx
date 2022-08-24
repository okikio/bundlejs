import type { ComponentProps, JSX } from "solid-js";
import Details from "../Details";

import { splitProps } from "solid-js";
import IconLink from "~icons/fluent/link-24-regular";

export function SnippetDetails(props: ComponentProps<'details'> & {
  children?: JSX.Element;
  summary?: string;
}) {
  let [newProps, attrs] = splitProps(props, ["children", "summary"]);

  const summary = (
    <h3 slot="summary" class="inline-flex items-center">
      {newProps.summary}
      <a href={"#" + attrs.id} custom-slug-link aria-hidden="true" tabIndex={-1}>
        <IconLink rehype-icon="link-24-regular" />
      </a>
    </h3>
  )
  return (
    <Details 
      custom-detail="snippet" 
      summary={summary} 
      contentClass=""
      {...attrs}
    >
      {newProps.children}
    </Details>
  );
}

export default SnippetDetails;