import type { TarStreamEntry } from "@std/tar/untar-stream";
import { UntarStream } from "@std/tar/untar-stream";
import { normalize, join } from "@std/path/posix";

const response = await fetch("https://pkg.pr.new/@tanstack/react-query@7988");
const content = await response.arrayBuffer();

const contentType = response.headers.get("content-type");


if (contentType?.trim()?.toLowerCase() === "application/tar+gzip") {
  // const blob = new Blob([content]);
  const stream = new Blob([content]).stream()
    .pipeThrough<Uint8Array>(new DecompressionStream("gzip"))
    .pipeThrough(new UntarStream());

  // Create a reader from the stream
  const reader = stream.getReader();

  console.log({
    stream,
    reader
  })

  // Get the stream as an async iterable
  const iterableStream = {
    async *[Symbol.asyncIterator]() {
      try {

        console.log({
          result: "result"
        })

        while (true) {
          const result = await reader.read();
          if (result.done) break;
          yield result.value;
        }

        console.log({
          result_POLL: "result"
        })
      } finally {
        reader.releaseLock();
      }
    }
  };

  for await (const entry of iterableStream) {
      // console.log({
      //     entry
      // })
      const path = normalize(entry.path);
      // await Deno.mkdir(dirname(path));

      // Convert the stream into a Blob
      const blob = await new Response(entry.readable).blob();

      // Convert the Blob to an ArrayBuffer and then into a Uint8Array
      const arrayBuffer = await blob.arrayBuffer();

      const uint8arr = new Uint8Array(arrayBuffer);
      console.log({
        path: join("./", path)
      })
      // setFile(args.namespace + ":" + join("./", path), uint8arr);
  }

}