// // import { dirname, resolve } from './_utils/path';

// import path from "path";
// import { fs, vol } from "memfs";
// 	// import {supportsCodeSplitting, supportsInput} from './_utils/rollupVersion';

// 	export let examples = [];
// 	let output = [];
// 	let options = {
// 		format: 'cjs',
// 		name: 'myBundle',
// 		amd: { id: '' },
// 		globals: {}
// 	};
// 	let codeSplitting = false;
// 	let selectedExample = null;
// 	let selectedExampleModules = [];
// 	let modules = [];
// 	let warnings = [];
// 	let input;
// 	let rollup;
// 	let error;

// 	function getUrlRollupVersion() {
// 	  if (typeof window === 'undefined') return null;
// 	  const versionMatch = /version=([^&]+)/.exec(window.location.search);
// 	  return versionMatch && versionMatch[1];
// 	}

// 	const urlRollupVersion = getUrlRollupVersion();

// 	const atob = typeof window ==='undefined'
// 		? base64 => Buffer.from(base64, 'base64').toString()
// 		: window.atob;

// 	function loadRollup () {
// 		const url = urlRollupVersion ?
// 			`https://unpkg.com/rollup@${urlRollupVersion}/dist/rollup.browser.js` :
// 			'https://unpkg.com/rollup/dist/rollup.browser.js';

//     	return new Promise(( fulfil, reject ) => {
//     		const script = document.createElement('script');
//     		script.src = url;
//     		script.onload = () => {
//     			fulfil(window.rollup);
//     		};
//     		script.onerror = reject;
//     		document.querySelector('head').appendChild(script);
//     	});
//     }

//     onMount(async () => {
//     	const {query} = get(stores().page);
//         try {
//         	if ( query.shareable ) {
//         		const json = decodeURIComponent(atob(query.shareable));
//         		({modules, options, example: selectedExample} = JSON.parse(json));
//         		input.$set({modules, selectedExample});
//         	} else if ( query.gist ) {
//         		const result = await (await fetch(`https://api.github.com/gists/${query.gist}`, {
//         			method: 'GET',
//         			headers: { Accept: 'application/vnd.github.v3+json' }
//         		})).json();
//         		const entryModules = query.entry ? query.entry.split(',') : [];
//         		modules = [result.files['main.js'] || { filename: 'main.js', content: '' }]
//         			.concat(Object.keys(result.files)
//         				.filter(fileName => fileName !== 'main.js')
//         				.map(fileName => result.files[fileName])
//         			).map(module => ({
//         				name: module.filename,
//         				code: module.content,
//         				isEntry: entryModules.indexOf(module.filename) >= 0
//         			}));
//         	} else {
//         		selectedExample = '00';
//         	}
//         } catch (err) {
//         	console.error(err);
//         	selectedExample = '00';
//         }

// 		rollup = await loadRollup();
// 		codeSplitting = rollup && supportsCodeSplitting(rollup.VERSION);
// 		return requestBundle();
//     });

// 	$: {
// 	    if (selectedExample) {
// 	        updateSelectedExample();
// 	    }
// 	}

// 	function updateSelectedExample() {
// 		fetch(`api/examples/${selectedExample}.json`).then(r => r.json()).then(example => {
//         	modules = example.modules;
//         	selectedExampleModules = modules.map(module => ({...module}))
//         });
//         input.$set({modules, selectedExample});
// 	}

// 	$: {
// 	  if (modules) {
// 	    requestDebouncedBundle();
// 	  }
// 	}

// 	$: {
// 	  if (options) {
// 	    requestBundle();
// 	  }
// 	}

//     // TODO instead of debouncing, we should bundle in a worker
// 	let bundleDebounceTimeout;
// 	function requestDebouncedBundle() {
// 		clearTimeout(bundleDebounceTimeout);
// 		bundleDebounceTimeout = setTimeout(requestBundle, 100);
// 	}

// 	let bundlePromise = null;
// 	async function requestBundle() {
// 		if (!modules.length || !rollup) return;
// 		if (bundlePromise) {
// 		  await bundlePromise;
// 		}
// 		bundlePromise = bundle().then(() => bundlePromise = null);
// 	}

// 	async function bundle () {
// 		console.clear();
// 		console.log(`running Rollup version %c${rollup.VERSION}`, 'font-weight: bold');
// 		if (selectedExample && selectedExampleModules.length) {
// 		  if (modules.length !== selectedExampleModules.length || selectedExampleModules.some((module, index) => {
// 		    const currentModule = modules[index];
// 		    return currentModule.name !== module.name ||
// 		        currentModule.code !== module.code ||
// 		        currentModule.isEntry !== module.isEntry;
// 		  })) {
// 		    selectedExample = null;
// 		    selectedExampleModules = [];
// 		  }
// 		}

// 		updateUrl();

// 		let moduleById = {};

// 		modules.forEach(module => {
// 			moduleById[module.name] = module;
// 		});

// 		warnings = [];
// 		const inputOptions = {
// 			plugins: [{
// 				resolveId ( importee, importer ) {
// 					if ( !importer ) return importee;
// 					if ( importee[0] !== '.' ) return false;

// 					let resolved = resolve(dirname(importer), importee).replace(/^\.\//, '');
// 					if ( resolved in moduleById ) return resolved;

// 					resolved += '.js';
// 					if ( resolved in moduleById ) return resolved;

// 					throw new Error(`Could not resolve '${importee}' from '${importer}'`);
// 				},
// 				load: function ( id ) {
// 					return moduleById[id].code;
// 				}
// 			}],
// 			onwarn ( warning ) {
// 				warnings.push(warning);

// 				console.group(warning.loc ? warning.loc.file : '');

// 				console.warn(warning.message);

// 				if ( warning.frame ) {
// 					console.log(warning.frame);
// 				}

// 				if ( warning.url ) {
// 					console.log(`See ${warning.url} for more information`);
// 				}

// 				console.groupEnd();
// 			}
// 		};
// 		if ( codeSplitting ) {
// 			inputOptions.input = modules
// 				.filter(( module, index ) => index === 0 || module.isEntry)
// 				.map(module => module.name);
// 		} else {
// 			inputOptions[supportsInput(rollup.VERSION) ? 'input' : 'entry'] = 'main.js';
// 		}

// 		try {
// 			const generated = await (await rollup.rollup(inputOptions)).generate(options);

// 			if ( codeSplitting ) {
// 				output = generated.output;
// 				error = null;
// 			} else {
// 			    output = [generated];
// 				error = null;
// 			}
// 		} catch (err) {
// 			error = err;
// 			if ( error.frame ) console.log(error.frame);
// 			setTimeout(() => {
// 				throw error;
// 			});
// 		}
// 	}

// 	function updateUrl () {
//     	if ( typeof history === 'undefined' ) return;

//     	const params = {};
//     	if ( typeof rollup !== 'undefined' ) {
//     		params.version = rollup.VERSION;
//     	} else if ( urlRollupVersion ) {
//     		params.version = urlRollupVersion;
//     	}

//     	const json = JSON.stringify({
//     		modules,
//     		options,
//     		example: selectedExample
//     	});
//     	params.shareable = btoa(encodeURIComponent(json));
//     	const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
//     	const url = `/repl/?${queryString}`;
//     	window.history.replaceState({}, '', url);
//     }