"use strict";var e=require("@babel/runtime/helpers/interopRequireDefault"),o=require("@babel/runtime/helpers/typeof");Object.defineProperty(exports,"__esModule",{value:!0}),exports.createWebpack=n;var u=e(require("@babel/runtime/regenerator")),a=e(require("@babel/runtime/helpers/toConsumableArray")),r=e(require("@babel/runtime/helpers/asyncToGenerator")),l=require("lodash"),i=e(require("@pmmmwh/react-refresh-webpack-plugin")),s=t(require("webpack")),p=require("../../../utl/path"),c=require("../common/page"),f=require("../common/module");function m(e){if("function"!=typeof WeakMap)return null;var r=new WeakMap,t=new WeakMap;return(m=function(e){return e?t:r})(e)}function t(e,r){if(!r&&e&&e.__esModule)return e;if(null===e||"object"!==o(e)&&"function"!=typeof e)return{default:e};r=m(r);if(r&&r.has(e))return r.get(e);var t,n,u={},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(t in e)"default"!==t&&Object.prototype.hasOwnProperty.call(e,t)&&((n=a?Object.getOwnPropertyDescriptor(e,t):null)&&(n.get||n.set)?Object.defineProperty(u,t,n):u[t]=e[t]);return u.default=e,r&&r.set(e,u),u}function n(e){return d.apply(this,arguments)}function d(){return(d=(0,r.default)(u.default.mark(function e(r){var t,n;return u.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.getPages)(r,!0);case 2:return t=e.sent,n=(0,l.omit)(r.module.externals,["react","react-dom"]),e.abrupt("return",(0,s.default)({mode:"development",devtool:"eval-cheap-module-source-map",context:r.root,entry:t.entry,output:{path:r.webDist,pathinfo:!0,publicPath:r.path,hashDigestLength:8,filename:"js/[name].js",chunkFilename:"js/[id].js"},module:{rules:(0,f.getRules)(r,!0)},externals:n,resolve:{extensions:[".tsx",".ts",".jsx",".js",".json"],alias:(0,l.mapValues)(r.alias,function(e){return r.withRoot(e)})},resolveLoader:{modules:[r.mdl,(0,p.cmdNmPath)()]},plugins:[new s.HotModuleReplacementPlugin,new i.default({overlay:{sockIntegration:"whm"}}),new s.NoEmitOnErrorsPlugin].concat((0,a.default)(t.plugins))}));case 5:case"end":return e.stop()}},e)}))).apply(this,arguments)}