import type { ComponentProps } from "solid-js";
import Details from "../Details";
import Loading from "../Loading";
import DragHandle from "./EditorSection/DragHandle";

export function Analysis(props?: ComponentProps<'details'>) {
  return (
    <div class="analysis-section">
      <Details
        class="inline-details umami--toggle--analysis-accordian"
        summary="Bundle Analysis">

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
        </p>
        <br />
        <div class="relative w-full">
          <div class="analyzer-loader">
            <div class="text-center">
              <p class="loader-content">Nothing to analyze...</p>
              <Loading hidden />
            </div>
          </div>
          <iframe id="analyzer" src="about:blank" sandbox="allow-scripts"></iframe>
          <DragHandle direction="y" />
        </div>
      </Details>
    </div>
  );
}

export default Analysis;