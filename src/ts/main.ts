import * as Default from "./modules/default";
import * as Playground from "./modules/playground";
import { runTheme } from "./modules/theme";

// Theme change
runTheme();

// The default navbar, etc... that is needed
Default.build();
Playground.build();
