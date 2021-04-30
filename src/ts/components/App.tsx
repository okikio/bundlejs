import { Suspense, lazy, ErrorBoundary } from "solid-js";
import { render } from "solid-js/web";

import Editor from "./Editor";
// const Editor = lazy(() => import("./Editor"));
// export const App = () => {
//     return (
//         <div class="center-container">
//         <ErrorBoundary fallback={<div>Something went terribly wrong</div>}>
//         <Suspense fallback={<div class="loading"></div>}>
//             <Editor />
//         </Suspense>
//     </ErrorBoundary>
// </div>
//     );
// };

export const App = () => {
    return <><Editor></Editor></>;
};

/*

<div class="center-container">
    <ErrorBoundary fallback={<div>Something went terribly wrong</div>}>
        <Suspense fallback={<div class="loading"></div>}>
        </Suspense>
    </ErrorBoundary>
</div>
*/

export const build = () => {
    render(() => <App />, document.getElementById("app"));
};

export default App;
