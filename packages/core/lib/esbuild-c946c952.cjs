"use strict";function Nt(he,Pe){for(var we=0;we<Pe.length;we++){const be=Pe[we];if(typeof be!="string"&&!Array.isArray(be)){for(const ve in be)if(ve!=="default"&&!(ve in he)){const $e=Object.getOwnPropertyDescriptor(be,ve);$e&&Object.defineProperty(he,ve,$e.get?$e:{enumerable:!0,get:()=>be[ve]})}}}return Object.freeze(Object.defineProperty(he,Symbol.toStringTag,{value:"Module"}))}function Mt(he){return he&&he.__esModule&&Object.prototype.hasOwnProperty.call(he,"default")?he.default:he}var We={exports:{}};(function(he){(Pe=>{var we=Object.defineProperty,be=Object.defineProperties,ve=Object.getOwnPropertyDescriptor,$e=Object.getOwnPropertyDescriptors,st=Object.getOwnPropertyNames,Le=Object.getOwnPropertySymbols,ze=Object.prototype.hasOwnProperty,it=Object.prototype.propertyIsEnumerable,Je=(e,t,r)=>t in e?we(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Ge=(e,t)=>{for(var r in t||(t={}))ze.call(t,r)&&Je(e,r,t[r]);if(Le)for(var r of Le(t))it.call(t,r)&&Je(e,r,t[r]);return e},Ye=(e,t)=>be(e,$e(t)),at=(e,t)=>{for(var r in t)we(e,r,{get:t[r],enumerable:!0})},ot=(e,t,r,f)=>{if(t&&typeof t=="object"||typeof t=="function")for(let p of st(t))!ze.call(e,p)&&p!==r&&we(e,p,{get:()=>t[p],enumerable:!(f=ve(t,p))||f.enumerable});return e},ct=e=>ot(we({},"__esModule",{value:!0}),e),ke=(e,t,r)=>new Promise((f,p)=>{var w=i=>{try{y(r.next(i))}catch(P){p(P)}},s=i=>{try{y(r.throw(i))}catch(P){p(P)}},y=i=>i.done?f(i.value):Promise.resolve(i.value).then(w,s);y((r=r.apply(e,t)).next())}),Re={};at(Re,{analyzeMetafile:()=>jt,analyzeMetafileSync:()=>Rt,build:()=>kt,buildSync:()=>Tt,default:()=>Ut,formatMessages:()=>St,formatMessagesSync:()=>Pt,initialize:()=>Dt,serve:()=>Et,transform:()=>Ot,transformSync:()=>$t,version:()=>_t}),Pe.exports=ct(Re);function He(e){let t=f=>{if(f===null)r.write8(0);else if(typeof f=="boolean")r.write8(1),r.write8(+f);else if(typeof f=="number")r.write8(2),r.write32(f|0);else if(typeof f=="string")r.write8(3),r.write(xe(f));else if(f instanceof Uint8Array)r.write8(4),r.write(f);else if(f instanceof Array){r.write8(5),r.write32(f.length);for(let p of f)t(p)}else{let p=Object.keys(f);r.write8(6),r.write32(p.length);for(let w of p)r.write(xe(w)),t(f[w])}},r=new Ke;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),t(e.value),Me(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function ut(e){let t=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return Ee(r.read());case 4:return r.read();case 5:{let s=r.read32(),y=[];for(let i=0;i<s;i++)y.push(t());return y}case 6:{let s=r.read32(),y={};for(let i=0;i<s;i++)y[Ee(r.read())]=t();return y}default:throw new Error("Invalid packet")}},r=new Ke(e),f=r.read32(),p=(f&1)===0;f>>>=1;let w=t();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:f,isRequest:p,value:w}}var Ke=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let t=new Uint8Array((this.len+e)*2);t.set(this.buf),this.buf=t}return this.len+=e,this.len-e}write8(e){let t=this._write(1);this.buf[t]=e}write32(e){let t=this._write(4);Me(this.buf,e,t)}write(e){let t=this._write(4+e.length);Me(this.buf,e.length,t),this.buf.set(e,t+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return Qe(this.buf,this._read(4))}read(){let e=this.read32(),t=new Uint8Array(e),r=this._read(t.length);return t.set(this.buf.subarray(r,r+e)),t}},xe,Ee;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,t=new TextDecoder;xe=r=>e.encode(r),Ee=r=>t.decode(r)}else if(typeof Buffer<"u")xe=e=>{let t=Buffer.from(e);return t instanceof Uint8Array||(t=new Uint8Array(t)),t},Ee=e=>{let{buffer:t,byteOffset:r,byteLength:f}=e;return Buffer.from(t,r,f).toString()};else throw new Error("No UTF-8 codec found");function Qe(e,t){return e[t++]|e[t++]<<8|e[t++]<<16|e[t++]<<24}function Me(e,t,r){e[r++]=t,e[r++]=t>>8,e[r++]=t>>16,e[r++]=t>>24}function Xe(e){if(e+="",e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var De=()=>null,Q=e=>typeof e=="boolean"?null:"a boolean",ft=e=>typeof e=="boolean"||typeof e=="object"&&!Array.isArray(e)?null:"a boolean or an object",x=e=>typeof e=="string"?null:"a string",Ce=e=>e instanceof RegExp?null:"a RegExp object",Oe=e=>typeof e=="number"&&e===(e|0)?null:"an integer",Fe=e=>typeof e=="function"?null:"a function",re=e=>Array.isArray(e)?null:"an array",ge=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",dt=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",ht=e=>typeof e=="object"&&e!==null?null:"an array or an object",qe=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",Ze=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",mt=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",gt=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",pt=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array";function l(e,t,r,f){let p=e[r];if(t[r+""]=!0,p===void 0)return;let w=f(p);if(w!==null)throw new Error(`"${r}" must be ${w}`);return p}function se(e,t,r){for(let f in e)if(!(f in t))throw new Error(`Invalid option ${r}: "${f}"`)}function wt(e){let t=Object.create(null),r=l(e,t,"wasmURL",x),f=l(e,t,"wasmModule",dt),p=l(e,t,"worker",Q);return se(e,t,"in initialize() call"),{wasmURL:r,wasmModule:f,worker:p}}function et(e){let t;if(e!==void 0){t=Object.create(null);for(let r of Object.keys(e)){let f=e[r];if(typeof f=="string"||f===!1)t[r]=f;else throw new Error(`Expected ${JSON.stringify(r)} in mangle cache to map to either a string or false`)}}return t}function Ue(e,t,r,f,p){let w=l(t,r,"color",Q),s=l(t,r,"logLevel",x),y=l(t,r,"logLimit",Oe);w!==void 0?e.push(`--color=${w}`):f&&e.push("--color=true"),e.push(`--log-level=${s||p}`),e.push(`--log-limit=${y||0}`)}function tt(e,t,r){let f=l(t,r,"legalComments",x),p=l(t,r,"sourceRoot",x),w=l(t,r,"sourcesContent",Q),s=l(t,r,"target",gt),y=l(t,r,"format",x),i=l(t,r,"globalName",x),P=l(t,r,"mangleProps",Ce),B=l(t,r,"reserveProps",Ce),S=l(t,r,"mangleQuoted",Q),m=l(t,r,"minify",Q),L=l(t,r,"minifySyntax",Q),H=l(t,r,"minifyWhitespace",Q),C=l(t,r,"minifyIdentifiers",Q),g=l(t,r,"drop",re),h=l(t,r,"charset",x),v=l(t,r,"treeShaking",Q),T=l(t,r,"ignoreAnnotations",Q),D=l(t,r,"jsx",x),U=l(t,r,"jsxFactory",x),q=l(t,r,"jsxFragment",x),n=l(t,r,"jsxImportSource",x),u=l(t,r,"jsxDev",Q),R=l(t,r,"define",ge),o=l(t,r,"logOverride",ge),c=l(t,r,"supported",ge),d=l(t,r,"pure",re),b=l(t,r,"keepNames",Q),W=l(t,r,"platform",x);if(f&&e.push(`--legal-comments=${f}`),p!==void 0&&e.push(`--source-root=${p}`),w!==void 0&&e.push(`--sources-content=${w}`),s&&(Array.isArray(s)?e.push(`--target=${Array.from(s).map(Xe).join(",")}`):e.push(`--target=${Xe(s)}`)),y&&e.push(`--format=${y}`),i&&e.push(`--global-name=${i}`),W&&e.push(`--platform=${W}`),m&&e.push("--minify"),L&&e.push("--minify-syntax"),H&&e.push("--minify-whitespace"),C&&e.push("--minify-identifiers"),h&&e.push(`--charset=${h}`),v!==void 0&&e.push(`--tree-shaking=${v}`),T&&e.push("--ignore-annotations"),g)for(let j of g)e.push(`--drop:${j}`);if(P&&e.push(`--mangle-props=${P.source}`),B&&e.push(`--reserve-props=${B.source}`),S!==void 0&&e.push(`--mangle-quoted=${S}`),D&&e.push(`--jsx=${D}`),U&&e.push(`--jsx-factory=${U}`),q&&e.push(`--jsx-fragment=${q}`),n&&e.push(`--jsx-import-source=${n}`),u&&e.push("--jsx-dev"),R)for(let j in R){if(j.indexOf("=")>=0)throw new Error(`Invalid define: ${j}`);e.push(`--define:${j}=${R[j]}`)}if(o)for(let j in o){if(j.indexOf("=")>=0)throw new Error(`Invalid log override: ${j}`);e.push(`--log-override:${j}=${o[j]}`)}if(c)for(let j in c){if(j.indexOf("=")>=0)throw new Error(`Invalid supported: ${j}`);e.push(`--supported:${j}=${c[j]}`)}if(d)for(let j of d)e.push(`--pure:${j}`);b&&e.push("--keep-names")}function yt(e,t,r,f,p){var w;let s=[],y=[],i=Object.create(null),P=null,B=null,S=null;Ue(s,t,i,r,f),tt(s,t,i);let m=l(t,i,"sourcemap",Ze),L=l(t,i,"bundle",Q),H=l(t,i,"watch",ft),C=l(t,i,"splitting",Q),g=l(t,i,"preserveSymlinks",Q),h=l(t,i,"metafile",Q),v=l(t,i,"outfile",x),T=l(t,i,"outdir",x),D=l(t,i,"outbase",x),U=l(t,i,"tsconfig",x),q=l(t,i,"resolveExtensions",re),n=l(t,i,"nodePaths",re),u=l(t,i,"mainFields",re),R=l(t,i,"conditions",re),o=l(t,i,"external",re),c=l(t,i,"loader",ge),d=l(t,i,"outExtension",ge),b=l(t,i,"publicPath",x),W=l(t,i,"entryNames",x),j=l(t,i,"chunkNames",x),F=l(t,i,"assetNames",x),I=l(t,i,"inject",re),z=l(t,i,"banner",ge),V=l(t,i,"footer",ge),$=l(t,i,"entryPoints",ht),K=l(t,i,"absWorkingDir",x),A=l(t,i,"stdin",ge),J=(w=l(t,i,"write",Q))!=null?w:p,Z=l(t,i,"allowOverwrite",Q),de=l(t,i,"incremental",Q)===!0,N=l(t,i,"mangleCache",ge);if(i.plugins=!0,se(t,i,`in ${e}() call`),m&&s.push(`--sourcemap${m===!0?"":`=${m}`}`),L&&s.push("--bundle"),Z&&s.push("--allow-overwrite"),H)if(s.push("--watch"),typeof H=="boolean")S={};else{let a=Object.create(null),k=l(H,a,"onRebuild",Fe);se(H,a,`on "watch" in ${e}() call`),S={onRebuild:k}}if(C&&s.push("--splitting"),g&&s.push("--preserve-symlinks"),h&&s.push("--metafile"),v&&s.push(`--outfile=${v}`),T&&s.push(`--outdir=${T}`),D&&s.push(`--outbase=${D}`),U&&s.push(`--tsconfig=${U}`),q){let a=[];for(let k of q){if(k+="",k.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${k}`);a.push(k)}s.push(`--resolve-extensions=${a.join(",")}`)}if(b&&s.push(`--public-path=${b}`),W&&s.push(`--entry-names=${W}`),j&&s.push(`--chunk-names=${j}`),F&&s.push(`--asset-names=${F}`),u){let a=[];for(let k of u){if(k+="",k.indexOf(",")>=0)throw new Error(`Invalid main field: ${k}`);a.push(k)}s.push(`--main-fields=${a.join(",")}`)}if(R){let a=[];for(let k of R){if(k+="",k.indexOf(",")>=0)throw new Error(`Invalid condition: ${k}`);a.push(k)}s.push(`--conditions=${a.join(",")}`)}if(o)for(let a of o)s.push(`--external:${a}`);if(z)for(let a in z){if(a.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${a}`);s.push(`--banner:${a}=${z[a]}`)}if(V)for(let a in V){if(a.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${a}`);s.push(`--footer:${a}=${V[a]}`)}if(I)for(let a of I)s.push(`--inject:${a}`);if(c)for(let a in c){if(a.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${a}`);s.push(`--loader:${a}=${c[a]}`)}if(d)for(let a in d){if(a.indexOf("=")>=0)throw new Error(`Invalid out extension: ${a}`);s.push(`--out-extension:${a}=${d[a]}`)}if($)if(Array.isArray($))for(let a of $)y.push(["",a+""]);else for(let[a,k]of Object.entries($))y.push([a+"",k+""]);if(A){let a=Object.create(null),k=l(A,a,"contents",x),X=l(A,a,"resolveDir",x),te=l(A,a,"sourcefile",x),E=l(A,a,"loader",x);se(A,a,'in "stdin" object'),te&&s.push(`--sourcefile=${te}`),E&&s.push(`--loader=${E}`),X&&(B=X+""),P=k?k+"":""}let O=[];if(n)for(let a of n)a+="",O.push(a);return{entries:y,flags:s,write:J,stdinContents:P,stdinResolveDir:B,absWorkingDir:K,incremental:de,nodePaths:O,watch:S,mangleCache:et(N)}}function bt(e,t,r,f){let p=[],w=Object.create(null);Ue(p,t,w,r,f),tt(p,t,w);let s=l(t,w,"sourcemap",Ze),y=l(t,w,"tsconfigRaw",mt),i=l(t,w,"sourcefile",x),P=l(t,w,"loader",x),B=l(t,w,"banner",x),S=l(t,w,"footer",x),m=l(t,w,"mangleCache",ge);return se(t,w,`in ${e}() call`),s&&p.push(`--sourcemap=${s===!0?"external":s}`),y&&p.push(`--tsconfig-raw=${typeof y=="string"?y:JSON.stringify(y)}`),i&&p.push(`--sourcefile=${i}`),P&&p.push(`--loader=${P}`),B&&p.push(`--banner=${B}`),S&&p.push(`--footer=${S}`),{flags:p,mangleCache:et(m)}}function vt(e){let t=new Map,r=new Map,f=new Map,p=new Map,w=null,s=0,y=0,i=new Uint8Array(16*1024),P=0,B=o=>{let c=P+o.length;if(c>i.length){let b=new Uint8Array(c*2);b.set(i),i=b}i.set(o,P),P+=o.length;let d=0;for(;d+4<=P;){let b=Qe(i,d);if(d+4+b>P)break;d+=4,g(i.subarray(d,d+b)),d+=b}d>0&&(i.copyWithin(0,d,P),P-=d)},S=o=>{w={reason:o?": "+(o.message||o):""};const c="The service was stopped"+w.reason;for(let d of t.values())d(c,null);t.clear();for(let d of p.values())d.onWait(c);p.clear();for(let d of f.values())try{d(new Error(c),null)}catch(b){console.error(b)}f.clear()},m=(o,c,d)=>{if(w)return d("The service is no longer running"+w.reason,null);let b=s++;t.set(b,(W,j)=>{try{d(W,j)}finally{o&&o.unref()}}),o&&o.ref(),e.writeToStdin(He({id:b,isRequest:!0,value:c}))},L=(o,c)=>{if(w)throw new Error("The service is no longer running"+w.reason);e.writeToStdin(He({id:o,isRequest:!1,value:c}))},H=(o,c)=>ke(this,null,function*(){try{switch(c.command){case"ping":{L(o,{});break}case"on-start":{let d=r.get(c.key);d?L(o,yield d(c)):L(o,{});break}case"on-resolve":{let d=r.get(c.key);d?L(o,yield d(c)):L(o,{});break}case"on-load":{let d=r.get(c.key);d?L(o,yield d(c)):L(o,{});break}case"serve-request":{let d=p.get(c.key);d&&d.onRequest&&d.onRequest(c.args),L(o,{});break}case"serve-wait":{let d=p.get(c.key);d&&d.onWait(c.error),L(o,{});break}case"watch-rebuild":{let d=f.get(c.key);try{d&&d(null,c.args)}catch(b){console.error(b)}L(o,{});break}default:throw new Error("Invalid command: "+c.command)}}catch(d){L(o,{errors:[Se(d,e,null,void 0,"")]})}}),C=!0,g=o=>{if(C){C=!1;let d=String.fromCharCode(...o);if(d!=="0.14.51")throw new Error(`Cannot start service: Host version "0.14.51" does not match binary version ${JSON.stringify(d)}`);return}let c=ut(o);if(c.isRequest)H(c.id,c.value);else{let d=t.get(c.id);t.delete(c.id),c.value.error?d(c.value.error,{}):d(null,c.value)}},h=(o,c,d,b,W)=>ke(this,null,function*(){let j=[],F=[],I={},z={},V=0,$=0,K=[],A=!1;c=[...c];for(let N of c){let O={};if(typeof N!="object")throw new Error(`Plugin at index ${$} must be an object`);const a=l(N,O,"name",x);if(typeof a!="string"||a==="")throw new Error(`Plugin at index ${$} is missing a name`);try{let k=l(N,O,"setup",Fe);if(typeof k!="function")throw new Error("Plugin is missing a setup function");se(N,O,`on plugin ${JSON.stringify(a)}`);let X={name:a,onResolve:[],onLoad:[]};$++;let E=k({initialOptions:o,resolve:(_,G={})=>{if(!A)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof _!="string")throw new Error("The path to resolve must be a string");let M=Object.create(null),ae=l(G,M,"pluginName",x),ee=l(G,M,"importer",x),le=l(G,M,"namespace",x),ue=l(G,M,"resolveDir",x),oe=l(G,M,"kind",x),Y=l(G,M,"pluginData",De);return se(G,M,"in resolve() call"),new Promise((ie,ce)=>{const ne={command:"resolve",path:_,key:d,pluginName:a};ae!=null&&(ne.pluginName=ae),ee!=null&&(ne.importer=ee),le!=null&&(ne.namespace=le),ue!=null&&(ne.resolveDir=ue),oe!=null&&(ne.kind=oe),Y!=null&&(ne.pluginData=b.store(Y)),m(W,ne,(pe,fe)=>{pe!==null?ce(new Error(pe)):ie({errors:ye(fe.errors,b),warnings:ye(fe.warnings,b),path:fe.path,external:fe.external,sideEffects:fe.sideEffects,namespace:fe.namespace,suffix:fe.suffix,pluginData:b.load(fe.pluginData)})})})},onStart(_){let G='This error came from the "onStart" callback registered here:',M=Ae(new Error(G),e,"onStart");j.push({name:a,callback:_,note:M})},onEnd(_){let G='This error came from the "onEnd" callback registered here:',M=Ae(new Error(G),e,"onEnd");F.push({name:a,callback:_,note:M})},onResolve(_,G){let M='This error came from the "onResolve" callback registered here:',ae=Ae(new Error(M),e,"onResolve"),ee={},le=l(_,ee,"filter",Ce),ue=l(_,ee,"namespace",x);if(se(_,ee,`in onResolve() call for plugin ${JSON.stringify(a)}`),le==null)throw new Error("onResolve() call is missing a filter");let oe=V++;I[oe]={name:a,callback:G,note:ae},X.onResolve.push({id:oe,filter:le.source,namespace:ue||""})},onLoad(_,G){let M='This error came from the "onLoad" callback registered here:',ae=Ae(new Error(M),e,"onLoad"),ee={},le=l(_,ee,"filter",Ce),ue=l(_,ee,"namespace",x);if(se(_,ee,`in onLoad() call for plugin ${JSON.stringify(a)}`),le==null)throw new Error("onLoad() call is missing a filter");let oe=V++;z[oe]={name:a,callback:G,note:ae},X.onLoad.push({id:oe,filter:le.source,namespace:ue||""})},esbuild:e.esbuild});E&&(yield E),K.push(X)}catch(k){return{ok:!1,error:k,pluginName:a}}}const J=N=>ke(this,null,function*(){switch(N.command){case"on-start":{let O={errors:[],warnings:[]};return yield Promise.all(j.map(a=>ke(this,[a],function*({name:k,callback:X,note:te}){try{let E=yield X();if(E!=null){if(typeof E!="object")throw new Error(`Expected onStart() callback in plugin ${JSON.stringify(k)} to return an object`);let _={},G=l(E,_,"errors",re),M=l(E,_,"warnings",re);se(E,_,`from onStart() callback in plugin ${JSON.stringify(k)}`),G!=null&&O.errors.push(..._e(G,"errors",b,k)),M!=null&&O.warnings.push(..._e(M,"warnings",b,k))}}catch(E){O.errors.push(Se(E,e,b,te&&te(),k))}}))),O}case"on-resolve":{let O={},a="",k,X;for(let te of N.ids)try{({name:a,callback:k,note:X}=I[te]);let E=yield k({path:N.path,importer:N.importer,namespace:N.namespace,resolveDir:N.resolveDir,kind:N.kind,pluginData:b.load(N.pluginData)});if(E!=null){if(typeof E!="object")throw new Error(`Expected onResolve() callback in plugin ${JSON.stringify(a)} to return an object`);let _={},G=l(E,_,"pluginName",x),M=l(E,_,"path",x),ae=l(E,_,"namespace",x),ee=l(E,_,"suffix",x),le=l(E,_,"external",Q),ue=l(E,_,"sideEffects",Q),oe=l(E,_,"pluginData",De),Y=l(E,_,"errors",re),ie=l(E,_,"warnings",re),ce=l(E,_,"watchFiles",re),ne=l(E,_,"watchDirs",re);se(E,_,`from onResolve() callback in plugin ${JSON.stringify(a)}`),O.id=te,G!=null&&(O.pluginName=G),M!=null&&(O.path=M),ae!=null&&(O.namespace=ae),ee!=null&&(O.suffix=ee),le!=null&&(O.external=le),ue!=null&&(O.sideEffects=ue),oe!=null&&(O.pluginData=b.store(oe)),Y!=null&&(O.errors=_e(Y,"errors",b,a)),ie!=null&&(O.warnings=_e(ie,"warnings",b,a)),ce!=null&&(O.watchFiles=Ie(ce,"watchFiles")),ne!=null&&(O.watchDirs=Ie(ne,"watchDirs"));break}}catch(E){return{id:te,errors:[Se(E,e,b,X&&X(),a)]}}return O}case"on-load":{let O={},a="",k,X;for(let te of N.ids)try{({name:a,callback:k,note:X}=z[te]);let E=yield k({path:N.path,namespace:N.namespace,suffix:N.suffix,pluginData:b.load(N.pluginData)});if(E!=null){if(typeof E!="object")throw new Error(`Expected onLoad() callback in plugin ${JSON.stringify(a)} to return an object`);let _={},G=l(E,_,"pluginName",x),M=l(E,_,"contents",pt),ae=l(E,_,"resolveDir",x),ee=l(E,_,"pluginData",De),le=l(E,_,"loader",x),ue=l(E,_,"errors",re),oe=l(E,_,"warnings",re),Y=l(E,_,"watchFiles",re),ie=l(E,_,"watchDirs",re);se(E,_,`from onLoad() callback in plugin ${JSON.stringify(a)}`),O.id=te,G!=null&&(O.pluginName=G),M instanceof Uint8Array?O.contents=M:M!=null&&(O.contents=xe(M)),ae!=null&&(O.resolveDir=ae),ee!=null&&(O.pluginData=b.store(ee)),le!=null&&(O.loader=le),ue!=null&&(O.errors=_e(ue,"errors",b,a)),oe!=null&&(O.warnings=_e(oe,"warnings",b,a)),Y!=null&&(O.watchFiles=Ie(Y,"watchFiles")),ie!=null&&(O.watchDirs=Ie(ie,"watchDirs"));break}}catch(E){return{id:te,errors:[Se(E,e,b,X&&X(),a)]}}return O}default:throw new Error("Invalid command: "+N.command)}});let Z=(N,O,a)=>a();F.length>0&&(Z=(N,O,a)=>{(()=>ke(this,null,function*(){for(const{name:k,callback:X,note:te}of F)try{yield X(N)}catch(E){N.errors.push(yield new Promise(_=>O(E,k,te&&te(),_)))}}))().then(a)}),A=!0;let de=0;return{ok:!0,requestPlugins:K,runOnEndCallbacks:Z,pluginRefs:{ref(){++de===1&&r.set(d,J)},unref(){--de===0&&r.delete(d)}}}}),v=(o,c,d,b)=>{let W={},j=l(c,W,"port",Oe),F=l(c,W,"host",x),I=l(c,W,"servedir",x),z=l(c,W,"onRequest",Fe),V,$=new Promise((K,A)=>{V=J=>{p.delete(b),J!==null?A(new Error(J)):K()}});return d.serve={},se(c,W,"in serve() call"),j!==void 0&&(d.serve.port=j),F!==void 0&&(d.serve.host=F),I!==void 0&&(d.serve.servedir=I),p.set(b,{onRequest:z,onWait:V}),{wait:$,stop(){m(o,{command:"serve-stop",key:b},()=>{})}}};const T="warning",D="silent";let U=o=>{let c=y++;const d=nt();let b,{refs:W,options:j,isTTY:F,callback:I}=o;if(typeof j=="object"){let $=j.plugins;if($!==void 0){if(!Array.isArray($))throw new Error('"plugins" must be an array');b=$}}let z=($,K,A,J)=>{let Z=[];try{Ue(Z,j,{},F,T)}catch{}const de=Se($,e,d,A,K);m(W,{command:"error",flags:Z,error:de},()=>{de.detail=d.load(de.detail),J(de)})},V=($,K)=>{z($,K,void 0,A=>{I(je("Build failed",[A],[]),null)})};if(b&&b.length>0){if(e.isSync)return V(new Error("Cannot use plugins in synchronous API calls"),"");h(j,b,c,d,W).then($=>{if(!$.ok)V($.error,$.pluginName);else try{q(Ye(Ge({},o),{key:c,details:d,logPluginError:z,requestPlugins:$.requestPlugins,runOnEndCallbacks:$.runOnEndCallbacks,pluginRefs:$.pluginRefs}))}catch(K){V(K,"")}},$=>V($,""))}else try{q(Ye(Ge({},o),{key:c,details:d,logPluginError:z,requestPlugins:null,runOnEndCallbacks:($,K,A)=>A(),pluginRefs:null}))}catch($){V($,"")}},q=({callName:o,refs:c,serveOptions:d,options:b,isTTY:W,defaultWD:j,callback:F,key:I,details:z,logPluginError:V,requestPlugins:$,runOnEndCallbacks:K,pluginRefs:A})=>{const J={ref(){A&&A.ref(),c&&c.ref()},unref(){A&&A.unref(),c&&c.unref()}};let Z=!e.isWriteUnavailable,{entries:de,flags:N,write:O,stdinContents:a,stdinResolveDir:k,absWorkingDir:X,incremental:te,nodePaths:E,watch:_,mangleCache:G}=yt(o,b,W,T,Z),M={command:"build",key:I,entries:de,flags:N,write:O,stdinContents:a,stdinResolveDir:k,absWorkingDir:X||j,incremental:te,nodePaths:E};$&&(M.plugins=$),G&&(M.mangleCache=G);let ae=d&&v(J,d,M,I),ee,le,ue=(Y,ie)=>{Y.outputFiles&&(ie.outputFiles=Y.outputFiles.map(xt)),Y.metafile&&(ie.metafile=JSON.parse(Y.metafile)),Y.mangleCache&&(ie.mangleCache=Y.mangleCache),Y.writeToStdout!==void 0&&console.log(Ee(Y.writeToStdout).replace(/\n$/,""))},oe=(Y,ie)=>{let ce={errors:ye(Y.errors,z),warnings:ye(Y.warnings,z)};ue(Y,ce),K(ce,V,()=>{if(ce.errors.length>0)return ie(je("Build failed",ce.errors,ce.warnings),null);if(Y.rebuild){if(!ee){let ne=!1;ee=()=>new Promise((pe,fe)=>{if(ne||w)throw new Error("Cannot rebuild");m(J,{command:"rebuild",key:I},(me,At)=>{if(me)return ie(je("Build failed",[{id:"",pluginName:"",text:me,location:null,notes:[],detail:void 0}],[]),null);oe(At,(Be,It)=>{Be?fe(Be):pe(It)})})}),J.ref(),ee.dispose=()=>{ne||(ne=!0,m(J,{command:"rebuild-dispose",key:I},()=>{}),J.unref())}}ce.rebuild=ee}if(Y.watch){if(!le){let ne=!1;J.ref(),le=()=>{ne||(ne=!0,f.delete(I),m(J,{command:"watch-stop",key:I},()=>{}),J.unref())},_&&f.set(I,(pe,fe)=>{if(pe){_.onRebuild&&_.onRebuild(pe,null);return}let me={errors:ye(fe.errors,z),warnings:ye(fe.warnings,z)};ue(fe,me),K(me,V,()=>{if(me.errors.length>0){_.onRebuild&&_.onRebuild(je("Build failed",me.errors,me.warnings),null);return}fe.rebuildID!==void 0&&(me.rebuild=ee),me.stop=le,_.onRebuild&&_.onRebuild(null,me)})})}ce.stop=le}ie(null,ce)})};if(O&&e.isWriteUnavailable)throw new Error('The "write" option is unavailable in this environment');if(te&&e.isSync)throw new Error('Cannot use "incremental" with a synchronous build');if(_&&e.isSync)throw new Error('Cannot use "watch" with a synchronous build');m(J,M,(Y,ie)=>{if(Y)return F(new Error(Y),null);if(ae){let ce=ie,ne=!1;J.ref();let pe={port:ce.port,host:ce.host,wait:ae.wait,stop(){ne||(ne=!0,ae.stop(),J.unref())}};return J.ref(),ae.wait.then(J.unref,J.unref),F(null,pe)}return oe(ie,F)})};return{readFromStdout:B,afterClose:S,service:{buildOrServe:U,transform:({callName:o,refs:c,input:d,options:b,isTTY:W,fs:j,callback:F})=>{const I=nt();let z=V=>{try{if(typeof d!="string")throw new Error('The input to "transform" must be a string');let{flags:$,mangleCache:K}=bt(o,b,W,D),A={command:"transform",flags:$,inputFS:V!==null,input:V!==null?V:d};K&&(A.mangleCache=K),m(c,A,(J,Z)=>{if(J)return F(new Error(J),null);let de=ye(Z.errors,I),N=ye(Z.warnings,I),O=1,a=()=>{if(--O===0){let k={warnings:N,code:Z.code,map:Z.map};Z.mangleCache&&(k.mangleCache=Z?.mangleCache),F(null,k)}};if(de.length>0)return F(je("Transform failed",de,N),null);Z.codeFS&&(O++,j.readFile(Z.code,(k,X)=>{k!==null?F(k,null):(Z.code=X,a())})),Z.mapFS&&(O++,j.readFile(Z.map,(k,X)=>{k!==null?F(k,null):(Z.map=X,a())})),a()})}catch($){let K=[];try{Ue(K,b,{},W,D)}catch{}const A=Se($,e,I,void 0,"");m(c,{command:"error",flags:K,error:A},()=>{A.detail=I.load(A.detail),F(je("Transform failed",[A],[]),null)})}};if(typeof d=="string"&&d.length>1024*1024){let V=z;z=()=>j.writeFile(d,V)}z(null)},formatMessages:({callName:o,refs:c,messages:d,options:b,callback:W})=>{let j=_e(d,"messages",null,"");if(!b)throw new Error(`Missing second argument in ${o}() call`);let F={},I=l(b,F,"kind",x),z=l(b,F,"color",Q),V=l(b,F,"terminalWidth",Oe);if(se(b,F,`in ${o}() call`),I===void 0)throw new Error(`Missing "kind" in ${o}() call`);if(I!=="error"&&I!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${o}() call`);let $={command:"format-msgs",messages:j,isWarning:I==="warning"};z!==void 0&&($.color=z),V!==void 0&&($.terminalWidth=V),m(c,$,(K,A)=>{if(K)return W(new Error(K),null);W(null,A.messages)})},analyzeMetafile:({callName:o,refs:c,metafile:d,options:b,callback:W})=>{b===void 0&&(b={});let j={},F=l(b,j,"color",Q),I=l(b,j,"verbose",Q);se(b,j,`in ${o}() call`);let z={command:"analyze-metafile",metafile:d};F!==void 0&&(z.color=F),I!==void 0&&(z.verbose=I),m(c,z,(V,$)=>{if(V)return W(new Error(V),null);W(null,$.result)})}}}}function nt(){const e=new Map;let t=0;return{load(r){return e.get(r)},store(r){if(r===void 0)return-1;const f=t++;return e.set(f,r),f}}}function Ae(e,t,r){let f,p=!1;return()=>{if(p)return f;p=!0;try{let w=(e.stack+"").split(`
`);w.splice(1,1);let s=rt(t,w,r);if(s)return f={text:e.message,location:s},f}catch{}}}function Se(e,t,r,f,p){let w="Internal error",s=null;try{w=(e&&e.message||e)+""}catch{}try{s=rt(t,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:p,text:w,location:s,notes:f?[f]:[],detail:r?r.store(e):-1}}function rt(e,t,r){let f="    at ";if(e.readFileSync&&!t[0].startsWith(f)&&t[1].startsWith(f))for(let p=1;p<t.length;p++){let w=t[p];if(!!w.startsWith(f))for(w=w.slice(f.length);;){let s=/^(?:new |async )?\S+ \((.*)\)$/.exec(w);if(s){w=s[1];continue}if(s=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(w),s){w=s[1];continue}if(s=/^(\S+):(\d+):(\d+)$/.exec(w),s){let y;try{y=e.readFileSync(s[1],"utf8")}catch{break}let i=y.split(/\r\n|\r|\n|\u2028|\u2029/)[+s[2]-1]||"",P=+s[3]-1,B=i.slice(P,P+r.length)===r?r.length:0;return{file:s[1],namespace:"file",line:+s[2],column:xe(i.slice(0,P)).length,length:xe(i.slice(P,P+B)).length,lineText:i+`
`+t.slice(1).join(`
`),suggestion:""}}break}}return null}function je(e,t,r){let f=5,p=t.length<1?"":` with ${t.length} error${t.length<2?"":"s"}:`+t.slice(0,f+1).map((s,y)=>{if(y===f)return`
...`;if(!s.location)return`
	error: ${s.text}`;let{file:i,line:P,column:B}=s.location,S=s.pluginName?`[plugin: ${s.pluginName}] `:"";return`
	${i}:${P}:${B}: ERROR: ${S}${s.text}`}).join(""),w=new Error(`${e}${p}`);return w.errors=t,w.warnings=r,w}function ye(e,t){for(const r of e)r.detail=t.load(r.detail);return e}function lt(e,t){if(e==null)return null;let r={},f=l(e,r,"file",x),p=l(e,r,"namespace",x),w=l(e,r,"line",Oe),s=l(e,r,"column",Oe),y=l(e,r,"length",Oe),i=l(e,r,"lineText",x),P=l(e,r,"suggestion",x);return se(e,r,t),{file:f||"",namespace:p||"",line:w||0,column:s||0,length:y||0,lineText:i||"",suggestion:P||""}}function _e(e,t,r,f){let p=[],w=0;for(const s of e){let y={},i=l(s,y,"id",x),P=l(s,y,"pluginName",x),B=l(s,y,"text",x),S=l(s,y,"location",qe),m=l(s,y,"notes",re),L=l(s,y,"detail",De),H=`in element ${w} of "${t}"`;se(s,y,H);let C=[];if(m)for(const g of m){let h={},v=l(g,h,"text",x),T=l(g,h,"location",qe);se(g,h,H),C.push({text:v||"",location:lt(T,H)})}p.push({id:i||"",pluginName:P||f,text:B||"",location:lt(S,H),notes:C,detail:r?r.store(L):-1}),w++}return p}function Ie(e,t){const r=[];for(const f of e){if(typeof f!="string")throw new Error(`${JSON.stringify(t)} must be an array of strings`);r.push(f)}return r}function xt({path:e,contents:t}){let r=null;return{path:e,contents:t,get text(){return r===null&&(r=Ee(t)),r}}}var _t="0.14.51",kt=e=>Ne().build(e),Et=()=>{throw new Error('The "serve" API only works in node')},Ot=(e,t)=>Ne().transform(e,t),St=(e,t)=>Ne().formatMessages(e,t),jt=(e,t)=>Ne().analyzeMetafile(e,t),Tt=()=>{throw new Error('The "buildSync" API only works in node')},$t=()=>{throw new Error('The "transformSync" API only works in node')},Pt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},Rt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Te,Ve,Ne=()=>{if(Ve)return Ve;throw Te?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Dt=e=>{e=wt(e||{});let t=e.wasmURL,r=e.wasmModule,f=e.worker!==!1;if(!t&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(Te)throw new Error('Cannot call "initialize" more than once');return Te=Ct(t||"",r,f),Te.catch(()=>{Te=void 0}),Te},Ct=(e,t,r)=>ke(void 0,null,function*(){let f;if(t)f=t;else{let y=yield fetch(e);if(!y.ok)throw new Error(`Failed to download ${JSON.stringify(e)}`);f=yield y.arrayBuffer()}let p;if(r){let y=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substr(0, nl));
                outputBuf = outputBuf.substr(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              go: {
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = new Date().getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8) + 1
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1)
              console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin)
              resumeStdin();
          }
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.14.51"}\`];
        if (wasm instanceof WebAssembly.Module) {
          WebAssembly.instantiate(wasm, go.importObject).then((instance) => go.run(instance));
        } else {
          WebAssembly.instantiate(wasm, go.importObject).then(({ instance }) => go.run(instance));
        }
      };
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});p=new Worker(URL.createObjectURL(y))}else{let y=(i=>{var P=(m,L,H)=>new Promise((C,g)=>{var h=D=>{try{T(H.next(D))}catch(U){g(U)}},v=D=>{try{T(H.throw(D))}catch(U){g(U)}},T=D=>D.done?C(D.value):Promise.resolve(D.value).then(h,v);T((H=H.apply(m,L)).next())});let B,S={};for(let m=self;m;m=Object.getPrototypeOf(m))for(let L of Object.getOwnPropertyNames(m))L in S||Object.defineProperty(S,L,{get:()=>self[L]});return(()=>{const m=()=>{const C=new Error("not implemented");return C.code="ENOSYS",C};if(!S.fs){let C="";S.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(g,h){C+=H.decode(h);const v=C.lastIndexOf(`
`);return v!=-1&&(console.log(C.substr(0,v)),C=C.substr(v+1)),h.length},write(g,h,v,T,D,U){if(v!==0||T!==h.length||D!==null){U(m());return}const q=this.writeSync(g,h);U(null,q)},chmod(g,h,v){v(m())},chown(g,h,v,T){T(m())},close(g,h){h(m())},fchmod(g,h,v){v(m())},fchown(g,h,v,T){T(m())},fstat(g,h){h(m())},fsync(g,h){h(null)},ftruncate(g,h,v){v(m())},lchown(g,h,v,T){T(m())},link(g,h,v){v(m())},lstat(g,h){h(m())},mkdir(g,h,v){v(m())},open(g,h,v,T){T(m())},read(g,h,v,T,D,U){U(m())},readdir(g,h){h(m())},readlink(g,h){h(m())},rename(g,h,v){v(m())},rmdir(g,h){h(m())},stat(g,h){h(m())},symlink(g,h,v){v(m())},truncate(g,h,v){v(m())},unlink(g,h){h(m())},utimes(g,h,v,T){T(m())}}}if(S.process||(S.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw m()},pid:-1,ppid:-1,umask(){throw m()},cwd(){throw m()},chdir(){throw m()}}),!S.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!S.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!S.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!S.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const L=new TextEncoder("utf-8"),H=new TextDecoder("utf-8");S.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=n=>{n!==0&&console.warn("exit code:",n)},this._exitPromise=new Promise(n=>{this._resolveExitPromise=n}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const C=(n,u)=>{this.mem.setUint32(n+0,u,!0),this.mem.setUint32(n+4,Math.floor(u/4294967296),!0)},g=n=>{const u=this.mem.getUint32(n+0,!0),R=this.mem.getInt32(n+4,!0);return u+R*4294967296},h=n=>{const u=this.mem.getFloat64(n,!0);if(u===0)return;if(!isNaN(u))return u;const R=this.mem.getUint32(n,!0);return this._values[R]},v=(n,u)=>{if(typeof u=="number"&&u!==0){if(isNaN(u)){this.mem.setUint32(n+4,2146959360,!0),this.mem.setUint32(n,0,!0);return}this.mem.setFloat64(n,u,!0);return}if(u===void 0){this.mem.setFloat64(n,0,!0);return}let o=this._ids.get(u);o===void 0&&(o=this._idPool.pop(),o===void 0&&(o=this._values.length),this._values[o]=u,this._goRefCounts[o]=0,this._ids.set(u,o)),this._goRefCounts[o]++;let c=0;switch(typeof u){case"object":u!==null&&(c=1);break;case"string":c=2;break;case"symbol":c=3;break;case"function":c=4;break}this.mem.setUint32(n+4,2146959360|c,!0),this.mem.setUint32(n,o,!0)},T=n=>{const u=g(n+0),R=g(n+8);return new Uint8Array(this._inst.exports.mem.buffer,u,R)},D=n=>{const u=g(n+0),R=g(n+8),o=new Array(R);for(let c=0;c<R;c++)o[c]=h(u+c*8);return o},U=n=>{const u=g(n+0),R=g(n+8);return H.decode(new DataView(this._inst.exports.mem.buffer,u,R))},q=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":n=>{n>>>=0;const u=this.mem.getInt32(n+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(u)},"runtime.wasmWrite":n=>{n>>>=0;const u=g(n+8),R=g(n+16),o=this.mem.getInt32(n+24,!0);S.fs.writeSync(u,new Uint8Array(this._inst.exports.mem.buffer,R,o))},"runtime.resetMemoryDataView":n=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":n=>{n>>>=0,C(n+8,(q+performance.now())*1e6)},"runtime.walltime":n=>{n>>>=0;const u=new Date().getTime();C(n+8,u/1e3),this.mem.setInt32(n+16,u%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":n=>{n>>>=0;const u=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(u,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(u);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},g(n+8)+1)),this.mem.setInt32(n+16,u,!0)},"runtime.clearTimeoutEvent":n=>{n>>>=0;const u=this.mem.getInt32(n+8,!0);clearTimeout(this._scheduledTimeouts.get(u)),this._scheduledTimeouts.delete(u)},"runtime.getRandomData":n=>{n>>>=0,crypto.getRandomValues(T(n+8))},"syscall/js.finalizeRef":n=>{n>>>=0;const u=this.mem.getUint32(n+8,!0);if(this._goRefCounts[u]--,this._goRefCounts[u]===0){const R=this._values[u];this._values[u]=null,this._ids.delete(R),this._idPool.push(u)}},"syscall/js.stringVal":n=>{n>>>=0,v(n+24,U(n+8))},"syscall/js.valueGet":n=>{n>>>=0;const u=Reflect.get(h(n+8),U(n+16));n=this._inst.exports.getsp()>>>0,v(n+32,u)},"syscall/js.valueSet":n=>{n>>>=0,Reflect.set(h(n+8),U(n+16),h(n+32))},"syscall/js.valueDelete":n=>{n>>>=0,Reflect.deleteProperty(h(n+8),U(n+16))},"syscall/js.valueIndex":n=>{n>>>=0,v(n+24,Reflect.get(h(n+8),g(n+16)))},"syscall/js.valueSetIndex":n=>{n>>>=0,Reflect.set(h(n+8),g(n+16),h(n+24))},"syscall/js.valueCall":n=>{n>>>=0;try{const u=h(n+8),R=Reflect.get(u,U(n+16)),o=D(n+32),c=Reflect.apply(R,u,o);n=this._inst.exports.getsp()>>>0,v(n+56,c),this.mem.setUint8(n+64,1)}catch(u){n=this._inst.exports.getsp()>>>0,v(n+56,u),this.mem.setUint8(n+64,0)}},"syscall/js.valueInvoke":n=>{n>>>=0;try{const u=h(n+8),R=D(n+16),o=Reflect.apply(u,void 0,R);n=this._inst.exports.getsp()>>>0,v(n+40,o),this.mem.setUint8(n+48,1)}catch(u){n=this._inst.exports.getsp()>>>0,v(n+40,u),this.mem.setUint8(n+48,0)}},"syscall/js.valueNew":n=>{n>>>=0;try{const u=h(n+8),R=D(n+16),o=Reflect.construct(u,R);n=this._inst.exports.getsp()>>>0,v(n+40,o),this.mem.setUint8(n+48,1)}catch(u){n=this._inst.exports.getsp()>>>0,v(n+40,u),this.mem.setUint8(n+48,0)}},"syscall/js.valueLength":n=>{n>>>=0,C(n+16,parseInt(h(n+8).length))},"syscall/js.valuePrepareString":n=>{n>>>=0;const u=L.encode(String(h(n+8)));v(n+16,u),C(n+24,u.length)},"syscall/js.valueLoadString":n=>{n>>>=0;const u=h(n+8);T(n+16).set(u)},"syscall/js.valueInstanceOf":n=>{n>>>=0,this.mem.setUint8(n+24,h(n+8)instanceof h(n+16)?1:0)},"syscall/js.copyBytesToGo":n=>{n>>>=0;const u=T(n+8),R=h(n+32);if(!(R instanceof Uint8Array||R instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const o=R.subarray(0,u.length);u.set(o),C(n+40,o.length),this.mem.setUint8(n+48,1)},"syscall/js.copyBytesToJS":n=>{n>>>=0;const u=h(n+8),R=T(n+16);if(!(u instanceof Uint8Array||u instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const o=R.subarray(0,u.length);u.set(o),C(n+40,o.length),this.mem.setUint8(n+48,1)},debug:n=>{console.log(n)}}}}run(C){return P(this,null,function*(){if(!(C instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=C,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,S,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[S,5],[this,6]]),this._idPool=[],this.exited=!1;let g=4096;const h=n=>{const u=g,R=L.encode(n+"\0");return new Uint8Array(this.mem.buffer,g,R.length).set(R),g+=R.length,g%8!==0&&(g+=8-g%8),u},v=this.argv.length,T=[];this.argv.forEach(n=>{T.push(h(n))}),T.push(0),Object.keys(this.env).sort().forEach(n=>{T.push(h(`${n}=${this.env[n]}`))}),T.push(0);const U=g;T.forEach(n=>{this.mem.setUint32(g,n,!0),this.mem.setUint32(g+4,0,!0),g+=8});const q=4096+8192;if(g>=q)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(v,U),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(C){const g=this;return function(){const h={id:C,this:this,args:arguments};return g._pendingEvent=h,g._resume(),h.result}}}})(),B=({data:m})=>{let L=new TextDecoder,H=S.fs,C="";H.writeSync=(D,U)=>{if(D===1)i(U);else if(D===2){C+=L.decode(U);let q=C.split(`
`);q.length>1&&console.log(q.slice(0,-1).join(`
`)),C=q[q.length-1]}else throw new Error("Bad write");return U.length};let g=[],h,v=0;B=({data:D})=>{D.length>0&&(g.push(D),h&&h())},H.read=(D,U,q,n,u,R)=>{if(D!==0||q!==0||n!==U.length||u!==null)throw new Error("Bad read");if(g.length===0){h=()=>H.read(D,U,q,n,u,R);return}let o=g[0],c=Math.max(0,Math.min(n,o.length-v));U.set(o.subarray(v,v+c),q),v+=c,v===o.length&&(g.shift(),v=0),R(null,c)};let T=new S.Go;T.argv=["","--service=0.14.51"],m instanceof WebAssembly.Module?WebAssembly.instantiate(m,T.importObject).then(D=>T.run(D)):WebAssembly.instantiate(m,T.importObject).then(({instance:D})=>T.run(D))},m=>B(m)})(i=>p.onmessage({data:i}));p={onmessage:null,postMessage:i=>setTimeout(()=>y({data:i})),terminate(){}}}p.postMessage(f),p.onmessage=({data:y})=>w(y);let{readFromStdout:w,service:s}=vt({writeToStdin(y){p.postMessage(y)},isSync:!1,isWriteUnavailable:!0,esbuild:Re});Ve={build:y=>new Promise((i,P)=>s.buildOrServe({callName:"build",refs:null,serveOptions:null,options:y,isTTY:!1,defaultWD:"/",callback:(B,S)=>B?P(B):i(S)})),transform:(y,i)=>new Promise((P,B)=>s.transform({callName:"transform",refs:null,input:y,options:i||{},isTTY:!1,fs:{readFile(S,m){m(new Error("Internal error"),null)},writeFile(S,m){m(null)}},callback:(S,m)=>S?B(S):P(m)})),formatMessages:(y,i)=>new Promise((P,B)=>s.formatMessages({callName:"formatMessages",refs:null,messages:y,options:i,callback:(S,m)=>S?B(S):P(m)})),analyzeMetafile:(y,i)=>new Promise((P,B)=>s.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof y=="string"?y:JSON.stringify(y),options:i,callback:(S,m)=>S?B(S):P(m)}))}}),Ut=Re})(he)})(We);const Ft=Mt(We.exports),Vt=Nt({__proto__:null,default:Ft},[We.exports]);exports.browser=Vt;
//# sourceMappingURL=esbuild-c946c952.cjs.map
