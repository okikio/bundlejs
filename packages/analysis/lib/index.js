(function(s,m){typeof exports=="object"&&typeof module<"u"?m(exports):typeof define=="function"&&define.amd?define(["exports"],m):(s=typeof globalThis<"u"?globalThis:s||self,m(s.analysis={}))})(this,function(s){"use strict";const l1=((n,e=21)=>(f=e)=>{let t="",z=f;for(;z--;)t+=n[Math.random()*n.length|0];return t})("1234567890abcdef",4)();let P1=0;const k=()=>`${l1}-${P1++}`;class r1{constructor(e){this.projectRoot=e,this.nodeParts={},this.nodeMetas={}}trimProjectRootId(e){return e.replace(this.projectRoot,"")}getModuleUid(e){return e in this.nodeMetas||(this.nodeMetas[e]={uid:k(),meta:{id:this.trimProjectRootId(e),moduleParts:{},imported:new Set,importedBy:new Set}}),this.nodeMetas[e].uid}getBundleModuleUid(e,f){return f in this.nodeMetas||(this.nodeMetas[f]={uid:k(),meta:{id:this.trimProjectRootId(f),moduleParts:{},imported:new Set,importedBy:new Set}}),e in this.nodeMetas[f].meta.moduleParts||(this.nodeMetas[f].meta.moduleParts[e]=k()),this.nodeMetas[f].meta.moduleParts[e]}setNodePart(e,f,t){const z=this.getBundleModuleUid(e,f);if(z in this.nodeParts)throw new Error(`Override module: bundle id ${e}, module id ${f}, value ${JSON.stringify(t)}, existing value: ${JSON.stringify(this.nodeParts[z])}`);return this.nodeParts[z]={...t,mainUid:this.getModuleUid(f)},z}setNodeMeta(e,f){this.getModuleUid(e),this.nodeMetas[e].meta.isEntry=f.isEntry,this.nodeMetas[e].meta.isExternal=f.isExternal}hasNodePart(e,f){return!(!(f in this.nodeMetas)||!(e in this.nodeMetas[f].meta.moduleParts)||!(this.nodeMetas[f].meta.moduleParts[e]in this.nodeParts))}getNodeParts(){return this.nodeParts}getNodeMetas(){const e={};for(const{uid:f,meta:t}of Object.values(this.nodeMetas))e[f]={...t,imported:[...t.imported].map(z=>{const[l,P]=z.split(","),r={uid:l};return P==="true"&&(r.dynamic=!0),r}),importedBy:[...t.importedBy].map(z=>{const[l,P]=z.split(","),r={uid:l};return P==="true"&&(r.dynamic=!0),r})};return e}addImportedByLink(e,f){const t=this.getModuleUid(f);this.getModuleUid(e),this.nodeMetas[e].meta.importedBy.add(t)}addImportedLink(e,f,t=!1){const z=this.getModuleUid(f);this.getModuleUid(e),this.nodeMetas[e].meta.imported.add(String([z,t]))}}const p=n=>"children"in n,g=(n,e,f,t)=>{if(f.length===0)throw new Error(`Error adding node to path ${n}`);const[z,...l]=f;if(l.length===0){e.children.push({...t,name:z});return}else{let P=e.children.find(r=>r.name===z&&p(r));P||(P={name:z,children:[]},e.children.push(P)),g(n,P,l,t);return}},R=n=>{if(n.children.length===1){const e=n.children[0],f=`${n.name}/${e.name}`;return p(e)?(n.name=f,n.children=e.children,R(n)):{name:f,uid:e.uid}}else return n.children=n.children.map(e=>p(e)?R(e):e),n},c1=(n,e,f)=>{const t={name:n,children:[]};for(const{id:z,renderedLength:l,gzipLength:P,brotliLength:r}of e){const u=f.setNodePart(n,z,{renderedLength:l,gzipLength:P,brotliLength:r}),Y=f.trimProjectRootId(z),I=Y.split(/\\|\//).filter(D=>D!=="");g(Y,t,I,{uid:u})}return t.children=t.children.map(z=>p(z)?R(z):z),t},v1=n=>({name:"root",children:n,isRoot:!0}),j1=(n,e,f)=>{const t={},z=[n];for(;z.length>0;){const l=z.shift();if(t[l])continue;t[l]=!0;const P=e(l);if(!P)return;P.isEntry&&f.setNodeMeta(l,{isEntry:!0}),P.isExternal&&f.setNodeMeta(l,{isExternal:!0});for(const r of P.importedIds)f.addImportedByLink(r,l),f.addImportedLink(l,r),z.push(r);for(const r of P.dynamicallyImportedIds)f.addImportedByLink(r,l),f.addImportedLink(l,r,!0),z.push(r)}},x1=n=>n.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");async function G1({title:n,data:e,template:f}){return`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${x1(n)}</title>
        <link rel='stylesheet' href='/js/${f}.min.css' />
      </head>
      <body>
        <main></main>
        <script type="module" defer>
          import * as drawChart from "/js/${f}.min.js";
          const data = ${JSON.stringify(e)};
          
          const run = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const chartNode = document.querySelector("main");
            drawChart.default(chartNode, data, width, height);
          };
      
          window.addEventListener('resize', run);
      
          document.addEventListener('DOMContentLoaded', run);
        <\/script>
      </body>
    </html>
//# sourceMappingURL=index.js.map