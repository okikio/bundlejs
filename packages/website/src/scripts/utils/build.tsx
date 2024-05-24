import toast from "../../components/SolidToast/index.tsx";

import { setState, state } from "./store.ts";
import { taskRunner } from "../index.ts";

import { outputModelResetValue } from "./get-initial.ts";
import { addLogs } from "../../components/MainSection/EditorSection/Console.tsx";

export const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

export async function bundle() {
  if (!state.monaco.loading) {
    const { input, config } = state.monaco.models;

    try {
      if (input && config && taskRunner) {
        const result = await taskRunner.bundle(
          input.uri.authority,
          input.getValue(),
          config.getValue()
        );

        return result;
      }
    } catch (e) {
      console.warn(e);
      throw e;
    }
  }

  return null;
}

export async function build() {
  if (!state.monaco.loading) {

    setState("bundling", true);

    try {
      state.monaco?.models?.output?.setValue(outputModelResetValue);
      setState("bundleSize", "...");

      let elapsed: number = 0;
      let _result: Awaited<ReturnType<typeof bundle>> | null = null;

      await toast.promise(
        (async () => {
          const start = Date.now();
          _result = await bundle();
          const end = Date.now();

          elapsed = (end - start) / 1000;
          return _result;
        })(),
        {
          loading: "Building...",
          success: () => (
            <>
              Build Done with a size of {_result!.size}{" "}
              {timeFormatter.format(elapsed, "seconds")}
            </>
          ),
          error: "Build Error",
        }
      );

      if (_result) {
        let result = _result as NonNullable<Awaited<ReturnType<typeof bundle>>>;
        if (result?.outputFiles) {
          state.monaco?.models?.output?.setValue(result?.outputFiles[0].text);
        }

        if (result?.size) setState("bundleSize", result.size);
        addLogs({
          type: "info",
          detail: `Build Done with a size of ${
            result.size
          } ${timeFormatter.format(elapsed, "seconds")}`,
        });
      }

      // Signifier to no longer hold results in memory
      _result = null;
    } catch (e) {
      console.warn(e);
      setState("bundleSize", "ERROR!");
      throw e;
    } finally {
      setState("bundling", false);
    }
  }
}
