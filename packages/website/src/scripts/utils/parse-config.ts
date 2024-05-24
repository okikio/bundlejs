import { taskRunner } from "../index.ts";

export async function parseConfig(input: string) {
  try {
    if (!taskRunner) return null;
    return await taskRunner.parseConfig(input);
  } catch (e) {
    console.warn(e);
  }
}