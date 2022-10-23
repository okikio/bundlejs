import { taskRunner } from "../index";

export async function parseConfig(input: string) {
  try {
    return await taskRunner.parseConfig(input);
  } catch (e) {
    console.warn(e);
  }
}