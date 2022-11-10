"use strict";function yt(H,de){for(var ee=0;ee<de.length;ee++){const te=de[ee];if(typeof te!="string"&&!Array.isArray(te)){for(const ne in te)if(ne!=="default"&&!(ne in H)){const ce=Object.getOwnPropertyDescriptor(te,ne);ce&&Object.defineProperty(H,ne,ce.get?ce:{enumerable:!0,get:()=>te[ne]})}}}return Object.freeze(Object.defineProperty(H,Symbol.toStringTag,{value:"Module"}))}function wt(H){return H&&H.__esModule&&Object.prototype.hasOwnProperty.call(H,"default")?H.default:H}var Ee={exports:{}};(function(H){(de=>{var ee=Object.defineProperty,te=Object.getOwnPropertyDescriptor,ne=Object.getOwnPropertyNames,ce=Object.prototype.hasOwnProperty,Be=(e,n)=>{for(var r in n)ee(e,r,{get:n[r],enumerable:!0})},Le=(e,n,r,h)=>{if(n&&typeof n=="object"||typeof n=="function")for(let g of ne(n))!ce.call(e,g)&&g!==r&&ee(e,g,{get:()=>n[g],enumerable:!(h=te(n,g))||h.enumerable});return e},We=e=>Le(ee({},"__esModule",{value:!0}),e),Z=(e,n,r)=>new Promise((h,g)=>{var b=u=>{try{p(r.next(u))}catch(j){g(j)}},a=u=>{try{p(r.throw(u))}catch(j){g(j)}},p=u=>u.done?h(u.value):Promise.resolve(u.value).then(b,a);p((r=r.apply(e,n)).next())}),he={};Be(he,{analyzeMetafile:()=>ut,analyzeMetafileSync:()=>ht,build:()=>st,buildSync:()=>ct,default:()=>pt,formatMessages:()=>at,formatMessagesSync:()=>dt,initialize:()=>mt,serve:()=>it,transform:()=>ot,transformSync:()=>ft,version:()=>lt}),de.exports=We(he);function Se(e){let n=h=>{if(h===null)r.write8(0);else if(typeof h=="boolean")r.write8(1),r.write8(+h);else if(typeof h=="number")r.write8(2),r.write32(h|0);else if(typeof h=="string")r.write8(3),r.write(X(h));else if(h instanceof Uint8Array)r.write8(4),r.write(h);else if(h instanceof Array){r.write8(5),r.write32(h.length);for(let g of h)n(g)}else{let g=Object.keys(h);r.write8(6),r.write32(g.length);for(let b of g)r.write(X(b)),n(h[b])}},r=new je;return r.write32(0),r.write32(e.id<<1|+!e.isRequest),n(e.value),xe(r.buf,r.len-4,0),r.buf.subarray(0,r.len)}function ze(e){let n=()=>{switch(r.read8()){case 0:return null;case 1:return!!r.read8();case 2:return r.read32();case 3:return se(r.read());case 4:return r.read();case 5:{let a=r.read32(),p=[];for(let u=0;u<a;u++)p.push(n());return p}case 6:{let a=r.read32(),p={};for(let u=0;u<a;u++)p[se(r.read())]=n();return p}default:throw new Error("Invalid packet")}},r=new je(e),h=r.read32(),g=(h&1)===0;h>>>=1;let b=n();if(r.ptr!==e.length)throw new Error("Invalid packet");return{id:h,isRequest:g,value:b}}var je=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let n=new Uint8Array((this.len+e)*2);n.set(this.buf),this.buf=n}return this.len+=e,this.len-e}write8(e){let n=this._write(1);this.buf[n]=e}write32(e){let n=this._write(4);xe(this.buf,e,n)}write(e){let n=this._write(4+e.length);xe(this.buf,e.length,n),this.buf.set(e,n+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return Oe(this.buf,this._read(4))}read(){let e=this.read32(),n=new Uint8Array(e),r=this._read(n.length);return n.set(this.buf.subarray(r,r+e)),n}},X,se;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,n=new TextDecoder;X=r=>e.encode(r),se=r=>n.decode(r)}else if(typeof Buffer<"u")X=e=>{let n=Buffer.from(e);return n instanceof Uint8Array||(n=new Uint8Array(n)),n},se=e=>{let{buffer:n,byteOffset:r,byteLength:h}=e;return Buffer.from(n,r,h).toString()};else throw new Error("No UTF-8 codec found");function Oe(e,n){return e[n++]|e[n++]<<8|e[n++]<<16|e[n++]<<24}function xe(e,n,r){e[r++]=n,e[r++]=n>>8,e[r++]=n>>16,e[r++]=n>>24}var $e="warning",Te="silent";function Pe(e){if(e+="",e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var me=()=>null,V=e=>typeof e=="boolean"?null:"a boolean",Je=e=>typeof e=="boolean"||typeof e=="object"&&!Array.isArray(e)?null:"a boolean or an object",S=e=>typeof e=="string"?null:"a string",ge=e=>e instanceof RegExp?null:"a RegExp object",ie=e=>typeof e=="number"&&e===(e|0)?null:"an integer",_e=e=>typeof e=="function"?null:"a function",L=e=>Array.isArray(e)?null:"an array",K=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",Ge=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",He=e=>typeof e=="object"&&e!==null?null:"an array or an object",De=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",Re=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",Ye=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",Qe=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",Ue=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array";function l(e,n,r,h){let g=e[r];if(n[r+""]=!0,g===void 0)return;let b=h(g);if(b!==null)throw new Error(`"${r}" must be ${b}`);return g}function z(e,n,r){for(let h in e)if(!(h in n))throw new Error(`Invalid option ${r}: "${h}"`)}function Xe(e){let n=Object.create(null),r=l(e,n,"wasmURL",S),h=l(e,n,"wasmModule",Ge),g=l(e,n,"worker",V);return z(e,n,"in initialize() call"),{wasmURL:r,wasmModule:h,worker:g}}function Ae(e){let n;if(e!==void 0){n=Object.create(null);for(let r of Object.keys(e)){let h=e[r];if(typeof h=="string"||h===!1)n[r]=h;else throw new Error(`Expected ${JSON.stringify(r)} in mangle cache to map to either a string or false`)}}return n}function pe(e,n,r,h,g){let b=l(n,r,"color",V),a=l(n,r,"logLevel",S),p=l(n,r,"logLimit",ie);b!==void 0?e.push(`--color=${b}`):h&&e.push("--color=true"),e.push(`--log-level=${a||g}`),e.push(`--log-limit=${p||0}`)}function Ce(e,n,r){let h=l(n,r,"legalComments",S),g=l(n,r,"sourceRoot",S),b=l(n,r,"sourcesContent",V),a=l(n,r,"target",Qe),p=l(n,r,"format",S),u=l(n,r,"globalName",S),j=l(n,r,"mangleProps",ge),P=l(n,r,"reserveProps",ge),E=l(n,r,"mangleQuoted",V),v=l(n,r,"minify",V),C=l(n,r,"minifySyntax",V),R=l(n,r,"minifyWhitespace",V),O=l(n,r,"minifyIdentifiers",V),w=l(n,r,"drop",L),y=l(n,r,"charset",S),m=l(n,r,"treeShaking",V),c=l(n,r,"ignoreAnnotations",V),s=l(n,r,"jsx",S),f=l(n,r,"jsxFactory",S),x=l(n,r,"jsxFragment",S),t=l(n,r,"jsxImportSource",S),i=l(n,r,"jsxDev",V),o=l(n,r,"jsxSideEffects",V),d=l(n,r,"define",K),_=l(n,r,"logOverride",K),D=l(n,r,"supported",K),T=l(n,r,"pure",L),I=l(n,r,"keepNames",V),U=l(n,r,"platform",S);if(h&&e.push(`--legal-comments=${h}`),g!==void 0&&e.push(`--source-root=${g}`),b!==void 0&&e.push(`--sources-content=${b}`),a&&(Array.isArray(a)?e.push(`--target=${Array.from(a).map(Pe).join(",")}`):e.push(`--target=${Pe(a)}`)),p&&e.push(`--format=${p}`),u&&e.push(`--global-name=${u}`),U&&e.push(`--platform=${U}`),v&&e.push("--minify"),C&&e.push("--minify-syntax"),R&&e.push("--minify-whitespace"),O&&e.push("--minify-identifiers"),y&&e.push(`--charset=${y}`),m!==void 0&&e.push(`--tree-shaking=${m}`),c&&e.push("--ignore-annotations"),w)for(let $ of w)e.push(`--drop:${$}`);if(j&&e.push(`--mangle-props=${j.source}`),P&&e.push(`--reserve-props=${P.source}`),E!==void 0&&e.push(`--mangle-quoted=${E}`),s&&e.push(`--jsx=${s}`),f&&e.push(`--jsx-factory=${f}`),x&&e.push(`--jsx-fragment=${x}`),t&&e.push(`--jsx-import-source=${t}`),i&&e.push("--jsx-dev"),o&&e.push("--jsx-side-effects"),d)for(let $ in d){if($.indexOf("=")>=0)throw new Error(`Invalid define: ${$}`);e.push(`--define:${$}=${d[$]}`)}if(_)for(let $ in _){if($.indexOf("=")>=0)throw new Error(`Invalid log override: ${$}`);e.push(`--log-override:${$}=${_[$]}`)}if(D)for(let $ in D){if($.indexOf("=")>=0)throw new Error(`Invalid supported: ${$}`);e.push(`--supported:${$}=${D[$]}`)}if(T)for(let $ of T)e.push(`--pure:${$}`);I&&e.push("--keep-names")}function Ke(e,n,r,h,g){var b;let a=[],p=[],u=Object.create(null),j=null,P=null,E=null;pe(a,n,u,r,h),Ce(a,n,u);let v=l(n,u,"sourcemap",Re),C=l(n,u,"bundle",V),R=l(n,u,"watch",Je),O=l(n,u,"splitting",V),w=l(n,u,"preserveSymlinks",V),y=l(n,u,"metafile",V),m=l(n,u,"outfile",S),c=l(n,u,"outdir",S),s=l(n,u,"outbase",S),f=l(n,u,"tsconfig",S),x=l(n,u,"resolveExtensions",L),t=l(n,u,"nodePaths",L),i=l(n,u,"mainFields",L),o=l(n,u,"conditions",L),d=l(n,u,"external",L),_=l(n,u,"loader",K),D=l(n,u,"outExtension",K),T=l(n,u,"publicPath",S),I=l(n,u,"entryNames",S),U=l(n,u,"chunkNames",S),$=l(n,u,"assetNames",S),N=l(n,u,"inject",L),W=l(n,u,"banner",K),J=l(n,u,"footer",K),B=l(n,u,"entryPoints",He),M=l(n,u,"absWorkingDir",S),A=l(n,u,"stdin",K),G=(b=l(n,u,"write",V))!=null?b:g,Y=l(n,u,"allowOverwrite",V),le=l(n,u,"incremental",V)===!0,fe=l(n,u,"mangleCache",K);if(u.plugins=!0,z(n,u,`in ${e}() call`),v&&a.push(`--sourcemap${v===!0?"":`=${v}`}`),C&&a.push("--bundle"),Y&&a.push("--allow-overwrite"),R)if(a.push("--watch"),typeof R=="boolean")E={};else{let k=Object.create(null),F=l(R,k,"onRebuild",_e);z(R,k,`on "watch" in ${e}() call`),E={onRebuild:F}}if(O&&a.push("--splitting"),w&&a.push("--preserve-symlinks"),y&&a.push("--metafile"),m&&a.push(`--outfile=${m}`),c&&a.push(`--outdir=${c}`),s&&a.push(`--outbase=${s}`),f&&a.push(`--tsconfig=${f}`),x){let k=[];for(let F of x){if(F+="",F.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${F}`);k.push(F)}a.push(`--resolve-extensions=${k.join(",")}`)}if(T&&a.push(`--public-path=${T}`),I&&a.push(`--entry-names=${I}`),U&&a.push(`--chunk-names=${U}`),$&&a.push(`--asset-names=${$}`),i){let k=[];for(let F of i){if(F+="",F.indexOf(",")>=0)throw new Error(`Invalid main field: ${F}`);k.push(F)}a.push(`--main-fields=${k.join(",")}`)}if(o){let k=[];for(let F of o){if(F+="",F.indexOf(",")>=0)throw new Error(`Invalid condition: ${F}`);k.push(F)}a.push(`--conditions=${k.join(",")}`)}if(d)for(let k of d)a.push(`--external:${k}`);if(W)for(let k in W){if(k.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${k}`);a.push(`--banner:${k}=${W[k]}`)}if(J)for(let k in J){if(k.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${k}`);a.push(`--footer:${k}=${J[k]}`)}if(N)for(let k of N)a.push(`--inject:${k}`);if(_)for(let k in _){if(k.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${k}`);a.push(`--loader:${k}=${_[k]}`)}if(D)for(let k in D){if(k.indexOf("=")>=0)throw new Error(`Invalid out extension: ${k}`);a.push(`--out-extension:${k}=${D[k]}`)}if(B)if(Array.isArray(B))for(let k of B)p.push(["",k+""]);else for(let[k,F]of Object.entries(B))p.push([k+"",F+""]);if(A){let k=Object.create(null),F=l(A,k,"contents",Ue),ve=l(A,k,"resolveDir",S),Fe=l(A,k,"sourcefile",S),Ve=l(A,k,"loader",S);z(A,k,'in "stdin" object'),Fe&&a.push(`--sourcefile=${Fe}`),Ve&&a.push(`--loader=${Ve}`),ve&&(P=ve+""),typeof F=="string"?j=X(F):F instanceof Uint8Array&&(j=F)}let Q=[];if(t)for(let k of t)k+="",Q.push(k);return{entries:p,flags:a,write:G,stdinContents:j,stdinResolveDir:P,absWorkingDir:M,incremental:le,nodePaths:Q,watch:E,mangleCache:Ae(fe)}}function Ze(e,n,r,h){let g=[],b=Object.create(null);pe(g,n,b,r,h),Ce(g,n,b);let a=l(n,b,"sourcemap",Re),p=l(n,b,"tsconfigRaw",Ye),u=l(n,b,"sourcefile",S),j=l(n,b,"loader",S),P=l(n,b,"banner",S),E=l(n,b,"footer",S),v=l(n,b,"mangleCache",K);return z(n,b,`in ${e}() call`),a&&g.push(`--sourcemap=${a===!0?"external":a}`),p&&g.push(`--tsconfig-raw=${typeof p=="string"?p:JSON.stringify(p)}`),u&&g.push(`--sourcefile=${u}`),j&&g.push(`--loader=${j}`),P&&g.push(`--banner=${P}`),E&&g.push(`--footer=${E}`),{flags:g,mangleCache:Ae(v)}}function qe(e){const n={},r={didClose:!1,reason:""};let h={},g=0,b=0,a=new Uint8Array(16*1024),p=0,u=c=>{let s=p+c.length;if(s>a.length){let x=new Uint8Array(s*2);x.set(a),a=x}a.set(c,p),p+=c.length;let f=0;for(;f+4<=p;){let x=Oe(a,f);if(f+4+x>p)break;f+=4,R(a.subarray(f,f+x)),f+=x}f>0&&(a.copyWithin(0,f,p),p-=f)},j=c=>{r.didClose=!0,c&&(r.reason=": "+(c.message||c));const s="The service was stopped"+r.reason;for(let f in h)h[f](s,null);h={}},P=(c,s,f)=>{if(r.didClose)return f("The service is no longer running"+r.reason,null);let x=g++;h[x]=(t,i)=>{try{f(t,i)}finally{c&&c.unref()}},c&&c.ref(),e.writeToStdin(Se({id:x,isRequest:!0,value:s}))},E=(c,s)=>{if(r.didClose)throw new Error("The service is no longer running"+r.reason);e.writeToStdin(Se({id:c,isRequest:!1,value:s}))},v=(c,s)=>Z(this,null,function*(){try{if(s.command==="ping"){E(c,{});return}if(typeof s.key=="number"){const f=n[s.key];if(f){const x=f[s.command];if(x){yield x(c,s);return}}}throw new Error("Invalid command: "+s.command)}catch(f){E(c,{errors:[oe(f,e,null,void 0,"")]})}}),C=!0,R=c=>{if(C){C=!1;let f=String.fromCharCode(...c);if(f!=="0.15.13")throw new Error(`Cannot start service: Host version "0.15.13" does not match binary version ${JSON.stringify(f)}`);return}let s=ze(c);if(s.isRequest)v(s.id,s.value);else{let f=h[s.id];delete h[s.id],s.value.error?f(s.value.error,{}):f(null,s.value)}};return{readFromStdout:u,afterClose:j,service:{buildOrServe:({callName:c,refs:s,serveOptions:f,options:x,isTTY:t,defaultWD:i,callback:o})=>{let d=0;const _=b++,D={},T={ref(){++d===1&&s&&s.ref()},unref(){--d===0&&(delete n[_],s&&s.unref())}};n[_]=D,T.ref(),et(c,_,P,E,T,e,D,x,f,t,i,r,(I,U)=>{try{o(I,U)}finally{T.unref()}})},transform:({callName:c,refs:s,input:f,options:x,isTTY:t,fs:i,callback:o})=>{const d=Ie();let _=D=>{try{if(typeof f!="string"&&!(f instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:T,mangleCache:I}=Ze(c,x,t,Te),U={command:"transform",flags:T,inputFS:D!==null,input:D!==null?X(D):typeof f=="string"?X(f):f};I&&(U.mangleCache=I),P(s,U,($,N)=>{if($)return o(new Error($),null);let W=q(N.errors,d),J=q(N.warnings,d),B=1,M=()=>{if(--B===0){let A={warnings:J,code:N.code,map:N.map};N.mangleCache&&(A.mangleCache=N?.mangleCache),o(null,A)}};if(W.length>0)return o(ae("Transform failed",W,J),null);N.codeFS&&(B++,i.readFile(N.code,(A,G)=>{A!==null?o(A,null):(N.code=G,M())})),N.mapFS&&(B++,i.readFile(N.map,(A,G)=>{A!==null?o(A,null):(N.map=G,M())})),M()})}catch(T){let I=[];try{pe(I,x,{},t,Te)}catch{}const U=oe(T,e,d,void 0,"");P(s,{command:"error",flags:I,error:U},()=>{U.detail=d.load(U.detail),o(ae("Transform failed",[U],[]),null)})}};if((typeof f=="string"||f instanceof Uint8Array)&&f.length>1024*1024){let D=_;_=()=>i.writeFile(f,D)}_(null)},formatMessages:({callName:c,refs:s,messages:f,options:x,callback:t})=>{let i=re(f,"messages",null,"");if(!x)throw new Error(`Missing second argument in ${c}() call`);let o={},d=l(x,o,"kind",S),_=l(x,o,"color",V),D=l(x,o,"terminalWidth",ie);if(z(x,o,`in ${c}() call`),d===void 0)throw new Error(`Missing "kind" in ${c}() call`);if(d!=="error"&&d!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${c}() call`);let T={command:"format-msgs",messages:i,isWarning:d==="warning"};_!==void 0&&(T.color=_),D!==void 0&&(T.terminalWidth=D),P(s,T,(I,U)=>{if(I)return t(new Error(I),null);t(null,U.messages)})},analyzeMetafile:({callName:c,refs:s,metafile:f,options:x,callback:t})=>{x===void 0&&(x={});let i={},o=l(x,i,"color",V),d=l(x,i,"verbose",V);z(x,i,`in ${c}() call`);let _={command:"analyze-metafile",metafile:f};o!==void 0&&(_.color=o),d!==void 0&&(_.verbose=d),P(s,_,(D,T)=>{if(D)return t(new Error(D),null);t(null,T.result)})}}}}function et(e,n,r,h,g,b,a,p,u,j,P,E,v){const C=Ie(),R=(m,c,s,f)=>{const x=[];try{pe(x,p,{},j,$e)}catch{}const t=oe(m,b,C,s,c);r(g,{command:"error",flags:x,error:t},()=>{t.detail=C.load(t.detail),f(t)})},O=(m,c)=>{R(m,c,void 0,s=>{v(ae("Build failed",[s],[]),null)})};let w;if(typeof p=="object"){const m=p.plugins;if(m!==void 0){if(!Array.isArray(m))throw new Error('"plugins" must be an array');w=m}}if(w&&w.length>0){if(b.isSync){O(new Error("Cannot use plugins in synchronous API calls"),"");return}nt(n,r,h,g,b,a,p,w,C).then(m=>{if(!m.ok){O(m.error,m.pluginName);return}try{y(m.requestPlugins,m.runOnEndCallbacks)}catch(c){O(c,"")}},m=>O(m,""));return}try{y(null,(m,c,s)=>s())}catch(m){O(m,"")}function y(m,c){let s=!b.isWriteUnavailable,{entries:f,flags:x,write:t,stdinContents:i,stdinResolveDir:o,absWorkingDir:d,incremental:_,nodePaths:D,watch:T,mangleCache:I}=Ke(e,p,j,$e,s),U={command:"build",key:n,entries:f,flags:x,write:t,stdinContents:i,stdinResolveDir:o,absWorkingDir:d||P,incremental:_,nodePaths:D};m&&(U.plugins=m),I&&(U.mangleCache=I);let $=u&&tt(n,r,h,g,a,u,U),N,W,J=(M,A)=>{M.outputFiles&&(A.outputFiles=M.outputFiles.map(rt)),M.metafile&&(A.metafile=JSON.parse(M.metafile)),M.mangleCache&&(A.mangleCache=M.mangleCache),M.writeToStdout!==void 0&&console.log(se(M.writeToStdout).replace(/\n$/,""))},B=(M,A)=>{let G={errors:q(M.errors,C),warnings:q(M.warnings,C)};J(M,G),c(G,R,()=>{if(G.errors.length>0)return A(ae("Build failed",G.errors,G.warnings),null);if(M.rebuild){if(!N){let Y=!1;N=()=>new Promise((le,fe)=>{if(Y||E.didClose)throw new Error("Cannot rebuild");r(g,{command:"rebuild",key:n},(Q,k)=>{if(Q)return A(ae("Build failed",[{id:"",pluginName:"",text:Q,location:null,notes:[],detail:void 0}],[]),null);B(k,(F,ve)=>{F?fe(F):le(ve)})})}),g.ref(),N.dispose=()=>{Y||(Y=!0,r(g,{command:"rebuild-dispose",key:n},()=>{}),g.unref())}}G.rebuild=N}if(M.watch){if(!W){let Y=!1;g.ref(),W=()=>{Y||(Y=!0,delete a["watch-rebuild"],r(g,{command:"watch-stop",key:n},()=>{}),g.unref())},T&&(a["watch-rebuild"]=(le,fe)=>{try{let Q=fe.args,k={errors:q(Q.errors,C),warnings:q(Q.warnings,C)};J(Q,k),c(k,R,()=>{if(k.errors.length>0){T.onRebuild&&T.onRebuild(ae("Build failed",k.errors,k.warnings),null);return}k.stop=W,T.onRebuild&&T.onRebuild(null,k)})}catch(Q){console.error(Q)}h(le,{})})}G.stop=W}A(null,G)})};if(t&&b.isWriteUnavailable)throw new Error('The "write" option is unavailable in this environment');if(_&&b.isSync)throw new Error('Cannot use "incremental" with a synchronous build');if(T&&b.isSync)throw new Error('Cannot use "watch" with a synchronous build');r(g,U,(M,A)=>{if(M)return v(new Error(M),null);if($){let G=A,Y=!1;g.ref();let le={port:G.port,host:G.host,wait:$.wait,stop(){Y||(Y=!0,$.stop(),g.unref())}};return g.ref(),$.wait.then(g.unref,g.unref),v(null,le)}return B(A,v)})}}var tt=(e,n,r,h,g,b,a)=>{let p={},u=l(b,p,"port",ie),j=l(b,p,"host",S),P=l(b,p,"servedir",S),E=l(b,p,"onRequest",_e),v=new Promise((C,R)=>{g["serve-wait"]=(O,w)=>{w.error!==null?R(new Error(w.error)):C(),r(O,{})}});return a.serve={},z(b,p,"in serve() call"),u!==void 0&&(a.serve.port=u),j!==void 0&&(a.serve.host=j),P!==void 0&&(a.serve.servedir=P),g["serve-request"]=(C,R)=>{E&&E(R.args),r(C,{})},{wait:v,stop(){n(h,{command:"serve-stop",key:e},()=>{})}}},nt=(e,n,r,h,g,b,a,p,u)=>Z(void 0,null,function*(){let j=[],P=[],E={},v={},C=0,R=0,O=[],w=!1;p=[...p];for(let m of p){let c={};if(typeof m!="object")throw new Error(`Plugin at index ${R} must be an object`);const s=l(m,c,"name",S);if(typeof s!="string"||s==="")throw new Error(`Plugin at index ${R} is missing a name`);try{let f=l(m,c,"setup",_e);if(typeof f!="function")throw new Error("Plugin is missing a setup function");z(m,c,`on plugin ${JSON.stringify(s)}`);let x={name:s,onResolve:[],onLoad:[]};R++;let i=f({initialOptions:a,resolve:(o,d={})=>{if(!w)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof o!="string")throw new Error("The path to resolve must be a string");let _=Object.create(null),D=l(d,_,"pluginName",S),T=l(d,_,"importer",S),I=l(d,_,"namespace",S),U=l(d,_,"resolveDir",S),$=l(d,_,"kind",S),N=l(d,_,"pluginData",me);return z(d,_,"in resolve() call"),new Promise((W,J)=>{const B={command:"resolve",path:o,key:e,pluginName:s};D!=null&&(B.pluginName=D),T!=null&&(B.importer=T),I!=null&&(B.namespace=I),U!=null&&(B.resolveDir=U),$!=null&&(B.kind=$),N!=null&&(B.pluginData=u.store(N)),n(h,B,(M,A)=>{M!==null?J(new Error(M)):W({errors:q(A.errors,u),warnings:q(A.warnings,u),path:A.path,external:A.external,sideEffects:A.sideEffects,namespace:A.namespace,suffix:A.suffix,pluginData:u.load(A.pluginData)})})})},onStart(o){let d='This error came from the "onStart" callback registered here:',_=ye(new Error(d),g,"onStart");j.push({name:s,callback:o,note:_})},onEnd(o){let d='This error came from the "onEnd" callback registered here:',_=ye(new Error(d),g,"onEnd");P.push({name:s,callback:o,note:_})},onResolve(o,d){let _='This error came from the "onResolve" callback registered here:',D=ye(new Error(_),g,"onResolve"),T={},I=l(o,T,"filter",ge),U=l(o,T,"namespace",S);if(z(o,T,`in onResolve() call for plugin ${JSON.stringify(s)}`),I==null)throw new Error("onResolve() call is missing a filter");let $=C++;E[$]={name:s,callback:d,note:D},x.onResolve.push({id:$,filter:I.source,namespace:U||""})},onLoad(o,d){let _='This error came from the "onLoad" callback registered here:',D=ye(new Error(_),g,"onLoad"),T={},I=l(o,T,"filter",ge),U=l(o,T,"namespace",S);if(z(o,T,`in onLoad() call for plugin ${JSON.stringify(s)}`),I==null)throw new Error("onLoad() call is missing a filter");let $=C++;v[$]={name:s,callback:d,note:D},x.onLoad.push({id:$,filter:I.source,namespace:U||""})},esbuild:g.esbuild});i&&(yield i),O.push(x)}catch(f){return{ok:!1,error:f,pluginName:s}}}b["on-start"]=(m,c)=>Z(void 0,null,function*(){let s={errors:[],warnings:[]};yield Promise.all(j.map(f=>Z(void 0,[f],function*({name:x,callback:t,note:i}){try{let o=yield t();if(o!=null){if(typeof o!="object")throw new Error(`Expected onStart() callback in plugin ${JSON.stringify(x)} to return an object`);let d={},_=l(o,d,"errors",L),D=l(o,d,"warnings",L);z(o,d,`from onStart() callback in plugin ${JSON.stringify(x)}`),_!=null&&s.errors.push(...re(_,"errors",u,x)),D!=null&&s.warnings.push(...re(D,"warnings",u,x))}}catch(o){s.errors.push(oe(o,g,u,i&&i(),x))}}))),r(m,s)}),b["on-resolve"]=(m,c)=>Z(void 0,null,function*(){let s={},f="",x,t;for(let i of c.ids)try{({name:f,callback:x,note:t}=E[i]);let o=yield x({path:c.path,importer:c.importer,namespace:c.namespace,resolveDir:c.resolveDir,kind:c.kind,pluginData:u.load(c.pluginData)});if(o!=null){if(typeof o!="object")throw new Error(`Expected onResolve() callback in plugin ${JSON.stringify(f)} to return an object`);let d={},_=l(o,d,"pluginName",S),D=l(o,d,"path",S),T=l(o,d,"namespace",S),I=l(o,d,"suffix",S),U=l(o,d,"external",V),$=l(o,d,"sideEffects",V),N=l(o,d,"pluginData",me),W=l(o,d,"errors",L),J=l(o,d,"warnings",L),B=l(o,d,"watchFiles",L),M=l(o,d,"watchDirs",L);z(o,d,`from onResolve() callback in plugin ${JSON.stringify(f)}`),s.id=i,_!=null&&(s.pluginName=_),D!=null&&(s.path=D),T!=null&&(s.namespace=T),I!=null&&(s.suffix=I),U!=null&&(s.external=U),$!=null&&(s.sideEffects=$),N!=null&&(s.pluginData=u.store(N)),W!=null&&(s.errors=re(W,"errors",u,f)),J!=null&&(s.warnings=re(J,"warnings",u,f)),B!=null&&(s.watchFiles=we(B,"watchFiles")),M!=null&&(s.watchDirs=we(M,"watchDirs"));break}}catch(o){s={id:i,errors:[oe(o,g,u,t&&t(),f)]};break}r(m,s)}),b["on-load"]=(m,c)=>Z(void 0,null,function*(){let s={},f="",x,t;for(let i of c.ids)try{({name:f,callback:x,note:t}=v[i]);let o=yield x({path:c.path,namespace:c.namespace,suffix:c.suffix,pluginData:u.load(c.pluginData)});if(o!=null){if(typeof o!="object")throw new Error(`Expected onLoad() callback in plugin ${JSON.stringify(f)} to return an object`);let d={},_=l(o,d,"pluginName",S),D=l(o,d,"contents",Ue),T=l(o,d,"resolveDir",S),I=l(o,d,"pluginData",me),U=l(o,d,"loader",S),$=l(o,d,"errors",L),N=l(o,d,"warnings",L),W=l(o,d,"watchFiles",L),J=l(o,d,"watchDirs",L);z(o,d,`from onLoad() callback in plugin ${JSON.stringify(f)}`),s.id=i,_!=null&&(s.pluginName=_),D instanceof Uint8Array?s.contents=D:D!=null&&(s.contents=X(D)),T!=null&&(s.resolveDir=T),I!=null&&(s.pluginData=u.store(I)),U!=null&&(s.loader=U),$!=null&&(s.errors=re($,"errors",u,f)),N!=null&&(s.warnings=re(N,"warnings",u,f)),W!=null&&(s.watchFiles=we(W,"watchFiles")),J!=null&&(s.watchDirs=we(J,"watchDirs"));break}}catch(o){s={id:i,errors:[oe(o,g,u,t&&t(),f)]};break}r(m,s)});let y=(m,c,s)=>s();return P.length>0&&(y=(m,c,s)=>{(()=>Z(void 0,null,function*(){for(const{name:f,callback:x,note:t}of P)try{yield x(m)}catch(i){m.errors.push(yield new Promise(o=>c(i,f,t&&t(),o)))}}))().then(s)}),w=!0,{ok:!0,requestPlugins:O,runOnEndCallbacks:y}});function Ie(){const e=new Map;let n=0;return{load(r){return e.get(r)},store(r){if(r===void 0)return-1;const h=n++;return e.set(h,r),h}}}function ye(e,n,r){let h,g=!1;return()=>{if(g)return h;g=!0;try{let b=(e.stack+"").split(`
`);b.splice(1,1);let a=Ne(n,b,r);if(a)return h={text:e.message,location:a},h}catch{}}}function oe(e,n,r,h,g){let b="Internal error",a=null;try{b=(e&&e.message||e)+""}catch{}try{a=Ne(n,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:g,text:b,location:a,notes:h?[h]:[],detail:r?r.store(e):-1}}function Ne(e,n,r){let h="    at ";if(e.readFileSync&&!n[0].startsWith(h)&&n[1].startsWith(h))for(let g=1;g<n.length;g++){let b=n[g];if(!!b.startsWith(h))for(b=b.slice(h.length);;){let a=/^(?:new |async )?\S+ \((.*)\)$/.exec(b);if(a){b=a[1];continue}if(a=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(b),a){b=a[1];continue}if(a=/^(\S+):(\d+):(\d+)$/.exec(b),a){let p;try{p=e.readFileSync(a[1],"utf8")}catch{break}let u=p.split(/\r\n|\r|\n|\u2028|\u2029/)[+a[2]-1]||"",j=+a[3]-1,P=u.slice(j,j+r.length)===r?r.length:0;return{file:a[1],namespace:"file",line:+a[2],column:X(u.slice(0,j)).length,length:X(u.slice(j,j+P)).length,lineText:u+`
`+n.slice(1).join(`
`),suggestion:""}}break}}return null}function ae(e,n,r){let h=5,g=n.length<1?"":` with ${n.length} error${n.length<2?"":"s"}:`+n.slice(0,h+1).map((a,p)=>{if(p===h)return`
...`;if(!a.location)return`
error: ${a.text}`;let{file:u,line:j,column:P}=a.location,E=a.pluginName?`[plugin: ${a.pluginName}] `:"";return`
${u}:${j}:${P}: ERROR: ${E}${a.text}`}).join(""),b=new Error(`${e}${g}`);return b.errors=n,b.warnings=r,b}function q(e,n){for(const r of e)r.detail=n.load(r.detail);return e}function Me(e,n){if(e==null)return null;let r={},h=l(e,r,"file",S),g=l(e,r,"namespace",S),b=l(e,r,"line",ie),a=l(e,r,"column",ie),p=l(e,r,"length",ie),u=l(e,r,"lineText",S),j=l(e,r,"suggestion",S);return z(e,r,n),{file:h||"",namespace:g||"",line:b||0,column:a||0,length:p||0,lineText:u||"",suggestion:j||""}}function re(e,n,r,h){let g=[],b=0;for(const a of e){let p={},u=l(a,p,"id",S),j=l(a,p,"pluginName",S),P=l(a,p,"text",S),E=l(a,p,"location",De),v=l(a,p,"notes",L),C=l(a,p,"detail",me),R=`in element ${b} of "${n}"`;z(a,p,R);let O=[];if(v)for(const w of v){let y={},m=l(w,y,"text",S),c=l(w,y,"location",De);z(w,y,R),O.push({text:m||"",location:Me(c,R)})}g.push({id:u||"",pluginName:j||h,text:P||"",location:Me(E,R),notes:O,detail:r?r.store(C):-1}),b++}return g}function we(e,n){const r=[];for(const h of e){if(typeof h!="string")throw new Error(`${JSON.stringify(n)} must be an array of strings`);r.push(h)}return r}function rt({path:e,contents:n}){let r=null;return{path:e,contents:n,get text(){const h=this.contents;return(r===null||h!==n)&&(n=h,r=se(h)),r}}}var lt="0.15.13",st=e=>be().build(e),it=()=>{throw new Error('The "serve" API only works in node')},ot=(e,n)=>be().transform(e,n),at=(e,n)=>be().formatMessages(e,n),ut=(e,n)=>be().analyzeMetafile(e,n),ct=()=>{throw new Error('The "buildSync" API only works in node')},ft=()=>{throw new Error('The "transformSync" API only works in node')},dt=()=>{throw new Error('The "formatMessagesSync" API only works in node')},ht=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},ue,ke,be=()=>{if(ke)return ke;throw ue?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},mt=e=>{e=Xe(e||{});let n=e.wasmURL,r=e.wasmModule,h=e.worker!==!1;if(!n&&!r)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(ue)throw new Error('Cannot call "initialize" more than once');return ue=gt(n||"",r,h),ue.catch(()=>{ue=void 0}),ue},gt=(e,n,r)=>Z(void 0,null,function*(){let h;if(n)h=n;else{let p=yield fetch(e);if(!p.ok)throw new Error(`Failed to download ${JSON.stringify(e)}`);h=yield p.arrayBuffer()}let g;if(r){let p=new Blob([`onmessage=((postMessage) => {
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
        go.argv = ["", \`--service=\${"0.15.13"}\`];
        if (wasm instanceof WebAssembly.Module) {
          WebAssembly.instantiate(wasm, go.importObject).then((instance) => go.run(instance));
        } else {
          WebAssembly.instantiate(wasm, go.importObject).then(({ instance }) => go.run(instance));
        }
      };
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});g=new Worker(URL.createObjectURL(p))}else{let p=(u=>{var j=(v,C,R)=>new Promise((O,w)=>{var y=s=>{try{c(R.next(s))}catch(f){w(f)}},m=s=>{try{c(R.throw(s))}catch(f){w(f)}},c=s=>s.done?O(s.value):Promise.resolve(s.value).then(y,m);c((R=R.apply(v,C)).next())});let P,E={};for(let v=self;v;v=Object.getPrototypeOf(v))for(let C of Object.getOwnPropertyNames(v))C in E||Object.defineProperty(E,C,{get:()=>self[C]});return(()=>{const v=()=>{const O=new Error("not implemented");return O.code="ENOSYS",O};if(!E.fs){let O="";E.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(w,y){O+=R.decode(y);const m=O.lastIndexOf(`
`);return m!=-1&&(console.log(O.substr(0,m)),O=O.substr(m+1)),y.length},write(w,y,m,c,s,f){if(m!==0||c!==y.length||s!==null){f(v());return}const x=this.writeSync(w,y);f(null,x)},chmod(w,y,m){m(v())},chown(w,y,m,c){c(v())},close(w,y){y(v())},fchmod(w,y,m){m(v())},fchown(w,y,m,c){c(v())},fstat(w,y){y(v())},fsync(w,y){y(null)},ftruncate(w,y,m){m(v())},lchown(w,y,m,c){c(v())},link(w,y,m){m(v())},lstat(w,y){y(v())},mkdir(w,y,m){m(v())},open(w,y,m,c){c(v())},read(w,y,m,c,s,f){f(v())},readdir(w,y){y(v())},readlink(w,y){y(v())},rename(w,y,m){m(v())},rmdir(w,y){y(v())},stat(w,y){y(v())},symlink(w,y,m){m(v())},truncate(w,y,m){m(v())},unlink(w,y){y(v())},utimes(w,y,m,c){c(v())}}}if(E.process||(E.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw v()},pid:-1,ppid:-1,umask(){throw v()},cwd(){throw v()},chdir(){throw v()}}),!E.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!E.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!E.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!E.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const C=new TextEncoder("utf-8"),R=new TextDecoder("utf-8");E.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=t=>{t!==0&&console.warn("exit code:",t)},this._exitPromise=new Promise(t=>{this._resolveExitPromise=t}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const O=(t,i)=>{this.mem.setUint32(t+0,i,!0),this.mem.setUint32(t+4,Math.floor(i/4294967296),!0)},w=t=>{const i=this.mem.getUint32(t+0,!0),o=this.mem.getInt32(t+4,!0);return i+o*4294967296},y=t=>{const i=this.mem.getFloat64(t,!0);if(i===0)return;if(!isNaN(i))return i;const o=this.mem.getUint32(t,!0);return this._values[o]},m=(t,i)=>{if(typeof i=="number"&&i!==0){if(isNaN(i)){this.mem.setUint32(t+4,2146959360,!0),this.mem.setUint32(t,0,!0);return}this.mem.setFloat64(t,i,!0);return}if(i===void 0){this.mem.setFloat64(t,0,!0);return}let d=this._ids.get(i);d===void 0&&(d=this._idPool.pop(),d===void 0&&(d=this._values.length),this._values[d]=i,this._goRefCounts[d]=0,this._ids.set(i,d)),this._goRefCounts[d]++;let _=0;switch(typeof i){case"object":i!==null&&(_=1);break;case"string":_=2;break;case"symbol":_=3;break;case"function":_=4;break}this.mem.setUint32(t+4,2146959360|_,!0),this.mem.setUint32(t,d,!0)},c=t=>{const i=w(t+0),o=w(t+8);return new Uint8Array(this._inst.exports.mem.buffer,i,o)},s=t=>{const i=w(t+0),o=w(t+8),d=new Array(o);for(let _=0;_<o;_++)d[_]=y(i+_*8);return d},f=t=>{const i=w(t+0),o=w(t+8);return R.decode(new DataView(this._inst.exports.mem.buffer,i,o))},x=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":t=>{t>>>=0;const i=this.mem.getInt32(t+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(i)},"runtime.wasmWrite":t=>{t>>>=0;const i=w(t+8),o=w(t+16),d=this.mem.getInt32(t+24,!0);E.fs.writeSync(i,new Uint8Array(this._inst.exports.mem.buffer,o,d))},"runtime.resetMemoryDataView":t=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":t=>{t>>>=0,O(t+8,(x+performance.now())*1e6)},"runtime.walltime":t=>{t>>>=0;const i=new Date().getTime();O(t+8,i/1e3),this.mem.setInt32(t+16,i%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":t=>{t>>>=0;const i=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(i,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(i);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},w(t+8)+1)),this.mem.setInt32(t+16,i,!0)},"runtime.clearTimeoutEvent":t=>{t>>>=0;const i=this.mem.getInt32(t+8,!0);clearTimeout(this._scheduledTimeouts.get(i)),this._scheduledTimeouts.delete(i)},"runtime.getRandomData":t=>{t>>>=0,crypto.getRandomValues(c(t+8))},"syscall/js.finalizeRef":t=>{t>>>=0;const i=this.mem.getUint32(t+8,!0);if(this._goRefCounts[i]--,this._goRefCounts[i]===0){const o=this._values[i];this._values[i]=null,this._ids.delete(o),this._idPool.push(i)}},"syscall/js.stringVal":t=>{t>>>=0,m(t+24,f(t+8))},"syscall/js.valueGet":t=>{t>>>=0;const i=Reflect.get(y(t+8),f(t+16));t=this._inst.exports.getsp()>>>0,m(t+32,i)},"syscall/js.valueSet":t=>{t>>>=0,Reflect.set(y(t+8),f(t+16),y(t+32))},"syscall/js.valueDelete":t=>{t>>>=0,Reflect.deleteProperty(y(t+8),f(t+16))},"syscall/js.valueIndex":t=>{t>>>=0,m(t+24,Reflect.get(y(t+8),w(t+16)))},"syscall/js.valueSetIndex":t=>{t>>>=0,Reflect.set(y(t+8),w(t+16),y(t+24))},"syscall/js.valueCall":t=>{t>>>=0;try{const i=y(t+8),o=Reflect.get(i,f(t+16)),d=s(t+32),_=Reflect.apply(o,i,d);t=this._inst.exports.getsp()>>>0,m(t+56,_),this.mem.setUint8(t+64,1)}catch(i){t=this._inst.exports.getsp()>>>0,m(t+56,i),this.mem.setUint8(t+64,0)}},"syscall/js.valueInvoke":t=>{t>>>=0;try{const i=y(t+8),o=s(t+16),d=Reflect.apply(i,void 0,o);t=this._inst.exports.getsp()>>>0,m(t+40,d),this.mem.setUint8(t+48,1)}catch(i){t=this._inst.exports.getsp()>>>0,m(t+40,i),this.mem.setUint8(t+48,0)}},"syscall/js.valueNew":t=>{t>>>=0;try{const i=y(t+8),o=s(t+16),d=Reflect.construct(i,o);t=this._inst.exports.getsp()>>>0,m(t+40,d),this.mem.setUint8(t+48,1)}catch(i){t=this._inst.exports.getsp()>>>0,m(t+40,i),this.mem.setUint8(t+48,0)}},"syscall/js.valueLength":t=>{t>>>=0,O(t+16,parseInt(y(t+8).length))},"syscall/js.valuePrepareString":t=>{t>>>=0;const i=C.encode(String(y(t+8)));m(t+16,i),O(t+24,i.length)},"syscall/js.valueLoadString":t=>{t>>>=0;const i=y(t+8);c(t+16).set(i)},"syscall/js.valueInstanceOf":t=>{t>>>=0,this.mem.setUint8(t+24,y(t+8)instanceof y(t+16)?1:0)},"syscall/js.copyBytesToGo":t=>{t>>>=0;const i=c(t+8),o=y(t+32);if(!(o instanceof Uint8Array||o instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const d=o.subarray(0,i.length);i.set(d),O(t+40,d.length),this.mem.setUint8(t+48,1)},"syscall/js.copyBytesToJS":t=>{t>>>=0;const i=y(t+8),o=c(t+16);if(!(i instanceof Uint8Array||i instanceof Uint8ClampedArray)){this.mem.setUint8(t+48,0);return}const d=o.subarray(0,i.length);i.set(d),O(t+40,d.length),this.mem.setUint8(t+48,1)},debug:t=>{console.log(t)}}}}run(O){return j(this,null,function*(){if(!(O instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=O,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,E,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[E,5],[this,6]]),this._idPool=[],this.exited=!1;let w=4096;const y=t=>{const i=w,o=C.encode(t+"\0");return new Uint8Array(this.mem.buffer,w,o.length).set(o),w+=o.length,w%8!==0&&(w+=8-w%8),i},m=this.argv.length,c=[];this.argv.forEach(t=>{c.push(y(t))}),c.push(0),Object.keys(this.env).sort().forEach(t=>{c.push(y(`${t}=${this.env[t]}`))}),c.push(0);const f=w;c.forEach(t=>{this.mem.setUint32(w,t,!0),this.mem.setUint32(w+4,0,!0),w+=8});const x=4096+8192;if(w>=x)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(m,f),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(O){const w=this;return function(){const y={id:O,this:this,args:arguments};return w._pendingEvent=y,w._resume(),y.result}}}})(),P=({data:v})=>{let C=new TextDecoder,R=E.fs,O="";R.writeSync=(s,f)=>{if(s===1)u(f);else if(s===2){O+=C.decode(f);let x=O.split(`
`);x.length>1&&console.log(x.slice(0,-1).join(`
`)),O=x[x.length-1]}else throw new Error("Bad write");return f.length};let w=[],y,m=0;P=({data:s})=>{s.length>0&&(w.push(s),y&&y())},R.read=(s,f,x,t,i,o)=>{if(s!==0||x!==0||t!==f.length||i!==null)throw new Error("Bad read");if(w.length===0){y=()=>R.read(s,f,x,t,i,o);return}let d=w[0],_=Math.max(0,Math.min(t,d.length-m));f.set(d.subarray(m,m+_),x),m+=_,m===d.length&&(w.shift(),m=0),o(null,_)};let c=new E.Go;c.argv=["","--service=0.15.13"],v instanceof WebAssembly.Module?WebAssembly.instantiate(v,c.importObject).then(s=>c.run(s)):WebAssembly.instantiate(v,c.importObject).then(({instance:s})=>c.run(s))},v=>P(v)})(u=>g.onmessage({data:u}));g={onmessage:null,postMessage:u=>setTimeout(()=>p({data:u})),terminate(){}}}g.postMessage(h),g.onmessage=({data:p})=>b(p);let{readFromStdout:b,service:a}=qe({writeToStdin(p){g.postMessage(p)},isSync:!1,isWriteUnavailable:!0,esbuild:he});ke={build:p=>new Promise((u,j)=>a.buildOrServe({callName:"build",refs:null,serveOptions:null,options:p,isTTY:!1,defaultWD:"/",callback:(P,E)=>P?j(P):u(E)})),transform:(p,u)=>new Promise((j,P)=>a.transform({callName:"transform",refs:null,input:p,options:u||{},isTTY:!1,fs:{readFile(E,v){v(new Error("Internal error"),null)},writeFile(E,v){v(null)}},callback:(E,v)=>E?P(E):j(v)})),formatMessages:(p,u)=>new Promise((j,P)=>a.formatMessages({callName:"formatMessages",refs:null,messages:p,options:u,callback:(E,v)=>E?P(E):j(v)})),analyzeMetafile:(p,u)=>new Promise((j,P)=>a.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof p=="string"?p:JSON.stringify(p),options:u,callback:(E,v)=>E?P(E):j(v)}))}}),pt=he})(H)})(Ee);const bt=wt(Ee.exports),vt=yt({__proto__:null,default:bt},[Ee.exports]);exports.browser=vt;
//# sourceMappingURL=esbuild-0884a4c8.cjs.map
