import type { ESBUILD } from "@bundlejs/core";
import toast from "../../components/SolidToast";

import { setState, state } from "./store";
import { taskRunner } from "../index";

import { outputModelResetValue } from "./get-initial";
import { addLogs } from "../../components/MainSection/EditorSection/Console";

export const timeFormatter = new Intl.RelativeTimeFormat("en", {
  style: "narrow",
  numeric: "auto",
});

export async function bundle() {
  if (!state.monaco.loading) {
    const { input, config } = state.monaco.models;

    try {
      return await taskRunner.bundle(
        input.uri.authority,
        input.getValue(),
        config.getValue()
      );
    } catch (e) {
      console.warn(e);
      throw e;
    }
  }
}

export async function build() {
  if (!state.monaco.loading) {
    let elapsed: number;
    let result: Awaited<ReturnType<typeof bundle>>;

    setState("bundling", true);

    try {
      state.monaco?.models?.output.setValue(outputModelResetValue);
      setState("bundleSize", "...");

      await toast.promise(
        (async () => {
          const start = Date.now();
          result = await bundle();
          const end = Date.now();

          elapsed = (end - start) / 1000;
          return result;
        })(),
        {
          loading: "Building...",
          success: () => (
            <>
              Build Done with a size of {result.size}{" "}
              {timeFormatter.format(elapsed, "seconds")}
            </>
          ),
          error: "Build Error",
        }
      );

      if (result?.outputFiles) {
        state.monaco?.models?.output.setValue(result?.outputFiles[0].text);
      }

      if (result?.size) {
        setState("bundleSize", result.size);
      }

      addLogs({
        type: "info",
        detail: `Build Done with a size of ${
          result.size
        } ${timeFormatter.format(elapsed, "seconds")}`,
      });

      // Signifier to no longer hold results in memory
      result = null;
    } catch (e) {
      console.warn(e);
      setState("bundleSize", "ERROR!");
      throw e;
    } finally {
      setState("bundling", false);
    }
  }
}
