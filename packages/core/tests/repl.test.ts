import { describe, test, expect, it } from "vitest";
import { build, FileSystem, setFile } from "../lib/index.mjs";

describe("suite", async () => {
  setFile("/index.tsx", `
    import animate from "@okikio/animate";
    animate({
      target: "div"
    })
  `);

  it("first bundle test", async () => {
    let result = await build({
      filesystem: {
        files: FileSystem
      }
    })

    console.log(result)

  })
})
