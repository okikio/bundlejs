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
        contentClass=""
      >
        {props.docs}
        <div class="relative w-full">
          <div class="relative w-full">
            <div class="analysis-loader">
              <div class="text-center">
                <Loading show={true}>
                <p class="loader-content">Nothing to analyze...</p>

                </Loading>
              </div>
            </div>
            <iframe class="analysis-iframe" title="Bundle Analysis" id="analyzer" src="about:blank" sandbox="allow-scripts"></iframe>
          </div>
          <DragHandle direction="y" />
        </div>
      </Details>
    </div>
  );
}

export default Analysis;