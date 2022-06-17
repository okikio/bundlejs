import type { ComponentProps } from "solid-js";

import Container from "../Container";
import SearchContainer from "./SearchSection/SearchContainer";
import EditorSection from "./EditorSection/EditorSection";
import Analysis from "./Analysis";

export function MainSection(props?: ComponentProps<'div'>) {

  return (
    <Container max="lg">
      <Container class="px-none">
        <SearchContainer />
      </Container>

      <EditorSection />

      <Container class="lt-md:px-none pb-4">
        <Analysis />
      </Container>
    </Container>
  );
}

export default MainSection;