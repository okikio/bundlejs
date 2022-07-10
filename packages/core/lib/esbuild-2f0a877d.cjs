"use strict";function Nt(he,Ie){return Ie.forEach(function(me){me&&typeof me!="string"&&!Array.isArray(me)&&Object.keys(me).forEach(function(be){if(be!=="default"&&!(be in he)){var Te=Object.getOwnPropertyDescriptor(me,be);Object.defineProperty(he,be,Te.get?Te:{enumerable:!0,get:function(){return me[be]}})}})}),Object.freeze(Object.defineProperty(he,Symbol.toStringTag,{value:"Module"}))}function Mt(he){return he&&he.__esModule&&Object.prototype.hasOwnProperty.call(he,"default")?he.default:he}var Be={exports:{}};(function(he){(Ie=>{var me=Object.defineProperty,be=Object.defineProperties,Te=Object.getOwnPropertyDescriptor,lt=Object.getOwnPropertyDescriptors,st=Object.getOwnPropertyNames,We=Object.getOwnPropertySymbols,Le=Object.prototype.hasOwnProperty,it=Object.prototype.propertyIsEnumerable,ze=(e,t,r)=>t in e?me(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Je=(e,t)=>{for(var r in t||(t={}))Le.call(t,r)&&ze(e,r,t[r]);if(We)for(var r of We(t))it.call(t,r)&&ze(e,r,t[r]);return e},Ge=(e,t)=>be(e,lt(t)),at=(e,t)=>{for(var r in t)me(e,r,{get:t[r],enumerable:!0})},ot=(e,t,r,u)=>{if(t&&typeof t=="object"||typeof t=="function")for(let p of st(t))!Le.call(e,p)&&p!==r&&me(e,p,{get:()=>t[p],enumerable:!(u=Te(t,p))||u.enumerable});return e},ct=e=>ot(me({},"__esModule",{value:!0}),e),xe=(e,t,r)=>new Promise((u,p)=>{var y=a=>{try{w(r.next(a))}catch(T){p(T)}},i=a=>{try{w(r.throw(a))}catch(T){p(T)}},w=a=>a.done?u(a.value):Promise.resolve(a.value).then(y,i);w((r=r.apply(e,t)).next())}),$e={};at($e,{analyzeMetafile:()=>jt,analyzeMetafileSync:()=>Rt,build:()=>kt,buildSync:()=>Tt,default:()=>Ut,formatMessages:()=>St,formatMessagesSync:()=>Pt,initialize:()=>Dt,serve:()=>Et,transform:()=>Ot,transformSync:()=>$t,version:()=>xt}),Ie.exports=ct($e);function Ye(e){let t=u=>{if(u===null)r.write8(0);else if(typeof u=="boolean")r.write8(1),r.write8(+u);else if(typeof u=="number")r.write8(2),r.write32(u|0);else if(typeof u=="string")r.write8(3),r.write(ve(u));else if(u instanceof Uint8Array)r.write8(4),r.write(u);else if(u instanceof Array){r.write8(5),r.write32(u.length);for(let p of u)t(p)}else{let p=Object.keys(u);r.write8(6),r.write32(p.length);for(let y of p)r.write(ve(y)),t(u[y])}},r=new He;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),t(e.value),Ne(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function ut(e){let t=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return ke(r.read());case 4:return r.read();case 5:{let i=r.read32(),w=[];for(let a=0;a<i;a++)w.push(t());return w}case 6:{let i=r.read32(),w={};for(let a=0;a<i;a++)w[ke(r.read())]=t();return w}default:throw new Error("Invalid packet")}},r=new He(e),u=r.read32(),p=(u&1)===0;u>>>=1;let y=t();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:u,isRequest:p,value:y}}var He=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let t=new Uint8Array((this.len+e)*2);t.set(this.buf),this.buf=t}return this.len+=e,this.len-e}write8(e){let t=this._write(1);this.buf[t]=e}write32(e){let t=this._write(4);Ne(this.buf,e,t)}write(e){let t=this._write(4+e.length);Ne(this.buf,e.length,t),this.buf.set(e,t+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return Ke(this.buf,this._read(4))}read(){let e=this.read32(),t=new Uint8Array(e),r=this._read(t.length);return t.set(this.buf.subarray(r,r+e)),t}},ve,ke;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,t=new TextDecoder;ve=r=>e.encode(r),ke=r=>t.decode(r)}else if(typeof Buffer<"u")ve=e=>{let t=Buffer.from(e);return t instanceof Uint8Array||(t=new Uint8Array(t)),t},ke=e=>{let{buffer:t,byteOffset:r,byteLength:u}=e;return Buffer.from(t,r,u).toString()};else throw new Error("No UTF-8 codec found");function Ke(e,t){return e[t++]|e[t++]<<8|e[t++]<<16|e[t++]<<24}function Ne(e,t,r){e[r++]=t,e[r++]=t>>8,e[r++]=t>>16,e[r++]=t>>24}function Qe(e){if(e+="",e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var Pe=()=>null,X=e=>typeof e=="boolean"?null:"a boolean",ft=e=>typeof e=="boolean"||typeof e=="object"&&!Array.isArray(e)?null:"a boolean or an object",x=e=>typeof e=="string"?null:"a string",Re=e=>e instanceof RegExp?null:"a RegExp object",Ee=e=>typeof e=="number"&&e===(e|0)?null:"an integer",Me=e=>typeof e=="function"?null:"a function",re=e=>Array.isArray(e)?null:"an array",pe=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",dt=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",ht=e=>typeof e=="object"&&e!==null?null:"an array or an object",Xe=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",qe=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",mt=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",gt=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",pt=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array";function l(e,t,r,u){let p=e[r];if(t[r+""]=!0,p===void 0)return;let y=u(p);if(y!==null)throw new Error(`"${r}" must be ${y}`);return p}function se(e,t,r){for(let u in e)if(!(u in t))throw new Error(`Invalid option ${r}: "${u}"`)}function yt(e){let t=Object.create(null),r=l(e,t,"wasmURL",x),u=l(e,t,"wasmModule",dt),p=l(e,t,"worker",X);return se(e,t,"in initialize() call"),{wasmURL:r,wasmModule:u,worker:p}}function Ze(e){let t;if(e!==void 0){t=Object.create(null);for(let r of Object.keys(e)){let u=e[r];if(typeof u=="string"||u===!1)t[r]=u;else throw new Error(`Expected ${JSON.stringify(r)} in mangle cache to map to either a string or false`)}}return t}function De(e,t,r,u,p){let y=l(t,r,"color",X),i=l(t,r,"logLevel",x),w=l(t,r,"logLimit",Ee);y!==void 0?e.push(`--color=${y}`):u&&e.push("--color=true"),e.push(`--log-level=${i||p}`),e.push(`--log-limit=${w||0}`)}function et(e,t,r){let u=l(t,r,"legalComments",x),p=l(t,r,"sourceRoot",x),y=l(t,r,"sourcesContent",X),i=l(t,r,"target",gt),w=l(t,r,"format",x),a=l(t,r,"globalName",x),T=l(t,r,"mangleProps",Re),B=l(t,r,"reserveProps",Re),O=l(t,r,"mangleQuoted",X),m=l(t,r,"minify",X),W=l(t,r,"minifySyntax",X),Q=l(t,r,"minifyWhitespace",X),C=l(t,r,"minifyIdentifiers",X),g=l(t,r,"drop",re),d=l(t,r,"charset",x),v=l(t,r,"treeShaking",X),S=l(t,r,"ignoreAnnotations",X),D=l(t,r,"jsx",x),U=l(t,r,"jsxFactory",x),q=l(t,r,"jsxFragment",x),n=l(t,r,"define",pe),o=l(t,r,"logOverride",pe),$=l(t,r,"supported",pe),c=l(t,r,"pure",re),f=l(t,r,"keepNames",X);if(u&&e.push(`--legal-comments=${u}`),p!==void 0&&e.push(`--source-root=${p}`),y!==void 0&&e.push(`--sources-content=${y}`),i&&(Array.isArray(i)?e.push(`--target=${Array.from(i).map(Qe).join(",")}`):e.push(`--target=${Qe(i)}`)),w&&e.push(`--format=${w}`),a&&e.push(`--global-name=${a}`),m&&e.push("--minify"),W&&e.push("--minify-syntax"),Q&&e.push("--minify-whitespace"),C&&e.push("--minify-identifiers"),d&&e.push(`--charset=${d}`),v!==void 0&&e.push(`--tree-shaking=${v}`),S&&e.push("--ignore-annotations"),g)for(let s of g)e.push(`--drop:${s}`);if(T&&e.push(`--mangle-props=${T.source}`),B&&e.push(`--reserve-props=${B.source}`),O!==void 0&&e.push(`--mangle-quoted=${O}`),D&&e.push(`--jsx=${D}`),U&&e.push(`--jsx-factory=${U}`),q&&e.push(`--jsx-fragment=${q}`),n)for(let s in n){if(s.indexOf("=")>=0)throw new Error(`Invalid define: ${s}`);e.push(`--define:${s}=${n[s]}`)}if(o)for(let s in o){if(s.indexOf("=")>=0)throw new Error(`Invalid log override: ${s}`);e.push(`--log-override:${s}=${o[s]}`)}if($)for(let s in $){if(s.indexOf("=")>=0)throw new Error(`Invalid supported: ${s}`);e.push(`--supported:${s}=${$[s]}`)}if(c)for(let s of c)e.push(`--pure:${s}`);f&&e.push("--keep-names")}function wt(e,t,r,u,p){var y;let i=[],w=[],a=Object.create(null),T=null,B=null,O=null;De(i,t,a,r,u),et(i,t,a);let m=l(t,a,"sourcemap",qe),W=l(t,a,"bundle",X),Q=l(t,a,"watch",ft),C=l(t,a,"splitting",X),g=l(t,a,"preserveSymlinks",X),d=l(t,a,"metafile",X),v=l(t,a,"outfile",x),S=l(t,a,"outdir",x),D=l(t,a,"outbase",x),U=l(t,a,"platform",x),q=l(t,a,"tsconfig",x),n=l(t,a,"resolveExtensions",re),o=l(t,a,"nodePaths",re),$=l(t,a,"mainFields",re),c=l(t,a,"conditions",re),f=l(t,a,"external",re),s=l(t,a,"loader",pe),b=l(t,a,"outExtension",pe),H=l(t,a,"publicPath",x),z=l(t,a,"entryNames",x),F=l(t,a,"chunkNames",x),I=l(t,a,"assetNames",x),J=l(t,a,"inject",re),V=l(t,a,"banner",pe),P=l(t,a,"footer",pe),L=l(t,a,"entryPoints",ht),G=l(t,a,"absWorkingDir",x),A=l(t,a,"stdin",pe),Z=(y=l(t,a,"write",X))!=null?y:p,de=l(t,a,"allowOverwrite",X),N=l(t,a,"incremental",X)===!0,E=l(t,a,"mangleCache",pe);if(a.plugins=!0,se(t,a,`in ${e}() call`),m&&i.push(`--sourcemap${m===!0?"":`=${m}`}`),W&&i.push("--bundle"),de&&i.push("--allow-overwrite"),Q)if(i.push("--watch"),typeof Q=="boolean")O={};else{let h=Object.create(null),j=l(Q,h,"onRebuild",Me);se(Q,h,`on "watch" in ${e}() call`),O={onRebuild:j}}if(C&&i.push("--splitting"),g&&i.push("--preserve-symlinks"),d&&i.push("--metafile"),v&&i.push(`--outfile=${v}`),S&&i.push(`--outdir=${S}`),D&&i.push(`--outbase=${D}`),U&&i.push(`--platform=${U}`),q&&i.push(`--tsconfig=${q}`),n){let h=[];for(let j of n){if(j+="",j.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${j}`);h.push(j)}i.push(`--resolve-extensions=${h.join(",")}`)}if(H&&i.push(`--public-path=${H}`),z&&i.push(`--entry-names=${z}`),F&&i.push(`--chunk-names=${F}`),I&&i.push(`--asset-names=${I}`),$){let h=[];for(let j of $){if(j+="",j.indexOf(",")>=0)throw new Error(`Invalid main field: ${j}`);h.push(j)}i.push(`--main-fields=${h.join(",")}`)}if(c){let h=[];for(let j of c){if(j+="",j.indexOf(",")>=0)throw new Error(`Invalid condition: ${j}`);h.push(j)}i.push(`--conditions=${h.join(",")}`)}if(f)for(let h of f)i.push(`--external:${h}`);if(V)for(let h in V){if(h.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${h}`);i.push(`--banner:${h}=${V[h]}`)}if(P)for(let h in P){if(h.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${h}`);i.push(`--footer:${h}=${P[h]}`)}if(J)for(let h of J)i.push(`--inject:${h}`);if(s)for(let h in s){if(h.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${h}`);i.push(`--loader:${h}=${s[h]}`)}if(b)for(let h in b){if(h.indexOf("=")>=0)throw new Error(`Invalid out extension: ${h}`);i.push(`--out-extension:${h}=${b[h]}`)}if(L)if(Array.isArray(L))for(let h of L)w.push(["",h+""]);else for(let[h,j]of Object.entries(L))w.push([h+"",j+""]);if(A){let h=Object.create(null),j=l(A,h,"contents",x),te=l(A,h,"resolveDir",x),k=l(A,h,"sourcefile",x),_=l(A,h,"loader",x);se(A,h,'in "stdin" object'),k&&i.push(`--sourcefile=${k}`),_&&i.push(`--loader=${_}`),te&&(B=te+""),T=j?j+"":""}let R=[];if(o)for(let h of o)h+="",R.push(h);return{entries:w,flags:i,write:Z,stdinContents:T,stdinResolveDir:B,absWorkingDir:G,incremental:N,nodePaths:R,watch:O,mangleCache:Ze(E)}}function bt(e,t,r,u){let p=[],y=Object.create(null);De(p,t,y,r,u),et(p,t,y);let i=l(t,y,"sourcemap",qe),w=l(t,y,"tsconfigRaw",mt),a=l(t,y,"sourcefile",x),T=l(t,y,"loader",x),B=l(t,y,"banner",x),O=l(t,y,"footer",x),m=l(t,y,"mangleCache",pe);return se(t,y,`in ${e}() call`),i&&p.push(`--sourcemap=${i===!0?"external":i}`),w&&p.push(`--tsconfig-raw=${typeof w=="string"?w:JSON.stringify(w)}`),a&&p.push(`--sourcefile=${a}`),T&&p.push(`--loader=${T}`),B&&p.push(`--banner=${B}`),O&&p.push(`--footer=${O}`),{flags:p,mangleCache:Ze(m)}}function vt(e){let t=new Map,r=new Map,u=new Map,p=new Map,y=null,i=0,w=0,a=new Uint8Array(16*1024),T=0,B=c=>{let f=T+c.length;if(f>a.length){let b=new Uint8Array(f*2);b.set(a),a=b}a.set(c,T),T+=c.length;let s=0;for(;s+4<=T;){let b=Ke(a,s);if(s+4+b>T)break;s+=4,g(a.subarray(s,s+b)),s+=b}s>0&&(a.copyWithin(0,s,T),T-=s)},O=c=>{y={reason:c?": "+(c.message||c):""};const f="The service was stopped"+y.reason;for(let s of t.values())s(f,null);t.clear();for(let s of p.values())s.onWait(f);p.clear();for(let s of u.values())try{s(new Error(f),null)}catch(b){console.error(b)}u.clear()},m=(c,f,s)=>{if(y)return s("The service is no longer running"+y.reason,null);let b=i++;t.set(b,(H,z)=>{try{s(H,z)}finally{c&&c.unref()}}),c&&c.ref(),e.writeToStdin(Ye({id:b,isRequest:!0,value:f}))},W=(c,f)=>{if(y)throw new Error("The service is no longer running"+y.reason);e.writeToStdin(Ye({id:c,isRequest:!1,value:f}))},Q=(c,f)=>xe(this,null,function*(){try{switch(f.command){case"ping":{W(c,{});break}case"on-start":{let s=r.get(f.key);s?W(c,yield s(f)):W(c,{});break}case"on-resolve":{let s=r.get(f.key);s?W(c,yield s(f)):W(c,{});break}case"on-load":{let s=r.get(f.key);s?W(c,yield s(f)):W(c,{});break}case"serve-request":{let s=p.get(f.key);s&&s.onRequest&&s.onRequest(f.args),W(c,{});break}case"serve-wait":{let s=p.get(f.key);s&&s.onWait(f.error),W(c,{});break}case"watch-rebuild":{let s=u.get(f.key);try{s&&s(null,f.args)}catch(b){console.error(b)}W(c,{});break}default:throw new Error("Invalid command: "+f.command)}}catch(s){W(c,{errors:[Oe(s,e,null,void 0,"")]})}}),C=!0,g=c=>{if(C){C=!1;let s=String.fromCharCode(...c);if(s!=="0.14.48")throw new Error(`Cannot start service: Host version "0.14.48" does not match binary version ${JSON.stringify(s)}`);return}let f=ut(c);if(f.isRequest)Q(f.id,f.value);else{let s=t.get(f.id);t.delete(f.id),f.value.error?s(f.value.error,{}):s(null,f.value)}},d=(c,f,s,b,H)=>xe(this,null,function*(){let z=[],F=[],I={},J={},V=0,P=0,L=[],G=!1;f=[...f];for(let N of f){let E={};if(typeof N!="object")throw new Error(`Plugin at index ${P} must be an object`);const R=l(N,E,"name",x);if(typeof R!="string"||R==="")throw new Error(`Plugin at index ${P} is missing a name`);try{let h=l(N,E,"setup",Me);if(typeof h!="function")throw new Error("Plugin is missing a setup function");se(N,E,`on plugin ${JSON.stringify(R)}`);let j={name:R,onResolve:[],onLoad:[]};P++;let k=h({initialOptions:c,resolve:(_,Y={})=>{if(!G)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof _!="string")throw new Error("The path to resolve must be a string");let M=Object.create(null),ae=l(Y,M,"pluginName",x),ee=l(Y,M,"importer",x),le=l(Y,M,"namespace",x),ue=l(Y,M,"resolveDir",x),oe=l(Y,M,"kind",x),K=l(Y,M,"pluginData",Pe);return se(Y,M,"in resolve() call"),new Promise((ie,ce)=>{const ne={command:"resolve",path:_,key:s,pluginName:R};ae!=null&&(ne.pluginName=ae),ee!=null&&(ne.importer=ee),le!=null&&(ne.namespace=le),ue!=null&&(ne.resolveDir=ue),oe!=null&&(ne.kind=oe),K!=null&&(ne.pluginData=b.store(K)),m(H,ne,(ye,fe)=>{ye!==null?ce(new Error(ye)):ie({errors:we(fe.errors,b),warnings:we(fe.warnings,b),path:fe.path,external:fe.external,sideEffects:fe.sideEffects,namespace:fe.namespace,suffix:fe.suffix,pluginData:b.load(fe.pluginData)})})})},onStart(_){let Y='This error came from the "onStart" callback registered here:',M=Ce(new Error(Y),e,"onStart");z.push({name:R,callback:_,note:M})},onEnd(_){let Y='This error came from the "onEnd" callback registered here:',M=Ce(new Error(Y),e,"onEnd");F.push({name:R,callback:_,note:M})},onResolve(_,Y){let M='This error came from the "onResolve" callback registered here:',ae=Ce(new Error(M),e,"onResolve"),ee={},le=l(_,ee,"filter",Re),ue=l(_,ee,"namespace",x);if(se(_,ee,`in onResolve() call for plugin ${JSON.stringify(R)}`),le==null)throw new Error("onResolve() call is missing a filter");let oe=V++;I[oe]={name:R,callback:Y,note:ae},j.onResolve.push({id:oe,filter:le.source,namespace:ue||""})},onLoad(_,Y){let M='This error came from the "onLoad" callback registered here:',ae=Ce(new Error(M),e,"onLoad"),ee={},le=l(_,ee,"filter",Re),ue=l(_,ee,"namespace",x);if(se(_,ee,`in onLoad() call for plugin ${JSON.stringify(R)}`),le==null)throw new Error("onLoad() call is missing a filter");let oe=V++;J[oe]={name:R,callback:Y,note:ae},j.onLoad.push({id:oe,filter:le.source,namespace:ue||""})},esbuild:e.esbuild});k&&(yield k),L.push(j)}catch(h){return{ok:!1,error:h,pluginName:R}}}const A=N=>xe(this,null,function*(){switch(N.command){case"on-start":{let E={errors:[],warnings:[]};return yield Promise.all(z.map(R=>xe(this,[R],function*({name:h,callback:j,note:te}){try{let k=yield j();if(k!=null){if(typeof k!="object")throw new Error(`Expected onStart() callback in plugin ${JSON.stringify(h)} to return an object`);let _={},Y=l(k,_,"errors",re),M=l(k,_,"warnings",re);se(k,_,`from onStart() callback in plugin ${JSON.stringify(h)}`),Y!=null&&E.errors.push(..._e(Y,"errors",b,h)),M!=null&&E.warnings.push(..._e(M,"warnings",b,h))}}catch(k){E.errors.push(Oe(k,e,b,te&&te(),h))}}))),E}case"on-resolve":{let E={},R="",h,j;for(let te of N.ids)try{({name:R,callback:h,note:j}=I[te]);let k=yield h({path:N.path,importer:N.importer,namespace:N.namespace,resolveDir:N.resolveDir,kind:N.kind,pluginData:b.load(N.pluginData)});if(k!=null){if(typeof k!="object")throw new Error(`Expected onResolve() callback in plugin ${JSON.stringify(R)} to return an object`);let _={},Y=l(k,_,"pluginName",x),M=l(k,_,"path",x),ae=l(k,_,"namespace",x),ee=l(k,_,"suffix",x),le=l(k,_,"external",X),ue=l(k,_,"sideEffects",X),oe=l(k,_,"pluginData",Pe),K=l(k,_,"errors",re),ie=l(k,_,"warnings",re),ce=l(k,_,"watchFiles",re),ne=l(k,_,"watchDirs",re);se(k,_,`from onResolve() callback in plugin ${JSON.stringify(R)}`),E.id=te,Y!=null&&(E.pluginName=Y),M!=null&&(E.path=M),ae!=null&&(E.namespace=ae),ee!=null&&(E.suffix=ee),le!=null&&(E.external=le),ue!=null&&(E.sideEffects=ue),oe!=null&&(E.pluginData=b.store(oe)),K!=null&&(E.errors=_e(K,"errors",b,R)),ie!=null&&(E.warnings=_e(ie,"warnings",b,R)),ce!=null&&(E.watchFiles=Ue(ce,"watchFiles")),ne!=null&&(E.watchDirs=Ue(ne,"watchDirs"));break}}catch(k){return{id:te,errors:[Oe(k,e,b,j&&j(),R)]}}return E}case"on-load":{let E={},R="",h,j;for(let te of N.ids)try{({name:R,callback:h,note:j}=J[te]);let k=yield h({path:N.path,namespace:N.namespace,suffix:N.suffix,pluginData:b.load(N.pluginData)});if(k!=null){if(typeof k!="object")throw new Error(`Expected onLoad() callback in plugin ${JSON.stringify(R)} to return an object`);let _={},Y=l(k,_,"pluginName",x),M=l(k,_,"contents",pt),ae=l(k,_,"resolveDir",x),ee=l(k,_,"pluginData",Pe),le=l(k,_,"loader",x),ue=l(k,_,"errors",re),oe=l(k,_,"warnings",re),K=l(k,_,"watchFiles",re),ie=l(k,_,"watchDirs",re);se(k,_,`from onLoad() callback in plugin ${JSON.stringify(R)}`),E.id=te,Y!=null&&(E.pluginName=Y),M instanceof Uint8Array?E.contents=M:M!=null&&(E.contents=ve(M)),ae!=null&&(E.resolveDir=ae),ee!=null&&(E.pluginData=b.store(ee)),le!=null&&(E.loader=le),ue!=null&&(E.errors=_e(ue,"errors",b,R)),oe!=null&&(E.warnings=_e(oe,"warnings",b,R)),K!=null&&(E.watchFiles=Ue(K,"watchFiles")),ie!=null&&(E.watchDirs=Ue(ie,"watchDirs"));break}}catch(k){return{id:te,errors:[Oe(k,e,b,j&&j(),R)]}}return E}default:throw new Error("Invalid command: "+N.command)}});let Z=(N,E,R)=>R();F.length>0&&(Z=(N,E,R)=>{(()=>xe(this,null,function*(){for(const{name:h,callback:j,note:te}of F)try{yield j(N)}catch(k){N.errors.push(yield new Promise(_=>E(k,h,te&&te(),_)))}}))().then(R)}),G=!0;let de=0;return{ok:!0,requestPlugins:L,runOnEndCallbacks:Z,pluginRefs:{ref(){++de===1&&r.set(s,A)},unref(){--de===0&&r.delete(s)}}}}),v=(c,f,s,b)=>{let H={},z=l(f,H,"port",Ee),F=l(f,H,"host",x),I=l(f,H,"servedir",x),J=l(f,H,"onRequest",Me),V,P=new Promise((L,G)=>{V=A=>{p.delete(b),A!==null?G(new Error(A)):L()}});return s.serve={},se(f,H,"in serve() call"),z!==void 0&&(s.serve.port=z),F!==void 0&&(s.serve.host=F),I!==void 0&&(s.serve.servedir=I),p.set(b,{onRequest:J,onWait:V}),{wait:P,stop(){m(c,{command:"serve-stop",key:b},()=>{})}}};const S="warning",D="silent";let U=c=>{let f=w++;const s=tt();let b,{refs:H,options:z,isTTY:F,callback:I}=c;if(typeof z=="object"){let P=z.plugins;if(P!==void 0){if(!Array.isArray(P))throw new Error('"plugins" must be an array');b=P}}let J=(P,L,G,A)=>{let Z=[];try{De(Z,z,{},F,S)}catch{}const de=Oe(P,e,s,G,L);m(H,{command:"error",flags:Z,error:de},()=>{de.detail=s.load(de.detail),A(de)})},V=(P,L)=>{J(P,L,void 0,G=>{I(Se("Build failed",[G],[]),null)})};if(b&&b.length>0){if(e.isSync)return V(new Error("Cannot use plugins in synchronous API calls"),"");d(z,b,f,s,H).then(P=>{if(!P.ok)V(P.error,P.pluginName);else try{q(Ge(Je({},c),{key:f,details:s,logPluginError:J,requestPlugins:P.requestPlugins,runOnEndCallbacks:P.runOnEndCallbacks,pluginRefs:P.pluginRefs}))}catch(L){V(L,"")}},P=>V(P,""))}else try{q(Ge(Je({},c),{key:f,details:s,logPluginError:J,requestPlugins:null,runOnEndCallbacks:(P,L,G)=>G(),pluginRefs:null}))}catch(P){V(P,"")}},q=({callName:c,refs:f,serveOptions:s,options:b,isTTY:H,defaultWD:z,callback:F,key:I,details:J,logPluginError:V,requestPlugins:P,runOnEndCallbacks:L,pluginRefs:G})=>{const A={ref(){G&&G.ref(),f&&f.ref()},unref(){G&&G.unref(),f&&f.unref()}};let Z=!e.isWriteUnavailable,{entries:de,flags:N,write:E,stdinContents:R,stdinResolveDir:h,absWorkingDir:j,incremental:te,nodePaths:k,watch:_,mangleCache:Y}=wt(c,b,H,S,Z),M={command:"build",key:I,entries:de,flags:N,write:E,stdinContents:R,stdinResolveDir:h,absWorkingDir:j||z,incremental:te,nodePaths:k};P&&(M.plugins=P),Y&&(M.mangleCache=Y);let ae=s&&v(A,s,M,I),ee,le,ue=(K,ie)=>{K.outputFiles&&(ie.outputFiles=K.outputFiles.map(_t)),K.metafile&&(ie.metafile=JSON.parse(K.metafile)),K.mangleCache&&(ie.mangleCache=K.mangleCache),K.writeToStdout!==void 0&&console.log(ke(K.writeToStdout).replace(/\n$/,""))},oe=(K,ie)=>{let ce={errors:we(K.errors,J),warnings:we(K.warnings,J)};ue(K,ce),L(ce,V,()=>{if(ce.errors.length>0)return ie(Se("Build failed",ce.errors,ce.warnings),null);if(K.rebuild){if(!ee){let ne=!1;ee=()=>new Promise((ye,fe)=>{if(ne||y)throw new Error("Cannot rebuild");m(A,{command:"rebuild",key:I},(ge,At)=>{if(ge)return ie(Se("Build failed",[{id:"",pluginName:"",text:ge,location:null,notes:[],detail:void 0}],[]),null);oe(At,(Ve,It)=>{Ve?fe(Ve):ye(It)})})}),A.ref(),ee.dispose=()=>{ne||(ne=!0,m(A,{command:"rebuild-dispose",key:I},()=>{}),A.unref())}}ce.rebuild=ee}if(K.watch){if(!le){let ne=!1;A.ref(),le=()=>{ne||(ne=!0,u.delete(I),m(A,{command:"watch-stop",key:I},()=>{}),A.unref())},_&&u.set(I,(ye,fe)=>{if(ye){_.onRebuild&&_.onRebuild(ye,null);return}let ge={errors:we(fe.errors,J),warnings:we(fe.warnings,J)};ue(fe,ge),L(ge,V,()=>{if(ge.errors.length>0){_.onRebuild&&_.onRebuild(Se("Build failed",ge.errors,ge.warnings),null);return}fe.rebuildID!==void 0&&(ge.rebuild=ee),ge.stop=le,_.onRebuild&&_.onRebuild(null,ge)})})}ce.stop=le}ie(null,ce)})};if(E&&e.isWriteUnavailable)throw new Error('The "write" option is unavailable in this environment');if(te&&e.isSync)throw new Error('Cannot use "incremental" with a synchronous build');if(_&&e.isSync)throw new Error('Cannot use "watch" with a synchronous build');m(A,M,(K,ie)=>{if(K)return F(new Error(K),null);if(ae){let ce=ie,ne=!1;A.ref();let ye={port:ce.port,host:ce.host,wait:ae.wait,stop(){ne||(ne=!0,ae.stop(),A.unref())}};return A.ref(),ae.wait.then(A.unref,A.unref),F(null,ye)}return oe(ie,F)})};return{readFromStdout:B,afterClose:O,service:{buildOrServe:U,transform:({callName:c,refs:f,input:s,options:b,isTTY:H,fs:z,callback:F})=>{const I=tt();let J=V=>{try{if(typeof s!="string")throw new Error('The input to "transform" must be a string');let{flags:P,mangleCache:L}=bt(c,b,H,D),G={command:"transform",flags:P,inputFS:V!==null,input:V!==null?V:s};L&&(G.mangleCache=L),m(f,G,(A,Z)=>{if(A)return F(new Error(A),null);let de=we(Z.errors,I),N=we(Z.warnings,I),E=1,R=()=>{if(--E===0){let h={warnings:N,code:Z.code,map:Z.map};Z.mangleCache&&(h.mangleCache=Z?.mangleCache),F(null,h)}};if(de.length>0)return F(Se("Transform failed",de,N),null);Z.codeFS&&(E++,z.readFile(Z.code,(h,j)=>{h!==null?F(h,null):(Z.code=j,R())})),Z.mapFS&&(E++,z.readFile(Z.map,(h,j)=>{h!==null?F(h,null):(Z.map=j,R())})),R()})}catch(P){let L=[];try{De(L,b,{},H,D)}catch{}const G=Oe(P,e,I,void 0,"");m(f,{command:"error",flags:L,error:G},()=>{G.detail=I.load(G.detail),F(Se("Transform failed",[G],[]),null)})}};if(typeof s=="string"&&s.length>1024*1024){let V=J;J=()=>z.writeFile(s,V)}J(null)},formatMessages:({callName:c,refs:f,messages:s,options:b,callback:H})=>{let z=_e(s,"messages",null,"");if(!b)throw new Error(`Missing second argument in ${c}() call`);let F={},I=l(b,F,"kind",x),J=l(b,F,"color",X),V=l(b,F,"terminalWidth",Ee);if(se(b,F,`in ${c}() call`),I===void 0)throw new Error(`Missing "kind" in ${c}() call`);if(I!=="error"&&I!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${c}() call`);let P={command:"format-msgs",messages:z,isWarning:I==="warning"};J!==void 0&&(P.color=J),V!==void 0&&(P.terminalWidth=V),m(f,P,(L,G)=>{if(L)return H(new Error(L),null);H(null,G.messages)})},analyzeMetafile:({callName:c,refs:f,metafile:s,options:b,callback:H})=>{b===void 0&&(b={});let z={},F=l(b,z,"color",X),I=l(b,z,"verbose",X);se(b,z,`in ${c}() call`);let J={command:"analyze-metafile",metafile:s};F!==void 0&&(J.color=F),I!==void 0&&(J.verbose=I),m(f,J,(V,P)=>{if(V)return H(new Error(V),null);H(null,P.result)})}}}}function tt(){const e=new Map;let t=0;return{load(r){return e.get(r)},store(r){if(r===void 0)return-1;const u=t++;return e.set(u,r),u}}}function Ce(e,t,r){let u,p=!1;return()=>{if(p)return u;p=!0;try{let y=(e.stack+"").split(`
`);y.splice(1,1);let i=nt(t,y,r);if(i)return u={text:e.message,location:i},u}catch{}}}function Oe(e,t,r,u,p){let y="Internal error",i=null;try{y=(e&&e.message||e)+""}catch{}try{i=nt(t,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:p,text:y,location:i,notes:u?[u]:[],detail:r?r.store(e):-1}}function nt(e,t,r){let u="    at ";if(e.readFileSync&&!t[0].startsWith(u)&&t[1].startsWith(u))for(let p=1;p<t.length;p++){let y=t[p];if(!!y.startsWith(u))for(y=y.slice(u.length);;){let i=/^(?:new |async )?\S+ \((.*)\)$/.exec(y);if(i){y=i[1];continue}if(i=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(y),i){y=i[1];continue}if(i=/^(\S+):(\d+):(\d+)$/.exec(y),i){let w;try{w=e.readFileSync(i[1],"utf8")}catch{break}let a=w.split(/\r\n|\r|\n|\u2028|\u2029/)[+i[2]-1]||"",T=+i[3]-1,B=a.slice(T,T+r.length)===r?r.length:0;return{file:i[1],namespace:"file",line:+i[2],column:ve(a.slice(0,T)).length,length:ve(a.slice(T,T+B)).length,lineText:a+`
`+t.slice(1).join(`
`),suggestion:""}}break}}return null}function Se(e,t,r){let u=5,p=t.length<1?"":` with ${t.length} error${t.length<2?"":"s"}:`+t.slice(0,u+1).map((i,w)=>{if(w===u)return`
...`;if(!i.location)return`
error: ${i.text}`;let{file:a,line:T,column:B}=i.location,O=i.pluginName?`[plugin: ${i.pluginName}] `:"";return`
${a}:${T}:${B}: ERROR: ${O}${i.text}`}).join(""),y=new Error(`${e}${p}`);return y.errors=t,y.warnings=r,y}function we(e,t){for(const r of e)r.detail=t.load(r.detail);return e}function rt(e,t){if(e==null)return null;let r={},u=l(e,r,"file",x),p=l(e,r,"namespace",x),y=l(e,r,"line",Ee),i=l(e,r,"column",Ee),w=l(e,r,"length",Ee),a=l(e,r,"lineText",x),T=l(e,r,"suggestion",x);return se(e,r,t),{file:u||"",namespace:p||"",line:y||0,column:i||0,length:w||0,lineText:a||"",suggestion:T||""}}function _e(e,t,r,u){let p=[],y=0;for(const i of e){let w={},a=l(i,w,"id",x),T=l(i,w,"pluginName",x),B=l(i,w,"text",x),O=l(i,w,"location",Xe),m=l(i,w,"notes",re),W=l(i,w,"detail",Pe),Q=`in element ${y} of "${t}"`;se(i,w,Q);let C=[];if(m)for(const g of m){let d={},v=l(g,d,"text",x),S=l(g,d,"location",Xe);se(g,d,Q),C.push({text:v||"",location:rt(S,Q)})}p.push({id:a||"",pluginName:T||u,text:B||"",location:rt(O,Q),notes:C,detail:r?r.store(W):-1}),y++}return p}function Ue(e,t){const r=[];for(const u of e){if(typeof u!="string")throw new Error(`${JSON.stringify(t)} must be an array of strings`);r.push(u)}return r}function _t({path:e,contents:t}){let r=null;return{path:e,contents:t,get text(){return r===null&&(r=ke(t)),r}}}var xt="0.14.48",kt=e=>Ae().build(e),Et=()=>{throw new Error('The "serve" API only works in node')},Ot=(e,t)=>Ae().transform(e,t),St=(e,t)=>Ae().formatMessages(e,t),jt=(e,t)=>Ae().analyzeMetafile(e,t),Tt=()=>{throw new Error('The "buildSync" API only works in node')},$t=()=>{throw new Error('The "transformSync" API only works in node')},Pt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},Rt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},je,Fe,Ae=()=>{if(Fe)return Fe;throw je?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Dt=e=>{e=yt(e||{});let t=e.wasmURL,r=e.wasmModule,u=e.worker!==!1;if(!t&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(je)throw new Error('Cannot call "initialize" more than once');return je=Ct(t||"",r,u),je.catch(()=>{je=void 0}),je},Ct=(e,t,r)=>xe(void 0,null,function*(){let u;if(t)u=t;else{let w=yield fetch(e);if(!w.ok)throw new Error(`Failed to download ${JSON.stringify(e)}`);u=yield w.arrayBuffer()}let p;if(r){let w=new Blob([`onmessage=((postMessage) => {
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
        go.argv = ["", \`--service=\${"0.14.48"}\`];
        if (wasm instanceof WebAssembly.Module) {
          WebAssembly.instantiate(wasm, go.importObject).then((instance) => go.run(instance));
        } else {
          WebAssembly.instantiate(wasm, go.importObject).then(({ instance }) => go.run(instance));
        }
      };
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});p=new Worker(URL.createObjectURL(w))}else{let w=(a=>{var T=(m,W,Q)=>new Promise((C,g)=>{var d=D=>{try{S(Q.next(D))}catch(U){g(U)}},v=D=>{try{S(Q.throw(D))}catch(U){g(U)}},S=D=>D.done?C(D.value):Promise.resolve(D.value).then(d,v);S((Q=Q.apply(m,W)).next())});let B,O={};for(let m=self;m;m=Object.getPrototypeOf(m))for(let W of Object.getOwnPropertyNames(m))W in O||Object.defineProperty(O,W,{get:()=>self[W]});return(()=>{const m=()=>{const C=new Error("not implemented");return C.code="ENOSYS",C};if(!O.fs){let C="";O.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(g,d){C+=Q.decode(d);const v=C.lastIndexOf(`
`);return v!=-1&&(console.log(C.substr(0,v)),C=C.substr(v+1)),d.length},write(g,d,v,S,D,U){if(v!==0||S!==d.length||D!==null){U(m());return}const q=this.writeSync(g,d);U(null,q)},chmod(g,d,v){v(m())},chown(g,d,v,S){S(m())},close(g,d){d(m())},fchmod(g,d,v){v(m())},fchown(g,d,v,S){S(m())},fstat(g,d){d(m())},fsync(g,d){d(null)},ftruncate(g,d,v){v(m())},lchown(g,d,v,S){S(m())},link(g,d,v){v(m())},lstat(g,d){d(m())},mkdir(g,d,v){v(m())},open(g,d,v,S){S(m())},read(g,d,v,S,D,U){U(m())},readdir(g,d){d(m())},readlink(g,d){d(m())},rename(g,d,v){v(m())},rmdir(g,d){d(m())},stat(g,d){d(m())},symlink(g,d,v){v(m())},truncate(g,d,v){v(m())},unlink(g,d){d(m())},utimes(g,d,v,S){S(m())}}}if(O.process||(O.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw m()},pid:-1,ppid:-1,umask(){throw m()},cwd(){throw m()},chdir(){throw m()}}),!O.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!O.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!O.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!O.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const W=new TextEncoder("utf-8"),Q=new TextDecoder("utf-8");O.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=n=>{n!==0&&console.warn("exit code:",n)},this._exitPromise=new Promise(n=>{this._resolveExitPromise=n}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const C=(n,o)=>{this.mem.setUint32(n+0,o,!0),this.mem.setUint32(n+4,Math.floor(o/4294967296),!0)},g=n=>{const o=this.mem.getUint32(n+0,!0),$=this.mem.getInt32(n+4,!0);return o+$*4294967296},d=n=>{const o=this.mem.getFloat64(n,!0);if(o===0)return;if(!isNaN(o))return o;const $=this.mem.getUint32(n,!0);return this._values[$]},v=(n,o)=>{if(typeof o=="number"&&o!==0){if(isNaN(o)){this.mem.setUint32(n+4,2146959360,!0),this.mem.setUint32(n,0,!0);return}this.mem.setFloat64(n,o,!0);return}if(o===void 0){this.mem.setFloat64(n,0,!0);return}let c=this._ids.get(o);c===void 0&&(c=this._idPool.pop(),c===void 0&&(c=this._values.length),this._values[c]=o,this._goRefCounts[c]=0,this._ids.set(o,c)),this._goRefCounts[c]++;let f=0;switch(typeof o){case"object":o!==null&&(f=1);break;case"string":f=2;break;case"symbol":f=3;break;case"function":f=4;break}this.mem.setUint32(n+4,2146959360|f,!0),this.mem.setUint32(n,c,!0)},S=n=>{const o=g(n+0),$=g(n+8);return new Uint8Array(this._inst.exports.mem.buffer,o,$)},D=n=>{const o=g(n+0),$=g(n+8),c=new Array($);for(let f=0;f<$;f++)c[f]=d(o+f*8);return c},U=n=>{const o=g(n+0),$=g(n+8);return Q.decode(new DataView(this._inst.exports.mem.buffer,o,$))},q=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":n=>{n>>>=0;const o=this.mem.getInt32(n+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(o)},"runtime.wasmWrite":n=>{n>>>=0;const o=g(n+8),$=g(n+16),c=this.mem.getInt32(n+24,!0);O.fs.writeSync(o,new Uint8Array(this._inst.exports.mem.buffer,$,c))},"runtime.resetMemoryDataView":n=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":n=>{n>>>=0,C(n+8,(q+performance.now())*1e6)},"runtime.walltime":n=>{n>>>=0;const o=new Date().getTime();C(n+8,o/1e3),this.mem.setInt32(n+16,o%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":n=>{n>>>=0;const o=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(o,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(o);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},g(n+8)+1)),this.mem.setInt32(n+16,o,!0)},"runtime.clearTimeoutEvent":n=>{n>>>=0;const o=this.mem.getInt32(n+8,!0);clearTimeout(this._scheduledTimeouts.get(o)),this._scheduledTimeouts.delete(o)},"runtime.getRandomData":n=>{n>>>=0,crypto.getRandomValues(S(n+8))},"syscall/js.finalizeRef":n=>{n>>>=0;const o=this.mem.getUint32(n+8,!0);if(this._goRefCounts[o]--,this._goRefCounts[o]===0){const $=this._values[o];this._values[o]=null,this._ids.delete($),this._idPool.push(o)}},"syscall/js.stringVal":n=>{n>>>=0,v(n+24,U(n+8))},"syscall/js.valueGet":n=>{n>>>=0;const o=Reflect.get(d(n+8),U(n+16));n=this._inst.exports.getsp()>>>0,v(n+32,o)},"syscall/js.valueSet":n=>{n>>>=0,Reflect.set(d(n+8),U(n+16),d(n+32))},"syscall/js.valueDelete":n=>{n>>>=0,Reflect.deleteProperty(d(n+8),U(n+16))},"syscall/js.valueIndex":n=>{n>>>=0,v(n+24,Reflect.get(d(n+8),g(n+16)))},"syscall/js.valueSetIndex":n=>{n>>>=0,Reflect.set(d(n+8),g(n+16),d(n+24))},"syscall/js.valueCall":n=>{n>>>=0;try{const o=d(n+8),$=Reflect.get(o,U(n+16)),c=D(n+32),f=Reflect.apply($,o,c);n=this._inst.exports.getsp()>>>0,v(n+56,f),this.mem.setUint8(n+64,1)}catch(o){n=this._inst.exports.getsp()>>>0,v(n+56,o),this.mem.setUint8(n+64,0)}},"syscall/js.valueInvoke":n=>{n>>>=0;try{const o=d(n+8),$=D(n+16),c=Reflect.apply(o,void 0,$);n=this._inst.exports.getsp()>>>0,v(n+40,c),this.mem.setUint8(n+48,1)}catch(o){n=this._inst.exports.getsp()>>>0,v(n+40,o),this.mem.setUint8(n+48,0)}},"syscall/js.valueNew":n=>{n>>>=0;try{const o=d(n+8),$=D(n+16),c=Reflect.construct(o,$);n=this._inst.exports.getsp()>>>0,v(n+40,c),this.mem.setUint8(n+48,1)}catch(o){n=this._inst.exports.getsp()>>>0,v(n+40,o),this.mem.setUint8(n+48,0)}},"syscall/js.valueLength":n=>{n>>>=0,C(n+16,parseInt(d(n+8).length))},"syscall/js.valuePrepareString":n=>{n>>>=0;const o=W.encode(String(d(n+8)));v(n+16,o),C(n+24,o.length)},"syscall/js.valueLoadString":n=>{n>>>=0;const o=d(n+8);S(n+16).set(o)},"syscall/js.valueInstanceOf":n=>{n>>>=0,this.mem.setUint8(n+24,d(n+8)instanceof d(n+16)?1:0)},"syscall/js.copyBytesToGo":n=>{n>>>=0;const o=S(n+8),$=d(n+32);if(!($ instanceof Uint8Array||$ instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const c=$.subarray(0,o.length);o.set(c),C(n+40,c.length),this.mem.setUint8(n+48,1)},"syscall/js.copyBytesToJS":n=>{n>>>=0;const o=d(n+8),$=S(n+16);if(!(o instanceof Uint8Array||o instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}const c=$.subarray(0,o.length);o.set(c),C(n+40,c.length),this.mem.setUint8(n+48,1)},debug:n=>{console.log(n)}}}}run(C){return T(this,null,function*(){if(!(C instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=C,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,O,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[O,5],[this,6]]),this._idPool=[],this.exited=!1;let g=4096;const d=n=>{const o=g,$=W.encode(n+"\0");return new Uint8Array(this.mem.buffer,g,$.length).set($),g+=$.length,g%8!==0&&(g+=8-g%8),o},v=this.argv.length,S=[];this.argv.forEach(n=>{S.push(d(n))}),S.push(0),Object.keys(this.env).sort().forEach(n=>{S.push(d(`${n}=${this.env[n]}`))}),S.push(0);const U=g;S.forEach(n=>{this.mem.setUint32(g,n,!0),this.mem.setUint32(g+4,0,!0),g+=8});const q=4096+8192;if(g>=q)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(v,U),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(C){const g=this;return function(){const d={id:C,this:this,args:arguments};return g._pendingEvent=d,g._resume(),d.result}}}})(),B=({data:m})=>{let W=new TextDecoder,Q=O.fs,C="";Q.writeSync=(D,U)=>{if(D===1)a(U);else if(D===2){C+=W.decode(U);let q=C.split(`
`);q.length>1&&console.log(q.slice(0,-1).join(`
`)),C=q[q.length-1]}else throw new Error("Bad write");return U.length};let g=[],d,v=0;B=({data:D})=>{D.length>0&&(g.push(D),d&&d())},Q.read=(D,U,q,n,o,$)=>{if(D!==0||q!==0||n!==U.length||o!==null)throw new Error("Bad read");if(g.length===0){d=()=>Q.read(D,U,q,n,o,$);return}let c=g[0],f=Math.max(0,Math.min(n,c.length-v));U.set(c.subarray(v,v+f),q),v+=f,v===c.length&&(g.shift(),v=0),$(null,f)};let S=new O.Go;S.argv=["","--service=0.14.48"],m instanceof WebAssembly.Module?WebAssembly.instantiate(m,S.importObject).then(D=>S.run(D)):WebAssembly.instantiate(m,S.importObject).then(({instance:D})=>S.run(D))},m=>B(m)})(a=>p.onmessage({data:a}));p={onmessage:null,postMessage:a=>setTimeout(()=>w({data:a})),terminate(){}}}p.postMessage(u),p.onmessage=({data:w})=>y(w);let{readFromStdout:y,service:i}=vt({writeToStdin(w){p.postMessage(w)},isSync:!1,isWriteUnavailable:!0,esbuild:$e});Fe={build:w=>new Promise((a,T)=>i.buildOrServe({callName:"build",refs:null,serveOptions:null,options:w,isTTY:!1,defaultWD:"/",callback:(B,O)=>B?T(B):a(O)})),transform:(w,a)=>new Promise((T,B)=>i.transform({callName:"transform",refs:null,input:w,options:a||{},isTTY:!1,fs:{readFile(O,m){m(new Error("Internal error"),null)},writeFile(O,m){m(null)}},callback:(O,m)=>O?B(O):T(m)})),formatMessages:(w,a)=>new Promise((T,B)=>i.formatMessages({callName:"formatMessages",refs:null,messages:w,options:a,callback:(O,m)=>O?B(O):T(m)})),analyzeMetafile:(w,a)=>new Promise((T,B)=>i.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof w=="string"?w:JSON.stringify(w),options:a,callback:(O,m)=>O?B(O):T(m)}))}}),Ut=$e})(he)})(Be);var Ft=Mt(Be.exports),Vt=Nt({__proto__:null,default:Ft},[Be.exports]);exports.browser=Vt;
//# sourceMappingURL=esbuild-2f0a877d.cjs.map
