(function(o,x){typeof exports=="object"&&typeof module<"u"?x(exports):typeof define=="function"&&define.amd?define(["exports"],x):(o=typeof globalThis<"u"?globalThis:o||self,x(o.analysis={}))})(this,function(o){"use strict";const YA=((A,B=21)=>(Q=B)=>{let E="",C=Q;for(;C--;)E+=A[Math.random()*A.length|0];return E})("1234567890abcdef",4)();let kA=0;const T=()=>`${YA}-${kA++}`;class cA{constructor(B){this.projectRoot=B,this.nodeParts={},this.nodeMetas={}}trimProjectRootId(B){return B.replace(this.projectRoot,"")}getModuleUid(B){return B in this.nodeMetas||(this.nodeMetas[B]={uid:T(),meta:{id:this.trimProjectRootId(B),moduleParts:{},imported:new Set,importedBy:new Set}}),this.nodeMetas[B].uid}getBundleModuleUid(B,Q){return Q in this.nodeMetas||(this.nodeMetas[Q]={uid:T(),meta:{id:this.trimProjectRootId(Q),moduleParts:{},imported:new Set,importedBy:new Set}}),B in this.nodeMetas[Q].meta.moduleParts||(this.nodeMetas[Q].meta.moduleParts[B]=T()),this.nodeMetas[Q].meta.moduleParts[B]}setNodePart(B,Q,E){const C=this.getBundleModuleUid(B,Q);if(C in this.nodeParts)throw new Error(`Override module: bundle id ${B}, module id ${Q}, value ${JSON.stringify(E)}, existing value: ${JSON.stringify(this.nodeParts[C])}`);return this.nodeParts[C]={...E,mainUid:this.getModuleUid(Q)},C}setNodeMeta(B,Q){this.getModuleUid(B),this.nodeMetas[B].meta.isEntry=Q.isEntry,this.nodeMetas[B].meta.isExternal=Q.isExternal}hasNodePart(B,Q){return!(!(Q in this.nodeMetas)||!(B in this.nodeMetas[Q].meta.moduleParts)||!(this.nodeMetas[Q].meta.moduleParts[B]in this.nodeParts))}getNodeParts(){return this.nodeParts}getNodeMetas(){const B={};for(const{uid:Q,meta:E}of Object.values(this.nodeMetas))B[Q]={...E,imported:[...E.imported].map(C=>{const[g,I]=C.split(","),G={uid:g};return I==="true"&&(G.dynamic=!0),G}),importedBy:[...E.importedBy].map(C=>{const[g,I]=C.split(","),G={uid:g};return I==="true"&&(G.dynamic=!0),G})};return B}addImportedByLink(B,Q){const E=this.getModuleUid(Q);this.getModuleUid(B),this.nodeMetas[B].meta.importedBy.add(E)}addImportedLink(B,Q,E=!1){const C=this.getModuleUid(Q);this.getModuleUid(B),this.nodeMetas[B].meta.imported.add(String([C,E]))}}const S=A=>"children"in A,$=(A,B,Q,E)=>{if(Q.length===0)throw new Error(`Error adding node to path ${A}`);const[C,...g]=Q;if(g.length===0){B.children.push({...E,name:C});return}else{let I=B.children.find(G=>G.name===C&&S(G));I||(I={name:C,children:[]},B.children.push(I)),$(A,I,g,E);return}},y=A=>{if(A.children.length===1){const B=A.children[0],Q=`${A.name}/${B.name}`;return S(B)?(A.name=Q,A.children=B.children,y(A)):{name:Q,uid:B.uid}}else return A.children=A.children.map(B=>S(B)?y(B):B),A},MA=(A,B,Q)=>{const E={name:A,children:[]};for(const{id:C,renderedLength:g,gzipLength:I,brotliLength:G}of B){const L=Q.setNodePart(A,C,{renderedLength:g,gzipLength:I,brotliLength:G}),p=Q.trimProjectRootId(C),r=p.split(/\\|\//).filter(n=>n!=="");$(p,E,r,{uid:L})}return E.children=E.children.map(C=>S(C)?y(C):C),E},RA=A=>({name:"root",children:A,isRoot:!0}),hA=(A,B,Q)=>{const E={},C=[A];for(;C.length>0;){const g=C.shift();if(E[g])continue;E[g]=!0;const I=B(g);if(!I)return;I.isEntry&&Q.setNodeMeta(g,{isEntry:!0}),I.isExternal&&Q.setNodeMeta(g,{isExternal:!0});for(const G of I.importedIds)Q.addImportedByLink(G,g),Q.addImportedLink(g,G),C.push(G);for(const G of I.dynamicallyImportedIds)Q.addImportedByLink(G,g),Q.addImportedLink(g,G,!0),C.push(G)}},oA=A=>A.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");async function JA({title:A,data:B,template:Q}){return`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>${oA(A)}</title>
        <link rel='stylesheet' href='/js/${Q}.min.css' />
      </head>
      <body>
        <main></main>
        <script type="module" defer>
          import * as drawChart from "/js/${Q}.min.js";
          const data = ${JSON.stringify(B)};
          
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