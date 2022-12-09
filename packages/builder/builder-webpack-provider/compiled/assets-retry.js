"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.retry=void 0;var TAG_TYPE={link:HTMLLinkElement,script:HTMLScriptElement,img:HTMLImageElement},TYPES=Object.keys(TAG_TYPE);function findCurrentDomain(e,t){for(var n="",r=0;r<t.length;r++)if(-1!==e.indexOf(t[r])){n=t[r];break}return n||e}function findNextDomain(e,t){var n=findCurrentDomain(e,t),r=t.indexOf(n);return t[(r+1)%t.length]||e}function getRequestUrl(e){return e instanceof HTMLScriptElement||e instanceof HTMLImageElement?e.src:e instanceof HTMLLinkElement?e.href:null}var defaultConfig={max:3,type:TYPES,domain:[],crossOrigin:!1};function validateTargetInfo(e,t){var n,r=t.target,i=null===(n=r.tagName)||void 0===n?void 0:n.toLocaleLowerCase(),a=e.type,o=getRequestUrl(r);return!!(i&&-1!==a.indexOf(i)&&TAG_TYPE[i]&&r instanceof TAG_TYPE[i]&&o)&&{target:r,tagName:i,url:o}}function createElement(e,t){if(e instanceof HTMLScriptElement){var n=document.createElement("script");return n.src=t.url,t.crossOrigin&&(n.crossOrigin="anonymous"),t.times&&(n.dataset.builderRetryTimes=String(t.times)),t.isAsync&&(n.dataset.builderAsync=""),{element:n,str:'<script src="'.concat(t.url,'" type="text/javascript" ').concat(t.crossOrigin?'crossorigin="anonymous"':""," ").concat(t.times?'data-builder-retry-times="'.concat(t.times,'"'):""," ").concat(t.isAsync?"data-builder-async":"","><\/script>")}}if(e instanceof HTMLLinkElement){var r=document.createElement("link");return r.rel="stylesheet",r.type="text/css",r.href=t.url,t.times&&(r.dataset.builderRetryTimes=String(t.times)),{element:r,str:'<link rel="stylesheet" href="'.concat(t.url,'" type="text/css" ').concat(t.times?'data-builder-retry-times="'.concat(t.times,'"'):"","></link>")}}}function reloadElementResource(e,t,n){e instanceof HTMLScriptElement&&(n.isAsync?document.body.appendChild(t.element):document.write(t.str)),e instanceof HTMLLinkElement&&document.getElementsByTagName("head")[0].appendChild(t.element),e instanceof HTMLImageElement&&(e.src=n.url,e.dataset.builderRetryTimes=String(n.times))}function retry(e,t){var n=validateTargetInfo(e,t);if(!1!==n){var r=n.target,i=n.tagName,a=n.url,o=e.test;if(o){if("string"==typeof o){var s=new RegExp(o);o=function(e){return s.test(e)}}if("function"!=typeof o||!o(a))return}var c=findCurrentDomain(a,e.domain);if(!(e.domain&&e.domain.length>0&&-1===e.domain.indexOf(c))){var m=Number(r.dataset.builderRetryTimes)||0;if(m!==e.max){var l=findNextDomain(c,e.domain),d=Boolean(r.dataset.builderAsync)||r.async||r.defer,u={url:a.replace(c,l),times:m+1,crossOrigin:e.crossOrigin&&r.crossOrigin,isAsync:d},f=createElement(r,u);if(e.onRetry&&"function"==typeof e.onRetry){var y={times:m,domain:c,url:a,tagName:i};e.onRetry(y)}reloadElementResource(r,f,u)}else if("function"==typeof e.onFail){var g={times:m,domain:c,url:a,tagName:i};e.onFail(g)}}}}function load(e,t){var n=validateTargetInfo(e,t);if(!1!==n){var r=n.target,i=n.tagName,a=n.url,o=findCurrentDomain(a,e.domain),s=Number(r.dataset.builderRetryTimes)||0;if(0!==s&&"function"==typeof e.onSuccess){var c={times:s,domain:o,url:a,tagName:i};e.onSuccess(c)}}}function resourceMonitor(e,t){"undefined"!=typeof window&&void 0!==window.document&&(document.addEventListener("error",(function(t){t&&t.target instanceof Element&&e(t)}),!0),document.addEventListener("load",(function(e){e&&e.target instanceof Element&&t(e)}),!0))}function init(e){var t=Object.assign({},defaultConfig,e);Array.isArray(t.type)&&0!==t.type.length||(t.type=defaultConfig.type),Array.isArray(t.domain)&&0!==t.domain.length||(t.domain=defaultConfig.domain),Array.isArray(t.domain)&&(t.domain=t.domain.filter(Boolean));try{resourceMonitor((function(e){try{retry(t,e)}catch(e){console.error("retry error captured",e)}}),(function(e){try{load(t,e)}catch(e){console.error("load error captured",e)}}))}catch(e){console.error("monitor error captured",e)}}exports.retry=retry;