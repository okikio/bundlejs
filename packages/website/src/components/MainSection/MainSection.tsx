import type { ComponentProps } from "solid-js";

import Container from "../Container";
import SearchContainer from "./SearchSection/SearchContainer";
import EditorSection from "./EditorSection/EditorSection";

export function MainSection(props?: ComponentProps<'div'>) {

  return (
    <Container max="lg">
      <Container class="px-none">
        <SearchContainer />
      </Container>

      <EditorSection />
    </Container>
  );
}

export default MainSection;