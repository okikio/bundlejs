var Module = typeof Module !== 'undefined' ? Module : {};
var moduleOverrides = {};
var key;
for (key in Module) {
  if (Module.hasOwnProperty(key)) {
    moduleOverrides[key] = Module[key];
  }
}
var arguments_ = [];
var err = Module['printErr'] || console.warn.bind(console);
for (key in moduleOverrides) {
  if (moduleOverrides.hasOwnProperty(key)) {
    Module[key] = moduleOverrides[key];
  }
}
moduleOverrides = null;
if (Module['arguments']) arguments_ = Module['arguments'];
if (Module['thisProgram']) thisProgram = Module['thisProgram'];
if (Module['quit']) quit_ = Module['quit'];
var tempRet0 = 0;
var setTempRet0 = function (value) {
  tempRet0 = value;
};
if (typeof WebAssembly !== 'object') {
  abort('no native wasm support detected');
}
var wasmMemory;
var ABORT = false;
function ___assert_fail(condition, filename, line, func) {
  abort('Assertion failed: ' + [filename ? filename : 'unknown filename', line, func ? func : 'unknown function']);
}
function alignUp(x, multiple) {
  if (x % multiple > 0) {
    x += multiple - (x % multiple);
  }
  return x;
}
var buffer, HEAPU8;
function updateGlobalBufferAndViews(buf) {
  buffer = buf;
  Module['HEAP8'] = new Int8Array(buf);
  Module['HEAPU8'] = HEAPU8 = new Uint8Array(buf);
}
var INITIAL_MEMORY = Module['INITIAL_MEMORY'] || 16777216;
var wasmTable;
var __ATPRERUN__ = [];
var __ATINIT__ = [];
var __ATPOSTRUN__ = [];
var runtimeInitialized = false;
function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPRERUN__);
}
function initRuntime() {
  runtimeInitialized = true;
  callRuntimeCallbacks(__ATINIT__);
}
function postRun() {
  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  callRuntimeCallbacks(__ATPOSTRUN__);
}
function addOnPreRun(cb) {
  __ATPRERUN__.unshift(cb);
}
function addOnInit(cb) {
  __ATINIT__.unshift(cb);
}
function addOnPostRun(cb) {
  __ATPOSTRUN__.unshift(cb);
}
var runDependencies = 0;
var runDependencyWatcher = null;
var dependenciesFulfilled = null;
function addRunDependency(id) {
  runDependencies++;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
}
function removeRunDependency(id) {
  runDependencies--;
  if (Module['monitorRunDependencies']) {
    Module['monitorRunDependencies'](runDependencies);
  }
  if (runDependencies == 0) {
    if (runDependencyWatcher !== null) {
      clearInterval(runDependencyWatcher);
      runDependencyWatcher = null;
    }
    if (dependenciesFulfilled) {
      var callback = dependenciesFulfilled;
      dependenciesFulfilled = null;
      callback();
    }
  }
}
Module['preloadedImages'] = {};
Module['preloadedAudios'] = {};
function abort(what) {
  if (Module['onAbort']) {
    Module['onAbort'](what);
  }
  what += '';
  err(what);
  ABORT = true;
  EXITSTATUS = 1;
  what = 'abort(' + what + ').';
  var e = new WebAssembly.RuntimeError(what);
  throw e;
}

function getBinaryPromise(url) {
  return fetch(url, { credentials: 'same-origin' }).then(function (response) {
    if (!response['ok']) {
      throw "failed to load wasm binary file at '" + url + "'";
    }
    return response['arrayBuffer']();
  });
}

function init(filePathOrBuf) {
  var info = { a: asmLibraryArg };
  function receiveInstance(instance, module) {
    var exports = instance.exports;
    Module['asm'] = exports;
    wasmMemory = Module['asm']['d'];
    updateGlobalBufferAndViews(wasmMemory.buffer);
    wasmTable = Module['asm']['s'];
    addOnInit(Module['asm']['e']);
    removeRunDependency('wasm-instantiate');
  }
  addRunDependency('wasm-instantiate');
  function receiveInstantiationResult(result) {
    receiveInstance(result['instance']);
  }
  function instantiateArrayBuffer(receiver) {
    return getBinaryPromise(filePathOrBuf)
      .then(function (binary) {
        var result = WebAssembly.instantiate(binary, info);
        return result;
      })
      .then(receiver, function (reason) {
        err('failed to asynchronously prepare wasm: ' + reason);
        abort(reason);
      });
  }
  function instantiateAsync() {
    if (filePathOrBuf && filePathOrBuf.byteLength > 0) {
      return WebAssembly.instantiate(filePathOrBuf, info).then(receiveInstantiationResult, function (reason) {
        err('wasm compile failed: ' + reason);
      });
    } else if (
      typeof WebAssembly.instantiateStreaming === 'function' &&
      typeof filePathOrBuf === 'string' &&
      typeof fetch === 'function'
    ) {
      return fetch(filePathOrBuf, { credentials: 'same-origin' }).then(function (response) {
        var result = WebAssembly.instantiateStreaming(response, info);
        return result.then(receiveInstantiationResult, function (reason) {
          err('wasm streaming compile failed: ' + reason);
          err('falling back to ArrayBuffer instantiation');
          return instantiateArrayBuffer(receiveInstantiationResult);
        });
      });
    } else {
      return instantiateArrayBuffer(receiveInstantiationResult);
    }
  }
  if (Module['instantiateWasm']) {
    try {
      var exports = Module['instantiateWasm'](info, receiveInstance);
      return exports;
    } catch (e) {
      err('Module.instantiateWasm callback failed with error: ' + e);
      return false;
    }
  }
  instantiateAsync();
  return {};
}
function callRuntimeCallbacks(callbacks) {
  while (callbacks.length > 0) {
    var callback = callbacks.shift();
    if (typeof callback == 'function') {
      callback(Module);
      continue;
    }
    var func = callback.func;
    if (typeof func === 'number') {
      if (callback.arg === undefined) {
        wasmTable.get(func)();
      } else {
        wasmTable.get(func)(callback.arg);
      }
    } else {
      func(callback.arg === undefined ? null : callback.arg);
    }
  }
}
function emscripten_realloc_buffer(size) {
  try {
    wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
    updateGlobalBufferAndViews(wasmMemory.buffer);
    return 1;
  } catch (e) {}
}
function _emscripten_resize_heap(requestedSize) {
  var oldSize = HEAPU8.length;
  requestedSize = requestedSize >>> 0;
  var maxHeapSize = 2147483648;
  if (requestedSize > maxHeapSize) {
    return false;
  }
  for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
    var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
    overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
    var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
    var replacement = emscripten_realloc_buffer(newSize);
    if (replacement) {
      return true;
    }
  }
  return false;
}
function _setTempRet0(val) {
  setTempRet0(val);
}
var asmLibraryArg = { a: ___assert_fail, b: _emscripten_resize_heap, c: _setTempRet0 };
Module['___wasm_call_ctors'] = function () {
  return (Module['___wasm_call_ctors'] = Module['asm']['e']).apply(null, arguments);
};
Module['_malloc'] = function () {
  return (Module['_malloc'] = Module['asm']['q']).apply(null, arguments);
};
Module['_free'] = function () {
  return (Module['_free'] = Module['asm']['r']).apply(null, arguments);
};
Module['_ZSTD_isError'] = function () {
  return (Module['_ZSTD_isError'] = Module['asm']['f']).apply(null, arguments);
};
Module['_ZSTD_compressBound'] = function () {
  return (Module['_ZSTD_compressBound'] = Module['asm']['g']).apply(null, arguments);
};
Module['_ZSTD_createCCtx'] = function () {
  return (Module['_ZSTD_createCCtx'] = Module['asm']['h']).apply(null, arguments);
};
Module['_ZSTD_freeCCtx'] = function () {
  return (Module['_ZSTD_freeCCtx'] = Module['asm']['i']).apply(null, arguments);
};
Module['_ZSTD_compress_usingDict'] = function () {
  return (Module['_ZSTD_compress_usingDict'] = Module['asm']['j']).apply(null, arguments);
};
Module['_ZSTD_compress'] = function () {
  return (Module['_ZSTD_compress'] = Module['asm']['k']).apply(null, arguments);
};
Module['_ZSTD_createDCtx'] = function () {
  return (Module['_ZSTD_createDCtx'] = Module['asm']['l']).apply(null, arguments);
};
Module['_ZSTD_freeDCtx'] = function () {
  return (Module['_ZSTD_freeDCtx'] = Module['asm']['m']).apply(null, arguments);
};
Module['_ZSTD_getFrameContentSize'] = function () {
  return (Module['_ZSTD_getFrameContentSize'] = Module['asm']['n']).apply(null, arguments);
};
Module['_ZSTD_decompress_usingDict'] = function () {
  return (Module['_ZSTD_decompress_usingDict'] = Module['asm']['o']).apply(null, arguments);
};
Module['_ZSTD_decompress'] = function () {
  return (Module['_ZSTD_decompress'] = Module['asm']['p']).apply(null, arguments);
};

var calledRun;
dependenciesFulfilled = function runCaller() {
  if (!calledRun) run();
  if (!calledRun) dependenciesFulfilled = runCaller;
};
function run(args) {
  args = args || arguments_;
  if (runDependencies > 0) {
    return;
  }
  preRun();
  if (runDependencies > 0) {
    return;
  }
  function doRun() {
    if (calledRun) return;
    calledRun = true;
    Module['calledRun'] = true;
    if (ABORT) return;
    initRuntime();
    if (Module['onRuntimeInitialized']) Module['onRuntimeInitialized']();
    postRun();
  }
  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(function () {
      setTimeout(function () {
        Module['setStatus']('');
      }, 1);
      doRun();
    }, 1);
  } else {
    doRun();
  }
}
Module['run'] = run;
if (Module['preInit']) {
  if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
  while (Module['preInit'].length > 0) {
    Module['preInit'].pop()();
  }
}
Module['init'] = init;
export default Module;
