"use strict";var t=require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var n=t(require("@babel/runtime/helpers/classCallCheck")),e=t(require("@babel/runtime/helpers/createClass")),i=require("lodash"),r=require("../utl/path"),h=require("../utl/read"),s=function(){function s(t,e){(0,n.default)(this,s);var i=this.project=t.project;this.root=i.withSrc(t.folder);var r=this.config=(0,h.readJsonSync)("page.js",this.root);this.path=r.path||t.folder,this.fullPath=t.project.joinPath(this.path),this.id=i.id+"_"+this.path,this.name=r.name||this.path,this.entry=r.entry||e.entry||"index.tsx",this.entry=this.withRoot(this.entry),r.container?this.container=this.withRoot(r.container):e.container&&(this.container=this.project.withRoot(e.container)),this.title=r.title||e.title,this.title||(this.title=this.name+" "+i.name),this.metas=this.uniqNodeAttrs(r.metas,e.metas),this.links=this.uniqNodeAttrs(r.links,e.links),this.scripts=this.uniqNodeAttrs(r.scripts,e.scripts),this.styles=this.uniqNodeAttrs(r.styles,e.styles)}return(0,e.default)(s,[{key:"withRoot",value:function(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return r.withPath.apply(void 0,[this.root].concat(e))}},{key:"compareWithId",value:function(t,e){return void 0!==t.id&&t.id===e.id}},{key:"uniqNodeAttrs",value:function(t,e){return t&&e?(0,i.uniqWith)(t.concat(e),this.compareWithId):t||e||[]}},{key:"nodesToHTML",value:function(t,e){for(var i=["script"].includes(t),r=[],s=0;s<e.length;s++){for(var n,h,o,a=e[s],u=[],l=void 0,c=Object.keys(a),p=0;p<c.length;p++)"key"!==(n=c[p])&&(h=a[n],"children"!==n?!0===h?u.push(n):u.push(n+'="'+h+'"'):l=h);u.length<=0||(o="<"+t+" "+u.join(" "),l?r.push(o+">"+l+"</"+t+">"):i?r.push(o+"></"+t+">"):r.push(o+"/>"))}return r.join("\n")}}]),s}();exports.default=s;