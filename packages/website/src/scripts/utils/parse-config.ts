import { state } from "./store";

export async function parseConfig(input: string) {
  if (!state.monaco.loading) {
    try {
      const worker = state.monaco.workers.taskRunner;
      const thisWorker = await worker.getWorker();

      return await thisWorker.parseConfig(input);
    } catch (e) {
      console.warn(e)
    }
  }
}