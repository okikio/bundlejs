import { copyToClipboard } from "./copy-to-clipboard.ts";
import { state } from "./store.ts";
import { taskRunner } from "../index.ts";
import toast from "../../components/SolidToast/index.tsx";

export async function createShareURL() {
  if (!state?.monaco?.models || !taskRunner) return;
  if (!state.monaco.loading) {
    const { input, config } = state.monaco.models;
    if (!input || !config) return;

    try {
      return await taskRunner.createShareURL(
        input?.uri.authority,
        input?.getValue(),
        config?.getValue()
      );
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function createShareURLQuery() {
  if (!state?.monaco?.models || !taskRunner) return;
  if (!state.monaco.loading) {
    const { input, config } = state.monaco.models;
    if (!input || !config) return;

    try {
      return await taskRunner.createShareURLParams(
        input.uri.authority,
        input.getValue(),
        config.getValue()
      );
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function share() {
  if (!state?.monaco?.models || !taskRunner) return;
  if (!state.monaco.loading) {
    try {
      await toast.promise(
        (async () => {
          if ("share" in globalThis?.navigator) {
            await globalThis?.navigator?.share?.({
              title: "bundlejs",
              text: "",
              url: await createShareURL(),
            });
          } else {
            const sharedUrl = (await createShareURL())!;
            await copyToClipboard(sharedUrl);
          }
        })(),
        {
          loading: "Sharing...",
          success: () => <>{"share" in globalThis?.navigator ? "Shared!" : "Copied!"}</>,
          error: "Share Error",
        }
      );
    } catch (error) {
      console.log("Error sharing", error);
      throw error;
    }
  }
}
