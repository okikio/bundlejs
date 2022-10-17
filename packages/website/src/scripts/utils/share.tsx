import toast from "../../components/SolidToast";
import { copyToClipboard } from "./copy-to-clipboard";
import { state } from "./store";

export async function createShareURL() {
  if (!state.monaco.loading) {
    const { input, config } = state.monaco.models;

    try {
      const worker = state.monaco.workers.taskRunner;
      const thisWorker = await worker.getWorker();

      return await thisWorker.createShareURL(
        input.uri.authority,
        input.getValue(),
        config.getValue()
      );
    } catch (e) {
      console.warn(e)
    }
  }
}

export async function share() {
  if (!state.monaco.loading) {
    try {
      await toast.promise(
        (async () => {
          if (navigator.share) {
            await navigator.share({
              title: 'bundlejs',
              text: '',
              url: await createShareURL(),
            });
          } else {
            await copyToClipboard(await createShareURL());
          }
        })(),
        {
          loading: "Sharing...",
          success: () => <>{navigator.share ? "Shared!" : "Copied!"}</>,
          error: 'Share Error'
        }
      );
    } catch (error) {
      console.log('Error sharing', error);
      throw error;
    }
  }
}