import prettyBytes from "pretty-bytes";

// import { gzip, zlib, deflate } from "@gfx/zopfli";
import { gzip } from "pako";

self.onmessage = ({ data }) => {
	(async () => {
		try {
			// @ts-ignore
            let { length } = await gzip(data, { level: 9, memLevel: 9 });
			self.postMessage(prettyBytes(length));
		} catch (error) {
			self.postMessage({ error });
		}
	})();
}