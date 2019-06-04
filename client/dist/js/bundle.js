!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s="./client/src/bundles/bundle.js")}({"./client/src/boot/index.js":function(e,t,n){"use strict";var o=n("./client/src/boot/registerTransformations.js"),r=function(e){return e&&e.__esModule?e:{default:e}}(o);window.document.addEventListener("DOMContentLoaded",function(){(0,r.default)()})},"./client/src/boot/registerTransformations.js":function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(0),u=o(r),i=n("./client/src/containers/SudoMode/SudoMode.js"),c=o(i);t.default=function(){u.default.transform("apply-sudo-mode-to-mfa",function(e){e.component("RegisteredMFAMethodListField",c.default)})}},"./client/src/bundles/bundle.js":function(e,t,n){"use strict";n("./client/src/boot/index.js")},"./client/src/containers/SudoMode/SudoMode.js":function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0});var c=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=n(2),d=o(a),f=n(1),l=o(f),p=function(e){var t=function(t){function n(e){r(this,n);var t=u(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return t.state={active:e.sudoModeActive||!1,showNotice:!0},t}return i(n,t),s(n,[{key:"isSudoModeActive",value:function(){return!0===this.state.active}},{key:"renderSudoModeNotice",value:function(){return d.default.createElement("p",null,"Sudo mode notice")}},{key:"renderSudoModeVerification",value:function(){return d.default.createElement("p",null,"Sudo mode verification")}},{key:"renderSudoMode",value:function(){return this.state.showNotice?this.renderSudoModeNotice():this.renderSudoModeVerification()}},{key:"render",value:function(){var t=c({},this.props);return this.isSudoModeActive()?d.default.createElement(e,t):this.renderSudoMode()}}]),n}(a.Component);return t.propTypes={sudoModeActive:l.default.bool},t.defaultProps={sudoModeActive:!1},t};t.default=p},0:function(e,t){e.exports=Injector},1:function(e,t){e.exports=PropTypes},2:function(e,t){e.exports=React}});