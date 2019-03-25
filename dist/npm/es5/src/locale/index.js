'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _format = require('./format');

var _format2 = _interopRequireDefault(_format);

var _en = require('./lang/en');

var _en2 = _interopRequireDefault(_en);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
  var enterModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).enterModule;
  enterModule && enterModule(module);
})();

var _lang = _en2.default;

function use(lang) {
  _lang = lang;
}

function t(path, options) {
  var array = path.split('.');
  var current = _lang;

  for (var i = 0, j = array.length; i < j; i++) {
    var property = array[i];
    var value = current[property];
    if (i === j - 1) return (0, _format2.default)(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
}

var _default = {
  use: use,
  t: t
};
exports.default = _default;
;

(function () {
  var reactHotLoader = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).default;

  if (!reactHotLoader) {
    return;
  }

  reactHotLoader.register(_lang, '_lang', 'src/locale/index.js');
  reactHotLoader.register(use, 'use', 'src/locale/index.js');
  reactHotLoader.register(t, 't', 'src/locale/index.js');
  reactHotLoader.register(_default, 'default', 'src/locale/index.js');
})();

;

(function () {
  var leaveModule = (typeof reactHotLoaderGlobal !== 'undefined' ? reactHotLoaderGlobal : require('react-hot-loader')).leaveModule;
  leaveModule && leaveModule(module);
})();