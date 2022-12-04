"use strict";function bt(Y,he){for(var te=0;te<he.length;te++){const ne=he[te];if(typeof ne!="string"&&!Array.isArray(ne)){for(const re in ne)if(re!=="default"&&!(re in Y)){const fe=Object.getOwnPropertyDescriptor(ne,re);fe&&Object.defineProperty(Y,re,fe.get?fe:{enumerable:!0,get:()=>ne[re]})}}}return Object.freeze(Object.defineProperty(Y,Symbol.toStringTag,{value:"Module"}))}function vt(Y){return Y&&Y.__esModule&&Object.prototype.hasOwnProperty.call(Y,"default")?Y.default:Y}var Ee={exports:{}};(function(Y){(he=>{var te=Object.defineProperty,ne=Object.getOwnPropertyDescriptor,re=Object.getOwnPropertyNames,fe=Object.prototype.hasOwnProperty,Le=(t,n)=>{for(var r in n)te(t,r,{get:n[r],enumerable:!0})},We=(t,n,r,c)=>{if(n&&typeof n=="object"||typeof n=="function")for(let m of re(n))!fe.call(t,m)&&m!==r&&te(t,m,{get:()=>n[m],enumerable:!(c=ne(n,m))||c.enumerable});return t},ze=t=>We(te({},"__esModule",{value:!0}),t),q=(t,n,r)=>new Promise((c,m)=>{var g=f=>{try{v(r.next(f))}catch(k){m(k)}},u=f=>{try{v(r.throw(f))}catch(k){m(k)}},v=f=>f.done?c(f.value):Promise.resolve(f.value).then(g,u);v((r=r.apply(t,n)).next())}),me={};Le(me,{analyzeMetafile:()=>ft,analyzeMetafileSync:()=>gt,build:()=>at,buildSync:()=>dt,default:()=>wt,formatMessages:()=>ct,formatMessagesSync:()=>mt,initialize:()=>pt,serve:()=>ot,transform:()=>ut,transformSync:()=>ht,version:()=>it}),he.exports=ze(me);function Se(t){let n=c=>{if(c===null)r.write8(0);else if(typeof c=="boolean")r.write8(1),r.write8(+c);else if(typeof c=="number")r.write8(2),r.write32(c|0);else if(typeof c=="string")r.write8(3),r.write(K(c));else if(c instanceof Uint8Array)r.write8(4),r.write(c);else if(c instanceof Array){r.write8(5),r.write32(c.length);for(let m of c)n(m)}else{let m=Object.keys(c);r.write8(6),r.write32(m.length);for(let g of m)r.write(K(g)),n(c[g])}},r=new je;return r.write32(0),r.write32(t.id<<1|+!t.isRequest),n(t.value),xe(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function Je(t){let n=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return ie(r.read());case 4:return r.read();case 5:{let u=r.read32(),v=[];for(let f=0;f<u;f++)v.push(n());return v}case 6:{let u=r.read32(),v={};for(let f=0;f<u;f++)v[ie(r.read())]=n();return v}default:throw new Error("Invalid packet")}},r=new je(t),c=r.read32(),m=(c&1)===0;c>>>=1;let g=n();if(r.ptr!==t.length)throw new Error("Invalid packet");return{id:c,isRequest:m,value:g}}var je=class{constructor(t=new Uint8Array(1024)){this.buf=t,this.len=0,this.ptr=0}_write(t){if(this.len+t>this.buf.length){let n=new Uint8Array((this.len+t)*2);n.set(this.buf),this.buf=n}return this.len+=t,this.len-t}write8(t){let n=this._write(1);this.buf[n]=t}write32(t){let n=this._write(4);xe(this.buf,t,n)}write(t){let n=this._write(4+t.length);xe(this.buf,t.length,n),this.buf.set(t,n+4)}_read(t){if(this.ptr+t>this.buf.length)throw new Error("Invalid packet");return this.ptr+=t,this.ptr-t}read8(){return this.buf[this._read(1)]}read32(){return Oe(this.buf,this._read(4))}read(){let t=this.read32(),n=new Uint8Array(t),r=this._read(n.length);return n.set(this.buf.subarray(r,r+t)),n}},K,ie;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let t=new TextEncoder,n=new TextDecoder;K=r=>t.encode(r),ie=r=>n.decode(r)}else if(typeof Buffer<"u")K=t=>{let n=Buffer.from(t);return n instanceof Uint8Array||(n=new Uint8Array(n)),n},ie=t=>{let{buffer:n,byteOffset:r,byteLength:c}=t;return Buffer.from(n,r,c).toString()};else throw new Error("No UTF-8 codec found");function Oe(t,n){return t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24}function xe(t,n,r){t[r++]=n,t[r++]=n>>8,t[r++]=n>>16,t[r++]=n>>24}var $e="warning",Te="silent";function Pe(t){if(t+="",t.indexOf(",")>=0)throw new Error(`Invalid target: ${t}`);return t}var ge=()=>null,F=t=>typeof t=="boolean"?null:"a boolean",Ge=t=>typeof t=="boolean"||typeof t=="object"&&!Array.isArray(t)?null:"a boolean or an object",S=t=>typeof t=="string"?null:"a string",pe=t=>t instanceof RegExp?null:"a RegExp object",ae=t=>typeof t=="number"&&t===(t|0)?null:"an integer",_e=t=>typeof t=="function"?null:"a function",W=t=>Array.isArray(t)?null:"an array",Q=t=>typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"an object",He=t=>t instanceof WebAssembly.Module?null:"a WebAssembly.Module",Ye=t=>typeof t=="object"&&t!==null?null:"an array or an object",Re=t=>typeof t=="object"&&!Array.isArray(t)?null:"an object or null",Ue=t=>typeof t=="string"||typeof t=="boolean"?null:"a string or a boolean",Qe=t=>typeof t=="string"||typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"a string or an object",Xe=t=>typeof t=="string"||Array.isArray(t)?null:"a string or an array",De=t=>typeof t=="string"||t instanceof Uint8Array?null:"a string or a Uint8Array",Ke=t=>typeof t=="string"||t instanceof URL?null:"a string or a URL";function l(t,n,r,c){let m=t[r];if(n[r+""]=!0,m===void 0)return;let g=c(m);if(g!==null)throw new Error(`"${r}" must be ${g}`);return m}function z(t,n,r){for(let c in t)if(!(c in n))throw new Error(`Invalid option ${r}: "${c}"`)}function Ze(t){let n=Object.create(null),r=l(t,n,"wasmURL",Ke),c=l(t,n,"wasmModule",He),m=l(t,n,"worker",F);return z(t,n,"in initialize() call"),{wasmURL:r,wasmModule:c,worker:m}}function Ae(t){let n;if(t!==void 0){n=Object.create(null);for(let r of Object.keys(t)){let c=t[r];if(typeof c=="string"||c===!1)n[r]=c;else throw new Error(`Expected ${JSON.stringify(r)} in mangle cache to map to either a string or false`)}}return n}function ye(t,n,r,c,m){let g=l(n,r,"color",F),u=l(n,r,"logLevel",S),v=l(n,r,"logLimit",ae);g!==void 0?t.push(`--color=${g}`):c&&t.push("--color=true"),t.push(`--log-level=${u||m}`),t.push(`--log-limit=${v||0}`)}function Ce(t,n,r){let c=l(n,r,"legalComments",S),m=l(n,r,"sourceRoot",S),g=l(n,r,"sourcesContent",F),u=l(n,r,"target",Xe),v=l(n,r,"format",S),f=l(n,r,"globalName",S),k=l(n,r,"mangleProps",pe),$=l(n,r,"reserveProps",pe),P=l(n,r,"mangleQuoted",F),U=l(n,r,"minify",F),j=l(n,r,"minifySyntax",F),R=l(n,r,"minifyWhitespace",F),x=l(n,r,"minifyIdentifiers",F),D=l(n,r,"drop",W),C=l(n,r,"charset",S),w=l(n,r,"treeShaking",F),i=l(n,r,"ignoreAnnotations",F),s=l(n,r,"jsx",S),o=l(n,r,"jsxFactory",S),h=l(n,r,"jsxFragment",S),b=l(n,r,"jsxImportSource",S),_=l(n,r,"jsxDev",F),d=l(n,r,"jsxSideEffects",F),e=l(n,r,"define",Q),a=l(n,r,"logOverride",Q),p=l(n,r,"supported",Q),y=l(n,r,"pure",W),O=l(n,r,"keepNames",F),A=l(n,r,"platform",S);if(c&&t.push(`--legal-comments=${c}`),m!==void 0&&t.push(`--source-root=${m}`),g!==void 0&&t.push(`--sources-content=${g}`),u&&(Array.isArray(u)?t.push(`--target=${Array.from(u).map(Pe).join(",")}`):t.push(`--target=${Pe(u)}`)),v&&t.push(`--format=${v}`),f&&t.push(`--global-name=${f}`),A&&t.push(`--platform=${A}`),U&&t.push("--minify"),j&&t.push("--minify-syntax"),R&&t.push("--minify-whitespace"),x&&t.push("--minify-identifiers"),C&&t.push(`--charset=${C}`),w!==void 0&&t.push(`--tree-shaking=${w}`),i&&t.push("--ignore-annotations"),D)for(let T of D)t.push(`--drop:${T}`);if(k&&t.push(`--mangle-props=${k.source}`),$&&t.push(`--reserve-props=${$.source}`),P!==void 0&&t.push(`--mangle-quoted=${P}`),s&&t.push(`--jsx=${s}`),o&&t.push(`--jsx-factory=${o}`),h&&t.push(`--jsx-fragment=${h}`),b&&t.push(`--jsx-import-source=${b}`),_&&t.push("--jsx-dev"),d&&t.push("--jsx-side-effects"),e)for(let T in e){if(T.indexOf("=")>=0)throw new Error(`Invalid define: ${T}`);t.push(`--define:${T}=${e[T]}`)}if(a)for(let T in a){if(T.indexOf("=")>=0)throw new Error(`Invalid log override: ${T}`);t.push(`--log-override:${T}=${a[T]}`)}if(p)for(let T in p){if(T.indexOf("=")>=0)throw new Error(`Invalid supported: ${T}`);t.push(`--supported:${T}=${p[T]}`)}if(y)for(let T of y)t.push(`--pure:${T}`);O&&t.push("--keep-names")}function qe(t,n,r,c,m){var g;let u=[],v=[],f=Object.create(null),k=null,$=null,P=null;ye(u,n,f,r,c),Ce(u,n,f);let U=l(n,f,"sourcemap",Ue),j=l(n,f,"bundle",F),R=l(n,f,"watch",Ge),x=l(n,f,"splitting",F),D=l(n,f,"preserveSymlinks",F),C=l(n,f,"metafile",F),w=l(n,f,"outfile",S),i=l(n,f,"outdir",S),s=l(n,f,"outbase",S),o=l(n,f,"tsconfig",S),h=l(n,f,"resolveExtensions",W),b=l(n,f,"nodePaths",W),_=l(n,f,"mainFields",W),d=l(n,f,"conditions",W),e=l(n,f,"external",W),a=l(n,f,"alias",Q),p=l(n,f,"loader",Q),y=l(n,f,"outExtension",Q),O=l(n,f,"publicPath",S),A=l(n,f,"entryNames",S),T=l(n,f,"chunkNames",S),N=l(n,f,"assetNames",S),J=l(n,f,"inject",W),G=l(n,f,"banner",Q),L=l(n,f,"footer",Q),I=l(n,f,"entryPoints",Ye),M=l(n,f,"absWorkingDir",S),B=l(n,f,"stdin",Q),X=(g=l(n,f,"write",F))!=null?g:m,le=l(n,f,"allowOverwrite",F),de=l(n,f,"incremental",F)===!0,Z=l(n,f,"mangleCache",Q);if(f.plugins=!0,z(n,f,`in ${t}() call`),U&&u.push(`--sourcemap${U===!0?"":`=${U}`}`),j&&u.push("--bundle"),le&&u.push("--allow-overwrite"),R)if(u.push("--watch"),typeof R=="boolean")P={};else{let E=Object.create(null),V=l(R,E,"onRebuild",_e);z(R,E,`on "watch" in ${t}() call`),P={onRebuild:V}}if(x&&u.push("--splitting"),D&&u.push("--preserve-symlinks"),C&&u.push("--metafile"),w&&u.push(`--outfile=${w}`),i&&u.push(`--outdir=${i}`),s&&u.push(`--outbase=${s}`),o&&u.push(`--tsconfig=${o}`),h){let E=[];for(let V of h){if(V+="",V.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${V}`);E.push(V)}u.push(`--resolve-extensions=${E.join(",")}`)}if(O&&u.push(`--public-path=${O}`),A&&u.push(`--entry-names=${A}`),T&&u.push(`--chunk-names=${T}`),N&&u.push(`--asset-names=${N}`),_){let E=[];for(let V of _){if(V+="",V.indexOf(",")>=0)throw new Error(`Invalid main field: ${V}`);E.push(V)}u.push(`--main-fields=${E.join(",")}`)}if(d){let E=[];for(let V of d){if(V+="",V.indexOf(",")>=0)throw new Error(`Invalid condition: ${V}`);E.push(V)}u.push(`--conditions=${E.join(",")}`)}if(e)for(let E of e)u.push(`--external:${E}`);if(a)for(let E in a){if(E.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${E}`);u.push(`--alias:${E}=${a[E]}`)}if(G)for(let E in G){if(E.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${E}`);u.push(`--banner:${E}=${G[E]}`)}if(L)for(let E in L){if(E.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${E}`);u.push(`--footer:${E}=${L[E]}`)}if(J)for(let E of J)u.push(`--inject:${E}`);if(p)for(let E in p){if(E.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${E}`);u.push(`--loader:${E}=${p[E]}`)}if(y)for(let E in y){if(E.indexOf("=")>=0)throw new Error(`Invalid out extension: ${E}`);u.push(`--out-extension:${E}=${y[E]}`)}if(I)if(Array.isArray(I))for(let E of I)v.push(["",E+""]);else for(let[E,V]of Object.entries(I))v.push([E+"",V+""]);if(B){let E=Object.create(null),V=l(B,E,"contents",De),Fe=l(B,E,"resolveDir",S),Ve=l(B,E,"sourcefile",S),Be=l(B,E,"loader",S);z(B,E,'in "stdin" object'),Ve&&u.push(`--sourcefile=${Ve}`),Be&&u.push(`--loader=${Be}`),Fe&&($=Fe+""),typeof V=="string"?k=K(V):V instanceof Uint8Array&&(k=V)}let H=[];if(b)for(let E of b)E+="",H.push(E);return{entries:v,flags:u,write:X,stdinContents:k,stdinResolveDir:$,absWorkingDir:M,incremental:de,nodePaths:H,watch:P,mangleCache:Ae(Z)}}function et(t,n,r,c){let m=[],g=Object.create(null);ye(m,n,g,r,c),Ce(m,n,g);let u=l(n,g,"sourcemap",Ue),v=l(n,g,"tsconfigRaw",Qe),f=l(n,g,"sourcefile",S),k=l(n,g,"loader",S),$=l(n,g,"banner",S),P=l(n,g,"footer",S),U=l(n,g,"mangleCache",Q);return z(n,g,`in ${t}() call`),u&&m.push(`--sourcemap=${u===!0?"external":u}`),v&&m.push(`--tsconfig-raw=${typeof v=="string"?v:JSON.stringify(v)}`),f&&m.push(`--sourcefile=${f}`),k&&m.push(`--loader=${k}`),$&&m.push(`--banner=${$}`),P&&m.push(`--footer=${P}`),{flags:m,mangleCache:Ae(U)}}function tt(t){const n={},r={didClose:!1,reason:""};let c={},m=0,g=0,u=new Uint8Array(16*1024),v=0,f=i=>{let s=v+i.length;if(s>u.length){let h=new Uint8Array(s*2);h.set(u),u=h}u.set(i,v),v+=i.length;let o=0;for(;o+4<=v;){let h=Oe(u,o);if(o+4+h>v)break;o+=4,R(u.subarray(o,o+h)),o+=h}o>0&&(u.copyWithin(0,o,v),v-=o)},k=i=>{r.didClose=!0,i&&(r.reason=": "+(i.message||i));const s="The service was stopped"+r.reason;for(let o in c)c[o](s,null);c={}},$=(i,s,o)=>{if(r.didClose)return o("The service is no longer running"+r.reason,null);let h=m++;c[h]=(b,_)=>{try{o(b,_)}finally{i&&i.unref()}},i&&i.ref(),t.writeToStdin(Se({id:h,isRequest:!0,value:s}))},P=(i,s)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);t.writeToStdin(Se({id:i,isRequest:!1,value:s}))},U=(i,s)=>q(this,null,function*(){try{if(s.command==="ping"){P(i,{});return}if(typeof s.key=="number"){const o=n[s.key];if(o){const h=o[s.command];if(h){yield h(i,s);return}}}throw new Error("Invalid command: "+s.command)}catch(o){P(i,{errors:[oe(o,t,null,void 0,"")]})}}),j=!0,R=i=>{if(j){j=!1;let o=String.fromCharCode(...i);if(o!=="0.15.17")throw new Error(`Cannot start service: Host version "0.15.17" does not match binary version ${JSON.stringify(o)}`);return}let s=Je(i);if(s.isRequest)U(s.id,s.value);else{let o=c[s.id];delete c[s.id],s.value.error?o(s.value.error,{}):o(null,s.value)}};return{readFromStdout:f,afterClose:k,service:{buildOrServe:({callName:i,refs:s,serveOptions:o,options:h,isTTY:b,defaultWD:_,callback:d})=>{let e=0;const a=g++,p={},y={ref(){++e===1&&s&&s.ref()},unref(){--e===0&&(delete n[a],s&&s.unref())}};n[a]=p,y.ref(),nt(i,a,$,P,y,t,p,h,o,b,_,r,(O,A)=>{try{d(O,A)}finally{y.unref()}})},transform:({callName:i,refs:s,input:o,options:h,isTTY:b,fs:_,callback:d})=>{const e=Ie();let a=p=>{try{if(typeof o!="string"&&!(o instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:y,mangleCache:O}=et(i,h,b,Te),A={command:"transform",flags:y,inputFS:p!==null,input:p!==null?K(p):typeof o=="string"?K(o):o};O&&(A.mangleCache=O),$(s,A,(T,N)=>{if(T)return d(new Error(T),null);let J=ee(N.errors,e),G=ee(N.warnings,e),L=1,I=()=>{if(--L===0){let M={warnings:G,code:N.code,map:N.map};N.mangleCache&&(M.mangleCache=N?.mangleCache),d(null,M)}};if(J.length>0)return d(ue("Transform failed",J,G),null);N.codeFS&&(L++,_.readFile(N.code,(M,B)=>{M!==null?d(M,null):(N.code=B,I())})),N.mapFS&&(L++,_.readFile(N.map,(M,B)=>{M!==null?d(M,null):(N.map=B,I())})),I()})}catch(y){let O=[];try{ye(O,h,{},b,Te)}catch{}const A=oe(y,t,e,void 0,"");$(s,{command:"error",flags:O,error:A},()=>{A.detail=e.load(A.detail),d(ue("Transform failed",[A],[]),null)})}};if((typeof o=="string"||o instanceof Uint8Array)&&o.length>1024*1024){let p=a;a=()=>_.writeFile(o,p)}a(null)},formatMessages:({callName:i,refs:s,messages:o,options:h,callback:b})=>{let _=se(o,"messages",null,"");if(!h)throw new Error(`Missing second argument in ${i}() call`);let d={},e=l(h,d,"kind",S),a=l(h,d,"color",F),p=l(h,d,"terminalWidth",ae);if(z(h,d,`in ${i}() call`),e===void 0)throw new Error(`Missing "kind" in ${i}() call`);if(e!=="error"&&e!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${i}() call`);let y={command:"format-msgs",messages:_,isWarning:e==="warning"};a!==void 0&&(y.color=a),p!==void 0&&(y.terminalWidth=p),$(s,y,(O,A)=>{if(O)return b(new Error(O),null);b(null,A.messages)})},analyzeMetafile:({callName:i,refs:s,metafile:o,options:h,callback:b})=>{h===void 0&&(h={});let _={},d=l(h,_,"color",F),e=l(h,_,"verbose",F);z(h,_,`in ${i}() call`);let a={command:"analyze-metafile",metafile:o};d!==void 0&&(a.color=d),e!==void 0&&(a.verbose=e),$(s,a,(p,y)=>{if(p)return b(new Error(p),null);b(null,y.result)})}}}}function nt(t,n,r,c,m,g,u,v,f,k,$,P,U){const j=Ie(),R=(w,i,s,o)=>{const h=[];try{ye(h,v,{},k,$e)}catch{}const b=oe(w,g,j,s,i);r(m,{command:"error",flags:h,error:b},()=>{b.detail=j.load(b.detail),o(b)})},x=(w,i)=>{R(w,i,void 0,s=>{U(ue("Build failed",[s],[]),null)})};let D;if(typeof v=="object"){const w=v.plugins;if(w!==void 0){if(!Array.isArray(w))throw new Error('"plugins" must be an array');D=w}}if(D&&D.length>0){if(g.isSync){x(new Error("Cannot use plugins in synchronous API calls"),"");return}st(n,r,c,m,g,u,v,D,j).then(w=>{if(!w.ok){x(w.error,w.pluginName);return}try{C(w.requestPlugins,w.runOnEndCallbacks)}catch(i){x(i,"")}},w=>x(w,""));return}try{C(null,(w,i,s)=>s())}catch(w){x(w,"")}function C(w,i){let s=!g.isWriteUnavailable,{entries:o,flags:h,write:b,stdinContents:_,stdinResolveDir:d,absWorkingDir:e,incremental:a,nodePaths:p,watch:y,mangleCache:O}=qe(t,v,k,$e,s),A={command:"build",key:n,entries:o,flags:h,write:b,stdinContents:_,stdinResolveDir:d,absWorkingDir:e||$,incremental:a,nodePaths:p};w&&(A.plugins=w),O&&(A.mangleCache=O);let T=f&&rt(n,r,c,m,u,f,A),N,J,G=(I,M)=>{I.outputFiles&&(M.outputFiles=I.outputFiles.map(lt)),I.metafile&&(M.metafile=JSON.parse(I.metafile)),I.mangleCache&&(M.mangleCache=I.mangleCache),I.writeToStdout!==void 0&&console.log(ie(I.writeToStdout).replace(/\n$/,""))},L=(I,M)=>{let B={errors:ee(I.errors,j),warnings:ee(I.warnings,j)};G(I,B),i(B,R,()=>{if(B.errors.length>0)return M(ue("Build failed",B.errors,B.warnings),null);if(I.rebuild){if(!N){let X=!1;N=()=>new Promise((le,de)=>{if(X||P.didClose)throw new Error("Cannot rebuild");r(m,{command:"rebuild",key:n},(Z,H)=>{if(Z)return M(ue("Build failed",[{id:"",pluginName:"",text:Z,location:null,notes:[],detail:void 0}],[]),null);L(H,(E,V)=>{E?de(E):le(V)})})}),m.ref(),N.dispose=()=>{X||(X=!0,r(m,{command:"rebuild-dispose",key:n},()=>{}),m.unref())}}B.rebuild=N}if(I.watch){if(!J){let X=!1;m.ref(),J=()=>{X||(X=!0,delete u["watch-rebuild"],r(m,{command:"watch-stop",key:n},()=>{}),m.unref())},y&&(u["watch-rebuild"]=(le,de)=>{try{let Z=de.args,H={errors:ee(Z.errors,j),warnings:ee(Z.warnings,j)};G(Z,H),i(H,R,()=>{if(H.errors.length>0){y.onRebuild&&y.onRebuild(ue("Build failed",H.errors,H.warnings),null);return}H.stop=J,y.onRebuild&&y.onRebuild(null,H)})}catch(Z){console.error(Z)}c(le,{})})}B.stop=J}M(null,B)})};if(b&&g.isWriteUnavailable)throw new Error('The "write" option is unavailable in this environment');if(a&&g.isSync)throw new Error('Cannot use "incremental" with a synchronous build');if(y&&g.isSync)throw new Error('Cannot use "watch" with a synchronous build');r(m,A,(I,M)=>{if(I)return U(new Error(I),null);if(T){let B=M,X=!1;m.ref();let le={port:B.port,host:B.host,wait:T.wait,stop(){X||(X=!0,T.stop(),m.unref())}};return m.ref(),T.wait.then(m.unref,m.unref),U(null,le)}return L(M,U)})}}var rt=(t,n,r,c,m,g,u)=>{let v={},f=l(g,v,"port",ae),k=l(g,v,"host",S),$=l(g,v,"servedir",S),P=l(g,v,"onRequest",_e),U=new Promise((j,R)=>{m["serve-wait"]=(x,D)=>{D.error!==null?R(new Error(D.error)):j(),r(x,{})}});return u.serve={},z(g,v,"in serve() call"),f!==void 0&&(u.serve.port=f),k!==void 0&&(u.serve.host=k),$!==void 0&&(u.serve.servedir=$),m["serve-request"]=(j,R)=>{P&&P(R.args),r(j,{})},{wait:U,stop(){n(c,{command:"serve-stop",key:t},()=>{})}}},st=(t,n,r,c,m,g,u,v,f)=>q(void 0,null,function*(){let k=[],$=[],P={},U={},j=0,R=0,x=[],D=!1;v=[...v];for(let w of v){let i={};if(typeof w!="object")throw new Error(`Plugin at index ${R} must be an object`);const s=l(w,i,"name",S);if(typeof s!="string"||s==="")throw new Error(`Plugin at index ${R} is missing a name`);try{let o=l(w,i,"setup",_e);if(typeof o!="function")throw new Error("Plugin is missing a setup function");z(w,i,`on plugin ${JSON.stringify(s)}`);let h={name:s,onResolve:[],onLoad:[]};R++;let _=o({initialOptions:u,resolve:(d,e={})=>{if(!D)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof d!="string")throw new Error("The path to resolve must be a string");let a=Object.create(null),p=l(e,a,"pluginName",S),y=l(e,a,"importer",S),O=l(e,a,"namespace",S),A=l(e,a,"resolveDir",S),T=l(e,a,"kind",S),N=l(e,a,"pluginData",ge);return z(e,a,"in resolve() call"),new Promise((J,G)=>{const L={command:"resolve",path:d,key:t,pluginName:s};p!=null&&(L.pluginName=p),y!=null&&(L.importer=y),O!=null&&(L.namespace=O),A!=null&&(L.resolveDir=A),T!=null&&(L.kind=T),N!=null&&(L.pluginData=f.store(N)),n(c,L,(I,M)=>{I!==null?G(new Error(I)):J({errors:ee(M.errors,f),warnings:ee(M.warnings,f),path:M.path,external:M.external,sideEffects:M.sideEffects,namespace:M.namespace,suffix:M.suffix,pluginData:f.load(M.pluginData)})})})},onStart(d){let e='This error came from the "onStart" callback registered here:',a=we(new Error(e),m,"onStart");k.push({name:s,callback:d,note:a})},onEnd(d){let e='This error came from the "onEnd" callback registered here:',a=we(new Error(e),m,"onEnd");$.push({name:s,callback:d,note:a})},onResolve(d,e){let a='This error came from the "onResolve" callback registered here:',p=we(new Error(a),m,"onResolve"),y={},O=l(d,y,"filter",pe),A=l(d,y,"namespace",S);if(z(d,y,`in onResolve() call for plugin ${JSON.stringify(s)}`),O==null)throw new Error("onResolve() call is missing a filter");let T=j++;P[T]={name:s,callback:e,note:p},h.onResolve.push({id:T,filter:O.source,namespace:A||""})},onLoad(d,e){let a='This error came from the "onLoad" callback registered here:',p=we(new Error(a),m,"onLoad"),y={},O=l(d,y,"filter",pe),A=l(d,y,"namespace",S);if(z(d,y,`in onLoad() call for plugin ${JSON.stringify(s)}`),O==null)throw new Error("onLoad() call is missing a filter");let T=j++;U[T]={name:s,callback:e,note:p},h.onLoad.push({id:T,filter:O.source,namespace:A||""})},esbuild:m.esbuild});_&&(yield _),x.push(h)}catch(o){return{ok:!1,error:o,pluginName:s}}}g["on-start"]=(w,i)=>q(void 0,null,function*(){let s={errors:[],warnings:[]};yield Promise.all(k.map(o=>q(void 0,[o],function*({name:h,callback:b,note:_}){try{let d=yield b();if(d!=null){if(typeof d!="object")throw new Error(`Expected onStart() callback in plugin ${JSON.stringify(h)} to return an object`);let e={},a=l(d,e,"errors",W),p=l(d,e,"warnings",W);z(d,e,`from onStart() callback in plugin ${JSON.stringify(h)}`),a!=null&&s.errors.push(...se(a,"errors",f,h)),p!=null&&s.warnings.push(...se(p,"warnings",f,h))}}catch(d){s.errors.push(oe(d,m,f,_&&_(),h))}}))),r(w,s)}),g["on-resolve"]=(w,i)=>q(void 0,null,function*(){let s={},o="",h,b;for(let _ of i.ids)try{({name:o,callback:h,note:b}=P[_]);let d=yield h({path:i.path,importer:i.importer,namespace:i.namespace,resolveDir:i.resolveDir,kind:i.kind,pluginData:f.load(i.pluginData)});if(d!=null){if(typeof d!="object")throw new Error(`Expected onResolve() callback in plugin ${JSON.stringify(o)} to return an object`);let e={},a=l(d,e,"pluginName",S),p=l(d,e,"path",S),y=l(d,e,"namespace",S),O=l(d,e,"suffix",S),A=l(d,e,"external",F),T=l(d,e,"sideEffects",F),N=l(d,e,"pluginData",ge),J=l(d,e,"errors",W),G=l(d,e,"warnings",W),L=l(d,e,"watchFiles",W),I=l(d,e,"watchDirs",W);z(d,e,`from onResolve() callback in plugin ${JSON.stringify(o)}`),s.id=_,a!=null&&(s.pluginName=a),p!=null&&(s.path=p),y!=null&&(s.namespace=y),O!=null&&(s.suffix=O),A!=null&&(s.external=A),T!=null&&(s.sideEffects=T),N!=null&&(s.pluginData=f.store(N)),J!=null&&(s.errors=se(J,"errors",f,o)),G!=null&&(s.warnings=se(G,"warnings",f,o)),L!=null&&(s.watchFiles=be(L,"watchFiles")),I!=null&&(s.watchDirs=be(I,"watchDirs"));break}}catch(d){s={id:_,errors:[oe(d,m,f,b&&b(),o)]};break}r(w,s)}),g["on-load"]=(w,i)=>q(void 0,null,function*(){let s={},o="",h,b;for(let _ of i.ids)try{({name:o,callback:h,note:b}=U[_]);let d=yield h({path:i.path,namespace:i.namespace,suffix:i.suffix,pluginData:f.load(i.pluginData)});if(d!=null){if(typeof d!="object")throw new Error(`Expected onLoad() callback in plugin ${JSON.stringify(o)} to return an object`);let e={},a=l(d,e,"pluginName",S),p=l(d,e,"contents",De),y=l(d,e,"resolveDir",S),O=l(d,e,"pluginData",ge),A=l(d,e,"loader",S),T=l(d,e,"errors",W),N=l(d,e,"warnings",W),J=l(d,e,"watchFiles",W),G=l(d,e,"watchDirs",W);z(d,e,`from onLoad() callback in plugin ${JSON.stringify(o)}`),s.id=_,a!=null&&(s.pluginName=a),p instanceof Uint8Array?s.contents=p:p!=null&&(s.contents=K(p)),y!=null&&(s.resolveDir=y),O!=null&&(s.pluginData=f.store(O)),A!=null&&(s.loader=A),T!=null&&(s.errors=se(T,"errors",f,o)),N!=null&&(s.warnings=se(N,"warnings",f,o)),J!=null&&(s.watchFiles=be(J,"watchFiles")),G!=null&&(s.watchDirs=be(G,"watchDirs"));break}}catch(d){s={id:_,errors:[oe(d,m,f,b&&b(),o)]};break}r(w,s)});let C=(w,i,s)=>s();return $.length>0&&(C=(w,i,s)=>{(()=>q(void 0,null,function*(){for(const{name:o,callback:h,note:b}of $)try{yield h(w)}catch(_){w.errors.push(yield new Promise(d=>i(_,o,b&&b(),d)))}}))().then(s)}),D=!0,{ok:!0,requestPlugins:x,runOnEndCallbacks:C}});function Ie(){const t=new Map;let n=0;return{load(r){return t.get(r)},store(r){if(r===void 0)return-1;const c=n++;return t.set(c,r),c}}}function we(t,n,r){let c,m=!1;return()=>{if(m)return c;m=!0;try{let g=(t.stack+"").split(`
`);g.splice(1,1);let u=Ne(n,g,r);if(u)return c={text:t.message,location:u},c}catch{}}}function oe(t,n,r,c,m){let g="Internal error",u=null;try{g=(t&&t.message||t)+""}catch{}try{u=Ne(n,(t.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:m,text:g,location:u,notes:c?[c]:[],detail:r?r.store(t):-1}}function Ne(t,n,r){let c="    at ";if(t.readFileSync&&!n[0].startsWith(c)&&n[1].startsWith(c))for(let m=1;m<n.length;m++){let g=n[m];if(!!g.startsWith(c))for(g=g.slice(c.length);;){let u=/^(?:new |async )?\S+ \((.*)\)$/.exec(g);if(u){g=u[1];continue}if(u=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(g),u){g=u[1];continue}if(u=/^(\S+):(\d+):(\d+)$/.exec(g),u){let v;try{v=t.readFileSync(u[1],"utf8")}catch{break}let f=v.split(/\r\n|\r|\n|\u2028|\u2029/)[+u[2]-1]||"",k=+u[3]-1,$=f.slice(k,k+r.length)===r?r.length:0;return{file:u[1],namespace:"file",line:+u[2],column:K(f.slice(0,k)).length,length:K(f.slice(k,k+$)).length,lineText:f+`
`+n.slice(1).join(`
`),suggestion:""}}break}}return null}function ue(t,n,r){let c=5,m=n.length<1?"":` with ${n.length} error${n.length<2?"":"s"}:`+n.slice(0,c+1).map((u,v)=>{if(v===c)return`
...`;if(!u.location)return`
error: ${u.text}`;let{file:f,line:k,column:$}=u.location,P=u.pluginName?`[plugin: ${u.pluginName}] `:"";return`
${f}:${k}:${$}: ERROR: ${P}${u.text}`}).join(""),g=new Error(`${t}${m}`);return g.errors=n,g.warnings=r,g}function ee(t,n){for(const r of t)r.detail=n.load(r.detail);return t}function Me(t,n){if(t==null)return null;let r={},c=l(t,r,"file",S),m=l(t,r,"namespace",S),g=l(t,r,"line",ae),u=l(t,r,"column",ae),v=l(t,r,"length",ae),f=l(t,r,"lineText",S),k=l(t,r,"suggestion",S);return z(t,r,n),{file:c||"",namespace:m||"",line:g||0,column:u||0,length:v||0,lineText:f||"",suggestion:k||""}}function se(t,n,r,c){let m=[],g=0;for(const u of t){let v={},f=l(u,v,"id",S),k=l(u,v,"pluginName",S),$=l(u,v,"text",S),P=l(u,v,"location",Re),U=l(u,v,"notes",W),j=l(u,v,"detail",ge),R=`in element ${g} of "${n}"`;z(u,v,R);let x=[];if(U)for(const D of U){let C={},w=l(D,C,"text",S),i=l(D,C,"location",Re);z(D,C,R),x.push({text:w||"",location:Me(i,R)})}m.push({id:f||"",pluginName:k||c,text:$||"",location:Me(P,R),notes:x,detail:r?r.store(j):-1}),g++}return m}function be(t,n){const r=[];for(const c of t){if(typeof c!="string")throw new Error(`${JSON.stringify(n)} must be an array of strings`);r.push(c)}return r}function lt({path:t,contents:n}){let r=null;return{path:t,contents:n,get text(){const c=this.contents;return(r===null||c!==n)&&(n=c,r=ie(c)),r}}}var it="0.15.17",at=t=>ve().build(t),ot=()=>{throw new Error('The "serve" API only works in node')},ut=(t,n)=>ve().transform(t,n),ct=(t,n)=>ve().formatMessages(t,n),ft=(t,n)=>ve().analyzeMetafile(t,n),dt=()=>{throw new Error('The "buildSync" API only works in node')},ht=()=>{throw new Error('The "transformSync" API only works in node')},mt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},gt=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},ce,ke,ve=()=>{if(ke)return ke;throw ce?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},pt=t=>{t=Ze(t||{});let n=t.wasmURL,r=t.wasmModule,c=t.worker!==!1;if(!n&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(ce)throw new Error('Cannot call "initialize" more than once');return ce=yt(n||"",r,c),ce.catch(()=>{ce=void 0}),ce},yt=(t,n,r)=>q(void 0,null,function*(){let c;if(r){let k=new Blob([`onmessage=((postMessage) => {
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
        go.argv = ["", \`--service=\${"0.15.17"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok)
            throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});c=new Worker(URL.createObjectURL(k))}else{let k=($=>{var P=(x,D,C)=>new Promise((w,i)=>{var s=b=>{try{h(C.next(b))}catch(_){i(_)}},o=b=>{try{h(C.throw(b))}catch(_){i(_)}},h=b=>b.done?w(b.value):Promise.resolve(b.value).then(s,o);h((C=C.apply(x,D)).next())});let U,j={};for(let x=self;x;x=Object.getPrototypeOf(x))for(let D of Object.getOwnPropertyNames(x))D in j||Object.defineProperty(j,D,{get:()=>self[D]});(()=>{const x=()=>{const w=new Error("not implemented");return w.code="ENOSYS",w};if(!j.fs){let w="";j.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(i,s){w+=C.decode(s);const o=w.lastIndexOf(`
`);return o!=-1&&(console.log(w.substr(0,o)),w=w.substr(o+1)),s.length},write(i,s,o,h,b,_){if(o!==0||h!==s.length||b!==null){_(x());return}const d=this.writeSync(i,s);_(null,d)},chmod(i,s,o){o(x())},chown(i,s,o,h){h(x())},close(i,s){s(x())},fchmod(i,s,o){o(x())},fchown(i,s,o,h){h(x())},fstat(i,s){s(x())},fsync(i,s){s(null)},ftruncate(i,s,o){o(x())},lchown(i,s,o,h){h(x())},link(i,s,o){o(x())},lstat(i,s){s(x())},mkdir(i,s,o){o(x())},open(i,s,o,h){h(x())},read(i,s,o,h,b,_){_(x())},readdir(i,s){s(x())},readlink(i,s){s(x())},rename(i,s,o){o(x())},rmdir(i,s){s(x())},stat(i,s){s(x())},symlink(i,s,o){o(x())},truncate(i,s,o){o(x())},unlink(i,s){s(x())},utimes(i,s,o,h){h(x())}}}if(j.process||(j.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw x()},pid:-1,ppid:-1,umask(){throw x()},cwd(){throw x()},chdir(){throw x()}}),!j.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!j.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!j.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!j.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const D=new TextEncoder("utf-8"),C=new TextDecoder("utf-8");j.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=e=>{e!==0&&console.warn("exit code:",e)},this._exitPromise=new Promise(e=>{this._resolveExitPromise=e}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const w=(e,a)=>{this.mem.setUint32(e+0,a,!0),this.mem.setUint32(e+4,Math.floor(a/4294967296),!0)},i=e=>{const a=this.mem.getUint32(e+0,!0),p=this.mem.getInt32(e+4,!0);return a+p*4294967296},s=e=>{const a=this.mem.getFloat64(e,!0);if(a===0)return;if(!isNaN(a))return a;const p=this.mem.getUint32(e,!0);return this._values[p]},o=(e,a)=>{if(typeof a=="number"&&a!==0){if(isNaN(a)){this.mem.setUint32(e+4,2146959360,!0),this.mem.setUint32(e,0,!0);return}this.mem.setFloat64(e,a,!0);return}if(a===void 0){this.mem.setFloat64(e,0,!0);return}let y=this._ids.get(a);y===void 0&&(y=this._idPool.pop(),y===void 0&&(y=this._values.length),this._values[y]=a,this._goRefCounts[y]=0,this._ids.set(a,y)),this._goRefCounts[y]++;let O=0;switch(typeof a){case"object":a!==null&&(O=1);break;case"string":O=2;break;case"symbol":O=3;break;case"function":O=4;break}this.mem.setUint32(e+4,2146959360|O,!0),this.mem.setUint32(e,y,!0)},h=e=>{const a=i(e+0),p=i(e+8);return new Uint8Array(this._inst.exports.mem.buffer,a,p)},b=e=>{const a=i(e+0),p=i(e+8),y=new Array(p);for(let O=0;O<p;O++)y[O]=s(a+O*8);return y},_=e=>{const a=i(e+0),p=i(e+8);return C.decode(new DataView(this._inst.exports.mem.buffer,a,p))},d=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":e=>{e>>>=0;const a=this.mem.getInt32(e+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(a)},"runtime.wasmWrite":e=>{e>>>=0;const a=i(e+8),p=i(e+16),y=this.mem.getInt32(e+24,!0);j.fs.writeSync(a,new Uint8Array(this._inst.exports.mem.buffer,p,y))},"runtime.resetMemoryDataView":e=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":e=>{e>>>=0,w(e+8,(d+performance.now())*1e6)},"runtime.walltime":e=>{e>>>=0;const a=new Date().getTime();w(e+8,a/1e3),this.mem.setInt32(e+16,a%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":e=>{e>>>=0;const a=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(a,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(a);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},i(e+8)+1)),this.mem.setInt32(e+16,a,!0)},"runtime.clearTimeoutEvent":e=>{e>>>=0;const a=this.mem.getInt32(e+8,!0);clearTimeout(this._scheduledTimeouts.get(a)),this._scheduledTimeouts.delete(a)},"runtime.getRandomData":e=>{e>>>=0,crypto.getRandomValues(h(e+8))},"syscall/js.finalizeRef":e=>{e>>>=0;const a=this.mem.getUint32(e+8,!0);if(this._goRefCounts[a]--,this._goRefCounts[a]===0){const p=this._values[a];this._values[a]=null,this._ids.delete(p),this._idPool.push(a)}},"syscall/js.stringVal":e=>{e>>>=0,o(e+24,_(e+8))},"syscall/js.valueGet":e=>{e>>>=0;const a=Reflect.get(s(e+8),_(e+16));e=this._inst.exports.getsp()>>>0,o(e+32,a)},"syscall/js.valueSet":e=>{e>>>=0,Reflect.set(s(e+8),_(e+16),s(e+32))},"syscall/js.valueDelete":e=>{e>>>=0,Reflect.deleteProperty(s(e+8),_(e+16))},"syscall/js.valueIndex":e=>{e>>>=0,o(e+24,Reflect.get(s(e+8),i(e+16)))},"syscall/js.valueSetIndex":e=>{e>>>=0,Reflect.set(s(e+8),i(e+16),s(e+24))},"syscall/js.valueCall":e=>{e>>>=0;try{const a=s(e+8),p=Reflect.get(a,_(e+16)),y=b(e+32),O=Reflect.apply(p,a,y);e=this._inst.exports.getsp()>>>0,o(e+56,O),this.mem.setUint8(e+64,1)}catch(a){e=this._inst.exports.getsp()>>>0,o(e+56,a),this.mem.setUint8(e+64,0)}},"syscall/js.valueInvoke":e=>{e>>>=0;try{const a=s(e+8),p=b(e+16),y=Reflect.apply(a,void 0,p);e=this._inst.exports.getsp()>>>0,o(e+40,y),this.mem.setUint8(e+48,1)}catch(a){e=this._inst.exports.getsp()>>>0,o(e+40,a),this.mem.setUint8(e+48,0)}},"syscall/js.valueNew":e=>{e>>>=0;try{const a=s(e+8),p=b(e+16),y=Reflect.construct(a,p);e=this._inst.exports.getsp()>>>0,o(e+40,y),this.mem.setUint8(e+48,1)}catch(a){e=this._inst.exports.getsp()>>>0,o(e+40,a),this.mem.setUint8(e+48,0)}},"syscall/js.valueLength":e=>{e>>>=0,w(e+16,parseInt(s(e+8).length))},"syscall/js.valuePrepareString":e=>{e>>>=0;const a=D.encode(String(s(e+8)));o(e+16,a),w(e+24,a.length)},"syscall/js.valueLoadString":e=>{e>>>=0;const a=s(e+8);h(e+16).set(a)},"syscall/js.valueInstanceOf":e=>{e>>>=0,this.mem.setUint8(e+24,s(e+8)instanceof s(e+16)?1:0)},"syscall/js.copyBytesToGo":e=>{e>>>=0;const a=h(e+8),p=s(e+32);if(!(p instanceof Uint8Array||p instanceof Uint8ClampedArray)){this.mem.setUint8(e+48,0);return}const y=p.subarray(0,a.length);a.set(y),w(e+40,y.length),this.mem.setUint8(e+48,1)},"syscall/js.copyBytesToJS":e=>{e>>>=0;const a=s(e+8),p=h(e+16);if(!(a instanceof Uint8Array||a instanceof Uint8ClampedArray)){this.mem.setUint8(e+48,0);return}const y=p.subarray(0,a.length);a.set(y),w(e+40,y.length),this.mem.setUint8(e+48,1)},debug:e=>{console.log(e)}}}}run(w){return P(this,null,function*(){if(!(w instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=w,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,j,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[j,5],[this,6]]),this._idPool=[],this.exited=!1;let i=4096;const s=e=>{const a=i,p=D.encode(e+"\0");return new Uint8Array(this.mem.buffer,i,p.length).set(p),i+=p.length,i%8!==0&&(i+=8-i%8),a},o=this.argv.length,h=[];this.argv.forEach(e=>{h.push(s(e))}),h.push(0),Object.keys(this.env).sort().forEach(e=>{h.push(s(`${e}=${this.env[e]}`))}),h.push(0);const _=i;h.forEach(e=>{this.mem.setUint32(i,e,!0),this.mem.setUint32(i+4,0,!0),i+=8});const d=4096+8192;if(i>=d)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(o,_),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(w){const i=this;return function(){const s={id:w,this:this,args:arguments};return i._pendingEvent=s,i._resume(),s.result}}}})(),U=({data:x})=>{let D=new TextDecoder,C=j.fs,w="";C.writeSync=(b,_)=>{if(b===1)$(_);else if(b===2){w+=D.decode(_);let d=w.split(`
`);d.length>1&&console.log(d.slice(0,-1).join(`
`)),w=d[d.length-1]}else throw new Error("Bad write");return _.length};let i=[],s,o=0;U=({data:b})=>{b.length>0&&(i.push(b),s&&s())},C.read=(b,_,d,e,a,p)=>{if(b!==0||d!==0||e!==_.length||a!==null)throw new Error("Bad read");if(i.length===0){s=()=>C.read(b,_,d,e,a,p);return}let y=i[0],O=Math.max(0,Math.min(e,y.length-o));_.set(y.subarray(o,o+O),d),o+=O,o===y.length&&(i.shift(),o=0),p(null,O)};let h=new j.Go;h.argv=["","--service=0.15.17"],R(x,h).then(b=>{$(null),h.run(b)},b=>{$(b)})};function R(x,D){return P(this,null,function*(){if(x instanceof WebAssembly.Module)return WebAssembly.instantiate(x,D.importObject);const C=yield fetch(x);if(!C.ok)throw new Error(`Failed to download ${JSON.stringify(x)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(C.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(C,D.importObject)).instance;const w=yield C.arrayBuffer();return(yield WebAssembly.instantiate(w,D.importObject)).instance})}return x=>U(x)})($=>c.onmessage({data:$}));c={onmessage:null,postMessage:$=>setTimeout(()=>k({data:$})),terminate(){}}}let m,g;const u=new Promise((k,$)=>{m=k,g=$});c.onmessage=({data:k})=>{c.onmessage=({data:$})=>v($),k?g(k):m()},c.postMessage(n||new URL(t,location.href).toString());let{readFromStdout:v,service:f}=tt({writeToStdin(k){c.postMessage(k)},isSync:!1,isWriteUnavailable:!0,esbuild:me});yield u,ke={build:k=>new Promise(($,P)=>f.buildOrServe({callName:"build",refs:null,serveOptions:null,options:k,isTTY:!1,defaultWD:"/",callback:(U,j)=>U?P(U):$(j)})),transform:(k,$)=>new Promise((P,U)=>f.transform({callName:"transform",refs:null,input:k,options:$||{},isTTY:!1,fs:{readFile(j,R){R(new Error("Internal error"),null)},writeFile(j,R){R(null)}},callback:(j,R)=>j?U(j):P(R)})),formatMessages:(k,$)=>new Promise((P,U)=>f.formatMessages({callName:"formatMessages",refs:null,messages:k,options:$,callback:(j,R)=>j?U(j):P(R)})),analyzeMetafile:(k,$)=>new Promise((P,U)=>f.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof k=="string"?k:JSON.stringify(k),options:$,callback:(j,R)=>j?U(j):P(R)}))}}),wt=me})(Y)})(Ee);const xt=vt(Ee.exports),_t=bt({__proto__:null,default:xt},[Ee.exports]);exports.browser=_t;
//# sourceMappingURL=esbuild-14df982c.cjs.map
