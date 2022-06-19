"use strict";var Nt=require("./index.js");function Mt(je,Ie){return Ie.forEach(function(he){he&&typeof he!="string"&&!Array.isArray(he)&&Object.keys(he).forEach(function(ye){if(ye!=="default"&&!(ye in je)){var Te=Object.getOwnPropertyDescriptor(he,ye);Object.defineProperty(je,ye,Te.get?Te:{enumerable:!0,get:function(){return he[ye]}})}})}),Object.freeze(Object.defineProperty(je,Symbol.toStringTag,{value:"Module"}))}var Be={exports:{}};(function(je){(Ie=>{var he=Object.defineProperty,ye=Object.defineProperties,Te=Object.getOwnPropertyDescriptor,lt=Object.getOwnPropertyDescriptors,st=Object.getOwnPropertyNames,Le=Object.getOwnPropertySymbols,We=Object.prototype.hasOwnProperty,it=Object.prototype.propertyIsEnumerable,ze=(e,t,r)=>t in e?he(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Je=(e,t)=>{for(var r in t||(t={}))We.call(t,r)&&ze(e,r,t[r]);if(Le)for(var r of Le(t))it.call(t,r)&&ze(e,r,t[r]);return e},Ge=(e,t)=>ye(e,lt(t)),at=(e,t)=>{for(var r in t)he(e,r,{get:t[r],enumerable:!0})},ot=(e,t,r,u)=>{if(t&&typeof t=="object"||typeof t=="function")for(let p of st(t))!We.call(e,p)&&p!==r&&he(e,p,{get:()=>t[p],enumerable:!(u=Te(t,p))||u.enumerable});return e},ct=e=>ot(he({},"__esModule",{value:!0}),e),xe=(e,t,r)=>new Promise((u,p)=>{var w=a=>{try{y(r.next(a))}catch(T){p(T)}},i=a=>{try{y(r.throw(a))}catch(T){p(T)}},y=a=>a.done?u(a.value):Promise.resolve(a.value).then(w,i);y((r=r.apply(e,t)).next())}),$e={};at($e,{analyzeMetafile:()=>jt,analyzeMetafileSync:()=>Rt,build:()=>kt,buildSync:()=>Tt,default:()=>At,formatMessages:()=>St,formatMessagesSync:()=>Pt,initialize:()=>Dt,serve:()=>Et,transform:()=>Ot,transformSync:()=>$t,version:()=>_t}),Ie.exports=ct($e);function Ye(e){let t=u=>{if(u===null)r.write8(0);else if(typeof u=="boolean")r.write8(1),r.write8(+u);else if(typeof u=="number")r.write8(2),r.write32(u|0);else if(typeof u=="string")r.write8(3),r.write(be(u));else if(u instanceof Uint8Array)r.write8(4),r.write(u);else if(u instanceof Array){r.write8(5),r.write32(u.length);for(let p of u)t(p)}else{let p=Object.keys(u);r.write8(6),r.write32(p.length);for(let w of p)r.write(be(w)),t(u[w])}},r=new He;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),t(e.value),Ne(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function ut(e){let t=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return _e(r.read());case 4:return r.read();case 5:{let i=r.read32(),y=[];for(let a=0;a<i;a++)y.push(t());return y}case 6:{let i=r.read32(),y={};for(let a=0;a<i;a++)y[_e(r.read())]=t();return y}default:throw new Error("Invalid packet")}},r=new He(e),u=r.read32(),p=(u&1)===0;u>>>=1;let w=t();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:u,isRequest:p,value:w}}var He=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let t=new Uint8Array((this.len+e)*2);t.set(this.buf),this.buf=t}return this.len+=e,this.len-e}write8(e){let t=this._write(1);this.buf[t]=e}write32(e){let t=this._write(4);Ne(this.buf,e,t)}write(e){let t=this._write(4+e.length);Ne(this.buf,e.length,t),this.buf.set(e,t+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return qe(this.buf,this._read(4))}read(){let e=this.read32(),t=new Uint8Array(e),r=this._read(t.length);return t.set(this.buf.subarray(r,r+e)),t}},be,_e;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,t=new TextDecoder;be=r=>e.encode(r),_e=r=>t.decode(r)}else if(typeof Buffer<"u")be=e=>{let t=Buffer.from(e);return t instanceof Uint8Array||(t=new Uint8Array(t)),t},_e=e=>{let{buffer:t,byteOffset:r,byteLength:u}=e;return Buffer.from(t,r,u).toString()};else throw new Error("No UTF-8 codec found");function qe(e,t){return e[t++]|e[t++]<<8|e[t++]<<16|e[t++]<<24}function Ne(e,t,r){e[r++]=t,e[r++]=t>>8,e[r++]=t>>16,e[r++]=t>>24}function Ke(e){if(e+="",e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var Pe=()=>null,Q=e=>typeof e=="boolean"?null:"a boolean",ft=e=>typeof e=="boolean"||typeof e=="object"&&!Array.isArray(e)?null:"a boolean or an object",_=e=>typeof e=="string"?null:"a string",Re=e=>e instanceof RegExp?null:"a RegExp object",ke=e=>typeof e=="number"&&e===(e|0)?null:"an integer",Me=e=>typeof e=="function"?null:"a function",re=e=>Array.isArray(e)?null:"an array",ge=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",dt=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",ht=e=>typeof e=="object"&&e!==null?null:"an array or an object",Qe=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",Xe=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",mt=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",gt=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",pt=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array";function l(e,t,r,u){let p=e[r];if(t[r+""]=!0,p===void 0)return;let w=u(p);if(w!==null)throw new Error(`"${r}" must be ${w}`);return p}function se(e,t,r){for(let u in e)if(!(u in t))throw new Error(`Invalid option ${r}: "${u}"`)}function wt(e){let t=Object.create(null),r=l(e,t,"wasmURL",_),u=l(e,t,"wasmModule",dt),p=l(e,t,"worker",Q);return se(e,t,"in initialize() call"),{wasmURL:r,wasmModule:u,worker:p}}function Ze(e){let t;if(e!==void 0){t=Object.create(null);for(let r of Object.keys(e)){let u=e[r];if(typeof u=="string"||u===!1)t[r]=u;else throw new Error(`Expected ${JSON.stringify(r)} in mangle cache to map to either a string or false`)}}return t}function De(e,t,r,u,p){let w=l(t,r,"color",Q),i=l(t,r,"logLevel",_),y=l(t,r,"logLimit",ke);w!==void 0?e.push(`--color=${w}`):u&&e.push("--color=true"),e.push(`--log-level=${i||p}`),e.push(`--log-limit=${y||0}`)}function et(e,t,r){let u=l(t,r,"legalComments",_),p=l(t,r,"sourceRoot",_),w=l(t,r,"sourcesContent",Q),i=l(t,r,"target",gt),y=l(t,r,"format",_),a=l(t,r,"globalName",_),T=l(t,r,"mangleProps",Re),B=l(t,r,"reserveProps",Re),O=l(t,r,"mangleQuoted",Q),m=l(t,r,"minify",Q),L=l(t,r,"minifySyntax",Q),K=l(t,r,"minifyWhitespace",Q),C=l(t,r,"minifyIdentifiers",Q),g=l(t,r,"drop",re),d=l(t,r,"charset",_),v=l(t,r,"treeShaking",Q),S=l(t,r,"ignoreAnnotations",Q),D=l(t,r,"jsx",_),A=l(t,r,"jsxFactory",_),X=l(t,r,"jsxFragment",_),n=l(t,r,"define",ge),o=l(t,r,"logOverride",ge),$=l(t,r,"supported",ge),c=l(t,r,"pure",re),f=l(t,r,"keepNames",Q);if(u&&e.push(`--legal-comments=${u}`),p!==void 0&&e.push(`--source-root=${p}`),w!==void 0&&e.push(`--sources-content=${w}`),i&&(Array.isArray(i)?e.push(`--target=${Array.from(i).map(Ke).join(",")}`):e.push(`--target=${Ke(i)}`)),y&&e.push(`--format=${y}`),a&&e.push(`--global-name=${a}`),m&&e.push("--minify"),L&&e.push("--minify-syntax"),K&&e.push("--minify-whitespace"),C&&e.push("--minify-identifiers"),d&&e.push(`--charset=${d}`),v!==void 0&&e.push(`--tree-shaking=${v}`),S&&e.push("--ignore-annotations"),g)for(let s of g)e.push(`--drop:${s}`);if(T&&e.push(`--mangle-props=${T.source}`),B&&e.push(`--reserve-props=${B.source}`),O!==void 0&&e.push(`--mangle-quoted=${O}`),D&&e.push(`--jsx=${D}`),A&&e.push(`--jsx-factory=${A}`),X&&e.push(`--jsx-fragment=${X}`),n)for(let s in n){if(s.indexOf("=")>=0)throw new Error(`Invalid define: ${s}`);e.push(`--define:${s}=${n[s]}`)}if(o)for(let s in o){if(s.indexOf("=")>=0)throw new Error(`Invalid log override: ${s}`);e.push(`--log-override:${s}=${o[s]}`)}if($)for(let s in $){if(s.indexOf("=")>=0)throw new Error(`Invalid supported: ${s}`);e.push(`--supported:${s}=${$[s]}`)}if(c)for(let s of c)e.push(`--pure:${s}`);f&&e.push("--keep-names")}function yt(e,t,r,u,p){var w;let i=[],y=[],a=Object.create(null),T=null,B=null,O=null;De(i,t,a,r,u),et(i,t,a);let m=l(t,a,"sourcemap",Xe),L=l(t,a,"bundle",Q),K=l(t,a,"watch",ft),C=l(t,a,"splitting",Q),g=l(t,a,"preserveSymlinks",Q),d=l(t,a,"metafile",Q),v=l(t,a,"outfile",_),S=l(t,a,"outdir",_),D=l(t,a,"outbase",_),A=l(t,a,"platform",_),X=l(t,a,"tsconfig",_),n=l(t,a,"resolveExtensions",re),o=l(t,a,"nodePaths",re),$=l(t,a,"mainFields",re),c=l(t,a,"conditions",re),f=l(t,a,"external",re),s=l(t,a,"loader",ge),b=l(t,a,"outExtension",ge),H=l(t,a,"publicPath",_),z=l(t,a,"entryNames",_),F=l(t,a,"chunkNames",_),I=l(t,a,"assetNames",_),J=l(t,a,"inject",re),V=l(t,a,"banner",ge),P=l(t,a,"footer",ge),W=l(t,a,"entryPoints",ht),G=l(t,a,"absWorkingDir",_),U=l(t,a,"stdin",ge),Z=(w=l(t,a,"write",Q))!=null?w:p,de=l(t,a,"allowOverwrite",Q),N=l(t,a,"incremental",Q)===!0,E=l(t,a,"mangleCache",ge);if(a.plugins=!0,se(t,a,`in ${e}() call`),m&&i.push(`--sourcemap${m===!0?"":`=${m}`}`),L&&i.push("--bundle"),de&&i.push("--allow-overwrite"),K)if(i.push("--watch"),typeof K=="boolean")O={};else{let h=Object.create(null),j=l(K,h,"onRebuild",Me);se(K,h,`on "watch" in ${e}() call`),O={onRebuild:j}}if(C&&i.push("--splitting"),g&&i.push("--preserve-symlinks"),d&&i.push("--metafile"),v&&i.push(`--outfile=${v}`),S&&i.push(`--outdir=${S}`),D&&i.push(`--outbase=${D}`),A&&i.push(`--platform=${A}`),X&&i.push(`--tsconfig=${X}`),n){let h=[];for(let j of n){if(j+="",j.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${j}`);h.push(j)}i.push(`--resolve-extensions=${h.join(",")}`)}if(H&&i.push(`--public-path=${H}`),z&&i.push(`--entry-names=${z}`),F&&i.push(`--chunk-names=${F}`),I&&i.push(`--asset-names=${I}`),$){let h=[];for(let j of $){if(j+="",j.indexOf(",")>=0)throw new Error(`Invalid main field: ${j}`);h.push(j)}i.push(`--main-fields=${h.join(",")}`)}if(c){let h=[];for(let j of c){if(j+="",j.indexOf(",")>=0)throw new Error(`Invalid condition: ${j}`);h.push(j)}i.push(`--conditions=${h.join(",")}`)}if(f)for(let h of f)i.push(`--external:${h}`);if(V)for(let h in V){if(h.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${h}`);i.push(`--banner:${h}=${V[h]}`)}if(P)for(let h in P){if(h.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${h}`);i.push(`--footer:${h}=${P[h]}`)}if(J)for(let h of J)i.push(`--inject:${h}`);if(s)for(let h in s){if(h.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${h}`);i.push(`--loader:${h}=${s[h]}`)}if(b)for(let h in b){if(h.indexOf("=")>=0)throw new Error(`Invalid out extension: ${h}`);i.push(`--out-extension:${h}=${b[h]}`)}if(W)if(Array.isArray(W))for(let h of W)y.push(["",h+""]);else for(let[h,j]of Object.entries(W))y.push([h+"",j+""]);if(U){let h=Object.create(null),j=l(U,h,"contents",_),te=l(U,h,"resolveDir",_),k=l(U,h,"sourcefile",_),x=l(U,h,"loader",_);se(U,h,'in "stdin" object'),k&&i.push(`--sourcefile=${k}`),x&&i.push(`--loader=${x}`),te&&(B=te+""),T=j?j+"":""}let R=[];if(o)for(let h of o)h+="",R.push(h);return{entries:y,flags:i,write:Z,stdinContents:T,stdinResolveDir:B,absWorkingDir:G,incremental:N,nodePaths:R,watch:O,mangleCache:Ze(E)}}function bt(e,t,r,u){let p=[],w=Object.create(null);De(p,t,w,r,u),et(p,t,w);let i=l(t,w,"sourcemap",Xe),y=l(t,w,"tsconfigRaw",mt),a=l(t,w,"sourcefile",_),T=l(t,w,"loader",_),B=l(t,w,"banner",_),O=l(t,w,"footer",_),m=l(t,w,"mangleCache",ge);return se(t,w,`in ${e}() call`),i&&p.push(`--sourcemap=${i===!0?"external":i}`),y&&p.push(`--tsconfig-raw=${typeof y=="string"?y:JSON.stringify(y)}`),a&&p.push(`--sourcefile=${a}`),T&&p.push(`--loader=${T}`),B&&p.push(`--banner=${B}`),O&&p.push(`--footer=${O}`),{flags:p,mangleCache:Ze(m)}}function vt(e){let t=new Map,r=new Map,u=new Map,p=new Map,w=null,i=0,y=0,a=new Uint8Array(16*1024),T=0,B=c=>{let f=T+c.length;if(f>a.length){let b=new Uint8Array(f*2);b.set(a),a=b}a.set(c,T),T+=c.length;let s=0;for(;s+4<=T;){let b=qe(a,s);if(s+4+b>T)break;s+=4,g(a.subarray(s,s+b)),s+=b}s>0&&(a.copyWithin(0,s,T),T-=s)},O=c=>{w={reason:c?": "+(c.message||c):""};const f="The service was stopped"+w.reason;for(let s of t.values())s(f,null);t.clear();for(let s of p.values())s.onWait(f);p.clear();for(let s of u.values())try{s(new Error(f),null)}catch(b){console.error(b)}u.clear()},m=(c,f,s)=>{if(w)return s("The service is no longer running"+w.reason,null);let b=i++;t.set(b,(H,z)=>{try{s(H,z)}finally{c&&c.unref()}}),c&&c.ref(),e.writeToStdin(Ye({id:b,isRequest:!0,value:f}))},L=(c,f)=>{if(w)throw new Error("The service is no longer running"+w.reason);e.writeToStdin(Ye({id:c,isRequest:!1,value:f}))},K=(c,f)=>xe(this,null,function*(){try{switch(f.command){case"ping":{L(c,{});break}case"on-start":{let s=r.get(f.key);s?L(c,yield s(f)):L(c,{});break}case"on-resolve":{let s=r.get(f.key);s?L(c,yield s(f)):L(c,{});break}case"on-load":{let s=r.get(f.key);s?L(c,yield s(f)):L(c,{});break}case"serve-request":{let s=p.get(f.key);s&&s.onRequest&&s.onRequest(f.args),L(c,{});break}case"serve-wait":{let s=p.get(f.key);s&&s.onWait(f.error),L(c,{});break}case"watch-rebuild":{let s=u.get(f.key);try{s&&s(null,f.args)}catch(b){console.error(b)}L(c,{});break}default:throw new Error("Invalid command: "+f.command)}}catch(s){L(c,{errors:[Ee(s,e,null,void 0,"")]})}}),C=!0,g=c=>{if(C){C=!1;let s=String.fromCharCode(...c);if(s!=="0.14.46")throw new Error(`Cannot start service: Host version "0.14.46" does not match binary version ${JSON.stringify(s)}`);return}let f=ut(c);if(f.isRequest)K(f.id,f.value);else{let s=t.get(f.id);t.delete(f.id),f.value.error?s(f.value.error,{}):s(null,f.value)}},d=(c,f,s,b,H)=>xe(this,null,function*(){let z=[],F=[],I={},J={},V=0,P=0,W=[],G=!1;f=[...f];for(let N of f){let E={};if(typeof N!="object")throw new Error(`Plugin at index ${P} must be an object`);const R=l(N,E,"name",_);if(typeof R!="string"||R==="")throw new Error(`Plugin at index ${P} is missing a name`);try{let h=l(N,E,"setup",Me);if(typeof h!="function")throw new Error("Plugin is missing a setup function");se(N,E,`on plugin ${JSON.stringify(R)}`);let j={name:R,onResolve:[],onLoad:[]};P++;let k=h({initialOptions:c,resolve:(x,Y={})=>{if(!G)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof x!="string")throw new Error("The path to resolve must be a string");let M=Object.create(null),ae=l(Y,M,"pluginName",_),ee=l(Y,M,"importer",_),le=l(Y,M,"namespace",_),ue=l(Y,M,"resolveDir",_),oe=l(Y,M,"kind",_),q=l(Y,M,"pluginData",Pe);return se(Y,M,"in resolve() call"),new Promise((ie,ce)=>{const ne={command:"resolve",path:x,key:s,pluginName:R};ae!=null&&(ne.pluginName=ae),ee!=null&&(ne.importer=ee),le!=null&&(ne.namespace=le),ue!=null&&(ne.resolveDir=ue),oe!=null&&(ne.kind=oe),q!=null&&(ne.pluginData=b.store(q)),m(H,ne,(pe,fe)=>{pe!==null?ce(new Error(pe)):ie({errors:we(fe.errors,b),warnings:we(fe.warnings,b),path:fe.path,external:fe.external,sideEffects:fe.sideEffects,namespace:fe.namespace,suffix:fe.suffix,pluginData:b.load(fe.pluginData)})})})},onStart(x){let Y='This error came from the "onStart" callback registered here:',M=Ce(new Error(Y),e,"onStart");z.push({name:R,callback:x,note:M})},onEnd(x){let Y='This error came from the "onEnd" callback registered here:',M=Ce(new Error(Y),e,"onEnd");F.push({name:R,callback:x,note:M})},onResolve(x,Y){let M='This error came from the "onResolve" callback registered here:',ae=Ce(new Error(M),e,"onResolve"),ee={},le=l(x,ee,"filter",Re),ue=l(x,ee,"namespace",_);if(se(x,ee,`in onResolve() call for plugin ${JSON.stringify(R)}`),le==null)throw new Error("onResolve() call is missing a filter");let oe=V++;I[oe]={name:R,callback:Y,note:ae},j.onResolve.push({id:oe,filter:le.source,namespace:ue||""})},onLoad(x,Y){let M='This error came from the "onLoad" callback registered here:',ae=Ce(new Error(M),e,"onLoad"),ee={},le=l(x,ee,"filter",Re),ue=l(x,ee,"namespace",_);if(se(x,ee,`in onLoad() call for plugin ${JSON.stringify(R)}`),le==null)throw new Error("onLoad() call is missing a filter");let oe=V++;J[oe]={name:R,callback:Y,note:ae},j.onLoad.push({id:oe,filter:le.source,namespace:ue||""})},esbuild:e.esbuild});k&&(yield k),W.push(j)}catch(h){return{ok:!1,error:h,pluginName:R}}}const U=N=>xe(this,null,function*(){switch(N.command){case"on-start":{let E={errors:[],warnings:[]};return yield Promise.all(z.map(R=>xe(this,[R],function*({name:h,callback:j,note:te}){try{let k=yield j();if(k!=null){if(typeof k!="object")throw new Error(`Expected onStart() callback in plugin ${JSON.stringify(h)} to return an object`);let x={},Y=l(k,x,"errors",re),M=l(k,x,"warnings",re);se(k,x,`from onStart() callback in plugin ${JSON.stringify(h)}`),Y!=null&&E.errors.push(...ve(Y,"errors",b,h)),M!=null&&E.warnings.push(...ve(M,"warnings",b,h))}}catch(k){E.errors.push(Ee(k,e,b,te&&te(),h))}}))),E}case"on-resolve":{let E={},R="",h,j;for(let te of N.ids)try{({name:R,callback:h,note:j}=I[te]);let k=yield h({path:N.path,importer:N.importer,namespace:N.namespace,resolveDir:N.resolveDir,kind:N.kind,pluginData:b.load(N.pluginData)});if(k!=null){if(typeof k!="object")throw new Error(`Expected onResolve() callback in plugin ${JSON.stringify(R)} to return an object`);let x={},Y=l(k,x,"pluginName",_),M=l(k,x,"path",_),ae=l(k,x,"namespace",_),ee=l(k,x,"suffix",_),le=l(k,x,"external",Q),ue=l(k,x,"sideEffects",Q),oe=l(k,x,"pluginData",Pe),q=l(k,x,"errors",re),ie=l(k,x,"warnings",re),ce=l(k,x,"watchFiles",re),ne=l(k,x,"watchDirs",re);se(k,x,`from onResolve() callback in plugin ${JSON.stringify(R)}`),E.id=te,Y!=null&&(E.pluginName=Y),M!=null&&(E.path=M),ae!=null&&(E.namespace=ae),ee!=null&&(E.suffix=ee),le!=null&&(E.external=le),ue!=null&&(E.sideEffects=ue),oe!=null&&(E.pluginData=b.store(oe)),q!=null&&(E.errors=ve(q,"errors",b,R)),ie!=null&&(E.warnings=ve(ie,"warnings",b,R)),ce!=null&&(E.watchFiles=Ae(ce,"watchFiles")),ne!=null&&(E.watchDirs=Ae(ne,"watchDirs"));break}}catch(k){return{id:te,errors:[Ee(k,e,b,j&&j(),R)]}}return E}case"on-load":{let E={},R="",h,j;for(let te of N.ids)try{({name:R,callback:h,note:j}=J[te]);let k=yield h({path:N.path,namespace:N.namespace,suffix:N.suffix,pluginData:b.load(N.pluginData)});if(k!=null){if(typeof k!="object")throw new Error(`Expected onLoad() callback in plugin ${JSON.stringify(R)} to return an object`);let x={},Y=l(k,x,"pluginName",_),M=l(k,x,"contents",pt),ae=l(k,x,"resolveDir",_),ee=l(k,x,"pluginData",Pe),le=l(k,x,"loader",_),ue=l(k,x,"errors",re),oe=l(k,x,"warnings",re),q=l(k,x,"watchFiles",re),ie=l(k,x,"watchDirs",re);se(k,x,`from onLoad() callback in plugin ${JSON.stringify(R)}`),E.id=te,Y!=null&&(E.pluginName=Y),M instanceof Uint8Array?E.contents=M:M!=null&&(E.contents=be(M)),ae!=null&&(E.resolveDir=ae),ee!=null&&(E.pluginData=b.store(ee)),le!=null&&(E.loader=le),ue!=null&&(E.errors=ve(ue,"errors",b,R)),oe!=null&&(E.warnings=ve(oe,"warnings",b,R)),q!=null&&(E.watchFiles=Ae(q,"watchFiles")),ie!=null&&(E.watchDirs=Ae(ie,"watchDirs"));break}}catch(k){return{id:te,errors:[Ee(k,e,b,j&&j(),R)]}}return E}default:throw new Error("Invalid command: "+N.command)}});let Z=(N,E,R)=>R();F.length>0&&(Z=(N,E,R)=>{(()=>xe(this,null,function*(){for(const{name:h,callback:j,note:te}of F)try{yield j(N)}catch(k){N.errors.push(yield new Promise(x=>E(k,h,te&&te(),x)))}}))().then(R)}),G=!0;let de=0;return{ok:!0,requestPlugins:W,runOnEndCallbacks:Z,pluginRefs:{ref(){++de===1&&r.set(s,U)},unref(){--de===0&&r.delete(s)}}}}),v=(c,f,s,b)=>{let H={},z=l(f,H,"port",ke),F=l(f,H,"host",_),I=l(f,H,"servedir",_),J=l(f,H,"onRequest",Me),V,P=new Promise((W,G)=>{V=U=>{p.delete(b),U!==null?G(new Error(U)):W()}});return s.serve={},se(f,H,"in serve() call"),z!==void 0&&(s.serve.port=z),F!==void 0&&(s.serve.host=F),I!==void 0&&(s.serve.servedir=I),p.set(b,{onRequest:J,onWait:V}),{wait:P,stop(){m(c,{command:"serve-stop",key:b},()=>{})}}};const S="warning",D="silent";let A=c=>{let f=y++;const s=tt();let b,{refs:H,options:z,isTTY:F,callback:I}=c;if(typeof z=="object"){let P=z.plugins;if(P!==void 0){if(!Array.isArray(P))throw new Error('"plugins" must be an array');b=P}}let J=(P,W,G,U)=>{let Z=[];try{De(Z,z,{},F,S)}catch{}const de=Ee(P,e,s,G,W);m(H,{command:"error",flags:Z,error:de},()=>{de.detail=s.load(de.detail),U(de)})},V=(P,W)=>{J(P,W,void 0,G=>{I(Oe("Build failed",[G],[]),null)})};if(b&&b.length>0){if(e.isSync)return V(new Error("Cannot use plugins in synchronous API calls"),"");d(z,b,f,s,H).then(P=>{if(!P.ok)V(P.error,P.pluginName);else try{X(Ge(Je({},c),{key:f,details:s,logPluginError:J,requestPlugins:P.requestPlugins,runOnEndCallbacks:P.runOnEndCallbacks,pluginRefs:P.pluginRefs}))}catch(W){V(W,"")}},P=>V(P,""))}else try{X(Ge(Je({},c),{key:f,details:s,logPluginError:J,requestPlugins:null,runOnEndCallbacks:(P,W,G)=>G(),pluginRefs:null}))}catch(P){V(P,"")}},X=({callName:c,refs:f,serveOptions:s,options:b,isTTY:H,defaultWD:z,callback:F,key:I,details:J,logPluginError:V,requestPlugins:P,runOnEndCallbacks:W,pluginRefs:G})=>{const U={ref(){G&&G.ref(),f&&f.ref()},unref(){G&&G.unref(),f&&f.unref()}};let Z=!e.isBrowser,{entries:de,flags:N,write:E,stdinContents:R,stdinResolveDir:h,absWorkingDir:j,incremental:te,nodePaths:k,watch:x,mangleCache:Y}=yt(c,b,H,S,Z),M={command:"build",key:I,entries:de,flags:N,write:E,stdinContents:R,stdinResolveDir:h,absWorkingDir:j||z,incremental:te,nodePaths:k};P&&(M.plugins=P),Y&&(M.mangleCache=Y);let ae=s&&v(U,s,M,I),ee,le,ue=(q,ie)=>{q.outputFiles&&(ie.outputFiles=q.outputFiles.map(xt)),q.metafile&&(ie.metafile=JSON.parse(q.metafile)),q.mangleCache&&(ie.mangleCache=q.mangleCache),q.writeToStdout!==void 0&&console.log(_e(q.writeToStdout).replace(/\n$/,""))},oe=(q,ie)=>{let ce={errors:we(q.errors,J),warnings:we(q.warnings,J)};ue(q,ce),W(ce,V,()=>{if(ce.errors.length>0)return ie(Oe("Build failed",ce.errors,ce.warnings),null);if(q.rebuild){if(!ee){let ne=!1;ee=()=>new Promise((pe,fe)=>{if(ne||w)throw new Error("Cannot rebuild");m(U,{command:"rebuild",key:I},(me,Ut)=>{if(me)return ie(Oe("Build failed",[{id:"",pluginName:"",text:me,location:null,notes:[],detail:void 0}],[]),null);oe(Ut,(Ve,It)=>{Ve?fe(Ve):pe(It)})})}),U.ref(),ee.dispose=()=>{ne||(ne=!0,m(U,{command:"rebuild-dispose",key:I},()=>{}),U.unref())}}ce.rebuild=ee}if(q.watch){if(!le){let ne=!1;U.ref(),le=()=>{ne||(ne=!0,u.delete(I),m(U,{command:"watch-stop",key:I},()=>{}),U.unref())},x&&u.set(I,(pe,fe)=>{if(pe){x.onRebuild&&x.onRebuild(pe,null);return}let me={errors:we(fe.errors,J),warnings:we(fe.warnings,J)};ue(fe,me),W(me,V,()=>{if(me.errors.length>0){x.onRebuild&&x.onRebuild(Oe("Build failed",me.errors,me.warnings),null);return}fe.rebuildID!==void 0&&(me.rebuild=ee),me.stop=le,x.onRebuild&&x.onRebuild(null,me)})})}ce.stop=le}ie(null,ce)})};if(E&&e.isBrowser)throw new Error('Cannot enable "write" in the browser');if(te&&e.isSync)throw new Error('Cannot use "incremental" with a synchronous build');if(x&&e.isSync)throw new Error('Cannot use "watch" with a synchronous build');m(U,M,(q,ie)=>{if(q)return F(new Error(q),null);if(ae){let ce=ie,ne=!1;U.ref();let pe={port:ce.port,host:ce.host,wait:ae.wait,stop(){ne||(ne=!0,ae.stop(),U.unref())}};return U.ref(),ae.wait.then(U.unref,U.unref),F(null,pe)}return oe(ie,F)})};return{readFromStdout:B,afterClose:O,service:{buildOrServe:A,transform:({callName:c,refs:f,input:s,options:b,isTTY:H,fs:z,callback:F})=>{const I=tt();let J=V=>{try{if(typeof s!="string")throw new Error('The input to "transform" must be a string');let{flags:P,mangleCache:W}=bt(c,b,H,D),G={command:"transform",flags:P,inputFS:V!==null,input:V!==null?V:s};W&&(G.mangleCache=W),m(f,G,(U,Z)=>{if(U)return F(new Error(U),null);let de=we(Z.errors,I),N=we(Z.warnings,I),E=1,R=()=>{if(--E===0){let h={warnings:N,code:Z.code,map:Z.map};Z.mangleCache&&(h.mangleCache=Z?.mangleCache),F(null,h)}};if(de.length>0)return F(Oe("Transform failed",de,N),null);Z.codeFS&&(E++,z.readFile(Z.code,(h,j)=>{h!==null?F(h,null):(Z.code=j,R())})),Z.mapFS&&(E++,z.readFile(Z.map,(h,j)=>{h!==null?F(h,null):(Z.map=j,R())})),R()})}catch(P){let W=[];try{De(W,b,{},H,D)}catch{}const G=Ee(P,e,I,void 0,"");m(f,{command:"error",flags:W,error:G},()=>{G.detail=I.load(G.detail),F(Oe("Transform failed",[G],[]),null)})}};if(typeof s=="string"&&s.length>1024*1024){let V=J;J=()=>z.writeFile(s,V)}J(null)},formatMessages:({callName:c,refs:f,messages:s,options:b,callback:H})=>{let z=ve(s,"messages",null,"");if(!b)throw new Error(`Missing second argument in ${c}() call`);let F={},I=l(b,F,"kind",_),J=l(b,F,"color",Q),V=l(b,F,"terminalWidth",ke);if(se(b,F,`in ${c}() call`),I===void 0)throw new Error(`Missing "kind" in ${c}() call`);if(I!=="error"&&I!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${c}() call`);let P={command:"format-msgs",messages:z,isWarning:I==="warning"};J!==void 0&&(P.color=J),V!==void 0&&(P.terminalWidth=V),m(f,P,(W,G)=>{if(W)return H(new Error(W),null);H(null,G.messages)})},analyzeMetafile:({callName:c,refs:f,metafile:s,options:b,callback:H})=>{b===void 0&&(b={});let z={},F=l(b,z,"color",Q),I=l(b,z,"verbose",Q);se(b,z,`in ${c}() call`);let J={command:"analyze-metafile",metafile:s};F!==void 0&&(J.color=F),I!==void 0&&(J.verbose=I),m(f,J,(V,P)=>{if(V)return H(new Error(V),null);H(null,P.result)})}}}}function tt(){const e=new Map;let t=0;return{load(r){return e.get(r)},store(r){if(r===void 0)return-1;const u=t++;return e.set(u,r),u}}}function Ce(e,t,r){let u,p=!1;return()=>{if(p)return u;p=!0;try{let w=(e.stack+"").split(`
`);w.splice(1,1);let i=nt(t,w,r);if(i)return u={text:e.message,location:i},u}catch{}}}function Ee(e,t,r,u,p){let w="Internal error",i=null;try{w=(e&&e.message||e)+""}catch{}try{i=nt(t,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:p,text:w,location:i,notes:u?[u]:[],detail:r?r.store(e):-1}}function nt(e,t,r){let u="    at ";if(e.readFileSync&&!t[0].startsWith(u)&&t[1].startsWith(u))for(let p=1;p<t.length;p++){let w=t[p];if(!!w.startsWith(u))for(w=w.slice(u.length);;){let i=/^(?:new |async )?\S+ \((.*)\)$/.exec(w);if(i){w=i[1];continue}if(i=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(w),i){w=i[1];continue}if(i=/^(\S+):(\d+):(\d+)$/.exec(w),i){let y;try{y=e.readFileSync(i[1],"utf8")}catch{break}let a=y.split(/\r\n|\r|\n|\u2028|\u2029/)[+i[2]-1]||"",T=+i[3]-1,B=a.slice(T,T+r.length)===r?r.length:0;return{file:i[1],namespace:"file",line:+i[2],column:be(a.slice(0,T)).length,length:be(a.slice(T,T+B)).length,lineText:a+`
`+t.slice(1).join(`
`),suggestion:""}}break}}return null}function Oe(e,t,r){let u=5,p=t.length<1?"":` with ${t.length} error${t.length<2?"":"s"}:`+t.slice(0,u+1).map((i,y)=>{if(y===u)return`
...`;if(!i.location)return`
error: ${i.text}`;let{file:a,line:T,column:B}=i.location,O=i.pluginName?`[plugin: ${i.pluginName}] `:"";return`
${a}:${T}:${B}: ERROR: ${O}${i.text}`}).join(""),w=new Error(`${e}${p}`);return w.errors=t,w.warnings=r,w}function we(e,t){for(const r of e)r.detail=t.load(r.detail);return e}function rt(e,t){if(e==null)return null;let r={},u=l(e,r,"file",_),p=l(e,r,"namespace",_),w=l(e,r,"line",ke),i=l(e,r,"column",ke),y=l(e,r,"length",ke),a=l(e,r,"lineText",_),T=l(e,r,"suggestion",_);return se(e,r,t),{file:u||"",namespace:p||"",line:w||0,column:i||0,length:y||0,lineText:a||"",suggestion:T||""}}function ve(e,t,r,u){let p=[],w=0;for(const i of e){let y={},a=l(i,y,"id",_),T=l(i,y,"pluginName",_),B=l(i,y,"text",_),O=l(i,y,"location",Qe),m=l(i,y,"notes",re),L=l(i,y,"detail",Pe),K=`in element ${w} of "${t}"`;se(i,y,K);let C=[];if(m)for(const g of m){let d={},v=l(g,d,"text",_),S=l(g,d,"location",Qe);se(g,d,K),C.push({text:v||"",location:rt(S,K)})}p.push({id:a||"",pluginName:T||u,text:B||"",location:rt(O,K),notes:C,detail:r?r.store(L):-1}),w++}return p}function Ae(e,t){const r=[];for(const u of e){if(typeof u!="string")throw new Error(`${JSON.stringify(t)} must be an array of strings`);r.push(u)}return r}function xt({path:e,contents:t}){let r=null;return{path:e,contents:t,get text(){return r===null&&(r=_e(t)),r}}}var _t="0.14.46",kt=e=>Ue().build(e),Et=()=>{throw new Error('The "serve" API only works in node')},Ot=(e,t)=>Ue().transform(e,t),St=(e,t)=>Ue().formatMessages(e,t),jt=(e,t)=>Ue().analyzeMetafile(e,t),Tt=()=>{throw new Error('The "buildSync" API only works in node')},$t=()=>{throw new Error('The "transformSync" API only works in node')},Pt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},Rt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Se,Fe,Ue=()=>{if(Fe)return Fe;throw Se?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Dt=e=>{e=wt(e||{});let t=e.wasmURL,r=e.wasmModule,u=e.worker!==!1;if(!t&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(Se)throw new Error('Cannot call "initialize" more than once');return Se=Ct(t||"",r,u),Se.catch(()=>{Se=void 0}),Se},Ct=(e,t,r)=>xe(void 0,null,function*(){let u;if(t)u=t;else{let y=yield fetch(e);if(!y.ok)throw new Error(`Failed to download ${JSON.stringify(e)}`);u=yield y.arrayBuffer()}let p;if(r){let y=new Blob([`onmessage=((postMessage) => {
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
                  this._scheduledTimeouts.set(id, setTimeout(() => {
                    this._resume();
                    while (this._scheduledTimeouts.has(id)) {
                      console.warn("scheduleTimeoutEvent: missed timeout event");
                      this._resume();
                    }
                  }, getInt64(sp + 8) + 1));
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
        go.argv = ["", \`--service=\${"0.14.46"}\`];
        if (wasm instanceof WebAssembly.Module) {
          WebAssembly.instantiate(wasm, go.importObject).then((instance) => go.run(instance));
        } else {
          WebAssembly.instantiate(wasm, go.importObject).then(({ instance }) => go.run(instance));
        }
      };
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});p=new Worker(URL.createObjectURL(y))}else{let y=(a=>{var T=(m,L,K)=>new Promise((C,g)=>{var d=D=>{try{S(K.next(D))}catch(A){g(A)}},v=D=>{try{S(K.throw(D))}catch(A){g(A)}},S=D=>D.done?C(D.value):Promise.resolve(D.value).then(d,v);S((K=K.apply(m,L)).next())});let B,O={};for(let m=self;m;m=Object.getPrototypeOf(m))for(let L of Object.getOwnPropertyNames(m))L in O||Object.defineProperty(O,L,{get:()=>self[L]});return(()=>{const m=()=>{const C=new Error("not implemented");return C.code="ENOSYS",C};if(!O.fs){let C="";O.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(g,d){C+=K.decode(d);const v=C.lastIndexOf(`
`);return v!=-1&&(console.log(C.substr(0,v)),C=C.substr(v+1)),d.length},write(g,d,v,S,D,A){if(v!==0||S!==d.length||D!==null){A(m());return}const X=this.writeSync(g,d);A(null,X)},chmod(g,d,v){v(m())},chown(g,d,v,S){S(m())},close(g,d){d(m())},fchmod(g,d,v){v(m())},fchown(g,d,v,S){S(m())},fstat(g,d){d(m())},fsync(g,d){d(null)},ftruncate(g,d,v){v(m())},lchown(g,d,v,S){S(m())},link(g,d,v){v(m())},lstat(g,d){d(m())},mkdir(g,d,v){v(m())},open(g,d,v,S){S(m())},read(g,d,v,S,D,A){A(m())},readdir(g,d){d(m())},readlink(g,d){d(m())},rename(g,d,v){v(m())},rmdir(g,d){d(m())},stat(g,d){d(m())},symlink(g,d,v){v(m())},truncate(g,d,v){v(m())},unlink(g,d){d(m())},utimes(g,d,v,S){S(m())}}}if(O.process||(O.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw m()},pid:-1,ppid:-1,umask(){throw m()},cwd(){throw m()},chdir(){throw m()}}),!O.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!O.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!O.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!O.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const L=new TextEncoder("utf-8"),K=new TextDecoder("utf-8");O.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=n=>{n!==0&&console.warn("exit code:",n)},this._exitPromise=new Promise(n=>{this._resolveExitPromise=n}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const C=(n,o)=>{this.mem.setUint32(n+0,o,!0),this.mem.setUint32(n+4,Math.floor(o/4294967296),!0)},g=n=>{const o=this.mem.getUint32(n+0,!0),$=this.mem.getInt32(n+4,!0);return o+$*4294967296},d=n=>{const o=this.mem.getFloat64(n,!0);if(o===0)return;if(!isNaN(o))return o;const $=this.mem.getUint32(n,!0);return this._values[$]},v=(n,o)=>{if(typeof o=="number"&&o!==0){if(isNaN(o)){this.mem.setUint32(n+4,2146959360,!0),this.mem.setUint32(n,0,!0);return}this.mem.setFloat64(n,o,!0);return}if(o===void 0){this.mem.setFloat64(n,0,!0);return}let c=this._ids.get(o);c===void 0&&(c=this._idPool.pop(),c===void 0&&(c=this._values.length),this._values[c]=o,this._goRefCounts[c]=0,this._ids.set(o,c)),this._goRefCounts[c]++;let f=0;switch(typeof o){case"object":o!==null&&(f=1);break;case"string":f=2;break;case"symbol":f=3;break;case"function":f=4;break}this.mem.setUint32(n+4,2146959360|f,!0),this.mem.setUint32(n,c,!0)},S=n=>{const o=g(n+0),$=g(n+8);return new Uint8Array(this._inst.exports.mem.buffer,o,$)},D=n=>{const o=g(n+0),$=g(n+8),c=new Array($);for(let f=0;f<$;f++)c[f]=d(o+f*8);return c},A=n=>{const o=g(n+0),$=g(n+8);return K.decode(new DataView(this._inst.exports.mem.buffer,o,$))},X=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":n=>{n>>>=0;const o=this.mem.getInt32(n+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(o)},"runtime.wasmWrite":n=>{n>>>=0;const o=g(n+8),$=g(n+16),c=this.mem.getInt32(n+24,!0);O.fs.writeSync(o,new Uint8Array(this._inst.exports.mem.buffer,$,c))},"runtime.resetMemoryDataView":n=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":n=>{n>>>=0,C(n+8,(X+performance.now())*1e6)},"runtime.walltime":n=>{n>>>=0;const o=new Date().getTime();C(n+8,o/1e3),this.mem.setInt32(n+16,o%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":n=>{n>>>=0;const o=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(o,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(o);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},g(n+8)+1)),this.mem.setInt32(n+16,o,!0)},"runtime.clearTimeoutEvent":n=>{n>>>=0;const o=this.mem.getInt32(n+8,!0);clearTimeout(this._scheduledTimeouts.get(o)),this._scheduledTimeouts.delete(o)},"runtime.getRandomData":n=>{n>>>=0,crypto.getRandomValues(S(n+8))},"syscall/js.finalizeRef":n=>{n>>>=0;const o=this.mem.getUint32(n+8,!0);if(this._goRefCounts[o]--,this._goRefCounts[o]===0){const $=this._values[o];this._values[o]=null,this._ids.delete($),this._idPool.push(o)}},"syscall/js.stringVal":n=>{n>>>=0,v(n+24,A(n+8))},"syscall/js.valueGet":n=>{n>>>=0;const o=Reflect.get(d(n+8),A(n+16));n=this._inst.exports.getsp()>>>0,v(n+32,o)},"syscall/js.valueSet":n=>{n>>>=0,Reflect.set(d(n+8),A(n+16),d(n+32))},"syscall/js.valueDelete":n=>{n>>>=0,Reflect.deleteProperty(d(n+8),A(n+16))},"syscall/js.valueIndex":n=>{n>>>=0,v(n+24,Reflect.get(d(n+8),g(n+16)))},"syscall/js.valueSetIndex":n=>{n>>>=0,Reflect.set(d(n+8),g(n+16),d(n+24))},"syscall/js.valueCall":n=>{n>>>=0;try{const o=d(n+8),$=Reflect.get(o,A(n+16)),c=D(n+32),f=Reflect.apply($,o,c);n=this._inst.exports.getsp()>>>0,v(n+56,f),this.mem.setUint8(n+64,1)}catch(o){n=this._inst.exports.getsp()>>>0,v(n+56,o),this.mem.setUint8(n+64,0)}},"syscall/js.valueInvoke":n=>{n>>>=0;try{const o=d(n+8),$=D(n+16),c=Reflect.apply(o,void 0,$);n=this._inst.exports.getsp()>>>0,v(n+40,c),this.mem.setUint8(n+48,1)}catch(o){n=this._inst.exports.getsp()>>>0,v(n+40,o),this.mem.setUint8(n+48,0)}},"syscall/js.valueNew":n=>{n>>>=0;try{const o=d(n+8),$=D(n+16),c=Reflect.construct(o,$);n=this._inst.exports.getsp()>>>0,v(n+40,c),this.mem.setUint8(n+48,1)}catch(o){n=this._inst.exports.getsp()>>>0,v(n+40,o),this.mem.setUint8(n+48,0)}},"syscall/js.valueLength":n=>{n>>>=0,C(n+16,parseInt(d(n+8).length))},"syscall/js.valuePrepareString":n=>{n>>>=0;const o=L.encode(String(d(n+8)));v(n+16,o),C(n+24,o.length)},"syscall/js.valueLoadString":n=>{n>>>=0;const o=d(n+8);S(n+16).set(o)},"syscall/js.valueInstanceOf":n=>{n>>>=0,this.mem.setUint8(n+24,d(n+8)instanceof d(n+16)?1:0)},"syscall/js.copyBytesToGo":n=>{n>>>=0;const o=S(n+8),$=d(n+32);if(!($ instanceof Uint8Array||$ instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const c=$.subarray(0,o.length);o.set(c),C(n+40,c.length),this.mem.setUint8(n+48,1)},"syscall/js.copyBytesToJS":n=>{n>>>=0;const o=d(n+8),$=S(n+16);if(!(o instanceof Uint8Array||o instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const c=$.subarray(0,o.length);o.set(c),C(n+40,c.length),this.mem.setUint8(n+48,1)},debug:n=>{console.log(n)}}}}run(C){return T(this,null,function*(){if(!(C instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=C,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,O,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[O,5],[this,6]]),this._idPool=[],this.exited=!1;let g=4096;const d=n=>{const o=g,$=L.encode(n+"\0");return new Uint8Array(this.mem.buffer,g,$.length).set($),g+=$.length,g%8!==0&&(g+=8-g%8),o},v=this.argv.length,S=[];this.argv.forEach(n=>{S.push(d(n))}),S.push(0),Object.keys(this.env).sort().forEach(n=>{S.push(d(`${n}=${this.env[n]}`))}),S.push(0);const A=g;S.forEach(n=>{this.mem.setUint32(g,n,!0),this.mem.setUint32(g+4,0,!0),g+=8});const X=4096+8192;if(g>=X)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(v,A),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(C){const g=this;return function(){const d={id:C,this:this,args:arguments};return g._pendingEvent=d,g._resume(),d.result}}}})(),B=({data:m})=>{let L=new TextDecoder,K=O.fs,C="";K.writeSync=(D,A)=>{if(D===1)a(A);else if(D===2){C+=L.decode(A);let X=C.split(`
`);X.length>1&&console.log(X.slice(0,-1).join(`
`)),C=X[X.length-1]}else throw new Error("Bad write");return A.length};let g=[],d,v=0;B=({data:D})=>{D.length>0&&(g.push(D),d&&d())},K.read=(D,A,X,n,o,$)=>{if(D!==0||X!==0||n!==A.length||o!==null)throw new Error("Bad read");if(g.length===0){d=()=>K.read(D,A,X,n,o,$);return}let c=g[0],f=Math.max(0,Math.min(n,c.length-v));A.set(c.subarray(v,v+f),X),v+=f,v===c.length&&(g.shift(),v=0),$(null,f)};let S=new O.Go;S.argv=["","--service=0.14.46"],m instanceof WebAssembly.Module?WebAssembly.instantiate(m,S.importObject).then(D=>S.run(D)):WebAssembly.instantiate(m,S.importObject).then(({instance:D})=>S.run(D))},m=>B(m)})(a=>p.onmessage({data:a}));p={onmessage:null,postMessage:a=>setTimeout(()=>y({data:a})),terminate(){}}}p.postMessage(u),p.onmessage=({data:y})=>w(y);let{readFromStdout:w,service:i}=vt({writeToStdin(y){p.postMessage(y)},isSync:!1,isBrowser:!0,esbuild:$e});Fe={build:y=>new Promise((a,T)=>i.buildOrServe({callName:"build",refs:null,serveOptions:null,options:y,isTTY:!1,defaultWD:"/",callback:(B,O)=>B?T(B):a(O)})),transform:(y,a)=>new Promise((T,B)=>i.transform({callName:"transform",refs:null,input:y,options:a||{},isTTY:!1,fs:{readFile(O,m){m(new Error("Internal error"),null)},writeFile(O,m){m(null)}},callback:(O,m)=>O?B(O):T(m)})),formatMessages:(y,a)=>new Promise((T,B)=>i.formatMessages({callName:"formatMessages",refs:null,messages:y,options:a,callback:(O,m)=>O?B(O):T(m)})),analyzeMetafile:(y,a)=>new Promise((T,B)=>i.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof y=="string"?y:JSON.stringify(y),options:a,callback:(O,m)=>O?B(O):T(m)}))}}),At=$e})(je)})(Be);var Ft=Nt.getDefaultExportFromCjs(Be.exports),Vt=Mt({__proto__:null,default:Ft},[Be.exports]);exports.browser=Vt;
//# sourceMappingURL=browser.js.map
