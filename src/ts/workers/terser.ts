importScripts("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
importScripts("https://unpkg.com/terser/dist/bundle.min.js");

export const options = {
	// toplevel: true,
	// ecma: 2020,
	// module: true,
};

self.onmessage = ({ data }) => {
	(async () => {
		try {
			// @ts-ignore
			let { code } = await Terser.minify(data, options);
			self.postMessage(code);
		} catch (error) {
			self.postMessage({ error });
		}
	})();
}