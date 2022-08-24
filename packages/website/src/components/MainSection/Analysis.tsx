import type { ComponentProps, JSX } from "solid-js";
import Details from "../Details";
import Loading from "../Loading";
import DragHandle from "./EditorSection/DragHandle";

export function Analysis(props?: ComponentProps<'details'> & { docs?: JSX.Element }) {
  return (
    <div class="analysis-section">
      <Details
        class="inline-details umami--toggle--analysis-accordian"
        summary="Bundle Analysis"
      >

        <p>
          {/* <Markdown>
          Enable the `analysis` config to view the size of output files with interactive zoomable charts.

          ```ts
          {
            "analysis": "treemap" | "network" | "sunburst" | true | false,
            "esbuild": { ... }
          }
          ```

        </Markdown> */}
          {props.docs}
        </p>
        <br />
        <div class="relative w-full">
          <div class="analyzer-loader">
            <div class="text-center">
              <p class="loader-content">Nothing to analyze...</p>
              <Loading show={false} />
            </div>
          </div>
          <iframe title="Bundle Analysis" id="analyzer" src="about:blank" sandbox="allow-scripts"></iframe>
          <DragHandle direction="y" />
        </div>
      </Details>
    </div>
  );
}

export default Analysis;