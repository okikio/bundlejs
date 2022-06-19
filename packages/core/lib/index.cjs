"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});function En(e){if(e&&e.__esModule)return e;var t=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});return e&&Object.keys(e).forEach(function(n){if(n!=="default"){var r=Object.getOwnPropertyDescriptor(e,n);Object.defineProperty(t,n,r.get?r:{enumerable:!0,get:function(){return e[n]}})}}),t.default=e,Object.freeze(t)}function os(e,t){return t.forEach(function(n){n&&typeof n!="string"&&!Array.isArray(n)&&Object.keys(n).forEach(function(r){if(r!=="default"&&!(r in e)){var i=Object.getOwnPropertyDescriptor(n,r);Object.defineProperty(e,r,i.get?i:{enumerable:!0,get:function(){return n[r]}})}})}),Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}function cs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ct={exports:{}};(function(e){(t=>{var n=Object.defineProperty,r=Object.defineProperties,i=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyDescriptors,u=Object.getOwnPropertyNames,d=Object.getOwnPropertySymbols,m=Object.prototype.hasOwnProperty,g=Object.prototype.propertyIsEnumerable,_=(s,l,c)=>l in s?n(s,l,{enumerable:!0,configurable:!0,writable:!0,value:c}):s[l]=c,k=(s,l)=>{for(var c in l||(l={}))m.call(l,c)&&_(s,c,l[c]);if(d)for(var c of d(l))g.call(l,c)&&_(s,c,l[c]);return s},O=(s,l)=>r(s,o(l)),L=(s,l)=>{for(var c in l)n(s,c,{get:l[c],enumerable:!0})},y=(s,l,c,S)=>{if(l&&typeof l=="object"||typeof l=="function")for(let j of u(l))!m.call(s,j)&&j!==c&&n(s,j,{get:()=>l[j],enumerable:!(S=i(l,j))||S.enumerable});return s},p=s=>y(n({},"__esModule",{value:!0}),s),h=(s,l,c)=>new Promise((S,j)=>{var R=v=>{try{D(c.next(v))}catch(G){j(G)}},b=v=>{try{D(c.throw(v))}catch(G){j(G)}},D=v=>v.done?S(v.value):Promise.resolve(v.value).then(R,b);D((c=c.apply(s,l)).next())}),$e={};L($e,{analyzeMetafile:()=>Qr,analyzeMetafileSync:()=>ns,build:()=>Hr,buildSync:()=>Zr,default:()=>is,formatMessages:()=>Kr,formatMessagesSync:()=>ts,initialize:()=>rs,serve:()=>Yr,transform:()=>Xr,transformSync:()=>es,version:()=>Jr}),t.exports=p($e);function Ie(s){let l=S=>{if(S===null)c.write8(0);else if(typeof S=="boolean")c.write8(1),c.write8(+S);else if(typeof S=="number")c.write8(2),c.write32(S|0);else if(typeof S=="string")c.write8(3),c.write(de(S));else if(S instanceof Uint8Array)c.write8(4),c.write(S);else if(S instanceof Array){c.write8(5),c.write32(S.length);for(let j of S)l(j)}else{let j=Object.keys(S);c.write8(6),c.write32(j.length);for(let R of j)c.write(de(R)),l(S[R])}},c=new ve;return c.write32(0),c.write32(s.id<<1|+!s.isRequest),l(s.value),Rt(c.buf,c.len-4,0),c.buf.subarray(0,c.len)}function M(s){let l=()=>{switch(c.read8()){case 0:return null;case 1:return!!c.read8();case 2:return c.read32();case 3:return We(c.read());case 4:return c.read();case 5:{let b=c.read32(),D=[];for(let v=0;v<b;v++)D.push(l());return D}case 6:{let b=c.read32(),D={};for(let v=0;v<b;v++)D[We(c.read())]=l();return D}default:throw new Error("Invalid packet")}},c=new ve(s),S=c.read32(),j=(S&1)===0;S>>>=1;let R=l();if(c.ptr!==s.length)throw new Error("Invalid packet");return{id:S,isRequest:j,value:R}}var ve=class{constructor(s=new Uint8Array(1024)){this.buf=s,this.len=0,this.ptr=0}_write(s){if(this.len+s>this.buf.length){let l=new Uint8Array((this.len+s)*2);l.set(this.buf),this.buf=l}return this.len+=s,this.len-s}write8(s){let l=this._write(1);this.buf[l]=s}write32(s){let l=this._write(4);Rt(this.buf,s,l)}write(s){let l=this._write(4+s.length);Rt(this.buf,s.length,l),this.buf.set(s,l+4)}_read(s){if(this.ptr+s>this.buf.length)throw new Error("Invalid packet");return this.ptr+=s,this.ptr-s}read8(){return this.buf[this._read(1)]}read32(){return hn(this.buf,this._read(4))}read(){let s=this.read32(),l=new Uint8Array(s),c=this._read(l.length);return l.set(this.buf.subarray(c,c+s)),l}},de,We;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let s=new TextEncoder,l=new TextDecoder;de=c=>s.encode(c),We=c=>l.decode(c)}else if(typeof Buffer<"u")de=s=>{let l=Buffer.from(s);return l instanceof Uint8Array||(l=new Uint8Array(l)),l},We=s=>{let{buffer:l,byteOffset:c,byteLength:S}=s;return Buffer.from(l,c,S).toString()};else throw new Error("No UTF-8 codec found");function hn(s,l){return s[l++]|s[l++]<<8|s[l++]<<16|s[l++]<<24}function Rt(s,l,c){s[c++]=l,s[c++]=l>>8,s[c++]=l>>16,s[c++]=l>>24}function pn(s){if(s+="",s.indexOf(",")>=0)throw new Error(`Invalid target: ${s}`);return s}var dt=()=>null,ge=s=>typeof s=="boolean"?null:"a boolean",Mr=s=>typeof s=="boolean"||typeof s=="object"&&!Array.isArray(s)?null:"a boolean or an object",F=s=>typeof s=="string"?null:"a string",ht=s=>s instanceof RegExp?null:"a RegExp object",tt=s=>typeof s=="number"&&s===(s|0)?null:"an integer",Dt=s=>typeof s=="function"?null:"a function",xe=s=>Array.isArray(s)?null:"an array",Fe=s=>typeof s=="object"&&s!==null&&!Array.isArray(s)?null:"an object",Ur=s=>s instanceof WebAssembly.Module?null:"a WebAssembly.Module",Ir=s=>typeof s=="object"&&s!==null?null:"an array or an object",mn=s=>typeof s=="object"&&!Array.isArray(s)?null:"an object or null",gn=s=>typeof s=="string"||typeof s=="boolean"?null:"a string or a boolean",Lr=s=>typeof s=="string"||typeof s=="object"&&s!==null&&!Array.isArray(s)?null:"a string or an object",Fr=s=>typeof s=="string"||Array.isArray(s)?null:"a string or an array",zr=s=>typeof s=="string"||s instanceof Uint8Array?null:"a string or a Uint8Array";function f(s,l,c,S){let j=s[c];if(l[c+""]=!0,j===void 0)return;let R=S(j);if(R!==null)throw new Error(`"${c}" must be ${R}`);return j}function Ae(s,l,c){for(let S in s)if(!(S in l))throw new Error(`Invalid option ${c}: "${S}"`)}function Br(s){let l=Object.create(null),c=f(s,l,"wasmURL",F),S=f(s,l,"wasmModule",Ur),j=f(s,l,"worker",ge);return Ae(s,l,"in initialize() call"),{wasmURL:c,wasmModule:S,worker:j}}function wn(s){let l;if(s!==void 0){l=Object.create(null);for(let c of Object.keys(s)){let S=s[c];if(typeof S=="string"||S===!1)l[c]=S;else throw new Error(`Expected ${JSON.stringify(c)} in mangle cache to map to either a string or false`)}}return l}function pt(s,l,c,S,j){let R=f(l,c,"color",ge),b=f(l,c,"logLevel",F),D=f(l,c,"logLimit",tt);R!==void 0?s.push(`--color=${R}`):S&&s.push("--color=true"),s.push(`--log-level=${b||j}`),s.push(`--log-limit=${D||0}`)}function yn(s,l,c){let S=f(l,c,"legalComments",F),j=f(l,c,"sourceRoot",F),R=f(l,c,"sourcesContent",ge),b=f(l,c,"target",Fr),D=f(l,c,"format",F),v=f(l,c,"globalName",F),G=f(l,c,"mangleProps",ht),ie=f(l,c,"reserveProps",ht),V=f(l,c,"mangleQuoted",ge),T=f(l,c,"minify",ge),le=f(l,c,"minifySyntax",ge),me=f(l,c,"minifyWhitespace",ge),K=f(l,c,"minifyIdentifiers",ge),C=f(l,c,"drop",xe),P=f(l,c,"charset",F),U=f(l,c,"treeShaking",ge),W=f(l,c,"ignoreAnnotations",ge),X=f(l,c,"jsx",F),Q=f(l,c,"jsxFactory",F),we=f(l,c,"jsxFragment",F),a=f(l,c,"define",Fe),E=f(l,c,"logOverride",Fe),J=f(l,c,"supported",Fe),x=f(l,c,"pure",xe),A=f(l,c,"keepNames",ge);if(S&&s.push(`--legal-comments=${S}`),j!==void 0&&s.push(`--source-root=${j}`),R!==void 0&&s.push(`--sources-content=${R}`),b&&(Array.isArray(b)?s.push(`--target=${Array.from(b).map(pn).join(",")}`):s.push(`--target=${pn(b)}`)),D&&s.push(`--format=${D}`),v&&s.push(`--global-name=${v}`),T&&s.push("--minify"),le&&s.push("--minify-syntax"),me&&s.push("--minify-whitespace"),K&&s.push("--minify-identifiers"),P&&s.push(`--charset=${P}`),U!==void 0&&s.push(`--tree-shaking=${U}`),W&&s.push("--ignore-annotations"),C)for(let w of C)s.push(`--drop:${w}`);if(G&&s.push(`--mangle-props=${G.source}`),ie&&s.push(`--reserve-props=${ie.source}`),V!==void 0&&s.push(`--mangle-quoted=${V}`),X&&s.push(`--jsx=${X}`),Q&&s.push(`--jsx-factory=${Q}`),we&&s.push(`--jsx-fragment=${we}`),a)for(let w in a){if(w.indexOf("=")>=0)throw new Error(`Invalid define: ${w}`);s.push(`--define:${w}=${a[w]}`)}if(E)for(let w in E){if(w.indexOf("=")>=0)throw new Error(`Invalid log override: ${w}`);s.push(`--log-override:${w}=${E[w]}`)}if(J)for(let w in J){if(w.indexOf("=")>=0)throw new Error(`Invalid supported: ${w}`);s.push(`--supported:${w}=${J[w]}`)}if(x)for(let w of x)s.push(`--pure:${w}`);A&&s.push("--keep-names")}function Vr(s,l,c,S,j){var R;let b=[],D=[],v=Object.create(null),G=null,ie=null,V=null;pt(b,l,v,c,S),yn(b,l,v);let T=f(l,v,"sourcemap",gn),le=f(l,v,"bundle",ge),me=f(l,v,"watch",Mr),K=f(l,v,"splitting",ge),C=f(l,v,"preserveSymlinks",ge),P=f(l,v,"metafile",ge),U=f(l,v,"outfile",F),W=f(l,v,"outdir",F),X=f(l,v,"outbase",F),Q=f(l,v,"platform",F),we=f(l,v,"tsconfig",F),a=f(l,v,"resolveExtensions",xe),E=f(l,v,"nodePaths",xe),J=f(l,v,"mainFields",xe),x=f(l,v,"conditions",xe),A=f(l,v,"external",xe),w=f(l,v,"loader",Fe),N=f(l,v,"outExtension",Fe),he=f(l,v,"publicPath",F),oe=f(l,v,"entryNames",F),re=f(l,v,"chunkNames",F),ee=f(l,v,"assetNames",F),ce=f(l,v,"inject",xe),se=f(l,v,"banner",Fe),H=f(l,v,"footer",Fe),ae=f(l,v,"entryPoints",Ir),ue=f(l,v,"absWorkingDir",F),Z=f(l,v,"stdin",Fe),ye=(R=f(l,v,"write",ge))!=null?R:j,Ne=f(l,v,"allowOverwrite",ge),te=f(l,v,"incremental",ge)===!0,B=f(l,v,"mangleCache",Fe);if(v.plugins=!0,Ae(l,v,`in ${s}() call`),T&&b.push(`--sourcemap${T===!0?"":`=${T}`}`),le&&b.push("--bundle"),Ne&&b.push("--allow-overwrite"),me)if(b.push("--watch"),typeof me=="boolean")V={};else{let $=Object.create(null),q=f(me,$,"onRebuild",Dt);Ae(me,$,`on "watch" in ${s}() call`),V={onRebuild:q}}if(K&&b.push("--splitting"),C&&b.push("--preserve-symlinks"),P&&b.push("--metafile"),U&&b.push(`--outfile=${U}`),W&&b.push(`--outdir=${W}`),X&&b.push(`--outbase=${X}`),Q&&b.push(`--platform=${Q}`),we&&b.push(`--tsconfig=${we}`),a){let $=[];for(let q of a){if(q+="",q.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${q}`);$.push(q)}b.push(`--resolve-extensions=${$.join(",")}`)}if(he&&b.push(`--public-path=${he}`),oe&&b.push(`--entry-names=${oe}`),re&&b.push(`--chunk-names=${re}`),ee&&b.push(`--asset-names=${ee}`),J){let $=[];for(let q of J){if(q+="",q.indexOf(",")>=0)throw new Error(`Invalid main field: ${q}`);$.push(q)}b.push(`--main-fields=${$.join(",")}`)}if(x){let $=[];for(let q of x){if(q+="",q.indexOf(",")>=0)throw new Error(`Invalid condition: ${q}`);$.push(q)}b.push(`--conditions=${$.join(",")}`)}if(A)for(let $ of A)b.push(`--external:${$}`);if(se)for(let $ in se){if($.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${$}`);b.push(`--banner:${$}=${se[$]}`)}if(H)for(let $ in H){if($.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${$}`);b.push(`--footer:${$}=${H[$]}`)}if(ce)for(let $ of ce)b.push(`--inject:${$}`);if(w)for(let $ in w){if($.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${$}`);b.push(`--loader:${$}=${w[$]}`)}if(N)for(let $ in N){if($.indexOf("=")>=0)throw new Error(`Invalid out extension: ${$}`);b.push(`--out-extension:${$}=${N[$]}`)}if(ae)if(Array.isArray(ae))for(let $ of ae)D.push(["",$+""]);else for(let[$,q]of Object.entries(ae))D.push([$+"",q+""]);if(Z){let $=Object.create(null),q=f(Z,$,"contents",F),_e=f(Z,$,"resolveDir",F),z=f(Z,$,"sourcefile",F),I=f(Z,$,"loader",F);Ae(Z,$,'in "stdin" object'),z&&b.push(`--sourcefile=${z}`),I&&b.push(`--loader=${I}`),_e&&(ie=_e+""),G=q?q+"":""}let Y=[];if(E)for(let $ of E)$+="",Y.push($);return{entries:D,flags:b,write:ye,stdinContents:G,stdinResolveDir:ie,absWorkingDir:ue,incremental:te,nodePaths:Y,watch:V,mangleCache:wn(B)}}function Wr(s,l,c,S){let j=[],R=Object.create(null);pt(j,l,R,c,S),yn(j,l,R);let b=f(l,R,"sourcemap",gn),D=f(l,R,"tsconfigRaw",Lr),v=f(l,R,"sourcefile",F),G=f(l,R,"loader",F),ie=f(l,R,"banner",F),V=f(l,R,"footer",F),T=f(l,R,"mangleCache",Fe);return Ae(l,R,`in ${s}() call`),b&&j.push(`--sourcemap=${b===!0?"external":b}`),D&&j.push(`--tsconfig-raw=${typeof D=="string"?D:JSON.stringify(D)}`),v&&j.push(`--sourcefile=${v}`),G&&j.push(`--loader=${G}`),ie&&j.push(`--banner=${ie}`),V&&j.push(`--footer=${V}`),{flags:j,mangleCache:wn(T)}}function qr(s){let l=new Map,c=new Map,S=new Map,j=new Map,R=null,b=0,D=0,v=new Uint8Array(16*1024),G=0,ie=x=>{let A=G+x.length;if(A>v.length){let N=new Uint8Array(A*2);N.set(v),v=N}v.set(x,G),G+=x.length;let w=0;for(;w+4<=G;){let N=hn(v,w);if(w+4+N>G)break;w+=4,C(v.subarray(w,w+N)),w+=N}w>0&&(v.copyWithin(0,w,G),G-=w)},V=x=>{R={reason:x?": "+(x.message||x):""};const A="The service was stopped"+R.reason;for(let w of l.values())w(A,null);l.clear();for(let w of j.values())w.onWait(A);j.clear();for(let w of S.values())try{w(new Error(A),null)}catch(N){console.error(N)}S.clear()},T=(x,A,w)=>{if(R)return w("The service is no longer running"+R.reason,null);let N=b++;l.set(N,(he,oe)=>{try{w(he,oe)}finally{x&&x.unref()}}),x&&x.ref(),s.writeToStdin(Ie({id:N,isRequest:!0,value:A}))},le=(x,A)=>{if(R)throw new Error("The service is no longer running"+R.reason);s.writeToStdin(Ie({id:x,isRequest:!1,value:A}))},me=(x,A)=>h(this,null,function*(){try{switch(A.command){case"ping":{le(x,{});break}case"on-start":{let w=c.get(A.key);w?le(x,yield w(A)):le(x,{});break}case"on-resolve":{let w=c.get(A.key);w?le(x,yield w(A)):le(x,{});break}case"on-load":{let w=c.get(A.key);w?le(x,yield w(A)):le(x,{});break}case"serve-request":{let w=j.get(A.key);w&&w.onRequest&&w.onRequest(A.args),le(x,{});break}case"serve-wait":{let w=j.get(A.key);w&&w.onWait(A.error),le(x,{});break}case"watch-rebuild":{let w=S.get(A.key);try{w&&w(null,A.args)}catch(N){console.error(N)}le(x,{});break}default:throw new Error("Invalid command: "+A.command)}}catch(w){le(x,{errors:[nt(w,s,null,void 0,"")]})}}),K=!0,C=x=>{if(K){K=!1;let w=String.fromCharCode(...x);if(w!=="0.14.46")throw new Error(`Cannot start service: Host version "0.14.46" does not match binary version ${JSON.stringify(w)}`);return}let A=M(x);if(A.isRequest)me(A.id,A.value);else{let w=l.get(A.id);l.delete(A.id),A.value.error?w(A.value.error,{}):w(null,A.value)}},P=(x,A,w,N,he)=>h(this,null,function*(){let oe=[],re=[],ee={},ce={},se=0,H=0,ae=[],ue=!1;A=[...A];for(let te of A){let B={};if(typeof te!="object")throw new Error(`Plugin at index ${H} must be an object`);const Y=f(te,B,"name",F);if(typeof Y!="string"||Y==="")throw new Error(`Plugin at index ${H} is missing a name`);try{let $=f(te,B,"setup",Dt);if(typeof $!="function")throw new Error("Plugin is missing a setup function");Ae(te,B,`on plugin ${JSON.stringify(Y)}`);let q={name:Y,onResolve:[],onLoad:[]};H++;let z=$({initialOptions:x,resolve:(I,fe={})=>{if(!ue)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof I!="string")throw new Error("The path to resolve must be a string");let ne=Object.create(null),Oe=f(fe,ne,"pluginName",F),be=f(fe,ne,"importer",F),Se=f(fe,ne,"namespace",F),je=f(fe,ne,"resolveDir",F),Te=f(fe,ne,"kind",F),pe=f(fe,ne,"pluginData",dt);return Ae(fe,ne,"in resolve() call"),new Promise((Pe,Ce)=>{const Ee={command:"resolve",path:I,key:w,pluginName:Y};Oe!=null&&(Ee.pluginName=Oe),be!=null&&(Ee.importer=be),Se!=null&&(Ee.namespace=Se),je!=null&&(Ee.resolveDir=je),Te!=null&&(Ee.kind=Te),pe!=null&&(Ee.pluginData=N.store(pe)),T(he,Ee,(Ve,Re)=>{Ve!==null?Ce(new Error(Ve)):Pe({errors:qe(Re.errors,N),warnings:qe(Re.warnings,N),path:Re.path,external:Re.external,sideEffects:Re.sideEffects,namespace:Re.namespace,suffix:Re.suffix,pluginData:N.load(Re.pluginData)})})})},onStart(I){let fe='This error came from the "onStart" callback registered here:',ne=mt(new Error(fe),s,"onStart");oe.push({name:Y,callback:I,note:ne})},onEnd(I){let fe='This error came from the "onEnd" callback registered here:',ne=mt(new Error(fe),s,"onEnd");re.push({name:Y,callback:I,note:ne})},onResolve(I,fe){let ne='This error came from the "onResolve" callback registered here:',Oe=mt(new Error(ne),s,"onResolve"),be={},Se=f(I,be,"filter",ht),je=f(I,be,"namespace",F);if(Ae(I,be,`in onResolve() call for plugin ${JSON.stringify(Y)}`),Se==null)throw new Error("onResolve() call is missing a filter");let Te=se++;ee[Te]={name:Y,callback:fe,note:Oe},q.onResolve.push({id:Te,filter:Se.source,namespace:je||""})},onLoad(I,fe){let ne='This error came from the "onLoad" callback registered here:',Oe=mt(new Error(ne),s,"onLoad"),be={},Se=f(I,be,"filter",ht),je=f(I,be,"namespace",F);if(Ae(I,be,`in onLoad() call for plugin ${JSON.stringify(Y)}`),Se==null)throw new Error("onLoad() call is missing a filter");let Te=se++;ce[Te]={name:Y,callback:fe,note:Oe},q.onLoad.push({id:Te,filter:Se.source,namespace:je||""})},esbuild:s.esbuild});z&&(yield z),ae.push(q)}catch($){return{ok:!1,error:$,pluginName:Y}}}const Z=te=>h(this,null,function*(){switch(te.command){case"on-start":{let B={errors:[],warnings:[]};return yield Promise.all(oe.map(Y=>h(this,[Y],function*({name:$,callback:q,note:_e}){try{let z=yield q();if(z!=null){if(typeof z!="object")throw new Error(`Expected onStart() callback in plugin ${JSON.stringify($)} to return an object`);let I={},fe=f(z,I,"errors",xe),ne=f(z,I,"warnings",xe);Ae(z,I,`from onStart() callback in plugin ${JSON.stringify($)}`),fe!=null&&B.errors.push(...Ye(fe,"errors",N,$)),ne!=null&&B.warnings.push(...Ye(ne,"warnings",N,$))}}catch(z){B.errors.push(nt(z,s,N,_e&&_e(),$))}}))),B}case"on-resolve":{let B={},Y="",$,q;for(let _e of te.ids)try{({name:Y,callback:$,note:q}=ee[_e]);let z=yield $({path:te.path,importer:te.importer,namespace:te.namespace,resolveDir:te.resolveDir,kind:te.kind,pluginData:N.load(te.pluginData)});if(z!=null){if(typeof z!="object")throw new Error(`Expected onResolve() callback in plugin ${JSON.stringify(Y)} to return an object`);let I={},fe=f(z,I,"pluginName",F),ne=f(z,I,"path",F),Oe=f(z,I,"namespace",F),be=f(z,I,"suffix",F),Se=f(z,I,"external",ge),je=f(z,I,"sideEffects",ge),Te=f(z,I,"pluginData",dt),pe=f(z,I,"errors",xe),Pe=f(z,I,"warnings",xe),Ce=f(z,I,"watchFiles",xe),Ee=f(z,I,"watchDirs",xe);Ae(z,I,`from onResolve() callback in plugin ${JSON.stringify(Y)}`),B.id=_e,fe!=null&&(B.pluginName=fe),ne!=null&&(B.path=ne),Oe!=null&&(B.namespace=Oe),be!=null&&(B.suffix=be),Se!=null&&(B.external=Se),je!=null&&(B.sideEffects=je),Te!=null&&(B.pluginData=N.store(Te)),pe!=null&&(B.errors=Ye(pe,"errors",N,Y)),Pe!=null&&(B.warnings=Ye(Pe,"warnings",N,Y)),Ce!=null&&(B.watchFiles=gt(Ce,"watchFiles")),Ee!=null&&(B.watchDirs=gt(Ee,"watchDirs"));break}}catch(z){return{id:_e,errors:[nt(z,s,N,q&&q(),Y)]}}return B}case"on-load":{let B={},Y="",$,q;for(let _e of te.ids)try{({name:Y,callback:$,note:q}=ce[_e]);let z=yield $({path:te.path,namespace:te.namespace,suffix:te.suffix,pluginData:N.load(te.pluginData)});if(z!=null){if(typeof z!="object")throw new Error(`Expected onLoad() callback in plugin ${JSON.stringify(Y)} to return an object`);let I={},fe=f(z,I,"pluginName",F),ne=f(z,I,"contents",zr),Oe=f(z,I,"resolveDir",F),be=f(z,I,"pluginData",dt),Se=f(z,I,"loader",F),je=f(z,I,"errors",xe),Te=f(z,I,"warnings",xe),pe=f(z,I,"watchFiles",xe),Pe=f(z,I,"watchDirs",xe);Ae(z,I,`from onLoad() callback in plugin ${JSON.stringify(Y)}`),B.id=_e,fe!=null&&(B.pluginName=fe),ne instanceof Uint8Array?B.contents=ne:ne!=null&&(B.contents=de(ne)),Oe!=null&&(B.resolveDir=Oe),be!=null&&(B.pluginData=N.store(be)),Se!=null&&(B.loader=Se),je!=null&&(B.errors=Ye(je,"errors",N,Y)),Te!=null&&(B.warnings=Ye(Te,"warnings",N,Y)),pe!=null&&(B.watchFiles=gt(pe,"watchFiles")),Pe!=null&&(B.watchDirs=gt(Pe,"watchDirs"));break}}catch(z){return{id:_e,errors:[nt(z,s,N,q&&q(),Y)]}}return B}default:throw new Error("Invalid command: "+te.command)}});let ye=(te,B,Y)=>Y();re.length>0&&(ye=(te,B,Y)=>{(()=>h(this,null,function*(){for(const{name:$,callback:q,note:_e}of re)try{yield q(te)}catch(z){te.errors.push(yield new Promise(I=>B(z,$,_e&&_e(),I)))}}))().then(Y)}),ue=!0;let Ne=0;return{ok:!0,requestPlugins:ae,runOnEndCallbacks:ye,pluginRefs:{ref(){++Ne===1&&c.set(w,Z)},unref(){--Ne===0&&c.delete(w)}}}}),U=(x,A,w,N)=>{let he={},oe=f(A,he,"port",tt),re=f(A,he,"host",F),ee=f(A,he,"servedir",F),ce=f(A,he,"onRequest",Dt),se,H=new Promise((ae,ue)=>{se=Z=>{j.delete(N),Z!==null?ue(new Error(Z)):ae()}});return w.serve={},Ae(A,he,"in serve() call"),oe!==void 0&&(w.serve.port=oe),re!==void 0&&(w.serve.host=re),ee!==void 0&&(w.serve.servedir=ee),j.set(N,{onRequest:ce,onWait:se}),{wait:H,stop(){T(x,{command:"serve-stop",key:N},()=>{})}}};const W="warning",X="silent";let Q=x=>{let A=D++;const w=bn();let N,{refs:he,options:oe,isTTY:re,callback:ee}=x;if(typeof oe=="object"){let H=oe.plugins;if(H!==void 0){if(!Array.isArray(H))throw new Error('"plugins" must be an array');N=H}}let ce=(H,ae,ue,Z)=>{let ye=[];try{pt(ye,oe,{},re,W)}catch{}const Ne=nt(H,s,w,ue,ae);T(he,{command:"error",flags:ye,error:Ne},()=>{Ne.detail=w.load(Ne.detail),Z(Ne)})},se=(H,ae)=>{ce(H,ae,void 0,ue=>{ee(rt("Build failed",[ue],[]),null)})};if(N&&N.length>0){if(s.isSync)return se(new Error("Cannot use plugins in synchronous API calls"),"");P(oe,N,A,w,he).then(H=>{if(!H.ok)se(H.error,H.pluginName);else try{we(O(k({},x),{key:A,details:w,logPluginError:ce,requestPlugins:H.requestPlugins,runOnEndCallbacks:H.runOnEndCallbacks,pluginRefs:H.pluginRefs}))}catch(ae){se(ae,"")}},H=>se(H,""))}else try{we(O(k({},x),{key:A,details:w,logPluginError:ce,requestPlugins:null,runOnEndCallbacks:(H,ae,ue)=>ue(),pluginRefs:null}))}catch(H){se(H,"")}},we=({callName:x,refs:A,serveOptions:w,options:N,isTTY:he,defaultWD:oe,callback:re,key:ee,details:ce,logPluginError:se,requestPlugins:H,runOnEndCallbacks:ae,pluginRefs:ue})=>{const Z={ref(){ue&&ue.ref(),A&&A.ref()},unref(){ue&&ue.unref(),A&&A.unref()}};let ye=!s.isBrowser,{entries:Ne,flags:te,write:B,stdinContents:Y,stdinResolveDir:$,absWorkingDir:q,incremental:_e,nodePaths:z,watch:I,mangleCache:fe}=Vr(x,N,he,W,ye),ne={command:"build",key:ee,entries:Ne,flags:te,write:B,stdinContents:Y,stdinResolveDir:$,absWorkingDir:q||oe,incremental:_e,nodePaths:z};H&&(ne.plugins=H),fe&&(ne.mangleCache=fe);let Oe=w&&U(Z,w,ne,ee),be,Se,je=(pe,Pe)=>{pe.outputFiles&&(Pe.outputFiles=pe.outputFiles.map(Gr)),pe.metafile&&(Pe.metafile=JSON.parse(pe.metafile)),pe.mangleCache&&(Pe.mangleCache=pe.mangleCache),pe.writeToStdout!==void 0&&console.log(We(pe.writeToStdout).replace(/\n$/,""))},Te=(pe,Pe)=>{let Ce={errors:qe(pe.errors,ce),warnings:qe(pe.warnings,ce)};je(pe,Ce),ae(Ce,se,()=>{if(Ce.errors.length>0)return Pe(rt("Build failed",Ce.errors,Ce.warnings),null);if(pe.rebuild){if(!be){let Ee=!1;be=()=>new Promise((Ve,Re)=>{if(Ee||R)throw new Error("Cannot rebuild");T(Z,{command:"rebuild",key:ee},(Le,ls)=>{if(Le)return Pe(rt("Build failed",[{id:"",pluginName:"",text:Le,location:null,notes:[],detail:void 0}],[]),null);Te(ls,(Mt,as)=>{Mt?Re(Mt):Ve(as)})})}),Z.ref(),be.dispose=()=>{Ee||(Ee=!0,T(Z,{command:"rebuild-dispose",key:ee},()=>{}),Z.unref())}}Ce.rebuild=be}if(pe.watch){if(!Se){let Ee=!1;Z.ref(),Se=()=>{Ee||(Ee=!0,S.delete(ee),T(Z,{command:"watch-stop",key:ee},()=>{}),Z.unref())},I&&S.set(ee,(Ve,Re)=>{if(Ve){I.onRebuild&&I.onRebuild(Ve,null);return}let Le={errors:qe(Re.errors,ce),warnings:qe(Re.warnings,ce)};je(Re,Le),ae(Le,se,()=>{if(Le.errors.length>0){I.onRebuild&&I.onRebuild(rt("Build failed",Le.errors,Le.warnings),null);return}Re.rebuildID!==void 0&&(Le.rebuild=be),Le.stop=Se,I.onRebuild&&I.onRebuild(null,Le)})})}Ce.stop=Se}Pe(null,Ce)})};if(B&&s.isBrowser)throw new Error('Cannot enable "write" in the browser');if(_e&&s.isSync)throw new Error('Cannot use "incremental" with a synchronous build');if(I&&s.isSync)throw new Error('Cannot use "watch" with a synchronous build');T(Z,ne,(pe,Pe)=>{if(pe)return re(new Error(pe),null);if(Oe){let Ce=Pe,Ee=!1;Z.ref();let Ve={port:Ce.port,host:Ce.host,wait:Oe.wait,stop(){Ee||(Ee=!0,Oe.stop(),Z.unref())}};return Z.ref(),Oe.wait.then(Z.unref,Z.unref),re(null,Ve)}return Te(Pe,re)})};return{readFromStdout:ie,afterClose:V,service:{buildOrServe:Q,transform:({callName:x,refs:A,input:w,options:N,isTTY:he,fs:oe,callback:re})=>{const ee=bn();let ce=se=>{try{if(typeof w!="string")throw new Error('The input to "transform" must be a string');let{flags:H,mangleCache:ae}=Wr(x,N,he,X),ue={command:"transform",flags:H,inputFS:se!==null,input:se!==null?se:w};ae&&(ue.mangleCache=ae),T(A,ue,(Z,ye)=>{if(Z)return re(new Error(Z),null);let Ne=qe(ye.errors,ee),te=qe(ye.warnings,ee),B=1,Y=()=>{if(--B===0){let $={warnings:te,code:ye.code,map:ye.map};ye.mangleCache&&($.mangleCache=ye?.mangleCache),re(null,$)}};if(Ne.length>0)return re(rt("Transform failed",Ne,te),null);ye.codeFS&&(B++,oe.readFile(ye.code,($,q)=>{$!==null?re($,null):(ye.code=q,Y())})),ye.mapFS&&(B++,oe.readFile(ye.map,($,q)=>{$!==null?re($,null):(ye.map=q,Y())})),Y()})}catch(H){let ae=[];try{pt(ae,N,{},he,X)}catch{}const ue=nt(H,s,ee,void 0,"");T(A,{command:"error",flags:ae,error:ue},()=>{ue.detail=ee.load(ue.detail),re(rt("Transform failed",[ue],[]),null)})}};if(typeof w=="string"&&w.length>1024*1024){let se=ce;ce=()=>oe.writeFile(w,se)}ce(null)},formatMessages:({callName:x,refs:A,messages:w,options:N,callback:he})=>{let oe=Ye(w,"messages",null,"");if(!N)throw new Error(`Missing second argument in ${x}() call`);let re={},ee=f(N,re,"kind",F),ce=f(N,re,"color",ge),se=f(N,re,"terminalWidth",tt);if(Ae(N,re,`in ${x}() call`),ee===void 0)throw new Error(`Missing "kind" in ${x}() call`);if(ee!=="error"&&ee!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${x}() call`);let H={command:"format-msgs",messages:oe,isWarning:ee==="warning"};ce!==void 0&&(H.color=ce),se!==void 0&&(H.terminalWidth=se),T(A,H,(ae,ue)=>{if(ae)return he(new Error(ae),null);he(null,ue.messages)})},analyzeMetafile:({callName:x,refs:A,metafile:w,options:N,callback:he})=>{N===void 0&&(N={});let oe={},re=f(N,oe,"color",ge),ee=f(N,oe,"verbose",ge);Ae(N,oe,`in ${x}() call`);let ce={command:"analyze-metafile",metafile:w};re!==void 0&&(ce.color=re),ee!==void 0&&(ce.verbose=ee),T(A,ce,(se,H)=>{if(se)return he(new Error(se),null);he(null,H.result)})}}}}function bn(){const s=new Map;let l=0;return{load(c){return s.get(c)},store(c){if(c===void 0)return-1;const S=l++;return s.set(S,c),S}}}function mt(s,l,c){let S,j=!1;return()=>{if(j)return S;j=!0;try{let R=(s.stack+"").split(`
`);R.splice(1,1);let b=vn(l,R,c);if(b)return S={text:s.message,location:b},S}catch{}}}function nt(s,l,c,S,j){let R="Internal error",b=null;try{R=(s&&s.message||s)+""}catch{}try{b=vn(l,(s.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:j,text:R,location:b,notes:S?[S]:[],detail:c?c.store(s):-1}}function vn(s,l,c){let S="    at ";if(s.readFileSync&&!l[0].startsWith(S)&&l[1].startsWith(S))for(let j=1;j<l.length;j++){let R=l[j];if(!!R.startsWith(S))for(R=R.slice(S.length);;){let b=/^(?:new |async )?\S+ \((.*)\)$/.exec(R);if(b){R=b[1];continue}if(b=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(R),b){R=b[1];continue}if(b=/^(\S+):(\d+):(\d+)$/.exec(R),b){let D;try{D=s.readFileSync(b[1],"utf8")}catch{break}let v=D.split(/\r\n|\r|\n|\u2028|\u2029/)[+b[2]-1]||"",G=+b[3]-1,ie=v.slice(G,G+c.length)===c?c.length:0;return{file:b[1],namespace:"file",line:+b[2],column:de(v.slice(0,G)).length,length:de(v.slice(G,G+ie)).length,lineText:v+`
`+l.slice(1).join(`
`),suggestion:""}}break}}return null}function rt(s,l,c){let S=5,j=l.length<1?"":` with ${l.length} error${l.length<2?"":"s"}:`+l.slice(0,S+1).map((b,D)=>{if(D===S)return`
...`;if(!b.location)return`
error: ${b.text}`;let{file:v,line:G,column:ie}=b.location,V=b.pluginName?`[plugin: ${b.pluginName}] `:"";return`
${v}:${G}:${ie}: ERROR: ${V}${b.text}`}).join(""),R=new Error(`${s}${j}`);return R.errors=l,R.warnings=c,R}function qe(s,l){for(const c of s)c.detail=l.load(c.detail);return s}function _n(s,l){if(s==null)return null;let c={},S=f(s,c,"file",F),j=f(s,c,"namespace",F),R=f(s,c,"line",tt),b=f(s,c,"column",tt),D=f(s,c,"length",tt),v=f(s,c,"lineText",F),G=f(s,c,"suggestion",F);return Ae(s,c,l),{file:S||"",namespace:j||"",line:R||0,column:b||0,length:D||0,lineText:v||"",suggestion:G||""}}function Ye(s,l,c,S){let j=[],R=0;for(const b of s){let D={},v=f(b,D,"id",F),G=f(b,D,"pluginName",F),ie=f(b,D,"text",F),V=f(b,D,"location",mn),T=f(b,D,"notes",xe),le=f(b,D,"detail",dt),me=`in element ${R} of "${l}"`;Ae(b,D,me);let K=[];if(T)for(const C of T){let P={},U=f(C,P,"text",F),W=f(C,P,"location",mn);Ae(C,P,me),K.push({text:U||"",location:_n(W,me)})}j.push({id:v||"",pluginName:G||S,text:ie||"",location:_n(V,me),notes:K,detail:c?c.store(le):-1}),R++}return j}function gt(s,l){const c=[];for(const S of s){if(typeof S!="string")throw new Error(`${JSON.stringify(l)} must be an array of strings`);c.push(S)}return c}function Gr({path:s,contents:l}){let c=null;return{path:s,contents:l,get text(){return c===null&&(c=We(l)),c}}}var Jr="0.14.46",Hr=s=>wt().build(s),Yr=()=>{throw new Error('The "serve" API only works in node')},Xr=(s,l)=>wt().transform(s,l),Kr=(s,l)=>wt().formatMessages(s,l),Qr=(s,l)=>wt().analyzeMetafile(s,l),Zr=()=>{throw new Error('The "buildSync" API only works in node')},es=()=>{throw new Error('The "transformSync" API only works in node')},ts=()=>{throw new Error('The "formatMessagesSync" API only works in node')},ns=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},st,Nt,wt=()=>{if(Nt)return Nt;throw st?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},rs=s=>{s=Br(s||{});let l=s.wasmURL,c=s.wasmModule,S=s.worker!==!1;if(!l&&!c)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(st)throw new Error('Cannot call "initialize" more than once');return st=ss(l||"",c,S),st.catch(()=>{st=void 0}),st},ss=(s,l,c)=>h(void 0,null,function*(){let S;if(l)S=l;else{let D=yield fetch(s);if(!D.ok)throw new Error(`Failed to download ${JSON.stringify(s)}`);S=yield D.arrayBuffer()}let j;if(c){let D=new Blob([`onmessage=((postMessage) => {
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
    })(postMessage)`],{type:"text/javascript"});j=new Worker(URL.createObjectURL(D))}else{let D=(v=>{var G=(T,le,me)=>new Promise((K,C)=>{var P=X=>{try{W(me.next(X))}catch(Q){C(Q)}},U=X=>{try{W(me.throw(X))}catch(Q){C(Q)}},W=X=>X.done?K(X.value):Promise.resolve(X.value).then(P,U);W((me=me.apply(T,le)).next())});let ie,V={};for(let T=self;T;T=Object.getPrototypeOf(T))for(let le of Object.getOwnPropertyNames(T))le in V||Object.defineProperty(V,le,{get:()=>self[le]});return(()=>{const T=()=>{const K=new Error("not implemented");return K.code="ENOSYS",K};if(!V.fs){let K="";V.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(C,P){K+=me.decode(P);const U=K.lastIndexOf(`
`);return U!=-1&&(console.log(K.substr(0,U)),K=K.substr(U+1)),P.length},write(C,P,U,W,X,Q){if(U!==0||W!==P.length||X!==null){Q(T());return}const we=this.writeSync(C,P);Q(null,we)},chmod(C,P,U){U(T())},chown(C,P,U,W){W(T())},close(C,P){P(T())},fchmod(C,P,U){U(T())},fchown(C,P,U,W){W(T())},fstat(C,P){P(T())},fsync(C,P){P(null)},ftruncate(C,P,U){U(T())},lchown(C,P,U,W){W(T())},link(C,P,U){U(T())},lstat(C,P){P(T())},mkdir(C,P,U){U(T())},open(C,P,U,W){W(T())},read(C,P,U,W,X,Q){Q(T())},readdir(C,P){P(T())},readlink(C,P){P(T())},rename(C,P,U){U(T())},rmdir(C,P){P(T())},stat(C,P){P(T())},symlink(C,P,U){U(T())},truncate(C,P,U){U(T())},unlink(C,P){P(T())},utimes(C,P,U,W){W(T())}}}if(V.process||(V.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw T()},pid:-1,ppid:-1,umask(){throw T()},cwd(){throw T()},chdir(){throw T()}}),!V.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!V.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!V.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!V.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");const le=new TextEncoder("utf-8"),me=new TextDecoder("utf-8");V.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=a=>{a!==0&&console.warn("exit code:",a)},this._exitPromise=new Promise(a=>{this._resolveExitPromise=a}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;const K=(a,E)=>{this.mem.setUint32(a+0,E,!0),this.mem.setUint32(a+4,Math.floor(E/4294967296),!0)},C=a=>{const E=this.mem.getUint32(a+0,!0),J=this.mem.getInt32(a+4,!0);return E+J*4294967296},P=a=>{const E=this.mem.getFloat64(a,!0);if(E===0)return;if(!isNaN(E))return E;const J=this.mem.getUint32(a,!0);return this._values[J]},U=(a,E)=>{if(typeof E=="number"&&E!==0){if(isNaN(E)){this.mem.setUint32(a+4,2146959360,!0),this.mem.setUint32(a,0,!0);return}this.mem.setFloat64(a,E,!0);return}if(E===void 0){this.mem.setFloat64(a,0,!0);return}let x=this._ids.get(E);x===void 0&&(x=this._idPool.pop(),x===void 0&&(x=this._values.length),this._values[x]=E,this._goRefCounts[x]=0,this._ids.set(E,x)),this._goRefCounts[x]++;let A=0;switch(typeof E){case"object":E!==null&&(A=1);break;case"string":A=2;break;case"symbol":A=3;break;case"function":A=4;break}this.mem.setUint32(a+4,2146959360|A,!0),this.mem.setUint32(a,x,!0)},W=a=>{const E=C(a+0),J=C(a+8);return new Uint8Array(this._inst.exports.mem.buffer,E,J)},X=a=>{const E=C(a+0),J=C(a+8),x=new Array(J);for(let A=0;A<J;A++)x[A]=P(E+A*8);return x},Q=a=>{const E=C(a+0),J=C(a+8);return me.decode(new DataView(this._inst.exports.mem.buffer,E,J))},we=Date.now()-performance.now();this.importObject={go:{"runtime.wasmExit":a=>{a>>>=0;const E=this.mem.getInt32(a+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(E)},"runtime.wasmWrite":a=>{a>>>=0;const E=C(a+8),J=C(a+16),x=this.mem.getInt32(a+24,!0);V.fs.writeSync(E,new Uint8Array(this._inst.exports.mem.buffer,J,x))},"runtime.resetMemoryDataView":a=>{this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":a=>{a>>>=0,K(a+8,(we+performance.now())*1e6)},"runtime.walltime":a=>{a>>>=0;const E=new Date().getTime();K(a+8,E/1e3),this.mem.setInt32(a+16,E%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":a=>{a>>>=0;const E=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(E,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(E);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},C(a+8)+1)),this.mem.setInt32(a+16,E,!0)},"runtime.clearTimeoutEvent":a=>{a>>>=0;const E=this.mem.getInt32(a+8,!0);clearTimeout(this._scheduledTimeouts.get(E)),this._scheduledTimeouts.delete(E)},"runtime.getRandomData":a=>{a>>>=0,crypto.getRandomValues(W(a+8))},"syscall/js.finalizeRef":a=>{a>>>=0;const E=this.mem.getUint32(a+8,!0);if(this._goRefCounts[E]--,this._goRefCounts[E]===0){const J=this._values[E];this._values[E]=null,this._ids.delete(J),this._idPool.push(E)}},"syscall/js.stringVal":a=>{a>>>=0,U(a+24,Q(a+8))},"syscall/js.valueGet":a=>{a>>>=0;const E=Reflect.get(P(a+8),Q(a+16));a=this._inst.exports.getsp()>>>0,U(a+32,E)},"syscall/js.valueSet":a=>{a>>>=0,Reflect.set(P(a+8),Q(a+16),P(a+32))},"syscall/js.valueDelete":a=>{a>>>=0,Reflect.deleteProperty(P(a+8),Q(a+16))},"syscall/js.valueIndex":a=>{a>>>=0,U(a+24,Reflect.get(P(a+8),C(a+16)))},"syscall/js.valueSetIndex":a=>{a>>>=0,Reflect.set(P(a+8),C(a+16),P(a+24))},"syscall/js.valueCall":a=>{a>>>=0;try{const E=P(a+8),J=Reflect.get(E,Q(a+16)),x=X(a+32),A=Reflect.apply(J,E,x);a=this._inst.exports.getsp()>>>0,U(a+56,A),this.mem.setUint8(a+64,1)}catch(E){a=this._inst.exports.getsp()>>>0,U(a+56,E),this.mem.setUint8(a+64,0)}},"syscall/js.valueInvoke":a=>{a>>>=0;try{const E=P(a+8),J=X(a+16),x=Reflect.apply(E,void 0,J);a=this._inst.exports.getsp()>>>0,U(a+40,x),this.mem.setUint8(a+48,1)}catch(E){a=this._inst.exports.getsp()>>>0,U(a+40,E),this.mem.setUint8(a+48,0)}},"syscall/js.valueNew":a=>{a>>>=0;try{const E=P(a+8),J=X(a+16),x=Reflect.construct(E,J);a=this._inst.exports.getsp()>>>0,U(a+40,x),this.mem.setUint8(a+48,1)}catch(E){a=this._inst.exports.getsp()>>>0,U(a+40,E),this.mem.setUint8(a+48,0)}},"syscall/js.valueLength":a=>{a>>>=0,K(a+16,parseInt(P(a+8).length))},"syscall/js.valuePrepareString":a=>{a>>>=0;const E=le.encode(String(P(a+8)));U(a+16,E),K(a+24,E.length)},"syscall/js.valueLoadString":a=>{a>>>=0;const E=P(a+8);W(a+16).set(E)},"syscall/js.valueInstanceOf":a=>{a>>>=0,this.mem.setUint8(a+24,P(a+8)instanceof P(a+16)?1:0)},"syscall/js.copyBytesToGo":a=>{a>>>=0;const E=W(a+8),J=P(a+32);if(!(J instanceof Uint8Array||J instanceof Uint8ClampedArray)){this.mem.setUint8(a+48,0);return}const x=J.subarray(0,E.length);E.set(x),K(a+40,x.length),this.mem.setUint8(a+48,1)},"syscall/js.copyBytesToJS":a=>{a>>>=0;const E=P(a+8),J=W(a+16);if(!(E instanceof Uint8Array||E instanceof Uint8ClampedArray)){this.mem.setUint8(a+48,0);return}const x=J.subarray(0,E.length);E.set(x),K(a+40,x.length),this.mem.setUint8(a+48,1)},debug:a=>{console.log(a)}}}}run(K){return G(this,null,function*(){if(!(K instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=K,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,V,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[V,5],[this,6]]),this._idPool=[],this.exited=!1;let C=4096;const P=a=>{const E=C,J=le.encode(a+"\0");return new Uint8Array(this.mem.buffer,C,J.length).set(J),C+=J.length,C%8!==0&&(C+=8-C%8),E},U=this.argv.length,W=[];this.argv.forEach(a=>{W.push(P(a))}),W.push(0),Object.keys(this.env).sort().forEach(a=>{W.push(P(`${a}=${this.env[a]}`))}),W.push(0);const Q=C;W.forEach(a=>{this.mem.setUint32(C,a,!0),this.mem.setUint32(C+4,0,!0),C+=8});const we=4096+8192;if(C>=we)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(U,Q),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(K){const C=this;return function(){const P={id:K,this:this,args:arguments};return C._pendingEvent=P,C._resume(),P.result}}}})(),ie=({data:T})=>{let le=new TextDecoder,me=V.fs,K="";me.writeSync=(X,Q)=>{if(X===1)v(Q);else if(X===2){K+=le.decode(Q);let we=K.split(`
`);we.length>1&&console.log(we.slice(0,-1).join(`
`)),K=we[we.length-1]}else throw new Error("Bad write");return Q.length};let C=[],P,U=0;ie=({data:X})=>{X.length>0&&(C.push(X),P&&P())},me.read=(X,Q,we,a,E,J)=>{if(X!==0||we!==0||a!==Q.length||E!==null)throw new Error("Bad read");if(C.length===0){P=()=>me.read(X,Q,we,a,E,J);return}let x=C[0],A=Math.max(0,Math.min(a,x.length-U));Q.set(x.subarray(U,U+A),we),U+=A,U===x.length&&(C.shift(),U=0),J(null,A)};let W=new V.Go;W.argv=["","--service=0.14.46"],T instanceof WebAssembly.Module?WebAssembly.instantiate(T,W.importObject).then(X=>W.run(X)):WebAssembly.instantiate(T,W.importObject).then(({instance:X})=>W.run(X))},T=>ie(T)})(v=>j.onmessage({data:v}));j={onmessage:null,postMessage:v=>setTimeout(()=>D({data:v})),terminate(){}}}j.postMessage(S),j.onmessage=({data:D})=>R(D);let{readFromStdout:R,service:b}=qr({writeToStdin(D){j.postMessage(D)},isSync:!1,isBrowser:!0,esbuild:$e});Nt={build:D=>new Promise((v,G)=>b.buildOrServe({callName:"build",refs:null,serveOptions:null,options:D,isTTY:!1,defaultWD:"/",callback:(ie,V)=>ie?G(ie):v(V)})),transform:(D,v)=>new Promise((G,ie)=>b.transform({callName:"transform",refs:null,input:D,options:v||{},isTTY:!1,fs:{readFile(V,T){T(new Error("Internal error"),null)},writeFile(V,T){T(null)}},callback:(V,T)=>V?ie(V):G(T)})),formatMessages:(D,v)=>new Promise((G,ie)=>b.formatMessages({callName:"formatMessages",refs:null,messages:D,options:v,callback:(V,T)=>V?ie(V):G(T)})),analyzeMetafile:(D,v)=>new Promise((G,ie)=>b.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof D=="string"?D:JSON.stringify(D),options:v,callback:(V,T)=>V?ie(V):G(T)}))}}),is=$e})(e)})(ct);var us=cs(ct.exports),fs=os({__proto__:null,default:us},[ct.exports]),At={exports:{}};/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */At.exports=ms;At.exports.format=Pn;At.exports.parse=$n;var ds=/\B(?=(\d{3})+(?!\d))/g,hs=/(?:\.0*|(\.[^0]+)0+)$/,Ge={b:1,kb:1<<10,mb:1<<20,gb:1<<30,tb:Math.pow(1024,4),pb:Math.pow(1024,5)},ps=/^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;function ms(e,t){return typeof e=="string"?$n(e):typeof e=="number"?Pn(e,t):null}function Pn(e,t){if(!Number.isFinite(e))return null;var n=Math.abs(e),r=t&&t.thousandsSeparator||"",i=t&&t.unitSeparator||"",o=t&&t.decimalPlaces!==void 0?t.decimalPlaces:2,u=Boolean(t&&t.fixedDecimals),d=t&&t.unit||"";(!d||!Ge[d.toLowerCase()])&&(n>=Ge.pb?d="PB":n>=Ge.tb?d="TB":n>=Ge.gb?d="GB":n>=Ge.mb?d="MB":n>=Ge.kb?d="KB":d="B");var m=e/Ge[d.toLowerCase()],g=m.toFixed(o);return u||(g=g.replace(hs,"$1")),r&&(g=g.split(".").map(function(_,k){return k===0?_.replace(ds,r):_}).join(".")),g+i+d}function $n(e){if(typeof e=="number"&&!isNaN(e))return e;if(typeof e!="string")return null;var t=ps.exec(e),n,r="b";return t?(n=parseFloat(t[1]),r=t[4].toLowerCase()):(n=parseInt(e,10),r="b"),isNaN(n)?null:Math.floor(Ge[r]*n)}var gs=At.exports;const Pt=e=>new TextEncoder().encode(e),kt=e=>new TextDecoder().decode(e),Ze="https://unpkg.com",qt=e=>/^(skypack|esm|esm\.sh|unpkg|jsdelivr|esm\.run)\:?/.test(e)||/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com)/.test(e)?"npm":/^(jsdelivr\.gh|github)\:?/.test(e)||/^https?:\/\/(cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com)/.test(e)?"github":/^(deno)\:?/.test(e)||/^https?:\/\/(deno\.land\/x)/.test(e)?"deno":"other",On=(e,t=Ze)=>(/^skypack\:/.test(e)?t="https://cdn.skypack.dev":/^(esm\.sh|esm)\:/.test(e)?t="https://cdn.esm.sh":/^unpkg\:/.test(e)?t="https://unpkg.com":/^(jsdelivr|esm\.run)\:/.test(e)?t="https://cdn.jsdelivr.net/npm":/^(jsdelivr\.gh)\:/.test(e)?t="https://cdn.jsdelivr.net/gh":/^(deno)\:/.test(e)?t="https://deno.land/x":/^(github)\:/.test(e)&&(t="https://raw.githubusercontent.com"),/\/$/.test(t)?t:`${t}/`),Tn=e=>e.replace(/^(skypack|esm|esm\.sh|unpkg|jsdelivr|jsdelivr\.gh|esm\.run|deno|github)\:/,"").replace(/^https?:\/\/(cdn\.skypack\.dev|cdn\.esm\.sh|cdn\.jsdelivr\.net\/npm|unpkg\.com|cdn\.jsdelivr\.net\/gh|raw\.githubusercontent\.com|deno\.land\/x)/,"").replace(/^\//,""),Me=(e,t=Ze)=>{let n=On(e,t),r=Tn(e),i=new URL(r,n);return{import:e,path:r,origin:n,cdn:t,url:i}},it="external-globals",Cn=Pt("export default {}"),jn={console:"console-browserify",constants:"constants-browserify",crypto:"crypto-browserify",http:"http-browserify",buffer:"buffer",Dirent:"dirent",vm:"vm-browserify",zlib:"zlib-browserify",assert:"assert",child_process:"child_process",cluster:"child_process",dgram:"dgram",dns:"dns",domain:"domain-browser",events:"events",https:"https",module:"module",net:"net",path:"path-browserify",punycode:"punycode",querystring:"querystring",readline:"readline",repl:"repl",stream:"stream",string_decoder:"string_decoder",sys:"sys",timers:"timers",tls:"tls",tty:"tty-browserify",url:"url",util:"util",_shims:"_shims",_stream_duplex:"_stream_duplex",_stream_readable:"_stream_readable",_stream_writable:"_stream_writable",_stream_transform:"_stream_transform",_stream_passthrough:"_stream_passthrough",process:"process/browser",fs:"memfs",os:"os-browserify/browser",v8:"v8","node-inspect":"node-inspect",_linklist:"_linklist",_stream_wrap:"_stream_wrap"},Rn=Object.keys(jn),Dn=["v8/tools/codemap","v8/tools/consarray","v8/tools/csvparser","v8/tools/logreader","v8/tools/profile_view","v8/tools/profile","v8/tools/SourceMap","v8/tools/splaytree","v8/tools/tickprocessor-driver","v8/tools/tickprocessor","node-inspect/lib/_inspect","node-inspect/lib/internal/inspect_client ","node-inspect/lib/internal/inspect_repl","_linklist","_stream_wrap"],Nn=["chokidar","yargs","fsevents","worker_threads","async_hooks","diagnostics_channel","http2","inspector","perf_hooks","trace_events","wasi",...Dn,...Rn],Mn=(e,t=[])=>[...Nn,...t].find(n=>!!(n===e||e.startsWith(`${n}/`))),Un=(e,t,n)=>{const{external:r=[]}=n?.esbuild??{};return{name:it,setup(i){i.onResolve({filter:/.*/},o=>{let u=o.path.replace(/^node\:/,""),{path:d}=Me(u);if(Mn(d,r))return{path:d,namespace:it,external:!0}}),i.onLoad({filter:/.*/,namespace:it},o=>({pluginName:it,contents:Cn,warnings:[{text:`${o.path} is marked as an external module and will be ignored.`,details:`"${o.path}" is a built-in node module thus can't be bundled by https://bundlejs.com, sorry about that.`}]}))}}},Gt=new Map,In="EXTERNAL_FETCHES",Ft=async(e,t,n)=>{let r=await fetch(t,n),i=r.clone();return"caches"in globalThis?e.put(t,i):Gt.set(t,i),r},ut=async(e,t=!1,n)=>{let r=new Request(e.toString()),i,o,u;return"caches"in globalThis?(o=await caches.open(In),u=await o.match(r)):u=Gt.get(r),i=u,u?t||Ft(o,r,n):i=await Ft(o,r,n),i.clone()},at=46,ke=47,Jt="/",Ht=/\/+/;function Be(e){if(typeof e!="string")throw new TypeError(`Path must be a string. Received ${JSON.stringify(e)}`)}function Ln(e){return e===ke}function Fn(e,t,n,r){let i="",o=0,u=-1,d=0,m;for(let g=0,_=e.length;g<=_;++g){if(g<_)m=e.charCodeAt(g);else{if(r(m))break;m=ke}if(r(m)){if(!(u===g-1||d===1))if(u!==g-1&&d===2){if(i.length<2||o!==2||i.charCodeAt(i.length-1)!==at||i.charCodeAt(i.length-2)!==at){if(i.length>2){const k=i.lastIndexOf(n);k===-1?(i="",o=0):(i=i.slice(0,k),o=i.length-1-i.lastIndexOf(n)),u=g,d=0;continue}else if(i.length===2||i.length===1){i="",o=0,u=g,d=0;continue}}t&&(i.length>0?i+=`${n}..`:i="..",o=2)}else i.length>0?i+=n+e.slice(u+1,g):i=e.slice(u+1,g),o=g-u-1;u=g,d=0}else m===at&&d!==-1?++d:d=-1}return i}function ws(e,t){const n=t.dir||t.root,r=t.base||(t.name||"")+(t.ext||"");return n?n===t.root?n+r:n+e+r:r}const ys={"	":"%09","\n":"%0A","\v":"%0B","\f":"%0C","\r":"%0D"," ":"%20"};function zn(e){return e.replaceAll(/[\s]/g,t=>ys[t]??t)}const bs="/",vs=":";function zt(...e){let t="",n=!1;for(let r=e.length-1;r>=-1&&!n;r--){let i;if(r>=0)i=e[r];else{const{Deno:o}=globalThis;if(typeof o?.cwd!="function")throw new TypeError("Resolved a relative path without a CWD.");i=o?.cwd?.()??"/"}Be(i),i.length!==0&&(t=`${i}/${t}`,n=i.charCodeAt(0)===ke)}return t=Fn(t,!n,"/",Ln),n?t.length>0?`/${t}`:"/":t.length>0?t:"."}function Bn(e){if(Be(e),e.length===0)return".";const t=e.charCodeAt(0)===ke,n=e.charCodeAt(e.length-1)===ke;return e=Fn(e,!t,"/",Ln),e.length===0&&!t&&(e="."),e.length>0&&n&&(e+="/"),t?`/${e}`:e}function Vn(e){return Be(e),e.length>0&&e.charCodeAt(0)===ke}function _s(...e){if(e.length===0)return".";let t;for(let n=0,r=e.length;n<r;++n){const i=e[n];Be(i),i.length>0&&(t?t+=`/${i}`:t=i)}return t?Bn(t):"."}function Es(e,t){if(Be(e),Be(t),e===t||(e=zt(e),t=zt(t),e===t))return"";let n=1;const r=e.length;for(;n<r&&e.charCodeAt(n)===ke;++n);const i=r-n;let o=1;const u=t.length;for(;o<u&&t.charCodeAt(o)===ke;++o);const d=u-o,m=i<d?i:d;let g=-1,_=0;for(;_<=m;++_){if(_===m){if(d>m){if(t.charCodeAt(o+_)===ke)return t.slice(o+_+1);if(_===0)return t.slice(o+_)}else i>m&&(e.charCodeAt(n+_)===ke?g=_:_===0&&(g=0));break}const O=e.charCodeAt(n+_),L=t.charCodeAt(o+_);if(O!==L)break;O===ke&&(g=_)}let k="";for(_=n+g+1;_<=r;++_)(_===r||e.charCodeAt(_)===ke)&&(k.length===0?k+="..":k+="/..");return k.length>0?k+t.slice(o+g):(o+=g,t.charCodeAt(o)===ke&&++o,t.slice(o))}function ks(e){return e}function xs(e){if(Be(e),e.length===0)return".";const t=e.charCodeAt(0)===ke;let n=-1,r=!0;for(let i=e.length-1;i>=1;--i)if(e.charCodeAt(i)===ke){if(!r){n=i;break}}else r=!1;return n===-1?t?"/":".":t&&n===1?"//":e.slice(0,n)}function Ss(e,t=""){if(t!==void 0&&typeof t!="string")throw new TypeError('"ext" argument must be a string');Be(e);let n=0,r=-1,i=!0,o;if(t!==void 0&&t.length>0&&t.length<=e.length){if(t.length===e.length&&t===e)return"";let u=t.length-1,d=-1;for(o=e.length-1;o>=0;--o){const m=e.charCodeAt(o);if(m===ke){if(!i){n=o+1;break}}else d===-1&&(i=!1,d=o+1),u>=0&&(m===t.charCodeAt(u)?--u===-1&&(r=o):(u=-1,r=d))}return n===r?r=d:r===-1&&(r=e.length),e.slice(n,r)}else{for(o=e.length-1;o>=0;--o)if(e.charCodeAt(o)===ke){if(!i){n=o+1;break}}else r===-1&&(i=!1,r=o+1);return r===-1?"":e.slice(n,r)}}function As(e){Be(e);let t=-1,n=0,r=-1,i=!0,o=0;for(let u=e.length-1;u>=0;--u){const d=e.charCodeAt(u);if(d===ke){if(!i){n=u+1;break}continue}r===-1&&(i=!1,r=u+1),d===at?t===-1?t=u:o!==1&&(o=1):t!==-1&&(o=-1)}return t===-1||r===-1||o===0||o===1&&t===r-1&&t===n+1?"":e.slice(t,r)}function Ps(e){if(e===null||typeof e!="object")throw new TypeError(`The "pathObject" argument must be of type Object. Received type ${typeof e}`);return ws("/",e)}function $s(e){Be(e);const t={root:"",dir:"",base:"",ext:"",name:""};if(e.length===0)return t;const n=e.charCodeAt(0)===ke;let r;n?(t.root="/",r=1):r=0;let i=-1,o=0,u=-1,d=!0,m=e.length-1,g=0;for(;m>=r;--m){const _=e.charCodeAt(m);if(_===ke){if(!d){o=m+1;break}continue}u===-1&&(d=!1,u=m+1),_===at?i===-1?i=m:g!==1&&(g=1):i!==-1&&(g=-1)}return i===-1||u===-1||g===0||g===1&&i===u-1&&i===o+1?u!==-1&&(o===0&&n?t.base=t.name=e.slice(1,u):t.base=t.name=e.slice(o,u)):(o===0&&n?(t.name=e.slice(1,i),t.base=e.slice(1,u)):(t.name=e.slice(o,i),t.base=e.slice(o,u)),t.ext=e.slice(i,u)),o>0?t.dir=e.slice(0,o-1):n&&(t.dir="/"),t}function Os(e){if(e=e instanceof URL?e:new URL(e),e.protocol!="file:")throw new TypeError("Must be a file URL.");return decodeURIComponent(e.pathname.replace(/%(?![0-9A-Fa-f]{2})/g,"%25"))}function Ts(e){if(!Vn(e))throw new TypeError("Must be an absolute path.");const t=new URL("file:///");return t.pathname=zn(e.replace(/%/g,"%25").replace(/\\/g,"%5C")),t}var Yt=Object.freeze(Object.defineProperty({__proto__:null,sep:bs,delimiter:vs,resolve:zt,normalize:Bn,isAbsolute:Vn,join:_s,relative:Es,toNamespacedPath:ks,dirname:xs,basename:Ss,extname:As,format:Ps,parse:$s,fromFileUrl:Os,toFileUrl:Ts},Symbol.toStringTag,{value:"Module"}));const Cs=Yt,{join:js,normalize:kn}=Cs,Ut=["!","$","(",")","*","+",".","=","?","[","\\","^","{","|"],Rs=["-","\\","]"];function Wn(e,{extended:t=!0,globstar:n=!0,os:r="linux",caseInsensitive:i=!1}={}){if(e=="")return/(?!)/;const o=r=="windows"?"(?:\\\\|/)+":"/+",u=r=="windows"?"(?:\\\\|/)*":"/*",d=r=="windows"?["\\","/"]:["/"],m=r=="windows"?"(?:[^\\\\/]*(?:\\\\|/|$)+)*":"(?:[^/]*(?:/|$)+)*",g=r=="windows"?"[^\\\\/]*":"[^/]*",_=r=="windows"?"`":"\\";let k=e.length;for(;k>1&&d.includes(e[k-1]);k--);e=e.slice(0,k);let O="";for(let L=0;L<e.length;){let y="";const p=[];let h=!1,$e=!1,Ie=!1,M=L;for(;M<e.length&&!d.includes(e[M]);M++){if($e){$e=!1,y+=(h?Rs:Ut).includes(e[M])?`\\${e[M]}`:e[M];continue}if(e[M]==_){$e=!0;continue}if(e[M]=="[")if(h){if(e[M+1]==":"){let ve=M+1,de="";for(;e[ve+1]!=null&&e[ve+1]!=":";)de+=e[ve+1],ve++;if(e[ve+1]==":"&&e[ve+2]=="]"){M=ve+2,de=="alnum"?y+="\\dA-Za-z":de=="alpha"?y+="A-Za-z":de=="ascii"?y+="\0-\x7F":de=="blank"?y+="	 ":de=="cntrl"?y+="\0-\x7F":de=="digit"?y+="\\d":de=="graph"?y+="!-~":de=="lower"?y+="a-z":de=="print"?y+=" -~":de=="punct"?y+=`!"#$%&'()*+,\\-./:;<=>?@[\\\\\\]^_\u2018{|}~`:de=="space"?y+="\\s\v":de=="upper"?y+="A-Z":de=="word"?y+="\\w":de=="xdigit"&&(y+="\\dA-Fa-f");continue}}}else{h=!0,y+="[",e[M+1]=="!"?(M++,y+="^"):e[M+1]=="^"&&(M++,y+="\\^");continue}if(e[M]=="]"&&h){h=!1,y+="]";continue}if(h){e[M]=="\\"?y+="\\\\":y+=e[M];continue}if(e[M]==")"&&p.length>0&&p[p.length-1]!="BRACE"){y+=")";const ve=p.pop();ve=="!"?y+=g:ve!="@"&&(y+=ve);continue}if(e[M]=="|"&&p.length>0&&p[p.length-1]!="BRACE"){y+="|";continue}if(e[M]=="+"&&t&&e[M+1]=="("){M++,p.push("+"),y+="(?:";continue}if(e[M]=="@"&&t&&e[M+1]=="("){M++,p.push("@"),y+="(?:";continue}if(e[M]=="?"){t&&e[M+1]=="("?(M++,p.push("?"),y+="(?:"):y+=".";continue}if(e[M]=="!"&&t&&e[M+1]=="("){M++,p.push("!"),y+="(?!";continue}if(e[M]=="{"){p.push("BRACE"),y+="(?:";continue}if(e[M]=="}"&&p[p.length-1]=="BRACE"){p.pop(),y+=")";continue}if(e[M]==","&&p[p.length-1]=="BRACE"){y+="|";continue}if(e[M]=="*"){if(t&&e[M+1]=="(")M++,p.push("*"),y+="(?:";else{const ve=e[M-1];let de=1;for(;e[M+1]=="*";)M++,de++;const We=e[M+1];n&&de==2&&[...d,void 0].includes(ve)&&[...d,void 0].includes(We)?(y+=m,Ie=!0):y+=g}continue}y+=Ut.includes(e[M])?`\\${e[M]}`:e[M]}if(p.length>0||h||$e){y="";for(const ve of e.slice(L,M))y+=Ut.includes(ve)?`\\${ve}`:ve,Ie=!1}for(O+=y,Ie||(O+=M<e.length?o:u,Ie=!0);d.includes(e[M]);)M++;if(!(M>L))throw new Error("Assertion failure: i > j (potential infinite loop)");L=M}return O=`^${O}$`,new RegExp(O,i?"i":"")}function qn(e){const t={"{":"}","(":")","[":"]"},n=/\\(.)|(^!|\*|\?|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;if(e==="")return!1;let r;for(;r=n.exec(e);){if(r[2])return!0;let i=r.index+r[0].length;const o=r[1],u=o?t[o]:null;if(o&&u){const d=e.indexOf(u,i);d!==-1&&(i=d+1)}e=e.slice(i)}return!1}function Xt(e,{globstar:t=!1}={}){if(e.match(/\0/g))throw new Error(`Glob contains invalid characters: "${e}"`);if(!t)return kn(e);const n=Ht.source,r=new RegExp(`(?<=(${n}|^)\\*\\*${n})\\.\\.(?=${n}|$)`,"g");return kn(e.replace(r,"\0")).replace(/\0/g,"..")}function Gn(e,{extended:t=!0,globstar:n=!1}={}){if(!n||e.length==0)return js(...e);if(e.length===0)return".";let r;for(const i of e){const o=i;o.length>0&&(r?r+=`${Jt}${o}`:r=o)}return r?Xt(r,{extended:t,globstar:n}):"."}const Ds=Yt,Jn=Yt,{basename:Hn,delimiter:Yn,dirname:$t,extname:Ot,format:Xn,fromFileUrl:Kn,isAbsolute:Kt,join:Qt,normalize:Qn,parse:Zn,relative:er,resolve:Tt,sep:tr,toFileUrl:nr,toNamespacedPath:rr}=Ds;var Ns=Object.freeze(Object.defineProperty({__proto__:null,posix:Jn,basename:Hn,delimiter:Yn,dirname:$t,extname:Ot,format:Xn,fromFileUrl:Kn,isAbsolute:Kt,join:Qt,normalize:Qn,parse:Zn,relative:er,resolve:Tt,sep:tr,toFileUrl:nr,toNamespacedPath:rr,SEP:Jt,SEP_PATTERN:Ht,globToRegExp:Wn,isGlob:qn,normalizeGlob:Xt,joinGlobs:Gn},Symbol.toStringTag,{value:"Module"}));const xt=(e,...t)=>{const n=new URL(e);return n.pathname=zn(Qt(n.pathname,...t).replace(/%/g,"%25").replace(/\\/g,"%5C")),n.toString()},Ct=e=>/^(?!\.).*/.test(e)&&!Kt(e),sr=[".tsx",".ts",".jsx",".js",".css",".json"],Zt=e=>{const t=Ot(e);return sr.includes(t)?(/\.js(x)?$/.test(t)?t.replace(/^\.js/,".ts"):t).slice(1):t===".mjs"||t===".cjs"||t===".mts"||t===".cts"?"ts":t==".scss"?"css":t==".png"||t==".jpeg"||t==".ttf"?"dataurl":t==".svg"||t==".html"||t==".txt"?"text":t==".wasm"?"file":t.length?"text":"ts"};function lt(e,t){if(typeof e=="string")return e;if(e){let n,r;if(Array.isArray(e)){for(n=0;n<e.length;n++)if(r=lt(e[n],t))return r}else for(n in e)if(t.has(n))return lt(e[n],t)}}function Xe(e,t,n){throw new Error(n?`No known conditions for "${t}" entry in "${e}" package`:`Missing "${t}" export in "${e}" package`)}function ir(e,t){return t===e?".":t[0]==="."?t:t.replace(new RegExp("^"+e+"/"),"./")}function Ms(e,t=".",n={}){let{name:r,exports:i}=e;if(i){let{browser:o,require:u,unsafe:d,conditions:m=[]}=n,g=ir(r,t);if(g[0]!=="."&&(g="./"+g),typeof i=="string")return g==="."?i:Xe(r,g);let _=new Set(["default",...m]);d||_.add(u?"require":"import"),d||_.add(o?"browser":"node");let k,O,L=!1;for(k in i){L=k[0]!==".";break}if(L)return g==="."?lt(i,_)||Xe(r,g,1):Xe(r,g);if(O=i[g])return lt(O,_)||Xe(r,g,1);for(k in i){if(O=k[k.length-1],O==="/"&&g.startsWith(k))return(O=lt(i[k],_))?O+g.substring(k.length):Xe(r,g,1);if(O==="*"&&g.startsWith(k.slice(0,-1))&&g.substring(k.length-1).length>0)return(O=lt(i[k],_))?O.replace("*",g.substring(k.length-1)):Xe(r,g,1)}return Xe(r,g)}}function Us(e,t={}){let n=0,r,i=t.browser,o=t.fields||["module","main"];for(i&&!o.includes("browser")&&o.unshift("browser");n<o.length;n++)if(r=e[o[n]]){if(typeof r!="string")if(typeof r=="object"&&o[n]=="browser"){if(typeof i=="string"&&(r=r[i=ir(e.name,i)],r==null))return i}else continue;return typeof r=="string"?"./"+r.replace(/^\.?\//,""):r}}var Is=/^(@[^\/]+\/[^@\/]+)(?:@([^\/]+))?(\/.*)?$/,Ls=/^([^@\/]+)(?:@([^\/]+))?(\/.*)?$/;function jt(e){const t=Is.exec(e)||Ls.exec(e);if(!t)throw new Error(`[parse-package-name] invalid package name: ${e}`);return{name:t[1]||"",version:t[2]||"latest",path:t[3]||""}}function Ke(e,t){if(typeof e=="string")return e;if(e){let n,r;if(Array.isArray(e)){for(n=0;n<e.length;n++)if(r=Ke(e[n],t))return r}else for(n in e)if(t.has(n))return Ke(e[n],t)}}function Je(e,t,n){throw new Error(n?`No known conditions for "${t}" entry in "${e}" package`:`Missing "${t}" import in "${e}" package`)}function lr(e,t){return t===e?".":t[0]==="."?t:t.replace(new RegExp("^"+e+"/"),"./")}function ar(e,t=".",n={}){let{name:r,imports:i}=e;if(i){let{browser:o,require:u,unsafe:d,conditions:m=[]}=n,g=lr(r,t);if(typeof i=="string")return g==="#"?i:Je(r,g);let _=new Set(["default",...m]);d||_.add(u?"require":"import"),d||_.add(o?"browser":"node");let k,O,L=!1;for(k in i){L=k[0]!=="#";break}if(L)return g==="#"?Ke(i,_)||Je(r,g,1):Je(r,g);if(O=i[g])return Ke(O,_)||Je(r,g,1);for(k in i){if(O=k[k.length-1],O==="/"&&g.startsWith(k))return(O=Ke(i[k],_))?O+g.substring(k.length):Je(r,g,1);if(O==="*"&&g.startsWith(k.slice(0,-1))&&g.substring(k.length-1).length>0)return(O=Ke(i[k],_))?O.replace("*",g.substring(k.length-1)):Je(r,g,1)}return Je(r,g)}}const Bt="cdn-url",St=(e=Ze,t)=>async n=>{if(Ct(n.path)){let{path:r,origin:i}=Me(n.path,e),o=qt(i)=="npm",u=jt(r),d=u.path,m=n.pluginData?.pkg??{};if(r[0]=="#"){let O=ar({...m,exports:m.imports},r,{require:n.kind==="require-call"||n.kind==="require-resolve"});if(typeof O=="string"){d=O.replace(/^\.?\/?/,"/"),d&&d[0]!=="/"&&(d=`/${d}`);let L=o?"@"+m.version:"",{url:{href:y}}=Me(`${m.name}${L}${d}`);return{namespace:ze,path:y,pluginData:{pkg:m}}}}if(("dependencies"in m||"devDependencies"in m||"peerDependencies"in m)&&!/\S+@\S+/.test(r)){let{devDependencies:O={},dependencies:L={},peerDependencies:y={}}=m,p=Object.assign({},O,y,L);Object.keys(p).includes(r)&&(u.version=p[r])}if(o)try{let{url:O}=Me(`${u.name}@${u.version}/package.json`,i);m=await ut(O,!0).then(y=>y.json());let L=Ms(m,d?"."+d.replace(/^\.?\/?/,"/"):".",{require:n.kind==="require-call"||n.kind==="require-resolve"})||Us(m);typeof L=="string"&&(d=L.replace(/^\.?\/?/,"/").replace(/\.js\.js$/,".js")),d&&d[0]!=="/"&&(d=`/${d}`)}catch(O){t.emit("logger.warn",`You may want to change CDNs. The current CDN ${/unpkg\.com/.test(i)?`path "${i}${r}" may not`:`"${i}" doesn't`} support package.json files.
There is a chance the CDN you're using doesn't support looking through the package.json of packages. bundlejs will switch to inaccurate guesses for package versions. For package.json support you may wish to use https://unpkg.com or other CDN's that support package.json.`).emit("logger.warn",O)}let _=o?"@"+u.version:"",{url:k}=Me(`${u.name}${_}${d}`,i);return{namespace:ze,path:k.toString(),pluginData:{pkg:m}}}},or=(e,t,n)=>{let{origin:r}=/:/.test(n?.cdn)?Me(n?.cdn):Me(n?.cdn+":");return n.filesystem,{name:Bt,setup(i){i.onResolve({filter:/.*/},St(r,e)),i.onResolve({filter:/.*/,namespace:Bt},St(r,e))}}},ze="http-url",ot=async(e,t)=>{try{let n=await ut(e);if(!n.ok)throw new Error(`Couldn't load ${n.url} (${n.status} code)`);return t.emit("logger.info",`Fetch ${e}`),{url:n.url,content:new Uint8Array(await n.arrayBuffer())}}catch(n){throw new Error(`[getRequest] Failed at request (${e})
${n.toString()}`)}},cr=async(e,t,n,r,i)=>{const o=/new URL\(['"`](.*)['"`],(?:\s+)?import\.meta\.url(?:\s+)?\)/g,u=new URL("./",e).toString(),d=i.filesystem,m=kt(t),_=Array.from(m.matchAll(o)).map(async([,k])=>{let{content:O,url:L}=await ot(xt(u,k),r);return d.set(n+":"+L,t),{path:k,contents:O,get text(){return kt(O)}}});return await Promise.allSettled(_)},en=(e=Ze,t)=>async n=>{let r=n.path.replace(/\/$/,"/index");if(!r.startsWith(".")){if(/^https?:\/\//.test(r))return{path:r,namespace:ze,pluginData:{pkg:n.pluginData?.pkg}};let o=new URL(xt(n.pluginData?.url?n.pluginData?.url:e,"../",r)).origin,d=qt(o)=="npm"?o:e;return Ct(r)?St(d,t)(n):{path:Me(r,d).url.toString(),namespace:ze,pluginData:{pkg:n.pluginData?.pkg}}}return{path:xt(n.pluginData?.url,"../",r),namespace:ze,pluginData:{pkg:n.pluginData?.pkg}}},ur=(e,t,n)=>{let{origin:r}=/:/.test(n?.cdn)?Me(n?.cdn):Me(n?.cdn+":");const i=n.filesystem,o=t.assets??[];return{name:ze,setup(u){u.onResolve({filter:/^https?:\/\//},d=>({path:d.path,namespace:ze})),u.onResolve({filter:/.*/,namespace:ze},en(r,e)),u.onLoad({filter:/.*/,namespace:ze},async d=>{let m=Ot(d.path),g=(L="")=>m.length>0?d.path:d.path+L,_,k;try{({content:_,url:k}=await ot(g(),e))}catch(L){try{({content:_,url:k}=await ot(g(".ts"),e))}catch{try{({content:_,url:k}=await ot(g(".tsx"),e))}catch(p){throw e.emit("logger.error",p.toString()),L}}}await i.set(d.namespace+":"+d.path,_);let O=(await cr(k,_,d.namespace,e,n)).filter(L=>L.status=="rejected"?(e.emit("logger:warn",`Asset fetch failed.
`+L?.reason?.toString()),!1):!0).map(L=>{if(L.status=="fulfilled")return L.value});return t.assets=o.concat(O),{contents:_,loader:Zt(k),pluginData:{url:k,pkg:d.pluginData?.pkg}}})}}},Vt="alias-globals",tn=(e,t={})=>{if(!Ct(e))return!1;let n=Object.keys(t),r=e.replace(/^node\:/,""),i=jt(r);return n.find(o=>i.name===o)},vt=(e={},t=Ze,n)=>async r=>{let i=r.path.replace(/^node\:/,""),{path:o}=Me(i);if(tn(o,e)){let u=jt(o),d=e[u.name];return en(t,n)({...r,path:d})}},fr=(e,t,n)=>{let{origin:r}=/:/.test(n?.cdn)?Me(n?.cdn):Me(n?.cdn+":"),i=n.alias??{};return{name:Vt,setup(o){o.onResolve({filter:/^node\:.*/},u=>tn(u.path,i)?vt(i,r,e)(u):{path:u.path,namespace:it,external:!0}),o.onResolve({filter:/.*/},vt(i,r,e)),o.onResolve({filter:/.*/,namespace:Vt},vt(i,r,e))}}},_t="virtual-filesystem",dr=(e,t,n)=>{const r=n.filesystem;return{name:_t,setup(i){i.onResolve({filter:/.*/},o=>({path:o.path,pluginData:o.pluginData??{},namespace:_t})),i.onLoad({filter:/.*/,namespace:_t},async o=>{let u=await r.resolve(o.path,o?.pluginData?.importer);return{contents:await r.get(o.path,"buffer",o?.pluginData?.importer),pluginData:{importer:u},loader:Zt(u)}})}}},hr="Deno"in globalThis?"deno":"process"in globalThis?"node":"browser",Qe=new Map,nn=async(e,t)=>{let n=e;if(t&&e.startsWith(".")&&(n=Tt($t(t),e)),Qe.has(n))return n;throw`File "${n}" does not exist`},pr=async(e,t="buffer",n)=>{let r=await nn(e,n);if(Qe.has(r)){let i=Qe.get(r);return t=="string"?kt(i):i}},mr=async(e,t,n)=>{let r=e;n&&e.startsWith(".")&&(r=Tt($t(n),e));try{Qe.set(r,t instanceof Uint8Array?t:Pt(t))}catch{throw`Error occurred while writing to "${r}"`}},He=e=>typeof e=="object"&&e!=null,gr=e=>typeof e=="object"?e===null:typeof e!="function",wr=e=>e!=="__proto__"&&e!=="constructor"&&e!=="prototype",rn=(e,t)=>{if(e===t)return!0;if(He(e)&&He(t)){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(var n in e)if(!rn(e[n],t[n]))return!1;return!0}},yr=(e,t)=>{let n=Object.keys(t),r={},i=0;for(;i<n.length;i++){let o=n[i],u=t[o];if(o in e){let d=Array.isArray(e[o])&&Array.isArray(u);if(e[o]==u)continue;if(d)if(!rn(e[o],u))r[o]=u;else continue;else if(He(e[o])&&He(u)){let m=yr(e[o],u);Object.keys(m).length&&(r[o]=m)}else r[o]=u}else r[o]=u}return r};/*!
 * Based on assign-deep <https://github.com/jonschlinkert/assign-deep>
 *
 * Copyright (c) 2017-present, Jon Schlinkert.
 * Released under the MIT License.
 */const ft=(e,...t)=>{let n=0;for(gr(e)&&(e=t[n++]),e||(e={});n<t.length;n++)if(He(t[n]))for(const r of Object.keys(t[n]))wr(r)&&(He(e[r])&&He(t[n][r])?e[r]=ft(Array.isArray(e[r])?[]:{},e[r],t[n][r]):e[r]=t[n][r]);return e},sn={entryPoints:["/index.tsx"],cdn:Ze,compression:"gzip",analysis:!1,esbuild:{target:["esnext"],format:"esm",bundle:!0,minify:!0,treeShaking:!0,platform:"browser"}},br=ft({},sn,{esbuild:{color:!0,globalName:"BundledCode",logLevel:"info",sourcemap:!1,incremental:!1},ascii:"ascii",filesystem:{files:Qe,get:pr,set:mr,resolve:nn,clear:()=>Qe.clear()},init:{platform:hr}});var vr=class{constructor(e){this.map=new Map(e)}getMap(){return this.map}get(e){return this.map.get(e)}keys(){return Array.from(this.map.keys())}values(){return Array.from(this.map.values())}set(e,t){return this.map.set(e,t),this}add(e){let t=this.size;return this.set(t,e),this}get size(){return this.map.size}get length(){return this.map.size}last(e=1){let t=this.keys()[this.size-e];return this.get(t)}delete(e){return this.map.delete(e)}remove(e){return this.map.delete(e),this}clear(){return this.map.clear(),this}has(e){return this.map.has(e)}entries(){return this.map.entries()}forEach(e,t){return this.map.forEach(e,t),this}[Symbol.iterator](){return this.entries()}},Fs=(e,t,...n)=>{e.forEach(r=>{r[t](...n)})},xn=({callback:e=()=>{},scope:t=null,name:n="event"})=>({callback:e,scope:t,name:n}),yt=class extends vr{constructor(e="event"){super(),this.name=e}},zs=class extends vr{constructor(){super()}getEvent(e){let t=this.get(e);return t instanceof yt?t:(this.set(e,new yt(e)),this.get(e))}newListener(e,t,n){let r=this.getEvent(e);return r.add(xn({name:e,callback:t,scope:n})),r}on(e,t,n){if(typeof e>"u"||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let r,i,o=typeof e=="object"&&!Array.isArray(e),u=o?t:n;return o||(i=t),Object.keys(e).forEach(d=>{r=o?d:e[d],o&&(i=e[d]),this.newListener(r,i,u)},this),this}removeListener(e,t,n){let r=this.get(e);if(r instanceof yt&&t){let i=xn({name:e,callback:t,scope:n});r.forEach((o,u)=>{if(o.callback===i.callback&&o.scope===i.scope)return r.remove(u)})}return r}off(e,t,n){if(typeof e>"u"||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let r,i,o=typeof e=="object"&&!Array.isArray(e),u=o?t:n;return o||(i=t),Object.keys(e).forEach(d=>{r=o?d:e[d],o&&(i=e[d]),typeof i=="function"?this.removeListener(r,i,u):this.remove(r)},this),this}once(e,t,n){if(typeof e>"u"||e==null)return this;typeof e=="string"&&(e=e.trim().split(/\s/g));let r=typeof e=="object"&&!Array.isArray(e);return Object.keys(e).forEach(i=>{let o=r?i:e[i],u=r?e[i]:t,d=r?t:n,m=(...g)=>{u.apply(d,g),this.removeListener(o,m,d)};this.newListener(o,m,d)},this),this}emit(e,...t){return typeof e>"u"||e==null?this:(typeof e=="string"&&(e=e.trim().split(/\s/g)),e.forEach(n=>{let r=this.get(n);r instanceof yt&&r.forEach(i=>{let{callback:o,scope:u}=i;o.apply(u,t)})},this),this)}clear(){return Fs(this,"clear"),super.clear(),this}};const _r={"init.start":console.log,"init.complete":console.info,"init.error":console.error,"init.loading":console.warn,"logger.log":console.log,"logger.error":console.error,"logger.warn":console.warn,"logger.info":console.info},De=new zs;De.on(_r);const Ue={initialized:!1,assets:[],esbuild:null},Wt={37:"dim",31:"red",32:"green",34:"blue",36:"cyan",35:"magenta",33:"yellow","41;31":"red-bg-red","41;97":"red-bg-white","42;32":"green-bg-green","42;97":"green-bg-white","44;34":"blue-bg-blue","44;97":"blue-bg-white","46;36":"cyan-bg-cyan","46;30":"cyan-bg-black","45;35":"magenta-bg-magenta","45;30":"magenta-bg-black","43;33":"yellow-bg-yellow","43;30":"yellow-bg-black"};function Er(e){return e.replace(/\<br\>/g,`
`).replace(/\&/g,"&amp;").replace(/\"/g,"&quot;").replace(/\'/g,"&#39;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;")}class kr{constructor(){this.result="",this._stack=[],this._bold=!1,this._underline=!1,this._link=!1}text(t){this.result+=Er(t)}reset(){let t;for(;t=this._stack.pop();)this.result+=t}bold(){this._bold||(this._bold=!0,this.result+="<strong>",this._stack.push("</strong>"))}underline(){this._underline||(this._underline=!0,this.result+="<ins>",this._stack.push("</ins>"))}last(){return this._stack[this._stack.length-1]}color(t){let n;for(;(n=this.last())==="</span>";)this._stack.pop(),this.result+=n;this.result+=`<span class="color-${t}">`,this._stack.push("</span>")}done(){return this.reset(),this.result}}function ln(e){e=e.trimEnd();let t=0;const n=new kr;for(let r of e.matchAll(/\x1B\[([\d;]+)m/g)){const i=r[1];n.text(e.slice(t,r.index)),t=r.index+r[0].length,i==="0"?n.reset():i==="1"?n.bold():i==="4"?n.underline():Wt[i]&&n.color(Wt[i])}return t<e.length&&n.text(e.slice(t)),n.done()}const Sn=async(e,t="error",n=!0)=>(await ct.exports.formatMessages(e,{color:n,kind:t})).map(i=>n?ln(i.replace(/(\s+)(\d+)(\s+)\│/g,`
$1$2$3\u2502`)):i),An=gs,Bs={build:Sr,init:an};async function xr(e="node"){try{switch(e){case"node":return await Promise.resolve().then(function(){return En(require("esbuild"))});case"deno":return await function(t){return Promise.resolve().then(function(){return En(require(t))})}(`https://deno.land/x/esbuild@v${ct.exports.version}/mod.js`);default:return await Promise.resolve().then(function(){return fs})}}catch(t){throw t}}async function an({platform:e,...t}={}){try{if(!Ue.initialized){if(De.emit("init.start"),Ue.esbuild=await xr(e),e!=="node"&&e!=="deno"){const{default:n}=await Promise.resolve().then(function(){return require("./wasm.js")});await Ue.esbuild.initialize({wasmModule:new WebAssembly.Module(await n()),...t})}Ue.initialized=!0,De.emit("init.complete")}return Ue.esbuild}catch(n){De.emit("init.error",n),console.error(n)}}async function Sr(e={}){Ue.initialized||De.emit("init.loading");const t=ft({},br,e),{build:n}=await an(t.init),{define:r={},loader:i={},...o}=t.esbuild??{};let u=[],d=[],m;try{try{const p="p.env.NODE_ENV".replace("p.","process.");m=await n({entryPoints:t?.entryPoints??[],metafile:Boolean(t.analysis),loader:{".png":"file",".jpeg":"file",".ttf":"file",".svg":"text",".html":"text",".scss":"css"},define:{__NODE__:"false",[p]:'"production"',...r},write:!1,outdir:"/",plugins:[fr(De,Ue,t),Un(De,Ue,t),ur(De,Ue,t),or(De,Ue,t),dr(De,Ue,t)],...o})}catch(p){if(p.errors){const h=[...await Sn(p.errors,"error",!1)],$e=[...await Sn(p.errors,"error")];De.emit("logger.error",h,$e);const Ie=($e.length>1?`${$e.length} error(s) `:"")+"(if you are having trouble solving this issue, please create a new issue in the repo, https://github.com/okikio/bundle)";return De.emit("logger.error",Ie)}else throw p}u=await Promise.all([...Ue.assets].concat(m?.outputFiles)),d=await Promise.all(u?.map(({path:p,text:h,contents:$e})=>/\.map$/.test(p)?Pt(""):(o?.logLevel=="verbose"&&(/\.(wasm|png|jpeg|webp)$/.test(p)?De.emit("logger.log","Output File: "+p):De.emit("logger.log","Output File: "+p+`
`+h)),$e)));let{compression:g={}}=t,{type:_="gzip",quality:k=9}=typeof g=="string"?{type:g}:g??{},O=An(d.reduce((p,{byteLength:h})=>p+h,0)),L=await(async()=>{switch(_){case"lz4":const{compress:p}=await Promise.resolve().then(function(){return Dr});return async M=>await p(M);case"brotli":const{compress:h}=await Promise.resolve().then(function(){return Cr});return async M=>await h(M,M.length,k);default:const{gzip:$e,getWASM:Ie}=await Promise.resolve().then(function(){return jr});return await Ie(),async M=>await $e(M,k)}})(),y=An((await Promise.all(d.map(L))).reduce((p,{length:h})=>p+h,0));return{result:m,outputFiles:m.outputFiles,initialSize:`${O}`}}catch{}}const Vs=(e,t=300,n)=>{let r;return function(...i){let o=this,u=()=>{r=null,n||e.apply(o,i)},d=n&&!r;clearTimeout(r),r=setTimeout(u,t),d&&e.apply(o,i)}};var Ar="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",Pr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",bt={};function $r(e,t){if(!bt[e]){bt[e]={};for(let n=0;n<e.length;n++)bt[e][e.charAt(n)]=n}return bt[e][t]}function Ws(e){if(e==null)return"";let t=on(e,6,n=>Ar.charAt(n));switch(t.length%4){default:case 0:return t;case 1:return t+"===";case 2:return t+"==";case 3:return t+"="}}function qs(e){return e==null?"":e==""?null:cn(e.length,32,t=>$r(Ar,e.charAt(t)))}function Gs(e){return e==null?"":on(e,6,t=>Pr.charAt(t))}function Or(e){return e==null?"":e==""?null:(e=e.replaceAll(" ","+"),cn(e.length,32,t=>$r(Pr,e.charAt(t))))}function Js(e){return on(e,16,String.fromCharCode)}function Hs(e){return e==null?"":e==""?null:cn(e.length,32768,t=>e.charCodeAt(t))}function on(e,t,n){if(e==null)return"";let r=[],i={},o={},u,d,m,g="",_="",k="",O=2,L=3,y=2,p=0,h=0;for(d=0;d<e.length;d+=1)if(g=e.charAt(d),Object.prototype.hasOwnProperty.call(i,g)||(i[g]=L++,o[g]=!0),k=_+g,Object.prototype.hasOwnProperty.call(i,k))_=k;else{if(Object.prototype.hasOwnProperty.call(o,_)){if(_.charCodeAt(0)<256){for(u=0;u<y;u++)p=p<<1,h==t-1?(h=0,r.push(n(p)),p=0):h++;for(m=_.charCodeAt(0),u=0;u<8;u++)p=p<<1|m&1,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=m>>1}else{for(m=1,u=0;u<y;u++)p=p<<1|m,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=0;for(m=_.charCodeAt(0),u=0;u<16;u++)p=p<<1|m&1,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=m>>1}O--,O==0&&(O=Math.pow(2,y),y++),delete o[_]}else for(m=i[_],u=0;u<y;u++)p=p<<1|m&1,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=m>>1;O--,O==0&&(O=Math.pow(2,y),y++),i[k]=L++,_=String(g)}if(_!==""){if(Object.prototype.hasOwnProperty.call(o,_)){if(_.charCodeAt(0)<256){for(u=0;u<y;u++)p=p<<1,h==t-1?(h=0,r.push(n(p)),p=0):h++;for(m=_.charCodeAt(0),u=0;u<8;u++)p=p<<1|m&1,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=m>>1}else{for(m=1,u=0;u<y;u++)p=p<<1|m,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=0;for(m=_.charCodeAt(0),u=0;u<16;u++)p=p<<1|m&1,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=m>>1}O--,O==0&&(O=Math.pow(2,y),y++),delete o[_]}else for(m=i[_],u=0;u<y;u++)p=p<<1|m&1,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=m>>1;O--,O==0&&(O=Math.pow(2,y),y++)}for(m=2,u=0;u<y;u++)p=p<<1|m&1,h==t-1?(h=0,r.push(n(p)),p=0):h++,m=m>>1;for(;;)if(p=p<<1,h==t-1){r.push(n(p));break}else h++;return r.join("")}function cn(e,t,n){let r=[],i=4,o=4,u=3,d="",m=[],g,_,k,O,L,y,p,h={val:n(0),position:t,index:1};for(g=0;g<3;g+=1)r[g]=g;for(k=0,L=Math.pow(2,2),y=1;y!=L;)O=h.val&h.position,h.position>>=1,h.position==0&&(h.position=t,h.val=n(h.index++)),k|=(O>0?1:0)*y,y<<=1;switch(k){case 0:for(k=0,L=Math.pow(2,8),y=1;y!=L;)O=h.val&h.position,h.position>>=1,h.position==0&&(h.position=t,h.val=n(h.index++)),k|=(O>0?1:0)*y,y<<=1;p=String.fromCharCode(k);break;case 1:for(k=0,L=Math.pow(2,16),y=1;y!=L;)O=h.val&h.position,h.position>>=1,h.position==0&&(h.position=t,h.val=n(h.index++)),k|=(O>0?1:0)*y,y<<=1;p=String.fromCharCode(k);break;case 2:return""}for(r[3]=p,_=p,m.push(p);;){if(h.index>e)return"";for(k=0,L=Math.pow(2,u),y=1;y!=L;)O=h.val&h.position,h.position>>=1,h.position==0&&(h.position=t,h.val=n(h.index++)),k|=(O>0?1:0)*y,y<<=1;switch(p=k){case 0:for(k=0,L=Math.pow(2,8),y=1;y!=L;)O=h.val&h.position,h.position>>=1,h.position==0&&(h.position=t,h.val=n(h.index++)),k|=(O>0?1:0)*y,y<<=1;r[o++]=String.fromCharCode(k),p=o-1,i--;break;case 1:for(k=0,L=Math.pow(2,16),y=1;y!=L;)O=h.val&h.position,h.position>>=1,h.position==0&&(h.position=t,h.val=n(h.index++)),k|=(O>0?1:0)*y,y<<=1;r[o++]=String.fromCharCode(k),p=o-1,i--;break;case 2:return m.join("")}if(i==0&&(i=Math.pow(2,u),u++),r[p])d=r[p];else if(p===o&&typeof _=="string")d=_+_.charAt(0);else return null;m.push(d),r[o++]=_+d.charAt(0),i--,_=d,i==0&&(i=Math.pow(2,u),u++)}}const Tr=e=>(e??"").split(/\],/).map(t=>t.replace(/\[|\]/g,"")),Ys=e=>{try{const t=e.searchParams;let n="",r=t.get("query")||t.get("q"),i=t.get("treeshake");if(r){let d=r.trim().split(","),m=Tr((i??"").trim());n+=`// Click Build for the Bundled, Minified & Compressed package size
`+d.map((g,_)=>{let k=m[_]&&m[_].trim()!=="*"?m[_].trim().split(",").join(", "):"*",[,,O="export",L]=/^(\((.*)\))?(.*)/.exec(g);return`${O} ${k} from ${JSON.stringify(L)};`}).join(`
`)}let o=t.get("share");o&&(n+=`
`+Or(o.trim()));let u=t.get("text");return u&&(n+=`
`+JSON.parse(/^["']/.test(u)&&/["']$/.test(u)?u:JSON.stringify(""+u).replace(/\\\\/g,"\\"))),n.trim()}catch{}},Xs=e=>{try{const n=e.searchParams.get("config")??"{}";return ft({},sn,JSON.parse(n||"{}"))}catch{}},un=e=>{const t="https://registry.npmjs.com";let{name:n,version:r,path:i}=jt(e),o=`${t}/-/v1/search?text=${encodeURIComponent(n)}&popularity=0.5&size=30`,u=`${t}/${n}/${r}`;return{searchURL:o,packageURL:u,version:r,name:n,path:i}},Ks=async e=>{let{searchURL:t}=un(e),n;try{n=await(await ut(t,!1)).json()}catch(i){throw console.warn(i),i}return{packages:n?.objects,info:n}},Qs=async e=>{let{packageURL:t}=un(e),n;try{n=await(await ut(t,!1)).json()}catch(r){throw console.warn(r),r}return n};let It;const fn=async()=>{if(It)return It;const e=await Promise.resolve().then(function(){return require("./wasm2.js")}),{default:t,source:n}=e;return await t(await n()),It=e};async function Zs(e,t=4096,n=6,r=22){const{compress:i}=await fn();return i(e,t,n,r)}async function ei(e,t=4096){const{decompress:n}=await fn();return n(e,t)}var Cr=Object.freeze(Object.defineProperty({__proto__:null,getWASM:fn,compress:Zs,decompress:ei},Symbol.toStringTag,{value:"Module"}));let dn,Et;const et=async e=>{if(Et)return Et;const t=await Promise.resolve().then(function(){return require("./denoflate.js")}),{default:n}=t,{wasm:r}=await Promise.resolve().then(function(){return require("./denoflate_bg.wasm.js")});return dn=await n(e??await r()),Et=t};async function ti(e,t){return(await et()).deflate(e,t)}async function ni(e){return(await et()).inflate(e)}async function ri(e,t){return(await et()).gzip(e,t)}async function si(e){return(await et()).gunzip(e)}async function ii(e,t){return(await et()).zlib(e,t)}async function li(e){return(await et()).unzlib(e)}var ai=dn,jr=Object.freeze(Object.defineProperty({__proto__:null,get wasm(){return dn},get initWASM(){return Et},getWASM:et,deflate:ti,inflate:ni,gzip:ri,gunzip:si,zlib:ii,unzlib:li,default:ai},Symbol.toStringTag,{value:"Module"}));let Lt;const Rr=async()=>{if(Lt)return Lt;const e=await Promise.resolve().then(function(){return require("./wasm3.js")}),{default:t,source:n}=e;return await t(await n()),Lt=e};async function oi(e){const{lz4_compress:t}=await Rr();return t(e)}async function ci(e){const{lz4_decompress:t}=await Rr();return t(e)}var Dr=Object.freeze(Object.defineProperty({__proto__:null,compress:oi,decompress:ci},Symbol.toStringTag,{value:"Module"}));function ui(e){if(typeof e=="string")return btoa(e);{const t=new Uint8Array(e);let n="";for(let r=0;r<t.length;++r)n+=String.fromCharCode(t[r]);return btoa(n)}}function fi(e){const t=Nr(e),n=new Uint8Array(t.length);for(let r=0;r<n.length;++r)n[r]=t.charCodeAt(r);return n.buffer}function Nr(e){return atob(e)}var di=Object.freeze(Object.defineProperty({__proto__:null,encode:ui,decode:fi,decodeString:Nr},Symbol.toStringTag,{value:"Module"}));exports.ALIAS=fr;exports.ALIAS_NAMESPACE=Vt;exports.ALIAS_RESOLVE=vt;exports.AnsiBuffer=kr;exports.CACHE=Gt;exports.CACHE_NAME=In;exports.CDN=or;exports.CDN_NAMESPACE=Bt;exports.CDN_RESOLVE=St;exports.DEFAULT_CDN_HOST=Ze;exports.DefaultConfig=br;exports.DeprecatedAPIs=Dn;exports.EMPTY_EXPORT=Cn;exports.ESCAPE_TO_COLOR=Wt;exports.EVENTS=De;exports.EVENTS_OPTS=_r;exports.EXTERNAL=Un;exports.EXTERNALS_NAMESPACE=it;exports.EasyDefaultConfig=sn;exports.ExternalPackages=Nn;exports.FileSystem=Qe;exports.HTTP=ur;exports.HTTP_NAMESPACE=ze;exports.HTTP_RESOLVE=en;exports.INPUT_EVENTS=Bs;exports.PLATFORM_AUTO=hr;exports.PolyfillKeys=Rn;exports.PolyfillMap=jn;exports.RESOLVE_EXTENSIONS=sr;exports.SEP=Jt;exports.SEP_PATTERN=Ht;exports.STATE=Ue;exports.VIRTUAL_FILESYSTEM_NAMESPACE=_t;exports.VIRTUAL_FS=dr;exports.ansi=ln;exports.bail=Je;exports.base64=di;exports.basename=Hn;exports.brotli=Cr;exports.build=Sr;exports.compress=Js;exports.compressToBase64=Ws;exports.compressToURL=Gs;exports.debounce=Vs;exports.decode=kt;exports.decompress=Hs;exports.decompressFromBase64=qs;exports.decompressFromURL=Or;exports.deepAssign=ft;exports.deepDiff=yr;exports.deepEqual=rn;exports.delimiter=Yn;exports.denoflate=jr;exports.dirname=$t;exports.encode=Pt;exports.extname=Ot;exports.fetchAssets=cr;exports.fetchPkg=ot;exports.format=Xn;exports.fromFileUrl=Kn;exports.getCDNOrigin=On;exports.getCDNStyle=qt;exports.getCDNUrl=Me;exports.getESBUILD=xr;exports.getFile=pr;exports.getPackage=Qs;exports.getPackages=Ks;exports.getPureImportPath=Tn;exports.getRegistryURL=un;exports.getRequest=ut;exports.getResolvedPath=nn;exports.globToRegExp=Wn;exports.htmlEscape=Er;exports.inferLoader=Zt;exports.init=an;exports.isAbsolute=Kt;exports.isAlias=tn;exports.isBareImport=Ct;exports.isExternal=Mn;exports.isGlob=qn;exports.isObject=He;exports.isPrimitive=gr;exports.isValidKey=wr;exports.join=Qt;exports.joinGlobs=Gn;exports.loop=Ke;exports.lz4=Dr;exports.newRequest=Ft;exports.normalize=Qn;exports.normalizeGlob=Xt;exports.parse=Zn;exports.parseConfig=Xs;exports.parseShareQuery=Ys;exports.parseTreeshakeExports=Tr;exports.path=Ns;exports.posix=Jn;exports.relative=er;exports.render=ln;exports.resolve=Tt;exports.resolveImports=ar;exports.sep=tr;exports.setFile=mr;exports.toFileUrl=nr;exports.toName=lr;exports.toNamespacedPath=rr;exports.urlJoin=xt;
//# sourceMappingURL=index.cjs.map
