'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _canvas = require('canvas');

var _canvas2 = _interopRequireDefault(_canvas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//canvas manipulation outside of the browser

var Image = _canvas2.default.Image;

exports.default = function (drawing, width, height) {
  var percentage = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.9;

  var clueData = void 0;
  var canvas = new _canvas2.default(width, height * (1 - percentage));
  var ctx = canvas.getContext('2d');
  var sx = 0;
  var sy = height * percentage;
  var sWidth = width;
  var sHeight = height * (1 - percentage);
  var dx = 0;
  var dy = 0;
  var dWidth = sWidth;
  var dHeight = sHeight;

  var imageObj = new Image();
  imageObj.onload = function () {
    ctx.drawImage(imageObj, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  };
  imageObj.src = drawing;
  clueData = canvas.toDataURL();
  return clueData;
};