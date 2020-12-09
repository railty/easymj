window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  Alert: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c12553sxCxG/on0Bz7rkX0f", "Alert");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _alert: null,
        _btnOK: null,
        _btnCancel: null,
        _title: null,
        _content: null,
        _onok: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this._alert = cc.find("Canvas/alert");
        this._title = cc.find("Canvas/alert/title").getComponent(cc.Label);
        this._content = cc.find("Canvas/alert/content").getComponent(cc.Label);
        this._btnOK = cc.find("Canvas/alert/btn_ok");
        this._btnCancel = cc.find("Canvas/alert/btn_cancel");
        cc.vv.utils.addClickEvent(this._btnOK, this.node, "Alert", "onBtnClicked");
        cc.vv.utils.addClickEvent(this._btnCancel, this.node, "Alert", "onBtnClicked");
        this._alert.active = false;
        cc.vv.alert = this;
      },
      onBtnClicked: function onBtnClicked(event) {
        "btn_ok" == event.target.name && this._onok && this._onok();
        this._alert.active = false;
        this._onok = null;
      },
      show: function show(title, content, onok, needcancel) {
        this._alert.active = true;
        this._onok = onok;
        this._title.string = title;
        this._content.string = content;
        if (needcancel) {
          this._btnCancel.active = true;
          this._btnOK.x = -150;
          this._btnCancel.x = 150;
        } else {
          this._btnCancel.active = false;
          this._btnOK.x = 0;
        }
      },
      onDestory: function onDestory() {
        cc.vv && (cc.vv.alert = null);
      }
    });
    cc._RF.pop();
  }, {} ],
  AnysdkMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f58cea6lrpDZJSNs2BGBqxN", "AnysdkMgr");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _isCapturing: false
      },
      onLoad: function onLoad() {},
      init: function init() {
        this.ANDROID_API = "com/vivigames/scmj/WXAPI";
        this.IOS_API = "AppController";
      },
      login: function login() {},
      share: function share(title, desc) {},
      shareResult: function shareResult() {
        if (this._isCapturing) return;
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        jsb.fileUtils.isFileExist(fullPath) && jsb.fileUtils.removeFile(fullPath);
        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height));
        texture.setPosition(cc.p(size.width / 2, size.height / 2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        var self = this;
        var tryTimes = 0;
        var fn = function fn() {
          if (jsb.fileUtils.isFileExist(fullPath)) {
            var height = 100;
            var scale = height / size.height;
            var width = Math.floor(size.width * scale);
            self._isCapturing = false;
          } else {
            tryTimes++;
            if (tryTimes > 10) {
              console.log("time out...");
              return;
            }
            setTimeout(fn, 50);
          }
        };
        setTimeout(fn, 50);
      },
      onLoginResp: function onLoginResp(code) {}
    });
    cc._RF.pop();
  }, {} ],
  AudioMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "55caepcpvFK5r0Ax5f8jss4", "AudioMgr");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        bgmVolume: 1,
        sfxVolume: 1,
        bgmAudioID: -1
      },
      init: function init() {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        null != t && (this.bgmVolume = parseFloat(t));
        var t = cc.sys.localStorage.getItem("sfxVolume");
        null != t && (this.sfxVolume = parseFloat(t));
        cc.game.on(cc.game.EVENT_HIDE, function() {
          console.log("cc.audioEngine.pauseAll");
          cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function() {
          console.log("cc.audioEngine.resumeAll");
          cc.audioEngine.resumeAll();
        });
      },
      getUrl: function getUrl(url) {
        return cc.url.raw("resources/sounds/" + url);
      },
      playBGM: function playBGM(url) {
        var audioUrl = this.getUrl(url);
        console.log(audioUrl);
        this.bgmAudioID >= 0 && cc.audioEngine.stop(this.bgmAudioID);
        cc.assetManager.loadRemote(audioUrl, function(err, clip) {
          this.bgmAudioID = cc.audioEngine.play(clip, true, this.bgmVolume);
        }.bind(this));
      },
      playSFX: function playSFX(url) {
        var audioUrl = this.getUrl(url);
        this.sfxVolume > 0 && cc.assetManager.loadRemote(audioUrl, function(err, clip) {
          var audioId = cc.audioEngine.play(clip, false, this.sfxVolume);
        }.bind(this));
      },
      setSFXVolume: function setSFXVolume(v) {
        if (this.sfxVolume != v) {
          cc.sys.localStorage.setItem("sfxVolume", v);
          this.sfxVolume = v;
        }
      },
      setBGMVolume: function setBGMVolume(v, force) {
        this.bgmAudioID >= 0 && (v > 0 ? cc.audioEngine.resume(this.bgmAudioID) : cc.audioEngine.pause(this.bgmAudioID));
        if (this.bgmVolume != v || force) {
          cc.sys.localStorage.setItem("bgmVolume", v);
          this.bgmVolume = v;
          cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
      },
      pauseAll: function pauseAll() {
        cc.audioEngine.pauseAll();
      },
      resumeAll: function resumeAll() {
        cc.audioEngine.resumeAll();
      }
    });
    cc._RF.pop();
  }, {} ],
  1: [ function(require, module, exports) {
    "use strict";
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = "undefined" !== typeof Uint8Array ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (var i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len = b64.length;
      if (len % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
      var validLen = b64.indexOf("=");
      -1 === validLen && (validLen = len);
      var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
      return [ validLen, placeHoldersLen ];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return 3 * (validLen + placeHoldersLen) / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i;
      for (i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      if (2 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = 255 & tmp;
      }
      if (1 === placeHoldersLen) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = 255 & tmp;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[63 & num];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (255 & uint8[i + 2]);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len = uint8.length;
      var extraBytes = len % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
      if (1 === extraBytes) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
      } else if (2 === extraBytes) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
      }
      return parts.join("");
    }
  }, {} ],
  2: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      var base64 = require("base64-js");
      var ieee754 = require("ieee754");
      var isArray = require("isarray");
      exports.Buffer = Buffer;
      exports.SlowBuffer = SlowBuffer;
      exports.INSPECT_MAX_BYTES = 50;
      Buffer.TYPED_ARRAY_SUPPORT = void 0 !== global.TYPED_ARRAY_SUPPORT ? global.TYPED_ARRAY_SUPPORT : typedArraySupport();
      exports.kMaxLength = kMaxLength();
      function typedArraySupport() {
        try {
          var arr = new Uint8Array(1);
          arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function() {
              return 42;
            }
          };
          return 42 === arr.foo() && "function" === typeof arr.subarray && 0 === arr.subarray(1, 1).byteLength;
        } catch (e) {
          return false;
        }
      }
      function kMaxLength() {
        return Buffer.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
      }
      function createBuffer(that, length) {
        if (kMaxLength() < length) throw new RangeError("Invalid typed array length");
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = new Uint8Array(length);
          that.__proto__ = Buffer.prototype;
        } else {
          null === that && (that = new Buffer(length));
          that.length = length;
        }
        return that;
      }
      function Buffer(arg, encodingOrOffset, length) {
        if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) return new Buffer(arg, encodingOrOffset, length);
        if ("number" === typeof arg) {
          if ("string" === typeof encodingOrOffset) throw new Error("If encoding is specified then the first argument must be a string");
          return allocUnsafe(this, arg);
        }
        return from(this, arg, encodingOrOffset, length);
      }
      Buffer.poolSize = 8192;
      Buffer._augment = function(arr) {
        arr.__proto__ = Buffer.prototype;
        return arr;
      };
      function from(that, value, encodingOrOffset, length) {
        if ("number" === typeof value) throw new TypeError('"value" argument must not be a number');
        if ("undefined" !== typeof ArrayBuffer && value instanceof ArrayBuffer) return fromArrayBuffer(that, value, encodingOrOffset, length);
        if ("string" === typeof value) return fromString(that, value, encodingOrOffset);
        return fromObject(that, value);
      }
      Buffer.from = function(value, encodingOrOffset, length) {
        return from(null, value, encodingOrOffset, length);
      };
      if (Buffer.TYPED_ARRAY_SUPPORT) {
        Buffer.prototype.__proto__ = Uint8Array.prototype;
        Buffer.__proto__ = Uint8Array;
        "undefined" !== typeof Symbol && Symbol.species && Buffer[Symbol.species] === Buffer && Object.defineProperty(Buffer, Symbol.species, {
          value: null,
          configurable: true
        });
      }
      function assertSize(size) {
        if ("number" !== typeof size) throw new TypeError('"size" argument must be a number');
        if (size < 0) throw new RangeError('"size" argument must not be negative');
      }
      function alloc(that, size, fill, encoding) {
        assertSize(size);
        if (size <= 0) return createBuffer(that, size);
        if (void 0 !== fill) return "string" === typeof encoding ? createBuffer(that, size).fill(fill, encoding) : createBuffer(that, size).fill(fill);
        return createBuffer(that, size);
      }
      Buffer.alloc = function(size, fill, encoding) {
        return alloc(null, size, fill, encoding);
      };
      function allocUnsafe(that, size) {
        assertSize(size);
        that = createBuffer(that, size < 0 ? 0 : 0 | checked(size));
        if (!Buffer.TYPED_ARRAY_SUPPORT) for (var i = 0; i < size; ++i) that[i] = 0;
        return that;
      }
      Buffer.allocUnsafe = function(size) {
        return allocUnsafe(null, size);
      };
      Buffer.allocUnsafeSlow = function(size) {
        return allocUnsafe(null, size);
      };
      function fromString(that, string, encoding) {
        "string" === typeof encoding && "" !== encoding || (encoding = "utf8");
        if (!Buffer.isEncoding(encoding)) throw new TypeError('"encoding" must be a valid string encoding');
        var length = 0 | byteLength(string, encoding);
        that = createBuffer(that, length);
        var actual = that.write(string, encoding);
        actual !== length && (that = that.slice(0, actual));
        return that;
      }
      function fromArrayLike(that, array) {
        var length = array.length < 0 ? 0 : 0 | checked(array.length);
        that = createBuffer(that, length);
        for (var i = 0; i < length; i += 1) that[i] = 255 & array[i];
        return that;
      }
      function fromArrayBuffer(that, array, byteOffset, length) {
        array.byteLength;
        if (byteOffset < 0 || array.byteLength < byteOffset) throw new RangeError("'offset' is out of bounds");
        if (array.byteLength < byteOffset + (length || 0)) throw new RangeError("'length' is out of bounds");
        array = void 0 === byteOffset && void 0 === length ? new Uint8Array(array) : void 0 === length ? new Uint8Array(array, byteOffset) : new Uint8Array(array, byteOffset, length);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          that = array;
          that.__proto__ = Buffer.prototype;
        } else that = fromArrayLike(that, array);
        return that;
      }
      function fromObject(that, obj) {
        if (Buffer.isBuffer(obj)) {
          var len = 0 | checked(obj.length);
          that = createBuffer(that, len);
          if (0 === that.length) return that;
          obj.copy(that, 0, 0, len);
          return that;
        }
        if (obj) {
          if ("undefined" !== typeof ArrayBuffer && obj.buffer instanceof ArrayBuffer || "length" in obj) {
            if ("number" !== typeof obj.length || isnan(obj.length)) return createBuffer(that, 0);
            return fromArrayLike(that, obj);
          }
          if ("Buffer" === obj.type && isArray(obj.data)) return fromArrayLike(that, obj.data);
        }
        throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
      }
      function checked(length) {
        if (length >= kMaxLength()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
        return 0 | length;
      }
      function SlowBuffer(length) {
        +length != length && (length = 0);
        return Buffer.alloc(+length);
      }
      Buffer.isBuffer = function isBuffer(b) {
        return !!(null != b && b._isBuffer);
      };
      Buffer.compare = function compare(a, b) {
        if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) throw new TypeError("Arguments must be Buffers");
        if (a === b) return 0;
        var x = a.length;
        var y = b.length;
        for (var i = 0, len = Math.min(x, y); i < len; ++i) if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      Buffer.isEncoding = function isEncoding(encoding) {
        switch (String(encoding).toLowerCase()) {
         case "hex":
         case "utf8":
         case "utf-8":
         case "ascii":
         case "latin1":
         case "binary":
         case "base64":
         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return true;

         default:
          return false;
        }
      };
      Buffer.concat = function concat(list, length) {
        if (!isArray(list)) throw new TypeError('"list" argument must be an Array of Buffers');
        if (0 === list.length) return Buffer.alloc(0);
        var i;
        if (void 0 === length) {
          length = 0;
          for (i = 0; i < list.length; ++i) length += list[i].length;
        }
        var buffer = Buffer.allocUnsafe(length);
        var pos = 0;
        for (i = 0; i < list.length; ++i) {
          var buf = list[i];
          if (!Buffer.isBuffer(buf)) throw new TypeError('"list" argument must be an Array of Buffers');
          buf.copy(buffer, pos);
          pos += buf.length;
        }
        return buffer;
      };
      function byteLength(string, encoding) {
        if (Buffer.isBuffer(string)) return string.length;
        if ("undefined" !== typeof ArrayBuffer && "function" === typeof ArrayBuffer.isView && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) return string.byteLength;
        "string" !== typeof string && (string = "" + string);
        var len = string.length;
        if (0 === len) return 0;
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "ascii":
         case "latin1":
         case "binary":
          return len;

         case "utf8":
         case "utf-8":
         case void 0:
          return utf8ToBytes(string).length;

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return 2 * len;

         case "hex":
          return len >>> 1;

         case "base64":
          return base64ToBytes(string).length;

         default:
          if (loweredCase) return utf8ToBytes(string).length;
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.byteLength = byteLength;
      function slowToString(encoding, start, end) {
        var loweredCase = false;
        (void 0 === start || start < 0) && (start = 0);
        if (start > this.length) return "";
        (void 0 === end || end > this.length) && (end = this.length);
        if (end <= 0) return "";
        end >>>= 0;
        start >>>= 0;
        if (end <= start) return "";
        encoding || (encoding = "utf8");
        while (true) switch (encoding) {
         case "hex":
          return hexSlice(this, start, end);

         case "utf8":
         case "utf-8":
          return utf8Slice(this, start, end);

         case "ascii":
          return asciiSlice(this, start, end);

         case "latin1":
         case "binary":
          return latin1Slice(this, start, end);

         case "base64":
          return base64Slice(this, start, end);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return utf16leSlice(this, start, end);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = (encoding + "").toLowerCase();
          loweredCase = true;
        }
      }
      Buffer.prototype._isBuffer = true;
      function swap(b, n, m) {
        var i = b[n];
        b[n] = b[m];
        b[m] = i;
      }
      Buffer.prototype.swap16 = function swap16() {
        var len = this.length;
        if (len % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
        for (var i = 0; i < len; i += 2) swap(this, i, i + 1);
        return this;
      };
      Buffer.prototype.swap32 = function swap32() {
        var len = this.length;
        if (len % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
        for (var i = 0; i < len; i += 4) {
          swap(this, i, i + 3);
          swap(this, i + 1, i + 2);
        }
        return this;
      };
      Buffer.prototype.swap64 = function swap64() {
        var len = this.length;
        if (len % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
        for (var i = 0; i < len; i += 8) {
          swap(this, i, i + 7);
          swap(this, i + 1, i + 6);
          swap(this, i + 2, i + 5);
          swap(this, i + 3, i + 4);
        }
        return this;
      };
      Buffer.prototype.toString = function toString() {
        var length = 0 | this.length;
        if (0 === length) return "";
        if (0 === arguments.length) return utf8Slice(this, 0, length);
        return slowToString.apply(this, arguments);
      };
      Buffer.prototype.equals = function equals(b) {
        if (!Buffer.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
        if (this === b) return true;
        return 0 === Buffer.compare(this, b);
      };
      Buffer.prototype.inspect = function inspect() {
        var str = "";
        var max = exports.INSPECT_MAX_BYTES;
        if (this.length > 0) {
          str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
          this.length > max && (str += " ... ");
        }
        return "<Buffer " + str + ">";
      };
      Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
        if (!Buffer.isBuffer(target)) throw new TypeError("Argument must be a Buffer");
        void 0 === start && (start = 0);
        void 0 === end && (end = target ? target.length : 0);
        void 0 === thisStart && (thisStart = 0);
        void 0 === thisEnd && (thisEnd = this.length);
        if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) throw new RangeError("out of range index");
        if (thisStart >= thisEnd && start >= end) return 0;
        if (thisStart >= thisEnd) return -1;
        if (start >= end) return 1;
        start >>>= 0;
        end >>>= 0;
        thisStart >>>= 0;
        thisEnd >>>= 0;
        if (this === target) return 0;
        var x = thisEnd - thisStart;
        var y = end - start;
        var len = Math.min(x, y);
        var thisCopy = this.slice(thisStart, thisEnd);
        var targetCopy = target.slice(start, end);
        for (var i = 0; i < len; ++i) if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
        if (x < y) return -1;
        if (y < x) return 1;
        return 0;
      };
      function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
        if (0 === buffer.length) return -1;
        if ("string" === typeof byteOffset) {
          encoding = byteOffset;
          byteOffset = 0;
        } else byteOffset > 2147483647 ? byteOffset = 2147483647 : byteOffset < -2147483648 && (byteOffset = -2147483648);
        byteOffset = +byteOffset;
        isNaN(byteOffset) && (byteOffset = dir ? 0 : buffer.length - 1);
        byteOffset < 0 && (byteOffset = buffer.length + byteOffset);
        if (byteOffset >= buffer.length) {
          if (dir) return -1;
          byteOffset = buffer.length - 1;
        } else if (byteOffset < 0) {
          if (!dir) return -1;
          byteOffset = 0;
        }
        "string" === typeof val && (val = Buffer.from(val, encoding));
        if (Buffer.isBuffer(val)) {
          if (0 === val.length) return -1;
          return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
        }
        if ("number" === typeof val) {
          val &= 255;
          if (Buffer.TYPED_ARRAY_SUPPORT && "function" === typeof Uint8Array.prototype.indexOf) return dir ? Uint8Array.prototype.indexOf.call(buffer, val, byteOffset) : Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir);
        }
        throw new TypeError("val must be string, number or Buffer");
      }
      function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
        var indexSize = 1;
        var arrLength = arr.length;
        var valLength = val.length;
        if (void 0 !== encoding) {
          encoding = String(encoding).toLowerCase();
          if ("ucs2" === encoding || "ucs-2" === encoding || "utf16le" === encoding || "utf-16le" === encoding) {
            if (arr.length < 2 || val.length < 2) return -1;
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
          }
        }
        function read(buf, i) {
          return 1 === indexSize ? buf[i] : buf.readUInt16BE(i * indexSize);
        }
        var i;
        if (dir) {
          var foundIndex = -1;
          for (i = byteOffset; i < arrLength; i++) if (read(arr, i) === read(val, -1 === foundIndex ? 0 : i - foundIndex)) {
            -1 === foundIndex && (foundIndex = i);
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            -1 !== foundIndex && (i -= i - foundIndex);
            foundIndex = -1;
          }
        } else {
          byteOffset + valLength > arrLength && (byteOffset = arrLength - valLength);
          for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
            if (found) return i;
          }
        }
        return -1;
      }
      Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
        return -1 !== this.indexOf(val, byteOffset, encoding);
      };
      Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
      };
      Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
        return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
      };
      function hexWrite(buf, string, offset, length) {
        offset = Number(offset) || 0;
        var remaining = buf.length - offset;
        if (length) {
          length = Number(length);
          length > remaining && (length = remaining);
        } else length = remaining;
        var strLen = string.length;
        if (strLen % 2 !== 0) throw new TypeError("Invalid hex string");
        length > strLen / 2 && (length = strLen / 2);
        for (var i = 0; i < length; ++i) {
          var parsed = parseInt(string.substr(2 * i, 2), 16);
          if (isNaN(parsed)) return i;
          buf[offset + i] = parsed;
        }
        return i;
      }
      function utf8Write(buf, string, offset, length) {
        return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
      }
      function asciiWrite(buf, string, offset, length) {
        return blitBuffer(asciiToBytes(string), buf, offset, length);
      }
      function latin1Write(buf, string, offset, length) {
        return asciiWrite(buf, string, offset, length);
      }
      function base64Write(buf, string, offset, length) {
        return blitBuffer(base64ToBytes(string), buf, offset, length);
      }
      function ucs2Write(buf, string, offset, length) {
        return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
      }
      Buffer.prototype.write = function write(string, offset, length, encoding) {
        if (void 0 === offset) {
          encoding = "utf8";
          length = this.length;
          offset = 0;
        } else if (void 0 === length && "string" === typeof offset) {
          encoding = offset;
          length = this.length;
          offset = 0;
        } else {
          if (!isFinite(offset)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
          offset |= 0;
          if (isFinite(length)) {
            length |= 0;
            void 0 === encoding && (encoding = "utf8");
          } else {
            encoding = length;
            length = void 0;
          }
        }
        var remaining = this.length - offset;
        (void 0 === length || length > remaining) && (length = remaining);
        if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) throw new RangeError("Attempt to write outside buffer bounds");
        encoding || (encoding = "utf8");
        var loweredCase = false;
        for (;;) switch (encoding) {
         case "hex":
          return hexWrite(this, string, offset, length);

         case "utf8":
         case "utf-8":
          return utf8Write(this, string, offset, length);

         case "ascii":
          return asciiWrite(this, string, offset, length);

         case "latin1":
         case "binary":
          return latin1Write(this, string, offset, length);

         case "base64":
          return base64Write(this, string, offset, length);

         case "ucs2":
         case "ucs-2":
         case "utf16le":
         case "utf-16le":
          return ucs2Write(this, string, offset, length);

         default:
          if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
          encoding = ("" + encoding).toLowerCase();
          loweredCase = true;
        }
      };
      Buffer.prototype.toJSON = function toJSON() {
        return {
          type: "Buffer",
          data: Array.prototype.slice.call(this._arr || this, 0)
        };
      };
      function base64Slice(buf, start, end) {
        return 0 === start && end === buf.length ? base64.fromByteArray(buf) : base64.fromByteArray(buf.slice(start, end));
      }
      function utf8Slice(buf, start, end) {
        end = Math.min(buf.length, end);
        var res = [];
        var i = start;
        while (i < end) {
          var firstByte = buf[i];
          var codePoint = null;
          var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
          if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
             case 1:
              firstByte < 128 && (codePoint = firstByte);
              break;

             case 2:
              secondByte = buf[i + 1];
              if (128 === (192 & secondByte)) {
                tempCodePoint = (31 & firstByte) << 6 | 63 & secondByte;
                tempCodePoint > 127 && (codePoint = tempCodePoint);
              }
              break;

             case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte)) {
                tempCodePoint = (15 & firstByte) << 12 | (63 & secondByte) << 6 | 63 & thirdByte;
                tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343) && (codePoint = tempCodePoint);
              }
              break;

             case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if (128 === (192 & secondByte) && 128 === (192 & thirdByte) && 128 === (192 & fourthByte)) {
                tempCodePoint = (15 & firstByte) << 18 | (63 & secondByte) << 12 | (63 & thirdByte) << 6 | 63 & fourthByte;
                tempCodePoint > 65535 && tempCodePoint < 1114112 && (codePoint = tempCodePoint);
              }
            }
          }
          if (null === codePoint) {
            codePoint = 65533;
            bytesPerSequence = 1;
          } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | 1023 & codePoint;
          }
          res.push(codePoint);
          i += bytesPerSequence;
        }
        return decodeCodePointsArray(res);
      }
      var MAX_ARGUMENTS_LENGTH = 4096;
      function decodeCodePointsArray(codePoints) {
        var len = codePoints.length;
        if (len <= MAX_ARGUMENTS_LENGTH) return String.fromCharCode.apply(String, codePoints);
        var res = "";
        var i = 0;
        while (i < len) res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
        return res;
      }
      function asciiSlice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(127 & buf[i]);
        return ret;
      }
      function latin1Slice(buf, start, end) {
        var ret = "";
        end = Math.min(buf.length, end);
        for (var i = start; i < end; ++i) ret += String.fromCharCode(buf[i]);
        return ret;
      }
      function hexSlice(buf, start, end) {
        var len = buf.length;
        (!start || start < 0) && (start = 0);
        (!end || end < 0 || end > len) && (end = len);
        var out = "";
        for (var i = start; i < end; ++i) out += toHex(buf[i]);
        return out;
      }
      function utf16leSlice(buf, start, end) {
        var bytes = buf.slice(start, end);
        var res = "";
        for (var i = 0; i < bytes.length; i += 2) res += String.fromCharCode(bytes[i] + 256 * bytes[i + 1]);
        return res;
      }
      Buffer.prototype.slice = function slice(start, end) {
        var len = this.length;
        start = ~~start;
        end = void 0 === end ? len : ~~end;
        if (start < 0) {
          start += len;
          start < 0 && (start = 0);
        } else start > len && (start = len);
        if (end < 0) {
          end += len;
          end < 0 && (end = 0);
        } else end > len && (end = len);
        end < start && (end = start);
        var newBuf;
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          newBuf = this.subarray(start, end);
          newBuf.__proto__ = Buffer.prototype;
        } else {
          var sliceLen = end - start;
          newBuf = new Buffer(sliceLen, void 0);
          for (var i = 0; i < sliceLen; ++i) newBuf[i] = this[i + start];
        }
        return newBuf;
      };
      function checkOffset(offset, ext, length) {
        if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
        if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
      }
      Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        return val;
      };
      Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset + --byteLength];
        var mul = 1;
        while (byteLength > 0 && (mul *= 256)) val += this[offset + --byteLength] * mul;
        return val;
      };
      Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        return this[offset];
      };
      Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] | this[offset + 1] << 8;
      };
      Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        return this[offset] << 8 | this[offset + 1];
      };
      Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + 16777216 * this[offset + 3];
      };
      Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return 16777216 * this[offset] + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
      };
      Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var val = this[offset];
        var mul = 1;
        var i = 0;
        while (++i < byteLength && (mul *= 256)) val += this[offset + i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
        offset |= 0;
        byteLength |= 0;
        noAssert || checkOffset(offset, byteLength, this.length);
        var i = byteLength;
        var mul = 1;
        var val = this[offset + --i];
        while (i > 0 && (mul *= 256)) val += this[offset + --i] * mul;
        mul *= 128;
        val >= mul && (val -= Math.pow(2, 8 * byteLength));
        return val;
      };
      Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
        noAssert || checkOffset(offset, 1, this.length);
        if (!(128 & this[offset])) return this[offset];
        return -1 * (255 - this[offset] + 1);
      };
      Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset] | this[offset + 1] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
        noAssert || checkOffset(offset, 2, this.length);
        var val = this[offset + 1] | this[offset] << 8;
        return 32768 & val ? 4294901760 | val : val;
      };
      Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
      };
      Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
      };
      Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, true, 23, 4);
      };
      Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
        noAssert || checkOffset(offset, 4, this.length);
        return ieee754.read(this, offset, false, 23, 4);
      };
      Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, true, 52, 8);
      };
      Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
        noAssert || checkOffset(offset, 8, this.length);
        return ieee754.read(this, offset, false, 52, 8);
      };
      function checkInt(buf, value, offset, ext, max, min) {
        if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
        if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
      }
      Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var mul = 1;
        var i = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        byteLength |= 0;
        if (!noAssert) {
          var maxBytes = Math.pow(2, 8 * byteLength) - 1;
          checkInt(this, value, offset, byteLength, maxBytes, 0);
        }
        var i = byteLength - 1;
        var mul = 1;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) this[offset + i] = value / mul & 255;
        return offset + byteLength;
      };
      Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 255, 0);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        this[offset] = 255 & value;
        return offset + 1;
      };
      function objectWriteUInt16(buf, value, offset, littleEndian) {
        value < 0 && (value = 65535 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> 8 * (littleEndian ? i : 1 - i);
      }
      Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 65535, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      function objectWriteUInt32(buf, value, offset, littleEndian) {
        value < 0 && (value = 4294967295 + value + 1);
        for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) buf[offset + i] = value >>> 8 * (littleEndian ? i : 3 - i) & 255;
      }
      Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset + 3] = value >>> 24;
          this[offset + 2] = value >>> 16;
          this[offset + 1] = value >>> 8;
          this[offset] = 255 & value;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 4294967295, 0);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = 0;
        var mul = 1;
        var sub = 0;
        this[offset] = 255 & value;
        while (++i < byteLength && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i - 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
        value = +value;
        offset |= 0;
        if (!noAssert) {
          var limit = Math.pow(2, 8 * byteLength - 1);
          checkInt(this, value, offset, byteLength, limit - 1, -limit);
        }
        var i = byteLength - 1;
        var mul = 1;
        var sub = 0;
        this[offset + i] = 255 & value;
        while (--i >= 0 && (mul *= 256)) {
          value < 0 && 0 === sub && 0 !== this[offset + i + 1] && (sub = 1);
          this[offset + i] = (value / mul >> 0) - sub & 255;
        }
        return offset + byteLength;
      };
      Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 1, 127, -128);
        Buffer.TYPED_ARRAY_SUPPORT || (value = Math.floor(value));
        value < 0 && (value = 255 + value + 1);
        this[offset] = 255 & value;
        return offset + 1;
      };
      Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
        } else objectWriteUInt16(this, value, offset, true);
        return offset + 2;
      };
      Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 2, 32767, -32768);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 8;
          this[offset + 1] = 255 & value;
        } else objectWriteUInt16(this, value, offset, false);
        return offset + 2;
      };
      Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = 255 & value;
          this[offset + 1] = value >>> 8;
          this[offset + 2] = value >>> 16;
          this[offset + 3] = value >>> 24;
        } else objectWriteUInt32(this, value, offset, true);
        return offset + 4;
      };
      Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
        value = +value;
        offset |= 0;
        noAssert || checkInt(this, value, offset, 4, 2147483647, -2147483648);
        value < 0 && (value = 4294967295 + value + 1);
        if (Buffer.TYPED_ARRAY_SUPPORT) {
          this[offset] = value >>> 24;
          this[offset + 1] = value >>> 16;
          this[offset + 2] = value >>> 8;
          this[offset + 3] = 255 & value;
        } else objectWriteUInt32(this, value, offset, false);
        return offset + 4;
      };
      function checkIEEE754(buf, value, offset, ext, max, min) {
        if (offset + ext > buf.length) throw new RangeError("Index out of range");
        if (offset < 0) throw new RangeError("Index out of range");
      }
      function writeFloat(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
        ieee754.write(buf, value, offset, littleEndian, 23, 4);
        return offset + 4;
      }
      Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
        return writeFloat(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
        return writeFloat(this, value, offset, false, noAssert);
      };
      function writeDouble(buf, value, offset, littleEndian, noAssert) {
        noAssert || checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
        ieee754.write(buf, value, offset, littleEndian, 52, 8);
        return offset + 8;
      }
      Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
        return writeDouble(this, value, offset, true, noAssert);
      };
      Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
        return writeDouble(this, value, offset, false, noAssert);
      };
      Buffer.prototype.copy = function copy(target, targetStart, start, end) {
        start || (start = 0);
        end || 0 === end || (end = this.length);
        targetStart >= target.length && (targetStart = target.length);
        targetStart || (targetStart = 0);
        end > 0 && end < start && (end = start);
        if (end === start) return 0;
        if (0 === target.length || 0 === this.length) return 0;
        if (targetStart < 0) throw new RangeError("targetStart out of bounds");
        if (start < 0 || start >= this.length) throw new RangeError("sourceStart out of bounds");
        if (end < 0) throw new RangeError("sourceEnd out of bounds");
        end > this.length && (end = this.length);
        target.length - targetStart < end - start && (end = target.length - targetStart + start);
        var len = end - start;
        var i;
        if (this === target && start < targetStart && targetStart < end) for (i = len - 1; i >= 0; --i) target[i + targetStart] = this[i + start]; else if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) for (i = 0; i < len; ++i) target[i + targetStart] = this[i + start]; else Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
        return len;
      };
      Buffer.prototype.fill = function fill(val, start, end, encoding) {
        if ("string" === typeof val) {
          if ("string" === typeof start) {
            encoding = start;
            start = 0;
            end = this.length;
          } else if ("string" === typeof end) {
            encoding = end;
            end = this.length;
          }
          if (1 === val.length) {
            var code = val.charCodeAt(0);
            code < 256 && (val = code);
          }
          if (void 0 !== encoding && "string" !== typeof encoding) throw new TypeError("encoding must be a string");
          if ("string" === typeof encoding && !Buffer.isEncoding(encoding)) throw new TypeError("Unknown encoding: " + encoding);
        } else "number" === typeof val && (val &= 255);
        if (start < 0 || this.length < start || this.length < end) throw new RangeError("Out of range index");
        if (end <= start) return this;
        start >>>= 0;
        end = void 0 === end ? this.length : end >>> 0;
        val || (val = 0);
        var i;
        if ("number" === typeof val) for (i = start; i < end; ++i) this[i] = val; else {
          var bytes = Buffer.isBuffer(val) ? val : utf8ToBytes(new Buffer(val, encoding).toString());
          var len = bytes.length;
          for (i = 0; i < end - start; ++i) this[i + start] = bytes[i % len];
        }
        return this;
      };
      var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
      function base64clean(str) {
        str = stringtrim(str).replace(INVALID_BASE64_RE, "");
        if (str.length < 2) return "";
        while (str.length % 4 !== 0) str += "=";
        return str;
      }
      function stringtrim(str) {
        if (str.trim) return str.trim();
        return str.replace(/^\s+|\s+$/g, "");
      }
      function toHex(n) {
        if (n < 16) return "0" + n.toString(16);
        return n.toString(16);
      }
      function utf8ToBytes(string, units) {
        units = units || Infinity;
        var codePoint;
        var length = string.length;
        var leadSurrogate = null;
        var bytes = [];
        for (var i = 0; i < length; ++i) {
          codePoint = string.charCodeAt(i);
          if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
              if (codePoint > 56319) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              if (i + 1 === length) {
                (units -= 3) > -1 && bytes.push(239, 191, 189);
                continue;
              }
              leadSurrogate = codePoint;
              continue;
            }
            if (codePoint < 56320) {
              (units -= 3) > -1 && bytes.push(239, 191, 189);
              leadSurrogate = codePoint;
              continue;
            }
            codePoint = 65536 + (leadSurrogate - 55296 << 10 | codePoint - 56320);
          } else leadSurrogate && (units -= 3) > -1 && bytes.push(239, 191, 189);
          leadSurrogate = null;
          if (codePoint < 128) {
            if ((units -= 1) < 0) break;
            bytes.push(codePoint);
          } else if (codePoint < 2048) {
            if ((units -= 2) < 0) break;
            bytes.push(codePoint >> 6 | 192, 63 & codePoint | 128);
          } else if (codePoint < 65536) {
            if ((units -= 3) < 0) break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          } else {
            if (!(codePoint < 1114112)) throw new Error("Invalid code point");
            if ((units -= 4) < 0) break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, 63 & codePoint | 128);
          }
        }
        return bytes;
      }
      function asciiToBytes(str) {
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) byteArray.push(255 & str.charCodeAt(i));
        return byteArray;
      }
      function utf16leToBytes(str, units) {
        var c, hi, lo;
        var byteArray = [];
        for (var i = 0; i < str.length; ++i) {
          if ((units -= 2) < 0) break;
          c = str.charCodeAt(i);
          hi = c >> 8;
          lo = c % 256;
          byteArray.push(lo);
          byteArray.push(hi);
        }
        return byteArray;
      }
      function base64ToBytes(str) {
        return base64.toByteArray(base64clean(str));
      }
      function blitBuffer(src, dst, offset, length) {
        for (var i = 0; i < length; ++i) {
          if (i + offset >= dst.length || i >= src.length) break;
          dst[i + offset] = src[i];
        }
        return i;
      }
      function isnan(val) {
        return val !== val;
      }
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    "base64-js": 1,
    ieee754: 4,
    isarray: 3
  } ],
  3: [ function(require, module, exports) {
    var toString = {}.toString;
    module.exports = Array.isArray || function(arr) {
      return "[object Array]" == toString.call(arr);
    };
  }, {} ],
  4: [ function(require, module, exports) {
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (;nBits > 0; e = 256 * e + buffer[offset + i], i += d, nBits -= 8) ;
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (;nBits > 0; m = 256 * m + buffer[offset + i], i += d, nBits -= 8) ;
      if (0 === e) e = 1 - eBias; else {
        if (e === eMax) return m ? NaN : Infinity * (s ? -1 : 1);
        m += Math.pow(2, mLen);
        e -= eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = 8 * nBytes - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = 23 === mLen ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || 0 === value && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || Infinity === value) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        value += e + eBias >= 1 ? rt / c : rt * Math.pow(2, 1 - eBias);
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e += eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (;mLen >= 8; buffer[offset + i] = 255 & m, i += d, m /= 256, mLen -= 8) ;
      e = e << mLen | m;
      eLen += mLen;
      for (;eLen > 0; buffer[offset + i] = 255 & e, i += d, e /= 256, eLen -= 8) ;
      buffer[offset + i - d] |= 128 * s;
    };
  }, {} ],
  Chat: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "58f27rxustNsYlRX3fryN8X", "Chat");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _chatRoot: null,
        _tabQuick: null,
        _tabEmoji: null,
        _iptChat: null,
        _quickChatInfo: null,
        _btnChat: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        cc.vv.chat = this;
        this._btnChat = this.node.getChildByName("btn_chat");
        this._btnChat.active = false == cc.vv.replayMgr.isReplay();
        this._chatRoot = this.node.getChildByName("chat");
        this._chatRoot.active = false;
        this._tabQuick = this._chatRoot.getChildByName("quickchatlist");
        this._tabEmoji = this._chatRoot.getChildByName("emojis");
        this._iptChat = this._chatRoot.getChildByName("iptChat").getComponent(cc.EditBox);
        this._quickChatInfo = {};
        this._quickChatInfo["item0"] = {
          index: 0,
          content: "\u5feb\u70b9\u554a\uff0c\u90fd\u7b49\u5230\u6211\u82b1\u513f\u90fd\u8c22\u8c22\u4e86\uff01",
          sound: "fix_msg_1.mp3"
        };
        this._quickChatInfo["item1"] = {
          index: 1,
          content: "\u600e\u4e48\u53c8\u65ad\u7ebf\u4e86\uff0c\u7f51\u7edc\u600e\u4e48\u8fd9\u4e48\u5dee\u554a\uff01",
          sound: "fix_msg_2.mp3"
        };
        this._quickChatInfo["item2"] = {
          index: 2,
          content: "\u4e0d\u8981\u8d70\uff0c\u51b3\u6218\u5230\u5929\u4eae\uff01",
          sound: "fix_msg_3.mp3"
        };
        this._quickChatInfo["item3"] = {
          index: 3,
          content: "\u4f60\u7684\u724c\u6253\u5f97\u4e5f\u592a\u597d\u4e86\uff01",
          sound: "fix_msg_4.mp3"
        };
        this._quickChatInfo["item4"] = {
          index: 4,
          content: "\u4f60\u662f\u59b9\u59b9\u8fd8\u662f\u54e5\u54e5\u554a\uff1f",
          sound: "fix_msg_5.mp3"
        };
        this._quickChatInfo["item5"] = {
          index: 5,
          content: "\u548c\u4f60\u5408\u4f5c\u771f\u662f\u592a\u6109\u5feb\u4e86\uff01",
          sound: "fix_msg_6.mp3"
        };
        this._quickChatInfo["item6"] = {
          index: 6,
          content: "\u5927\u5bb6\u597d\uff0c\u5f88\u9ad8\u5174\u89c1\u5230\u5404\u4f4d\uff01",
          sound: "fix_msg_7.mp3"
        };
        this._quickChatInfo["item7"] = {
          index: 7,
          content: "\u5404\u4f4d\uff0c\u771f\u662f\u4e0d\u597d\u610f\u601d\uff0c\u6211\u5f97\u79bb\u5f00\u4e00\u4f1a\u513f\u3002",
          sound: "fix_msg_8.mp3"
        };
        this._quickChatInfo["item8"] = {
          index: 8,
          content: "\u4e0d\u8981\u5435\u4e86\uff0c\u4e13\u5fc3\u73a9\u6e38\u620f\u5427\uff01",
          sound: "fix_msg_9.mp3"
        };
      },
      getQuickChatInfo: function getQuickChatInfo(index) {
        var key = "item" + index;
        return this._quickChatInfo[key];
      },
      onBtnChatClicked: function onBtnChatClicked() {
        this._chatRoot.active = true;
      },
      onBgClicked: function onBgClicked() {
        this._chatRoot.active = false;
      },
      onTabClicked: function onTabClicked(event) {
        if ("tabQuick" == event.target.name) {
          this._tabQuick.active = true;
          this._tabEmoji.active = false;
        } else if ("tabEmoji" == event.target.name) {
          this._tabQuick.active = false;
          this._tabEmoji.active = true;
        }
      },
      onQuickChatItemClicked: function onQuickChatItemClicked(event) {
        this._chatRoot.active = false;
        var info = this._quickChatInfo[event.target.name];
        cc.vv.net.send("quick_chat", info.index);
      },
      onEmojiItemClicked: function onEmojiItemClicked(event) {
        console.log(event.target.name);
        this._chatRoot.active = false;
        cc.vv.net.send("emoji", event.target.name);
      },
      onBtnSendChatClicked: function onBtnSendChatClicked() {
        this._chatRoot.active = false;
        if ("" == this._iptChat.string) return;
        cc.vv.net.send("chat", this._iptChat.string);
        this._iptChat.string = "";
      }
    });
    cc._RF.pop();
  }, {} ],
  CheckBox: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dc9e5hcegFBFpbh0CwUFw8V", "CheckBox");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        target: cc.Node,
        sprite: cc.SpriteFrame,
        checkedSprite: cc.SpriteFrame,
        checked: false
      },
      onLoad: function onLoad() {
        this.refresh();
      },
      onClicked: function onClicked() {
        this.checked = !this.checked;
        this.refresh();
      },
      refresh: function refresh() {
        var targetSprite = this.target.getComponent(cc.Sprite);
        this.checked ? targetSprite.spriteFrame = this.checkedSprite : targetSprite.spriteFrame = this.sprite;
      }
    });
    cc._RF.pop();
  }, {} ],
  CreateRole: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d56bFYy/REb77pQCq9YHh6", "CreateRole");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        inputName: cc.EditBox,
        editBoxName: cc.EditBox
      },
      onRandomBtnClicked: function onRandomBtnClicked() {
        var names = [ "\u4e0a\u5b98", "\u6b27\u9633", "\u4e1c\u65b9", "\u7aef\u6728", "\u72ec\u5b64", "\u53f8\u9a6c", "\u5357\u5bab", "\u590f\u4faf", "\u8bf8\u845b", "\u7687\u752b", "\u957f\u5b59", "\u5b87\u6587", "\u8f69\u8f95", "\u4e1c\u90ed", "\u5b50\u8f66", "\u4e1c\u9633", "\u5b50\u8a00" ];
        var names2 = [ "\u96c0\u5723", "\u8d4c\u4fa0", "\u8d4c\u5723", "\u7a33\u8d62", "\u4e0d\u8f93", "\u597d\u8fd0", "\u81ea\u6478", "\u6709\u94b1", "\u571f\u8c6a" ];
        var idx = Math.floor(Math.random() * (names.length - 1));
        var idx2 = Math.floor(Math.random() * (names2.length - 1));
        var nm = names[idx] + names2[idx2];
        this.editBoxName.string = nm;
        this.editBoxName.textLabel.string = nm;
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
          var cvs = this.node.getComponent(cc.Canvas);
          cvs.fitHeight = true;
          cvs.fitWidth = true;
        }
      },
      onBtnConfirmClicked: function onBtnConfirmClicked() {
        var name = this.editBoxName.string;
        if ("" == name) {
          console.log("invalid name.");
          return;
        }
        console.log(name);
        cc.vv.userMgr.create(name);
      }
    });
    cc._RF.pop();
  }, {} ],
  CreateRoom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eec07HsL4pBn5/PiT3SYBew", "CreateRoom");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _difenxuanze: null,
        _zimo: null,
        _wanfaxuanze: null,
        _zuidafanshu: null,
        _jushuxuanze: null,
        _dianganghua: null,
        _leixingxuanze: null,
        lblCreateGameRoom: cc.Label,
        lbl4Games: cc.Label,
        lbl8Games: cc.Label
      },
      onLoad: function onLoad() {
        this.lblCreateGameRoom.node.color = new cc.Color().fromHEX("#A82121");
        this.lblCreateGameRoom.enableBold = true;
        this.lbl4Games.string = "4 Games";
        this.lbl8Games.string = "8 Games";
        this._leixingxuanze = [];
        var t = this.node.getChildByName("leixingxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
          var n = t.children[i].getComponent("RadioButton");
          null != n && this._leixingxuanze.push(n);
        }
        this._difenxuanze = [];
        var t = this.node.getChildByName("difenxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
          var n = t.children[i].getComponent("RadioButton");
          null != n && this._difenxuanze.push(n);
        }
        this._zimo = [];
        var t = this.node.getChildByName("zimojiacheng");
        for (var i = 0; i < t.childrenCount; ++i) {
          var n = t.children[i].getComponent("RadioButton");
          null != n && this._zimo.push(n);
        }
        this._wanfaxuanze = [];
        var t = this.node.getChildByName("wanfaxuanze");
        for (var i = 0; i < t.childrenCount; ++i) {
          var n = t.children[i].getComponent("CheckBox");
          null != n && this._wanfaxuanze.push(n);
        }
        this._zuidafanshu = [];
        var t = this.node.getChildByName("zuidafanshu");
        for (var i = 0; i < t.childrenCount; ++i) {
          var n = t.children[i].getComponent("RadioButton");
          null != n && this._zuidafanshu.push(n);
        }
        this._jushuxuanze = [];
        var t = this.node.getChildByName("xuanzejushu");
        for (var i = 0; i < t.childrenCount; ++i) {
          var n = t.children[i].getComponent("RadioButton");
          null != n && this._jushuxuanze.push(n);
        }
        this._dianganghua = [];
        var t = this.node.getChildByName("dianganghua");
        for (var i = 0; i < t.childrenCount; ++i) {
          var n = t.children[i].getComponent("RadioButton");
          null != n && this._dianganghua.push(n);
        }
      },
      onBtnBack: function onBtnBack() {
        this.node.active = false;
      },
      onBtnOK: function onBtnOK() {
        this.node.active = false;
        this.createRoom();
      },
      createRoom: function createRoom() {
        var self = this;
        var onCreate = function onCreate(ret) {
          if (0 !== ret.errcode) {
            cc.vv.wc.hide();
            2222 == ret.errcode ? cc.vv.alert.show("\u63d0\u793a", "\u623f\u5361\u4e0d\u8db3\uff0c\u521b\u5efa\u623f\u95f4\u5931\u8d25!") : cc.vv.alert.show("\u63d0\u793a", "\u521b\u5efa\u623f\u95f4\u5931\u8d25,\u9519\u8bef\u7801:" + ret.errcode);
          } else cc.vv.gameNetMgr.connectGameServer(ret);
        };
        var difen = 0;
        for (var i = 0; i < self._difenxuanze.length; ++i) if (self._difenxuanze[i].checked) {
          difen = i;
          break;
        }
        var zimo = 0;
        for (var i = 0; i < self._zimo.length; ++i) if (self._zimo[i].checked) {
          zimo = i;
          break;
        }
        var huansanzhang = self._wanfaxuanze[0].checked;
        var jiangdui = self._wanfaxuanze[1].checked;
        var menqing = self._wanfaxuanze[2].checked;
        var tiandihu = self._wanfaxuanze[3].checked;
        var type = 0;
        for (var i = 0; i < self._leixingxuanze.length; ++i) if (self._leixingxuanze[i].checked) {
          type = i;
          break;
        }
        type = 0 == type ? "xzdd" : 1 == type ? "xlch" : "rzmj";
        var zuidafanshu = 0;
        for (var i = 0; i < self._zuidafanshu.length; ++i) if (self._zuidafanshu[i].checked) {
          zuidafanshu = i;
          break;
        }
        var jushuxuanze = 0;
        for (var i = 0; i < self._jushuxuanze.length; ++i) if (self._jushuxuanze[i].checked) {
          jushuxuanze = i;
          break;
        }
        var dianganghua = 0;
        for (var i = 0; i < self._dianganghua.length; ++i) if (self._dianganghua[i].checked) {
          dianganghua = i;
          break;
        }
        if ("rzmj" != type) var conf = {
          type: type,
          difen: difen,
          zimo: zimo,
          jiangdui: jiangdui,
          huansanzhang: huansanzhang,
          zuidafanshu: zuidafanshu,
          jushuxuanze: jushuxuanze,
          dianganghua: dianganghua,
          menqing: menqing,
          tiandihu: tiandihu
        }; else var conf = {
          type: type,
          difen: difen,
          jushuxuanze: jushuxuanze,
          zuidafanshu: zuidafanshu
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign,
          conf: JSON.stringify(conf)
        };
        console.log(data);
        cc.vv.wc.show("\u6b63\u5728\u521b\u5efa\u623f\u95f4");
        cc.vv.http.sendRequest("/create_private_room", data, onCreate);
      }
    });
    cc._RF.pop();
  }, {} ],
  DingQue: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "907582awNJFnobC/mZGFLBq", "DingQue");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        queYiMen: null,
        tips: [],
        selected: [],
        dingques: []
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this.initView();
        this.initDingQue();
        this.initEventHandlers();
      },
      initView: function initView() {
        var gameChild = this.node.getChildByName("game");
        this.queYiMen = gameChild.getChildByName("dingque");
        this.queYiMen.active = cc.vv.gameNetMgr.isDingQueing;
        var arr = [ "myself", "right", "up", "left" ];
        for (var i = 0; i < arr.length; ++i) {
          var side = gameChild.getChildByName(arr[i]);
          var seat = side.getChildByName("seat");
          var dingque = seat.getChildByName("que");
          this.dingques.push(dingque);
        }
        this.reset();
        var tips = this.queYiMen.getChildByName("tips");
        for (var i = 0; i < tips.childrenCount; ++i) {
          var n = tips.children[i];
          this.tips.push(n.getComponent(cc.Label));
        }
        "dingque" == cc.vv.gameNetMgr.gamestate && this.showDingQueChoice();
      },
      initEventHandlers: function initEventHandlers() {
        var self = this;
        this.node.on("game_dingque", function(data) {
          self.showDingQueChoice();
        });
        this.node.on("game_dingque_notify", function(data) {
          var seatIndex = cc.vv.gameNetMgr.getSeatIndexByID(data);
          var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
          console.log("game_dingque_notify:" + localIndex);
          self.tips[localIndex].node.active = true;
        });
        this.node.on("game_dingque_finish", function() {
          self.queYiMen.active = false;
          cc.vv.gameNetMgr.isDingQueing = false;
          self.initDingQue();
        });
      },
      showDingQueChoice: function showDingQueChoice() {
        this.queYiMen.active = true;
        var sd = cc.vv.gameNetMgr.getSelfData();
        var typeCounts = [ 0, 0, 0 ];
        for (var i = 0; i < sd.holds.length; ++i) {
          var pai = sd.holds[i];
          var type = cc.vv.mahjongmgr.getMahjongType(pai);
          typeCounts[type]++;
        }
        var min = 65535;
        var minIndex = 0;
        for (var i = 0; i < typeCounts.length; ++i) if (typeCounts[i] < min) {
          min = typeCounts[i];
          minIndex = i;
        }
        var arr = [ "tong", "tiao", "wan" ];
        for (var i = 0; i < arr.length; ++i) {
          var node = this.queYiMen.getChildByName(arr[i]);
          minIndex == i ? node.getComponent(cc.Animation).play("dingque_tuijian") : node.getComponent(cc.Animation).stop();
        }
        this.reset();
        for (var i = 0; i < this.tips.length; ++i) {
          var n = this.tips[i];
          n.node.active = !(i > 0);
        }
      },
      initDingQue: function initDingQue() {
        var arr = [ "tong", "tiao", "wan" ];
        var data = cc.vv.gameNetMgr.seats;
        for (var i = 0; i < data.length; ++i) {
          var que = data[i].dingque;
          que = null == que || que < 0 || que >= arr.length ? null : arr[que];
          var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
          que && (this.dingques[localIndex].getChildByName(que).active = true);
        }
      },
      reset: function reset() {
        this.setInteractable(true);
        this.selected.push(this.queYiMen.getChildByName("tong_selected"));
        this.selected.push(this.queYiMen.getChildByName("tiao_selected"));
        this.selected.push(this.queYiMen.getChildByName("wan_selected"));
        for (var i = 0; i < this.selected.length; ++i) this.selected[i].active = false;
        for (var i = 0; i < this.dingques.length; ++i) for (var j = 0; j < this.dingques[i].children.length; ++j) this.dingques[i].children[j].active = false;
      },
      onQueYiMenClicked: function onQueYiMenClicked(event) {
        var type = 0;
        "tong" == event.target.name ? type = 0 : "tiao" == event.target.name ? type = 1 : "wan" == event.target.name && (type = 2);
        for (var i = 0; i < this.selected.length; ++i) this.selected[i].active = false;
        this.selected[type].active = true;
        cc.vv.gameNetMgr.dingque = type;
        cc.vv.net.send("dingque", type);
      },
      setInteractable: function setInteractable(value) {
        this.queYiMen.getChildByName("tong").getComponent(cc.Button).interactable = value;
        this.queYiMen.getChildByName("tiao").getComponent(cc.Button).interactable = value;
        this.queYiMen.getChildByName("wan").getComponent(cc.Button).interactable = value;
      }
    });
    cc._RF.pop();
  }, {} ],
  Folds: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0bf63eiZEFMWbW03o8heqa5", "Folds");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _folds: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this.initView();
        this.initEventHandler();
        this.initAllFolds();
      },
      initView: function initView() {
        this._folds = {};
        var game = this.node.getChildByName("game");
        var sides = [ "myself", "right", "up", "left" ];
        for (var i = 0; i < sides.length; ++i) {
          var sideName = sides[i];
          var sideRoot = game.getChildByName(sideName);
          var folds = [];
          var foldRoot = sideRoot.getChildByName("folds");
          for (var j = 0; j < foldRoot.children.length; ++j) {
            var n = foldRoot.children[j];
            n.active = false;
            var sprite = n.getComponent(cc.Sprite);
            sprite.spriteFrame = null;
            folds.push(sprite);
          }
          this._folds[sideName] = folds;
        }
        this.hideAllFolds();
      },
      hideAllFolds: function hideAllFolds() {
        for (var k in this._folds) {
          var f = this._folds[i];
          for (var i in f) f[i].node.active = false;
        }
      },
      initEventHandler: function initEventHandler() {
        var self = this;
        this.node.on("game_begin", function(data) {
          self.initAllFolds();
        });
        this.node.on("game_sync", function(data) {
          self.initAllFolds();
        });
        this.node.on("game_chupai_notify", function(data) {
          self.initFolds(data.seatData);
        });
        this.node.on("guo_notify", function(data) {
          self.initFolds(data);
        });
      },
      initAllFolds: function initAllFolds() {
        var seats = cc.vv.gameNetMgr.seats;
        for (var i in seats) this.initFolds(seats[i]);
      },
      initFolds: function initFolds(seatData) {
        var folds = seatData.folds;
        if (null == folds) return;
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var foldsSprites = this._folds[side];
        for (var i = 0; i < foldsSprites.length; ++i) {
          var index = i;
          "right" != side && "up" != side || (index = foldsSprites.length - i - 1);
          var sprite = foldsSprites[index];
          sprite.node.active = true;
          this.setSpriteFrameByMJID(pre, sprite, folds[i]);
        }
        for (var i = folds.length; i < foldsSprites.length; ++i) {
          var index = i;
          "right" != side && "up" != side || (index = foldsSprites.length - i - 1);
          var sprite = foldsSprites[index];
          sprite.spriteFrame = null;
          sprite.node.active = false;
        }
      },
      setSpriteFrameByMJID: function setSpriteFrameByMJID(pre, sprite, mjid) {
        sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
      }
    });
    cc._RF.pop();
  }, {} ],
  GameNetMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9545659TARKZLMoHGqXoY2N", "GameNetMgr");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        dataEventHandler: null,
        roomId: null,
        maxNumOfGames: 0,
        numOfGames: 0,
        numOfMJ: 0,
        seatIndex: -1,
        seats: null,
        turn: -1,
        button: -1,
        dingque: -1,
        chupai: -1,
        isDingQueing: false,
        isHuanSanZhang: false,
        gamestate: "",
        isOver: false,
        dissoveData: null
      },
      reset: function reset() {
        this.turn = -1;
        this.chupai = -1, this.dingque = -1;
        this.button = -1;
        this.gamestate = "";
        this.dingque = -1;
        this.isDingQueing = false;
        this.isHuanSanZhang = false;
        this.curaction = null;
        for (var i = 0; i < this.seats.length; ++i) {
          this.seats[i].holds = [];
          this.seats[i].folds = [];
          this.seats[i].pengs = [];
          this.seats[i].angangs = [];
          this.seats[i].diangangs = [];
          this.seats[i].wangangs = [];
          this.seats[i].dingque = -1;
          this.seats[i].ready = false;
          this.seats[i].hued = false;
          this.seats[i].huanpais = null;
          this.huanpaimethod = -1;
        }
      },
      clear: function clear() {
        this.dataEventHandler = null;
        if (null == this.isOver) {
          this.seats = null;
          this.roomId = null;
          this.maxNumOfGames = 0;
          this.numOfGames = 0;
        }
      },
      dispatchEvent: function dispatchEvent(event, data) {
        this.dataEventHandler && this.dataEventHandler.emit(event, data);
      },
      getSeatIndexByID: function getSeatIndexByID(userId) {
        for (var i = 0; i < this.seats.length; ++i) {
          var s = this.seats[i];
          if (s.userid == userId) return i;
        }
        return -1;
      },
      isOwner: function isOwner() {
        return 0 == this.seatIndex;
      },
      getSeatByID: function getSeatByID(userId) {
        var seatIndex = this.getSeatIndexByID(userId);
        var seat = this.seats[seatIndex];
        return seat;
      },
      getSelfData: function getSelfData() {
        return this.seats[this.seatIndex];
      },
      getLocalIndex: function getLocalIndex(index) {
        var ret = (index - this.seatIndex + 4) % 4;
        return ret;
      },
      prepareReplay: function prepareReplay(roomInfo, detailOfGame) {
        this.roomId = roomInfo.id;
        this.seats = roomInfo.seats;
        this.turn = detailOfGame.base_info.button;
        var baseInfo = detailOfGame.base_info;
        for (var i = 0; i < this.seats.length; ++i) {
          var s = this.seats[i];
          s.seatindex = i;
          s.score = null;
          s.holds = baseInfo.game_seats[i];
          s.pengs = [];
          s.angangs = [];
          s.diangangs = [];
          s.wangangs = [];
          s.folds = [];
          console.log(s);
          cc.vv.userMgr.userId == s.userid && (this.seatIndex = i);
        }
        this.conf = {
          type: baseInfo.type
        };
        null == this.conf.type && "xzdd" == this.conf.type;
      },
      getWanfa: function getWanfa() {
        var conf = this.conf;
        if (conf && null != conf.maxGames && null != conf.maxFan) {
          var strArr = [];
          strArr.push(conf.maxGames + "Games");
          return strArr.join(" ");
        }
        return "";
      },
      initHandlers: function initHandlers() {
        var self = this;
        cc.vv.net.addHandler("login_result", function(data) {
          console.log(data);
          if (0 === data.errcode) {
            var data = data.data;
            self.roomId = data.roomid;
            self.conf = data.conf;
            self.maxNumOfGames = data.conf.maxGames;
            self.numOfGames = data.numofgames;
            self.seats = data.seats;
            self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
            self.isOver = false;
          } else console.log(data.errmsg);
        });
        cc.vv.net.addHandler("login_finished", function(data) {
          console.log("login_finished");
          cc.director.loadScene("mjgame");
        });
        cc.vv.net.addHandler("exit_result", function(data) {
          self.roomId = null;
          self.turn = -1;
          self.dingque = -1;
          self.isDingQueing = false;
          self.seats = null;
        });
        cc.vv.net.addHandler("exit_notify_push", function(data) {
          var userId = data;
          var s = self.getSeatByID(userId);
          if (null != s) {
            s.userid = 0;
            s.name = "";
            self.dispatchEvent("user_state_changed", s);
          }
        });
        cc.vv.net.addHandler("dispress_push", function(data) {
          self.roomId = null;
          self.turn = -1;
          self.dingque = -1;
          self.isDingQueing = false;
          self.seats = null;
        });
        cc.vv.net.addHandler("disconnect", function(data) {
          if (null == self.roomId) cc.director.loadScene("hall"); else if (false == self.isOver) {
            cc.vv.userMgr.oldRoomId = self.roomId;
            self.dispatchEvent("disconnect");
          } else self.roomId = null;
        });
        cc.vv.net.addHandler("new_user_comes_push", function(data) {
          var seatIndex = data.seatindex;
          if (self.seats[seatIndex].userid > 0) self.seats[seatIndex].online = true; else {
            data.online = true;
            self.seats[seatIndex] = data;
          }
          self.dispatchEvent("new_user", self.seats[seatIndex]);
        });
        cc.vv.net.addHandler("user_state_push", function(data) {
          var userId = data.userid;
          var seat = self.getSeatByID(userId);
          seat.online = data.online;
          self.dispatchEvent("user_state_changed", seat);
        });
        cc.vv.net.addHandler("user_ready_push", function(data) {
          var userId = data.userid;
          var seat = self.getSeatByID(userId);
          seat.ready = data.ready;
          self.dispatchEvent("user_state_changed", seat);
        });
        cc.vv.net.addHandler("game_holds_push", function(data) {
          var seat = self.seats[self.seatIndex];
          console.log(data);
          seat.holds = data;
          for (var i = 0; i < self.seats.length; ++i) {
            var s = self.seats[i];
            null == s.folds && (s.folds = []);
            null == s.pengs && (s.pengs = []);
            null == s.angangs && (s.angangs = []);
            null == s.diangangs && (s.diangangs = []);
            null == s.wangangs && (s.wangangs = []);
            s.ready = false;
          }
          self.dispatchEvent("game_holds");
        });
        cc.vv.net.addHandler("game_begin_push", function(data) {
          console.log("game_action_push");
          console.log(data);
          self.button = data;
          self.turn = self.button;
          self.gamestate = "begin";
          self.dispatchEvent("game_begin");
        });
        cc.vv.net.addHandler("game_playing_push", function(data) {
          console.log("game_playing_push");
          self.gamestate = "playing";
          self.dispatchEvent("game_playing");
        });
        cc.vv.net.addHandler("game_sync_push", function(data) {
          console.log("game_sync_push");
          console.log(data);
          self.numOfMJ = data.numofmj;
          self.gamestate = data.state;
          "dingque" == self.gamestate ? self.isDingQueing = true : "huanpai" == self.gamestate && (self.isHuanSanZhang = true);
          self.turn = data.turn;
          self.button = data.button;
          self.chupai = data.chuPai;
          self.huanpaimethod = data.huanpaimethod;
          for (var i = 0; i < 4; ++i) {
            var seat = self.seats[i];
            var sd = data.seats[i];
            seat.holds = sd.holds;
            seat.folds = sd.folds;
            seat.angangs = sd.angangs;
            seat.diangangs = sd.diangangs;
            seat.wangangs = sd.wangangs;
            seat.pengs = sd.pengs;
            seat.dingque = sd.que;
            seat.hued = sd.hued;
            seat.iszimo = sd.iszimo;
            seat.huinfo = sd.huinfo;
            seat.huanpais = sd.huanpais;
            i == self.seatIndex && (self.dingque = sd.que);
          }
        });
        cc.vv.net.addHandler("game_dingque_push", function(data) {
          self.isDingQueing = true;
          self.isHuanSanZhang = false;
          self.dispatchEvent("game_dingque");
        });
        cc.vv.net.addHandler("", function(data) {});
        cc.vv.net.addHandler("game_huanpai_push", function(data) {
          self.isHuanSanZhang = true;
          self.dispatchEvent("game_huanpai");
        });
        cc.vv.net.addHandler("hangang_notify_push", function(data) {
          self.dispatchEvent("hangang_notify", data);
        });
        cc.vv.net.addHandler("game_action_push", function(data) {
          self.curaction = data;
          console.log(data);
          self.dispatchEvent("game_action", data);
        });
        cc.vv.net.addHandler("game_chupai_push", function(data) {
          console.log("game_chupai_push");
          var turnUserID = data;
          var si = self.getSeatIndexByID(turnUserID);
          self.doTurnChange(si);
        });
        cc.vv.net.addHandler("game_num_push", function(data) {
          self.numOfGames = data;
          self.dispatchEvent("game_num", data);
        });
        cc.vv.net.addHandler("game_over_push", function(data) {
          console.log("game_over_push");
          var results = data.results;
          for (var i = 0; i < self.seats.length; ++i) self.seats[i].score = 0 == results.length ? 0 : results[i].totalscore;
          self.dispatchEvent("game_over", results);
          if (data.endinfo) {
            self.isOver = true;
            self.dispatchEvent("game_end", data.endinfo);
          }
          self.reset();
          for (var i = 0; i < self.seats.length; ++i) self.dispatchEvent("user_state_changed", self.seats[i]);
        });
        cc.vv.net.addHandler("mj_count_push", function(data) {
          console.log("mj_count_push");
          self.numOfMJ = data;
          self.dispatchEvent("mj_count", data);
        });
        cc.vv.net.addHandler("hu_push", function(data) {
          console.log("hu_push");
          console.log(data);
          self.doHu(data);
        });
        cc.vv.net.addHandler("game_chupai_notify_push", function(data) {
          var userId = data.userId;
          var pai = data.pai;
          var si = self.getSeatIndexByID(userId);
          self.doChupai(si, pai);
        });
        cc.vv.net.addHandler("game_mopai_push", function(data) {
          console.log("game_mopai_push");
          self.doMopai(self.seatIndex, data);
        });
        cc.vv.net.addHandler("guo_notify_push", function(data) {
          console.log("guo_notify_push");
          var userId = data.userId;
          var pai = data.pai;
          var si = self.getSeatIndexByID(userId);
          self.doGuo(si, pai);
        });
        cc.vv.net.addHandler("guo_result", function(data) {
          console.log("guo_result");
          self.dispatchEvent("guo_result");
        });
        cc.vv.net.addHandler("guohu_push", function(data) {
          console.log("guohu_push");
          self.dispatchEvent("push_notice", {
            info: "\u8fc7\u80e1",
            time: 1.5
          });
        });
        cc.vv.net.addHandler("huanpai_notify", function(data) {
          var seat = self.getSeatByID(data.si);
          seat.huanpais = data.huanpais;
          self.dispatchEvent("huanpai_notify", seat);
        });
        cc.vv.net.addHandler("game_huanpai_over_push", function(data) {
          console.log("game_huanpai_over_push");
          var info = "";
          var method = data.method;
          info = 0 == method ? "\u6362\u5bf9\u5bb6\u724c" : 1 == method ? "\u6362\u4e0b\u5bb6\u724c" : "\u6362\u4e0a\u5bb6\u724c";
          self.huanpaimethod = method;
          cc.vv.gameNetMgr.isHuanSanZhang = false;
          self.dispatchEvent("game_huanpai_over");
          self.dispatchEvent("push_notice", {
            info: info,
            time: 2
          });
        });
        cc.vv.net.addHandler("peng_notify_push", function(data) {
          console.log("peng_notify_push");
          console.log(data);
          var userId = data.userid;
          var pai = data.pai;
          var si = self.getSeatIndexByID(userId);
          self.doPeng(si, data.pai);
        });
        cc.vv.net.addHandler("gang_notify_push", function(data) {
          console.log("gang_notify_push");
          console.log(data);
          var userId = data.userid;
          var pai = data.pai;
          var si = self.getSeatIndexByID(userId);
          self.doGang(si, pai, data.gangtype);
        });
        cc.vv.net.addHandler("game_dingque_notify_push", function(data) {
          self.dispatchEvent("game_dingque_notify", data);
        });
        cc.vv.net.addHandler("game_dingque_finish_push", function(data) {
          for (var i = 0; i < data.length; ++i) self.seats[i].dingque = data[i];
          self.dispatchEvent("game_dingque_finish", data);
        });
        cc.vv.net.addHandler("chat_push", function(data) {
          self.dispatchEvent("chat_push", data);
        });
        cc.vv.net.addHandler("quick_chat_push", function(data) {
          self.dispatchEvent("quick_chat_push", data);
        });
        cc.vv.net.addHandler("emoji_push", function(data) {
          self.dispatchEvent("emoji_push", data);
        });
        cc.vv.net.addHandler("dissolve_notice_push", function(data) {
          console.log("dissolve_notice_push");
          console.log(data);
          self.dissoveData = data;
          self.dispatchEvent("dissolve_notice", data);
        });
        cc.vv.net.addHandler("dissolve_cancel_push", function(data) {
          self.dissoveData = null;
          self.dispatchEvent("dissolve_cancel", data);
        });
        cc.vv.net.addHandler("voice_msg_push", function(data) {
          self.dispatchEvent("voice_msg", data);
        });
      },
      doGuo: function doGuo(seatIndex, pai) {
        var seatData = this.seats[seatIndex];
        var folds = seatData.folds;
        folds.push(pai);
        this.dispatchEvent("guo_notify", seatData);
      },
      doMopai: function doMopai(seatIndex, pai) {
        var seatData = this.seats[seatIndex];
        if (seatData.holds) {
          seatData.holds.push(pai);
          this.dispatchEvent("game_mopai", {
            seatIndex: seatIndex,
            pai: pai
          });
        }
      },
      doChupai: function doChupai(seatIndex, pai) {
        this.chupai = pai;
        var seatData = this.seats[seatIndex];
        if (seatData.holds) {
          var idx = seatData.holds.indexOf(pai);
          seatData.holds.splice(idx, 1);
        }
        this.dispatchEvent("game_chupai_notify", {
          seatData: seatData,
          pai: pai
        });
      },
      doPeng: function doPeng(seatIndex, pai) {
        var seatData = this.seats[seatIndex];
        if (seatData.holds) for (var i = 0; i < 2; ++i) {
          var idx = seatData.holds.indexOf(pai);
          seatData.holds.splice(idx, 1);
        }
        var pengs = seatData.pengs;
        pengs.push(pai);
        this.dispatchEvent("peng_notify", seatData);
      },
      getGangType: function getGangType(seatData, pai) {
        if (-1 != seatData.pengs.indexOf(pai)) return "wangang";
        var cnt = 0;
        for (var i = 0; i < seatData.holds.length; ++i) seatData.holds[i] == pai && cnt++;
        return 3 == cnt ? "diangang" : "angang";
      },
      doGang: function doGang(seatIndex, pai, gangtype) {
        var seatData = this.seats[seatIndex];
        gangtype || (gangtype = this.getGangType(seatData, pai));
        if ("wangang" == gangtype) {
          if (-1 != seatData.pengs.indexOf(pai)) {
            var idx = seatData.pengs.indexOf(pai);
            -1 != idx && seatData.pengs.splice(idx, 1);
          }
          seatData.wangangs.push(pai);
        }
        if (seatData.holds) for (var i = 0; i <= 4; ++i) {
          var idx = seatData.holds.indexOf(pai);
          if (-1 == idx) break;
          seatData.holds.splice(idx, 1);
        }
        "angang" == gangtype ? seatData.angangs.push(pai) : "diangang" == gangtype && seatData.diangangs.push(pai);
        this.dispatchEvent("gang_notify", {
          seatData: seatData,
          gangtype: gangtype
        });
      },
      doHu: function doHu(data) {
        this.dispatchEvent("hupai", data);
      },
      doTurnChange: function doTurnChange(si) {
        var data = {
          last: this.turn,
          turn: si
        };
        this.turn = si;
        this.dispatchEvent("game_chupai", data);
      },
      connectGameServer: function connectGameServer(data) {
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;
        var onConnectOK = function onConnectOK() {
          console.log("onConnectOK");
          var sd = {
            token: data.token,
            roomid: data.roomid,
            time: data.time,
            sign: data.sign
          };
          cc.vv.net.send("login", sd);
        };
        var onConnectFailed = function onConnectFailed() {
          console.log("failed.");
          cc.vv.wc.hide();
        };
        cc.vv.wc.show("\u6b63\u5728\u8fdb\u5165\u623f\u95f4");
        cc.vv.net.connect(onConnectOK, onConnectFailed);
      }
    });
    cc._RF.pop();
  }, {} ],
  GameOver: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "facfdljnx5F+rFDAq5Qbmqa", "GameOver");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _gameover: null,
        _gameresult: null,
        _seats: [],
        _isGameEnd: false,
        _pingju: null,
        _win: null,
        _lose: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        if (null == cc.vv.gameNetMgr.conf) return;
        "xzdd" == cc.vv.gameNetMgr.conf.type ? this._gameover = this.node.getChildByName("game_over") : "xlch" == cc.vv.gameNetMgr.conf.type ? this._gameover = this.node.getChildByName("game_over_xlch") : this._gameover = this.node.getChildByName("game_over_rzmj");
        this._gameover.active = false;
        this._pingju = this._gameover.getChildByName("pingju");
        this._win = this._gameover.getChildByName("win");
        this._lose = this._gameover.getChildByName("lose");
        this._gameresult = this.node.getChildByName("game_result");
        var wanfa = this._gameover.getChildByName("wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
        var listRoot = this._gameover.getChildByName("result_list");
        for (var i = 1; i <= 4; ++i) {
          var s = "s" + i;
          var sn = listRoot.getChildByName(s);
          var viewdata = {};
          viewdata.username = sn.getChildByName("username").getComponent(cc.Label);
          viewdata.reason = sn.getChildByName("reason").getComponent(cc.Label);
          var f = sn.getChildByName("fan");
          null != f && (viewdata.fan = f.getComponent(cc.Label));
          viewdata.score = sn.getChildByName("score").getComponent(cc.Label);
          viewdata.hu = sn.getChildByName("hu");
          viewdata.mahjongs = sn.getChildByName("pai");
          viewdata.zhuang = sn.getChildByName("zhuang");
          viewdata.hupai = sn.getChildByName("hupai");
          viewdata._pengandgang = [];
          this._seats.push(viewdata);
        }
        var self = this;
        this.node.on("game_over", function(data) {
          self.onGameOver(data);
        });
        this.node.on("game_end", function(data) {
          self._isGameEnd = true;
        });
      },
      onGameOver: function onGameOver(data) {
        "xzdd" == cc.vv.gameNetMgr.conf.type ? this.onGameOver_XZDD(data) : "xlch" == cc.vv.gameNetMgr.conf.type ? this.onGameOver_XLCH(data) : this.onGameOver_XZDD(data);
      },
      onGameOver_XZDD: function onGameOver_XZDD(data) {
        console.log(data);
        if (0 == data.length) {
          this._gameresult.active = true;
          return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        myscore > 0 ? this._win.active = true : myscore < 0 ? this._lose.active = true : this._pingju.active = true;
        for (var i = 0; i < 4; ++i) {
          var seatView = this._seats[i];
          var userData = data[i];
          var hued = false;
          var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
          var numOfGen = userData.numofgen;
          var actionArr = [];
          var is7pairs = false;
          var ischadajiao = false;
          for (var j = 0; j < userData.actions.length; ++j) {
            var ac = userData.actions[j];
            if ("zimo" == ac.type || "ganghua" == ac.type || "dianganghua" == ac.type || "hu" == ac.type || "gangpaohu" == ac.type || "qiangganghu" == ac.type || "chadajiao" == ac.type) {
              "7pairs" == userData.pattern ? actionArr.push("\u4e03\u5bf9") : "l7pairs" == userData.pattern ? actionArr.push("\u9f99\u4e03\u5bf9") : "j7pairs" == userData.pattern ? actionArr.push("\u5c06\u4e03\u5bf9") : "duidui" == userData.pattern ? actionArr.push("\u78b0\u78b0\u80e1") : "jiangdui" == userData.pattern && actionArr.push("\u5c06\u5bf9");
              "zimo" == ac.type ? actionArr.push("\u81ea\u6478") : "ganghua" == ac.type ? actionArr.push("\u6760\u4e0a\u82b1") : "dianganghua" == ac.type ? actionArr.push("\u70b9\u6760\u82b1") : "gangpaohu" == ac.type ? actionArr.push("\u6760\u70ae\u80e1") : "qiangganghu" == ac.type ? actionArr.push("\u62a2\u6760\u80e1") : "chadajiao" == ac.type && (ischadajiao = true);
              hued = true;
            } else "fangpao" == ac.type ? actionArr.push("\u653e\u70ae") : "angang" == ac.type ? actionArr.push("\u6697\u6760") : "diangang" == ac.type ? actionArr.push("\u660e\u6760") : "wangang" == ac.type ? actionArr.push("\u5f2f\u6760") : "fanggang" == ac.type ? actionArr.push("\u653e\u6760") : "zhuanshougang" == ac.type ? actionArr.push("\u8f6c\u624b\u6760") : "beiqianggang" == ac.type ? actionArr.push("\u88ab\u62a2\u6760") : "beichadajiao" == ac.type && actionArr.push("\u88ab\u67e5\u53eb");
          }
          if (hued) {
            userData.qingyise && actionArr.push("\u6e05\u4e00\u8272");
            userData.menqing && actionArr.push("\u95e8\u6e05");
            userData.zhongzhang && actionArr.push("\u4e2d\u5f20");
            userData.jingouhu && actionArr.push("\u91d1\u94a9\u80e1");
            userData.haidihu && actionArr.push("\u6d77\u5e95\u80e1");
            userData.tianhu && actionArr.push("\u5929\u80e1");
            userData.dihu && actionArr.push("\u5730\u80e1");
            numOfGen > 0 && actionArr.push("\u6839x" + numOfGen);
            ischadajiao && actionArr.push("\u67e5\u5927\u53eb");
          }
          for (var o = 0; o < 3; ++o) seatView.hu.children[o].active = false;
          userData.huorder >= 0 && (seatView.hu.children[userData.huorder].active = true);
          seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
          seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
          seatView.reason.string = actionArr.join("\u3001");
          var fan = 0;
          hued && (fan = userData.fan);
          seatView.fan.string = fan + "\u756a";
          userData.score > 0 ? seatView.score.string = "+" + userData.score : seatView.score.string = userData.score;
          var hupai = -1;
          hued && (hupai = userData.holds.pop());
          cc.vv.mahjongmgr.sortMJ(userData.holds, userData.dingque);
          hued && userData.holds.push(hupai);
          for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
            var n = seatView.mahjongs.children[k];
            n.active = false;
          }
          var lackingNum = 3 * (userData.pengs.length + numOfGangs);
          for (var k = 0; k < userData.holds.length; ++k) {
            var pai = userData.holds[k];
            var n = seatView.mahjongs.children[k + lackingNum];
            n.active = true;
            var sprite = n.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", pai);
          }
          for (var k = 0; k < seatView._pengandgang.length; ++k) seatView._pengandgang[k].active = false;
          var index = 0;
          var gangs = userData.angangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "angang");
            index++;
          }
          var gangs = userData.diangangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "diangang");
            index++;
          }
          var gangs = userData.wangangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "wangang");
            index++;
          }
          var pengs = userData.pengs;
          if (pengs) for (var k = 0; k < pengs.length; ++k) {
            var mjid = pengs[k];
            this.initPengAndGangs(seatView, index, mjid, "peng");
            index++;
          }
        }
      },
      onGameOver_RZMJ: function onGameOver_RZMJ(data) {
        console.log(data);
        if (0 == data.length) {
          this._gameresult.active = true;
          return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        myscore > 0 ? this._win.active = true : myscore < 0 ? this._lose.active = true : this._pingju.active = true;
        for (var i = 0; i < 4; ++i) {
          var seatView = this._seats[i];
          var userData = data[i];
          var hued = false;
          var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
          var numOfGen = userData.numofgen;
          var actionArr = [];
          var is7pairs = false;
          var ischadajiao = false;
          for (var j = 0; j < userData.actions.length; ++j) {
            var ac = userData.actions[j];
            if ("zimo" == ac.type || "ganghua" == ac.type || "dianganghua" == ac.type || "hu" == ac.type || "gangpaohu" == ac.type || "qiangganghu" == ac.type || "chadajiao" == ac.type) {
              "7pairs" == userData.pattern ? actionArr.push("\u4e03\u5bf9") : "l7pairs" == userData.pattern ? actionArr.push("\u9f99\u4e03\u5bf9") : "j7pairs" == userData.pattern ? actionArr.push("\u5c06\u4e03\u5bf9") : "duidui" == userData.pattern ? actionArr.push("\u78b0\u78b0\u80e1") : "jiangdui" == userData.pattern && actionArr.push("\u5c06\u5bf9");
              "zimo" == ac.type ? actionArr.push("\u81ea\u6478") : "ganghua" == ac.type ? actionArr.push("\u6760\u4e0a\u82b1") : "dianganghua" == ac.type ? actionArr.push("\u70b9\u6760\u82b1") : "gangpaohu" == ac.type ? actionArr.push("\u6760\u70ae\u80e1") : "qiangganghu" == ac.type ? actionArr.push("\u62a2\u6760\u80e1") : "chadajiao" == ac.type && (ischadajiao = true);
              hued = true;
            } else "fangpao" == ac.type ? actionArr.push("\u653e\u70ae") : "angang" == ac.type ? actionArr.push("\u6697\u6760") : "diangang" == ac.type ? actionArr.push("\u660e\u6760") : "wangang" == ac.type ? actionArr.push("\u5f2f\u6760") : "fanggang" == ac.type ? actionArr.push("\u653e\u6760") : "zhuanshougang" == ac.type ? actionArr.push("\u8f6c\u624b\u6760") : "beiqianggang" == ac.type ? actionArr.push("\u88ab\u62a2\u6760") : "beichadajiao" == ac.type && actionArr.push("\u88ab\u67e5\u53eb");
          }
          if (hued) {
            userData.qingyise && actionArr.push("\u6e05\u4e00\u8272");
            userData.menqing && actionArr.push("\u95e8\u6e05");
            userData.zhongzhang && actionArr.push("\u4e2d\u5f20");
            userData.jingouhu && actionArr.push("\u91d1\u94a9\u80e1");
            userData.haidihu && actionArr.push("\u6d77\u5e95\u80e1");
            userData.tianhu && actionArr.push("\u5929\u80e1");
            userData.dihu && actionArr.push("\u5730\u80e1");
            numOfGen > 0 && actionArr.push("\u6839x" + numOfGen);
            ischadajiao && actionArr.push("\u67e5\u5927\u53eb");
          }
          for (var o = 0; o < 3; ++o) seatView.hu.children[o].active = false;
          userData.huorder >= 0 && (seatView.hu.children[userData.huorder].active = true);
          seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
          seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
          seatView.reason.string = actionArr.join("\u3001");
          var fan = 0;
          hued && (fan = userData.fan);
          seatView.fan.string = fan + "\u756a";
          userData.score > 0 ? seatView.score.string = "+" + userData.score : seatView.score.string = userData.score;
          var hupai = -1;
          hued && (hupai = userData.holds.pop());
          cc.vv.mahjongmgr.sortMJ(userData.holds, userData.dingque);
          hued && userData.holds.push(hupai);
          for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
            var n = seatView.mahjongs.children[k];
            n.active = false;
          }
          var lackingNum = 3 * (userData.pengs.length + numOfGangs);
          for (var k = 0; k < userData.holds.length; ++k) {
            var pai = userData.holds[k];
            var n = seatView.mahjongs.children[k + lackingNum];
            n.active = true;
            var sprite = n.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", pai);
          }
          for (var k = 0; k < seatView._pengandgang.length; ++k) seatView._pengandgang[k].active = false;
          var index = 0;
          var gangs = userData.angangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "angang");
            index++;
          }
          var gangs = userData.diangangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "diangang");
            index++;
          }
          var gangs = userData.wangangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "wangang");
            index++;
          }
          var pengs = userData.pengs;
          if (pengs) for (var k = 0; k < pengs.length; ++k) {
            var mjid = pengs[k];
            this.initPengAndGangs(seatView, index, mjid, "peng");
            index++;
          }
        }
      },
      onGameOver_XLCH: function onGameOver_XLCH(data) {
        console.log(data);
        if (0 == data.length) {
          this._gameresult.active = true;
          return;
        }
        this._gameover.active = true;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.vv.gameNetMgr.seatIndex].score;
        myscore > 0 ? this._win.active = true : myscore < 0 ? this._lose.active = true : this._pingju.active = true;
        for (var i = 0; i < 4; ++i) {
          var seatView = this._seats[i];
          var userData = data[i];
          var hued = false;
          var actionArr = [];
          var is7pairs = false;
          var ischadajiao = false;
          var hupaiRoot = seatView.hupai;
          for (var j = 0; j < hupaiRoot.children.length; ++j) hupaiRoot.children[j].active = false;
          var hi = 0;
          for (var j = 0; j < userData.huinfo.length; ++j) {
            var info = userData.huinfo[j];
            hued = hued || info.ishupai;
            if (info.ishupai && hi < hupaiRoot.children.length) {
              var hupaiView = hupaiRoot.children[hi];
              hupaiView.active = true;
              hupaiView.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_", info.pai);
              hi++;
            }
            var str = "";
            var sep = "";
            var dataseat = userData;
            if (info.ishupai) "hu" == info.action ? str = "\u63a5\u70ae\u80e1" : "zimo" == info.action ? str = "\u81ea\u6478" : "ganghua" == info.action ? str = "\u6760\u4e0a\u82b1" : "dianganghua" == info.action ? str = "\u70b9\u6760\u82b1" : "gangpaohu" == info.action ? str = "\u6760\u70ae\u80e1" : "qiangganghu" == info.action ? str = "\u62a2\u6760\u80e1" : "chadajiao" == info.action && (str = "\u67e5\u5927\u53eb"); else {
              str = "fangpao" == info.action ? "\u653e\u70ae" : "gangpao" == info.action ? "\u6760\u4e0a\u70ae" : "beiqianggang" == info.action ? "\u88ab\u62a2\u6760" : "\u88ab\u67e5\u5927\u53eb";
              dataseat = data[info.target];
              info = dataseat.huinfo[info.index];
            }
            str += "(";
            if ("7pairs" == info.pattern) {
              str += "\u4e03\u5bf9";
              sep = "\u3001";
            } else if ("l7pairs" == info.pattern) {
              str += "\u9f99\u4e03\u5bf9";
              sep = "\u3001";
            } else if ("j7pairs" == info.pattern) {
              str += "\u5c06\u4e03\u5bf9";
              sep = "\u3001";
            } else if ("duidui" == info.pattern) {
              str += "\u78b0\u78b0\u80e1";
              sep = "\u3001";
            } else if ("jiangdui" == info.pattern) {
              str += "\u5c06\u5bf9";
              sep = "\u3001";
            }
            if (info.haidihu) {
              str += sep + "\u6d77\u5e95\u80e1";
              sep = "\u3001";
            }
            if (info.tianhu) {
              str += sep + "\u5929\u80e1";
              sep = "\u3001";
            }
            if (info.dihu) {
              str += sep + "\u5730\u80e1";
              sep = "\u3001";
            }
            if (dataseat.qingyise) {
              str += sep + "\u6e05\u4e00\u8272";
              sep = "\u3001";
            }
            if (dataseat.menqing) {
              str += sep + "\u95e8\u6e05";
              sep = "\u3001";
            }
            if (dataseat.jingouhu) {
              str += sep + "\u91d1\u94a9\u80e1";
              sep = "\u3001";
            }
            if (dataseat.zhongzhang) {
              str += sep + "\u4e2d\u5f20";
              sep = "\u3001";
            }
            if (info.numofgen > 0) {
              str += sep + "\u6839x" + info.numofgen;
              sep = "\u3001";
            }
            "" == sep && (str += "\u5e73\u80e1");
            str += "\u3001" + info.fan + "\u756a";
            str += ")";
            actionArr.push(str);
          }
          seatView.hu.active = hued;
          userData.angangs.length && actionArr.push("\u6697\u6760x" + userData.angangs.length);
          userData.diangangs.length && actionArr.push("\u660e\u6760x" + userData.diangangs.length);
          userData.wangangs.length && actionArr.push("\u5df4\u6760x" + userData.wangangs.length);
          seatView.username.string = cc.vv.gameNetMgr.seats[i].name;
          seatView.zhuang.active = cc.vv.gameNetMgr.button == i;
          seatView.reason.string = actionArr.join("\u3001");
          userData.score > 0 ? seatView.score.string = "+" + userData.score : seatView.score.string = userData.score;
          for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
            var n = seatView.mahjongs.children[k];
            n.active = false;
          }
          cc.vv.mahjongmgr.sortMJ(userData.holds, userData.dingque);
          var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
          var lackingNum = 3 * (userData.pengs.length + numOfGangs);
          for (var k = 0; k < userData.holds.length; ++k) {
            var pai = userData.holds[k];
            var n = seatView.mahjongs.children[k + lackingNum];
            n.active = true;
            var sprite = n.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", pai);
          }
          for (var k = 0; k < seatView._pengandgang.length; ++k) seatView._pengandgang[k].active = false;
          var index = 0;
          var gangs = userData.angangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "angang");
            index++;
          }
          var gangs = userData.diangangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "diangang");
            index++;
          }
          var gangs = userData.wangangs;
          for (var k = 0; k < gangs.length; ++k) {
            var mjid = gangs[k];
            this.initPengAndGangs(seatView, index, mjid, "wangang");
            index++;
          }
          var pengs = userData.pengs;
          if (pengs) for (var k = 0; k < pengs.length; ++k) {
            var mjid = pengs[k];
            this.initPengAndGangs(seatView, index, mjid, "peng");
            index++;
          }
        }
      },
      initPengAndGangs: function initPengAndGangs(seatView, index, mjid, flag) {
        var pgroot = null;
        if (seatView._pengandgang.length <= index) {
          pgroot = cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
          seatView._pengandgang.push(pgroot);
          seatView.mahjongs.addChild(pgroot);
        } else {
          pgroot = seatView._pengandgang[index];
          pgroot.active = true;
        }
        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        for (var s = 0; s < sprites.length; ++s) {
          var sprite = sprites[s];
          if ("gang" == sprite.node.name) {
            var isGang = "peng" != flag;
            sprite.node.active = isGang;
            sprite.node.scaleX = 1;
            sprite.node.scaleY = 1;
            if ("angang" == flag) {
              sprite.spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame("myself");
              sprite.node.scaleX = 1.4;
              sprite.node.scaleY = 1.4;
            } else sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_", mjid);
          } else sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("B_", mjid);
        }
        pgroot.x = 55 * index * 3 + 10 * index;
      },
      onBtnReadyClicked: function onBtnReadyClicked() {
        console.log("onBtnReadyClicked");
        this._isGameEnd ? this._gameresult.active = true : cc.vv.net.send("ready");
        this._gameover.active = false;
      },
      onBtnShareClicked: function onBtnShareClicked() {
        console.log("onBtnShareClicked");
      }
    });
    cc._RF.pop();
  }, {} ],
  GameResult: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2b08d8pm0VBDLYlZIdfLuPS", "GameResult");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _gameresult: null,
        _seats: []
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this._gameresult = this.node.getChildByName("game_result");
        var seats = this._gameresult.getChildByName("seats");
        for (var i = 0; i < seats.children.length; ++i) this._seats.push(seats.children[i].getComponent("Seat"));
        var btnClose = cc.find("Canvas/game_result/btnClose");
        btnClose && cc.vv.utils.addClickEvent(btnClose, this.node, "GameResult", "onBtnCloseClicked");
        var btnShare = cc.find("Canvas/game_result/btnShare");
        btnShare && cc.vv.utils.addClickEvent(btnShare, this.node, "GameResult", "onBtnShareClicked");
        var self = this;
        this.node.on("game_end", function(data) {
          self.onGameEnd(data);
        });
      },
      showResult: function showResult(seat, info, isZuiJiaPaoShou) {
        seat.node.getChildByName("zuijiapaoshou").active = isZuiJiaPaoShou;
        seat.node.getChildByName("zimocishu").getComponent(cc.Label).string = info.numzimo;
        seat.node.getChildByName("jiepaocishu").getComponent(cc.Label).string = info.numjiepao;
        seat.node.getChildByName("dianpaocishu").getComponent(cc.Label).string = info.numdianpao;
        seat.node.getChildByName("angangcishu").getComponent(cc.Label).string = info.numangang;
        seat.node.getChildByName("minggangcishu").getComponent(cc.Label).string = info.numminggang;
        seat.node.getChildByName("chajiaocishu").getComponent(cc.Label).string = info.numchadajiao;
      },
      onGameEnd: function onGameEnd(endinfo) {
        var seats = cc.vv.gameNetMgr.seats;
        var maxscore = -1;
        var maxdianpao = 0;
        var dianpaogaoshou = -1;
        for (var i = 0; i < seats.length; ++i) {
          var seat = seats[i];
          seat.score > maxscore && (maxscore = seat.score);
          if (endinfo[i].numdianpao > maxdianpao) {
            maxdianpao = endinfo[i].numdianpao;
            dianpaogaoshou = i;
          }
        }
        for (var i = 0; i < seats.length; ++i) {
          var seat = seats[i];
          var isBigwin = false;
          seat.score > 0 && (isBigwin = seat.score == maxscore);
          this._seats[i].setInfo(seat.name, seat.score, isBigwin);
          this._seats[i].setID(seat.userid);
          var isZuiJiaPaoShou = dianpaogaoshou == i;
          this.showResult(this._seats[i], endinfo[i], isZuiJiaPaoShou);
        }
      },
      onBtnCloseClicked: function onBtnCloseClicked() {
        cc.director.loadScene("hall");
      },
      onBtnShareClicked: function onBtnShareClicked() {}
    });
    cc._RF.pop();
  }, {} ],
  Global: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24e30ZJLgdH3rs1R1CvqN8U", "Global");
    "use strict";
    var Global = cc.Class({
      extends: cc.Component,
      statics: {
        isstarted: false,
        netinited: false,
        userguid: 0,
        nickname: "",
        money: 0,
        lv: 0,
        roomId: 0
      }
    });
    cc._RF.pop();
  }, {} ],
  HTTP: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "90ae61J525JQIt5taF3Nce2", "HTTP");
    "use strict";
    var URL = "https://act.game.com:9000";
    cc.VERSION = 20161227;
    var HTTP = cc.Class({
      extends: cc.Component,
      statics: {
        sessionId: 0,
        userId: 0,
        master_url: URL,
        url: URL,
        sendRequest: function sendRequest(path, data, handler, extraUrl) {
          var xhr = cc.loader.getXMLHttpRequest();
          xhr.timeout = 5e3;
          var str = "?";
          for (var k in data) {
            "?" != str && (str += "&");
            str += k + "=" + data[k];
          }
          null == extraUrl && (extraUrl = HTTP.url);
          var requestURL = extraUrl + path + encodeURI(str);
          console.log("RequestURL:" + requestURL);
          xhr.open("GET", requestURL, true);
          cc.sys.isNative && xhr.setRequestHeader("Accept-Encoding", "gzip,deflate", "text/html;charset=UTF-8");
          xhr.onreadystatechange = function() {
            if (4 === xhr.readyState && xhr.status >= 200 && xhr.status < 300) {
              console.log("http res(" + xhr.responseText.length + "):" + xhr.responseText);
              try {
                var ret = JSON.parse(xhr.responseText);
                null !== handler && handler(ret);
              } catch (e) {
                console.log("err:" + e);
              } finally {
                cc.vv && cc.vv.wc;
              }
            }
          };
          cc.vv && cc.vv.wc;
          xhr.send();
          return xhr;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Hall: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6edb3jjx+FBepS1mk1xKDF2", "Hall");
    "use strict";
    var Net = require("Net");
    var Global = require("Global");
    cc.Class({
      extends: cc.Component,
      properties: {
        lblName: cc.Label,
        lblMoney: cc.Label,
        lblGems: cc.Label,
        lblID: cc.Label,
        lblNotice: cc.Label,
        joinGameWin: cc.Node,
        createRoomWin: cc.Node,
        settingsWin: cc.Node,
        helpWin: cc.Node,
        xiaoxiWin: cc.Node,
        btnJoinGame: cc.Node,
        btnReturnGame: cc.Node,
        sprHeadImg: cc.Sprite
      },
      initNetHandlers: function initNetHandlers() {
        var self = this;
      },
      onShare: function onShare() {
        cc.vv.anysdkMgr.share("\u8fbe\u8fbe\u9ebb\u5c06", "\u8fbe\u8fbe\u9ebb\u5c06\uff0c\u5305\u542b\u4e86\u8840\u6218\u5230\u5e95\u3001\u8840\u6d41\u6210\u6cb3\u7b49\u591a\u79cd\u56db\u5ddd\u6d41\u884c\u9ebb\u5c06\u73a9\u6cd5\u3002");
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
          var cvs = this.node.getComponent(cc.Canvas);
          cvs.fitHeight = true;
          cvs.fitWidth = true;
        }
        if (!cc.vv) {
          cc.director.loadScene("loading");
          return;
        }
        this.initLabels();
        if (null == cc.vv.gameNetMgr.roomId) {
          this.btnJoinGame.active = true;
          this.btnReturnGame.active = false;
        } else {
          this.btnJoinGame.active = false;
          this.btnReturnGame.active = true;
        }
        var roomId = cc.vv.userMgr.oldRoomId;
        if (null != roomId) {
          cc.vv.userMgr.oldRoomId = null;
          cc.vv.userMgr.enterRoom(roomId);
        }
        var imgLoader = this.sprHeadImg.node.getComponent("ImageLoader");
        imgLoader.setUserID(cc.vv.userMgr.userId);
        cc.vv.utils.addClickEvent(this.sprHeadImg.node, this.node, "Hall", "onBtnClicked");
        this.addComponent("UserInfoShow");
        this.initButtonHandler("Canvas/right_bottom/btn_shezhi");
        this.initButtonHandler("Canvas/right_bottom/btn_help");
        this.initButtonHandler("Canvas/right_bottom/btn_xiaoxi");
        this.helpWin.addComponent("OnBack");
        this.xiaoxiWin.addComponent("OnBack");
        cc.vv.userMgr.notice || (cc.vv.userMgr.notice = {
          version: null,
          msg: "\u6570\u636e\u8bf7\u6c42\u4e2d..."
        });
        cc.vv.userMgr.gemstip || (cc.vv.userMgr.gemstip = {
          version: null,
          msg: "\u6570\u636e\u8bf7\u6c42\u4e2d..."
        });
        this.lblNotice.string = cc.vv.userMgr.notice.msg;
        this.refreshInfo();
        this.refreshNotice();
        this.refreshGemsTip();
        cc.vv.audioMgr.playBGM("bgMain.mp3");
      },
      refreshInfo: function refreshInfo() {
        var self = this;
        var onGet = function onGet(ret) {
          0 !== ret.errcode ? console.log(ret.errmsg) : null != ret.gems && (this.lblGems.string = ret.gems);
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign
        };
        cc.vv.http.sendRequest("/get_user_status", data, onGet.bind(this));
      },
      refreshGemsTip: function refreshGemsTip() {
        var self = this;
        var onGet = function onGet(ret) {
          if (0 !== ret.errcode) console.log(ret.errmsg); else {
            cc.vv.userMgr.gemstip.version = ret.version;
            cc.vv.userMgr.gemstip.msg = ret.msg.replace("<newline>", "\n");
          }
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign,
          type: "fkgm",
          version: cc.vv.userMgr.gemstip.version
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
      },
      refreshNotice: function refreshNotice() {
        var self = this;
        var onGet = function onGet(ret) {
          if (0 !== ret.errcode) console.log(ret.errmsg); else {
            cc.vv.userMgr.notice.version = ret.version;
            cc.vv.userMgr.notice.msg = ret.msg;
            this.lblNotice.string = ret.msg;
          }
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign,
          type: "notice",
          version: cc.vv.userMgr.notice.version
        };
        cc.vv.http.sendRequest("/get_message", data, onGet.bind(this));
      },
      initButtonHandler: function initButtonHandler(btnPath) {
        var btn = cc.find(btnPath);
        cc.vv.utils.addClickEvent(btn, this.node, "Hall", "onBtnClicked");
      },
      initLabels: function initLabels() {
        this.lblName.string = cc.vv.userMgr.userName;
        this.lblMoney.string = cc.vv.userMgr.coins;
        this.lblGems.string = cc.vv.userMgr.gems;
        this.lblID.string = "ID:" + cc.vv.userMgr.userId;
      },
      onBtnClicked: function onBtnClicked(event) {
        "btn_shezhi" == event.target.name ? this.settingsWin.active = true : "btn_help" == event.target.name ? this.helpWin.active = true : "btn_xiaoxi" == event.target.name ? this.xiaoxiWin.active = true : "head" == event.target.name && cc.vv.userinfoShow.show(cc.vv.userMgr.userName, cc.vv.userMgr.userId, this.sprHeadImg, cc.vv.userMgr.sex, cc.vv.userMgr.ip);
      },
      onJoinGameClicked: function onJoinGameClicked() {
        this.joinGameWin.active = true;
      },
      onReturnGameClicked: function onReturnGameClicked() {
        cc.director.loadScene("mjgame");
      },
      onBtnAddGemsClicked: function onBtnAddGemsClicked() {
        cc.vv.alert.show("\u63d0\u793a", cc.vv.userMgr.gemstip.msg);
        this.refreshInfo();
      },
      onCreateRoomClicked: function onCreateRoomClicked() {
        if (null != cc.vv.gameNetMgr.roomId) {
          cc.vv.alert.show("\u63d0\u793a", "\u623f\u95f4\u5df2\u7ecf\u521b\u5efa!\n\u5fc5\u987b\u89e3\u6563\u5f53\u524d\u623f\u95f4\u624d\u80fd\u521b\u5efa\u65b0\u7684\u623f\u95f4");
          return;
        }
        console.log("onCreateRoomClicked");
        this.createRoomWin.active = true;
      },
      update: function update(dt) {
        var x = this.lblNotice.node.x;
        x -= 100 * dt;
        x + this.lblNotice.node.width < -1e3 && (x = 500);
        this.lblNotice.node.x = x;
        if (cc.vv && null != cc.vv.userMgr.roomData) {
          cc.vv.userMgr.enterRoom(cc.vv.userMgr.roomData);
          cc.vv.userMgr.roomData = null;
        }
      }
    });
    cc._RF.pop();
  }, {
    Global: "Global",
    Net: "Net"
  } ],
  History: [ function(require, module, exports) {
    (function(Buffer) {
      "use strict";
      cc._RF.push(module, "4d7bci0LUxMT6MJKXJDj89w", "History");
      "use strict";
      cc.Class({
        extends: cc.Component,
        properties: {
          HistoryItemPrefab: {
            default: null,
            type: cc.Prefab
          },
          _history: null,
          _viewlist: null,
          _content: null,
          _viewitemTemp: null,
          _historyData: null,
          _curRoomInfo: null,
          _emptyTip: null
        },
        onLoad: function onLoad() {
          this._history = this.node.getChildByName("history");
          this._history.active = false;
          this._emptyTip = this._history.getChildByName("emptyTip");
          this._emptyTip.active = true;
          this._viewlist = this._history.getChildByName("viewlist");
          this._content = cc.find("view/content", this._viewlist);
          this._viewitemTemp = this._content.children[0];
          this._content.removeChild(this._viewitemTemp);
          var node = cc.find("Canvas/btn_zhanji");
          this.addClickEvent(node, this.node, "History", "onBtnHistoryClicked");
          var node = cc.find("Canvas/history/btn_back");
          this.addClickEvent(node, this.node, "History", "onBtnBackClicked");
        },
        addClickEvent: function addClickEvent(node, target, component, handler) {
          var eventHandler = new cc.Component.EventHandler();
          eventHandler.target = target;
          eventHandler.component = component;
          eventHandler.handler = handler;
          var clickEvents = node.getComponent(cc.Button).clickEvents;
          clickEvents.push(eventHandler);
        },
        onBtnBackClicked: function onBtnBackClicked() {
          if (null == this._curRoomInfo) {
            this._historyData = null;
            this._history.active = false;
          } else this.initRoomHistoryList(this._historyData);
        },
        onBtnHistoryClicked: function onBtnHistoryClicked() {
          this._history.active = true;
          var self = this;
          cc.vv.userMgr.getHistoryList(function(data) {
            data.sort(function(a, b) {
              return a.time < b.time;
            });
            self._historyData = data;
            for (var i = 0; i < data.length; ++i) for (var j = 0; j < 4; ++j) {
              var s = data[i].seats[j];
              s.name = new Buffer(s.name, "base64").toString();
            }
            self.initRoomHistoryList(data);
          });
        },
        dateFormat: function dateFormat(time) {
          var date = new Date(time);
          var datetime = "{0}-{1}-{2} {3}:{4}:{5}";
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          month = month >= 10 ? month : "0" + month;
          var day = date.getDate();
          day = day >= 10 ? day : "0" + day;
          var h = date.getHours();
          h = h >= 10 ? h : "0" + h;
          var m = date.getMinutes();
          m = m >= 10 ? m : "0" + m;
          var s = date.getSeconds();
          s = s >= 10 ? s : "0" + s;
          datetime = datetime.format(year, month, day, h, m, s);
          return datetime;
        },
        initRoomHistoryList: function initRoomHistoryList(data) {
          for (var i = 0; i < data.length; ++i) {
            var node = this.getViewItem(i);
            node.idx = i;
            var titleId = "" + (i + 1);
            node.getChildByName("title").getComponent(cc.Label).string = titleId;
            node.getChildByName("roomNo").getComponent(cc.Label).string = "\u623f\u95f4ID:" + data[i].id;
            var datetime = this.dateFormat(1e3 * data[i].time);
            node.getChildByName("time").getComponent(cc.Label).string = datetime;
            var btnOp = node.getChildByName("btnOp");
            btnOp.idx = i;
            btnOp.getChildByName("Label").getComponent(cc.Label).string = "\u8be6\u60c5";
            for (var j = 0; j < 4; ++j) {
              var s = data[i].seats[j];
              var info = s.name + ":" + s.score;
              node.getChildByName("info" + j).getComponent(cc.Label).string = info;
            }
          }
          this._emptyTip.active = 0 == data.length;
          this.shrinkContent(data.length);
          this._curRoomInfo = null;
        },
        initGameHistoryList: function initGameHistoryList(roomInfo, data) {
          data.sort(function(a, b) {
            return a.create_time < b.create_time;
          });
          for (var i = 0; i < data.length; ++i) {
            var node = this.getViewItem(i);
            var idx = data.length - i - 1;
            node.idx = idx;
            var titleId = "" + (idx + 1);
            node.getChildByName("title").getComponent(cc.Label).string = titleId;
            node.getChildByName("roomNo").getComponent(cc.Label).string = "\u623f\u95f4ID:" + roomInfo.id;
            var datetime = this.dateFormat(1e3 * data[i].create_time);
            node.getChildByName("time").getComponent(cc.Label).string = datetime;
            var btnOp = node.getChildByName("btnOp");
            btnOp.idx = idx;
            btnOp.getChildByName("Label").getComponent(cc.Label).string = "\u56de\u653e";
            var result = JSON.parse(data[i].result);
            for (var j = 0; j < 4; ++j) {
              var s = roomInfo.seats[j];
              var info = s.name + ":" + result[j];
              node.getChildByName("info" + j).getComponent(cc.Label).string = info;
            }
          }
          this.shrinkContent(data.length);
          this._curRoomInfo = roomInfo;
        },
        getViewItem: function getViewItem(index) {
          var content = this._content;
          if (content.childrenCount > index) return content.children[index];
          var node = cc.instantiate(this._viewitemTemp);
          content.addChild(node);
          return node;
        },
        shrinkContent: function shrinkContent(num) {
          while (this._content.childrenCount > num) {
            var lastOne = this._content.children[this._content.childrenCount - 1];
            this._content.removeChild(lastOne, true);
          }
        },
        getGameListOfRoom: function getGameListOfRoom(idx) {
          var self = this;
          var roomInfo = this._historyData[idx];
          cc.vv.userMgr.getGamesOfRoom(roomInfo.uuid, function(data) {
            null != data && data.length > 0 && self.initGameHistoryList(roomInfo, data);
          });
        },
        getDetailOfGame: function getDetailOfGame(idx) {
          var self = this;
          var roomUUID = this._curRoomInfo.uuid;
          cc.vv.userMgr.getDetailOfGame(roomUUID, idx, function(data) {
            data.base_info = JSON.parse(data.base_info);
            data.action_records = JSON.parse(data.action_records);
            cc.vv.gameNetMgr.prepareReplay(self._curRoomInfo, data);
            cc.vv.replayMgr.init(data);
            cc.director.loadScene("mjgame");
          });
        },
        onViewItemClicked: function onViewItemClicked(event) {
          var idx = event.target.idx;
          console.log(idx);
          null == this._curRoomInfo ? this.getGameListOfRoom(idx) : this.getDetailOfGame(idx);
        },
        onBtnOpClicked: function onBtnOpClicked(event) {
          var idx = event.target.parent.idx;
          console.log(idx);
          null == this._curRoomInfo ? this.getGameListOfRoom(idx) : this.getDetailOfGame(idx);
        }
      });
      cc._RF.pop();
    }).call(this, require("buffer").Buffer);
  }, {
    buffer: 2
  } ],
  HotUpdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "17141EodNRM/4IpsE04IyCU", "HotUpdate");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        updatePanel: {
          default: null,
          type: cc.Node
        },
        manifestUrl: {
          default: null,
          url: cc.RawAsset
        },
        percent: {
          default: null,
          type: cc.Label
        },
        lblErr: {
          default: null,
          type: cc.Label
        }
      },
      checkCb: function checkCb(event) {
        cc.log("Code: " + event.getEventCode());
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          cc.log("No local manifest file found, hot update skipped.");
          cc.eventManager.removeListener(this._checkListener);
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          cc.log("Fail to download manifest file, hot update skipped.");
          cc.eventManager.removeListener(this._checkListener);
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          cc.log("Already up to date with the latest remote version.");
          cc.eventManager.removeListener(this._checkListener);
          this.lblErr.string += "\u6e38\u620f\u4e0d\u9700\u8981\u66f4\u65b0\n";
          cc.director.loadScene("loading");
          break;

         case jsb.EventAssetsManager.NEW_VERSION_FOUND:
          this._needUpdate = true;
          this.updatePanel.active = true;
          this.percent.string = "00.00%";
          cc.eventManager.removeListener(this._checkListener);
        }
        this.hotUpdate();
      },
      updateCb: function updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
         case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
          cc.log("No local manifest file found, hot update skipped.");
          failed = true;
          break;

         case jsb.EventAssetsManager.UPDATE_PROGRESSION:
          var percent = event.getPercent();
          var percentByFile = event.getPercentByFile();
          var msg = event.getMessage();
          msg && cc.log(msg);
          cc.log(percent.toFixed(2) + "%");
          this.percent.string = percent + "%";
          break;

         case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
         case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
          cc.log("Fail to download manifest file, hot update skipped.");
          failed = true;
          break;

         case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
          cc.log("Already up to date with the latest remote version.");
          failed = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FINISHED:
          cc.log("Update finished. " + event.getMessage());
          needRestart = true;
          break;

         case jsb.EventAssetsManager.UPDATE_FAILED:
          cc.log("Update failed. " + event.getMessage());
          this._failCount++;
          if (this._failCount < 5) this._am.downloadFailedAssets(); else {
            cc.log("Reach maximum fail count, exit update process");
            this._failCount = 0;
            failed = true;
          }
          break;

         case jsb.EventAssetsManager.ERROR_UPDATING:
          cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
          break;

         case jsb.EventAssetsManager.ERROR_DECOMPRESS:
          cc.log(event.getMessage());
        }
        if (failed) {
          cc.eventManager.removeListener(this._updateListener);
          this.updatePanel.active = false;
        }
        if (needRestart) {
          cc.eventManager.removeListener(this._updateListener);
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var newPaths = this._am.getLocalManifest().getSearchPaths();
          Array.prototype.unshift(searchPaths, newPaths);
          cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(searchPaths));
          jsb.fileUtils.setSearchPaths(searchPaths);
          this.lblErr.string += "\u6e38\u620f\u8d44\u6e90\u66f4\u65b0\u5b8c\u6bd5\n";
          cc.game.restart();
        }
      },
      hotUpdate: function hotUpdate() {
        if (this._am && this._needUpdate) {
          this.lblErr.string += "\u5f00\u59cb\u66f4\u65b0\u6e38\u620f\u8d44\u6e90...\n";
          this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
          cc.eventManager.addListener(this._updateListener, 1);
          this._failCount = 0;
          this._am.update();
        }
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative) return;
        this.lblErr.string += "\u68c0\u67e5\u6e38\u620f\u8d44\u6e90...\n";
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "tiantianqipai-asset";
        cc.log("Storage path for remote asset : " + storagePath);
        this.lblErr.string += storagePath + "\n";
        cc.log("Local manifest URL : " + this.manifestUrl);
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        this._am.retain();
        this._needUpdate = false;
        if (this._am.getLocalManifest().isLoaded()) {
          this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
          cc.eventManager.addListener(this._checkListener, 1);
          this._am.checkUpdate();
        }
      },
      onDestroy: function onDestroy() {
        this._am && this._am.release();
      }
    });
    cc._RF.pop();
  }, {} ],
  HuanSanZhang: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a096oAgU5HwrxX05ZPNYtW", "HuanSanZhang");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _huanpaitip: null,
        _huanpaiArr: []
      },
      onLoad: function onLoad() {
        this._huanpaitip = cc.find("Canvas/huansanzhang");
        this._huanpaitip.active = cc.vv.gameNetMgr.isHuanSanZhang;
        this._huanpaitip.active && this.showHuanpai(null == cc.vv.gameNetMgr.getSelfData().huanpais);
        this.initHuaipaiInfo();
        var btnOk = cc.find("Canvas/huansanzhang/btn_ok");
        btnOk && cc.vv.utils.addClickEvent(btnOk, this.node, "HuanSanZhang", "onHuanSanZhang");
        var self = this;
        this.node.on("game_huanpai", function(data) {
          self._huanpaitip.active = true;
          self.showHuanpai(true);
        });
        this.node.on("huanpai_notify", function(data) {
          data.seatindex == cc.vv.gameNetMgr.seatIndex && self.initHuaipaiInfo();
        });
        this.node.on("game_huanpai_over", function(data) {
          self._huanpaitip.active = false;
          for (var i = 0; i < self._huanpaiArr.length; ++i) self._huanpaiArr[i].y = 0;
          self._huanpaiArr = [];
          self.initHuaipaiInfo();
        });
        this.node.on("game_huanpai_result", function(data) {
          cc.vv.gameNetMgr.isHuanSanZhang = false;
          self._huanpaitip.active = false;
          for (var i = 0; i < self._huanpaiArr.length; ++i) self._huanpaiArr[i].y = 0;
          self._huanpaiArr = [];
        });
        this.node.on("mj_clicked", function(data) {
          var target = data;
          var idx = self._huanpaiArr.indexOf(target);
          if (-1 != idx) {
            target.y = 0;
            self._huanpaiArr.splice(idx, 1);
          } else if (self._huanpaiArr.length < 3) {
            self._huanpaiArr.push(target);
            target.y = 15;
          }
        });
      },
      showHuanpai: function showHuanpai(interactable) {
        this._huanpaitip.getChildByName("info").getComponent(cc.Label).string = "\u8bf7\u9009\u62e9\u4e09\u5f20\u4e00\u6837\u82b1\u8272\u7684\u724c";
        this._huanpaitip.getChildByName("btn_ok").getComponent(cc.Button).interactable = interactable;
        this._huanpaitip.getChildByName("mask").active = false;
      },
      initHuaipaiInfo: function initHuaipaiInfo() {
        var huaipaiinfo = cc.find("Canvas/game/huanpaiinfo");
        var seat = cc.vv.gameNetMgr.getSelfData();
        if (null == seat.huanpais) {
          huaipaiinfo.active = false;
          return;
        }
        huaipaiinfo.active = true;
        for (var i = 0; i < seat.huanpais.length; ++i) huaipaiinfo.getChildByName("hp" + (i + 1)).getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", seat.huanpais[i]);
        var hpm = huaipaiinfo.getChildByName("hpm");
        hpm.active = true;
        0 == cc.vv.gameNetMgr.huanpaimethod ? hpm.rotation = 90 : 1 == cc.vv.gameNetMgr.huanpaimethod ? hpm.rotation = 0 : 2 == cc.vv.gameNetMgr.huanpaimethod ? hpm.rotation = 180 : hpm.active = false;
      },
      onHuanSanZhang: function onHuanSanZhang(event) {
        if (3 != this._huanpaiArr.length) return;
        var type = null;
        for (var i = 0; i < this._huanpaiArr.length; ++i) {
          var pai = this._huanpaiArr[i].mjId;
          var nt = cc.vv.mahjongmgr.getMahjongType(pai);
          if (null == type) type = nt; else if (type != nt) return;
        }
        var data = {
          p1: this._huanpaiArr[0].mjId,
          p2: this._huanpaiArr[1].mjId,
          p3: this._huanpaiArr[2].mjId
        };
        this._huanpaitip.getChildByName("info").getComponent(cc.Label).string = "\u7b49\u5f85\u5176\u4ed6\u73a9\u5bb6\u9009\u724c...";
        this._huanpaitip.getChildByName("btn_ok").getComponent(cc.Button).interactable = false;
        this._huanpaitip.getChildByName("mask").active = true;
        cc.vv.net.send("huanpai", data);
      }
    });
    cc._RF.pop();
  }, {} ],
  ImageLoader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ed057Bgp8FHlJbGI+ljAN7d", "ImageLoader");
    "use strict";
    function loadImage(url, code, callback) {
      cc.loader.load(url, function(err, tex) {
        var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
        callback(code, spriteFrame);
      });
    }
    function getBaseInfo(userid, callback) {
      null == cc.vv.baseInfoMap && (cc.vv.baseInfoMap = {});
      null != cc.vv.baseInfoMap[userid] ? callback(userid, cc.vv.baseInfoMap[userid]) : cc.vv.http.sendRequest("/base_info", {
        userid: userid
      }, function(ret) {
        var url = null;
        ret.headimgurl && (url = ret.headimgurl + ".jpg");
        var info = {
          name: ret.name,
          sex: ret.sex,
          url: url
        };
        cc.vv.baseInfoMap[userid] = info;
        callback(userid, info);
      }, cc.vv.http.master_url);
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.setupSpriteFrame();
      },
      setUserID: function setUserID(userid) {
        if (false == cc.sys.isNative) return;
        if (!userid) return;
        null == cc.vv.images && (cc.vv.images = {});
        var self = this;
        getBaseInfo(userid, function(code, info) {
          info && info.url && loadImage(info.url, userid, function(err, spriteFrame) {
            self._spriteFrame = spriteFrame;
            self.setupSpriteFrame();
          });
        });
      },
      setupSpriteFrame: function setupSpriteFrame() {
        if (this._spriteFrame) {
          var spr = this.getComponent(cc.Sprite);
          spr && (spr.spriteFrame = this._spriteFrame);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  JoinGameInput: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "10a1c8jz95Ju4NnpkOWUfin", "JoinGameInput");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        nums: {
          default: [],
          type: [ cc.Label ]
        },
        _inputIndex: 0,
        lblJoinGameRoom: cc.Label
      },
      onLoad: function onLoad() {
        this.lblJoinGameRoom.node.color = new cc.Color().fromHEX("#A82121");
        this.lblJoinGameRoom.enableBold = true;
      },
      onEnable: function onEnable() {
        this.onResetClicked();
      },
      onInputFinished: function onInputFinished(roomId) {
        cc.vv.userMgr.enterRoom(roomId, function(ret) {
          if (0 == ret.errcode) this.node.active = false; else {
            var content = "\u623f\u95f4[" + roomId + "]\u4e0d\u5b58\u5728\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165!";
            4 == ret.errcode && (content = "\u623f\u95f4[" + roomId + "]\u5df2\u6ee1!");
            cc.vv.alert.show("\u63d0\u793a", content);
            this.onResetClicked();
          }
        }.bind(this));
      },
      onInput: function onInput(num) {
        if (this._inputIndex >= this.nums.length) return;
        this.nums[this._inputIndex].string = num;
        this._inputIndex += 1;
        if (this._inputIndex == this.nums.length) {
          var roomId = this.parseRoomID();
          console.log("ok:" + roomId);
          this.onInputFinished(roomId);
        }
      },
      onN0Clicked: function onN0Clicked() {
        this.onInput(0);
      },
      onN1Clicked: function onN1Clicked() {
        this.onInput(1);
      },
      onN2Clicked: function onN2Clicked() {
        this.onInput(2);
      },
      onN3Clicked: function onN3Clicked() {
        this.onInput(3);
      },
      onN4Clicked: function onN4Clicked() {
        this.onInput(4);
      },
      onN5Clicked: function onN5Clicked() {
        this.onInput(5);
      },
      onN6Clicked: function onN6Clicked() {
        this.onInput(6);
      },
      onN7Clicked: function onN7Clicked() {
        this.onInput(7);
      },
      onN8Clicked: function onN8Clicked() {
        this.onInput(8);
      },
      onN9Clicked: function onN9Clicked() {
        this.onInput(9);
      },
      onResetClicked: function onResetClicked() {
        for (var i = 0; i < this.nums.length; ++i) this.nums[i].string = "";
        this._inputIndex = 0;
      },
      onDelClicked: function onDelClicked() {
        if (this._inputIndex > 0) {
          this._inputIndex -= 1;
          this.nums[this._inputIndex].string = "";
        }
      },
      onCloseClicked: function onCloseClicked() {
        this.node.active = false;
      },
      parseRoomID: function parseRoomID() {
        var str = "";
        for (var i = 0; i < this.nums.length; ++i) str += this.nums[i].string;
        return str;
      }
    });
    cc._RF.pop();
  }, {} ],
  LoadingLogic: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "350d3Ry9aVIqJR27fP2H/z1", "LoadingLogic");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        tipLabel: cc.Label,
        _stateStr: "",
        _progress: 0,
        _splash: null,
        _isLoading: false
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
          var cvs = this.node.getComponent(cc.Canvas);
          cvs.fitHeight = true;
          cvs.fitWidth = true;
        }
        this.initMgr();
        this.tipLabel.string = this._stateStr;
        this._splash = cc.find("Canvas/splash");
        this._splash.active = false;
      },
      start: function start() {
        var self = this;
        var SHOW_TIME = 3e3;
        var FADE_TIME = 500;
        this.checkVersion();
      },
      initMgr: function initMgr() {
        cc.vv = {};
        var UserMgr = require("UserMgr");
        cc.vv.userMgr = new UserMgr();
        var ReplayMgr = require("ReplayMgr");
        cc.vv.replayMgr = new ReplayMgr();
        cc.vv.http = require("HTTP");
        cc.vv.global = require("Global");
        cc.vv.net = require("Net");
        var GameNetMgr = require("GameNetMgr");
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();
        var AnysdkMgr = require("AnysdkMgr");
        cc.vv.anysdkMgr = new AnysdkMgr();
        cc.vv.anysdkMgr.init();
        var VoiceMgr = require("VoiceMgr");
        cc.vv.voiceMgr = new VoiceMgr();
        cc.vv.voiceMgr.init();
        var AudioMgr = require("AudioMgr");
        cc.vv.audioMgr = new AudioMgr();
        cc.vv.audioMgr.init();
        var Utils = require("Utils");
        cc.vv.utils = new Utils();
        cc.args = this.urlParse();
      },
      urlParse: function urlParse() {
        var params = {};
        if (null == window.location) return params;
        var name, value;
        var str = window.location.href;
        var num = str.indexOf("?");
        str = str.substr(num + 1);
        var arr = str.split("&");
        for (var i = 0; i < arr.length; i++) {
          num = arr[i].indexOf("=");
          if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            params[name] = value;
          }
        }
        return params;
      },
      checkVersion: function checkVersion() {
        var self = this;
        var onGetVersion = function onGetVersion(ret) {
          if (null == ret.version) console.log("error."); else {
            cc.vv.SI = ret;
            ret.version != cc.VERSION ? cc.find("Canvas/alert").active = true : self.startPreloading();
          }
        };
        var xhr = null;
        var complete = false;
        var fnRequest = function fnRequest() {
          self._stateStr = "\u6b63\u5728\u8fde\u63a5\u670d\u52a1\u5668";
          xhr = cc.vv.http.sendRequest("/get_serverinfo", null, function(ret) {
            xhr = null;
            complete = true;
            onGetVersion(ret);
          });
          setTimeout(fn, 5e3);
        };
        var fn = function fn() {
          if (!complete) if (xhr) {
            xhr.abort();
            self._stateStr = "\u8fde\u63a5\u5931\u8d25\uff0c\u5373\u5c06\u91cd\u8bd5";
            setTimeout(function() {
              fnRequest();
            }, 5e3);
          } else fnRequest();
        };
        fn();
      },
      onBtnDownloadClicked: function onBtnDownloadClicked() {
        cc.sys.openURL(cc.vv.SI.appweb);
      },
      startPreloading: function startPreloading() {
        this._stateStr = "\u6b63\u5728\u52a0\u8f7d\u8d44\u6e90\uff0c\u8bf7\u7a0d\u5019";
        this._isLoading = true;
        var self = this;
        cc.loader.loadResDir("textures", function(completedCount, totalCount, item) {
          self._isLoading && (self._progress = completedCount / totalCount);
        }, function(err, assets) {
          self.onLoadComplete();
        });
      },
      onLoadComplete: function onLoadComplete() {
        this._isLoading = false;
        this._stateStr = "\u51c6\u5907\u767b\u9646";
        cc.director.loadScene("login");
        cc.loader.onComplete = null;
      },
      update: function update(dt) {
        if (0 == this._stateStr.length) return;
        this.tipLabel.string = this._stateStr + " ";
        if (this._isLoading) this.tipLabel.string += Math.floor(100 * this._progress) + "%"; else {
          var t = Math.floor(Date.now() / 1e3) % 4;
          for (var i = 0; i < t; ++i) this.tipLabel.string += ".";
        }
      }
    });
    cc._RF.pop();
  }, {
    AnysdkMgr: "AnysdkMgr",
    AudioMgr: "AudioMgr",
    GameNetMgr: "GameNetMgr",
    Global: "Global",
    HTTP: "HTTP",
    Net: "Net",
    ReplayMgr: "ReplayMgr",
    UserMgr: "UserMgr",
    Utils: "Utils",
    VoiceMgr: "VoiceMgr"
  } ],
  Login: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "572a7Qfh69N9ZLXkNthANfi", "Login");
    "use strict";
    String.prototype.format = function(args) {
      if (arguments.length > 0) {
        var result = this;
        if (1 == arguments.length && "object" == typeof args) for (var key in args) {
          var reg = new RegExp("({" + key + "})", "g");
          result = result.replace(reg, args[key]);
        } else for (var i = 0; i < arguments.length; i++) {
          if (void 0 == arguments[i]) return "";
          var reg = new RegExp("({[" + i + "]})", "g");
          result = result.replace(reg, arguments[i]);
        }
        return result;
      }
      return this;
    };
    cc.Class({
      extends: cc.Component,
      properties: {
        _mima: null,
        _mimaIndex: 0
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
          var cvs = this.node.getComponent(cc.Canvas);
          cvs.fitHeight = true;
          cvs.fitWidth = true;
        }
        if (!cc.vv) {
          cc.director.loadScene("loading");
          return;
        }
        cc.vv.http.url = cc.vv.http.master_url;
        cc.vv.net.addHandler("push_need_create_role", function() {
          console.log("onLoad:push_need_create_role");
          cc.director.loadScene("createrole");
        });
        cc.vv.audioMgr.playBGM("bgMain.mp3");
        this._mima = [ "A", "A", "B", "B", "A", "B", "A", "B", "A", "A", "A", "B", "B", "B" ];
        cc.sys.isNative && cc.sys.os != cc.sys.OS_WINDOWS || (cc.find("Canvas/btn_yk").active = true);
        cc.find("Canvas/btn_yk").active = true;
      },
      start: function start() {
        var account = cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");
        if (null != account && null != sign) {
          var ret = {
            errcode: 0,
            account: account,
            sign: sign
          };
          cc.vv.userMgr.onAuth(ret);
        }
      },
      onBtnQuickStartClicked: function onBtnQuickStartClicked() {
        cc.vv.userMgr.guestAuth();
      },
      onBtnWeichatClicked: function onBtnWeichatClicked() {
        var self = this;
        cc.vv.anysdkMgr.login();
      },
      onBtnMIMAClicked: function onBtnMIMAClicked(event) {
        cc.find("Canvas/btn_yk").active = true;
      }
    });
    cc._RF.pop();
  }, {} ],
  MJGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7fa8fcvrqFOj6lhh6xHzd3c", "MJGame");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        gameRoot: {
          default: null,
          type: cc.Node
        },
        prepareRoot: {
          default: null,
          type: cc.Node
        },
        _myMJArr: [],
        _options: null,
        _selectedMJ: null,
        _chupaiSprite: [],
        _mjcount: null,
        _gamecount: null,
        _hupaiTips: [],
        _hupaiLists: [],
        _playEfxs: [],
        _opts: []
      },
      onLoad: function onLoad() {
        if (!cc.sys.isNative && cc.sys.isMobile) {
          var cvs = this.node.getComponent(cc.Canvas);
          cvs.fitHeight = true;
          cvs.fitWidth = true;
        }
        if (!cc.vv) {
          cc.director.loadScene("loading");
          return;
        }
        this.addComponent("NoticeTip");
        this.addComponent("GameOver");
        "rzmj" != cc.vv.gameNetMgr.conf.type && this.addComponent("DingQue");
        this.addComponent("PengGangs");
        this.addComponent("MJRoom");
        this.addComponent("TimePointer");
        this.addComponent("GameResult");
        this.addComponent("Chat");
        this.addComponent("Folds");
        this.addComponent("ReplayCtrl");
        this.addComponent("PopupMgr");
        this.addComponent("HuanSanZhang");
        this.addComponent("ReConnect");
        this.addComponent("Voice");
        this.addComponent("UserInfoShow");
        this.initView();
        this.initEventHandlers();
        this.gameRoot.active = false;
        this.prepareRoot.active = true;
        this.initWanfaLabel();
        this.onGameBeign();
        cc.vv.audioMgr.playBGM("bgFight.mp3");
      },
      initView: function initView() {
        var gameChild = this.node.getChildByName("game");
        this._mjcount = gameChild.getChildByName("mjcount").getComponent(cc.Label);
        this._mjcount.string = "\u5269\u4f59" + cc.vv.gameNetMgr.numOfMJ + "\u5f20";
        this._gamecount = gameChild.getChildByName("gamecount").getComponent(cc.Label);
        this._gamecount.string = cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "\u5c40";
        var myselfChild = gameChild.getChildByName("myself");
        var myholds = myselfChild.getChildByName("holds");
        for (var i = 0; i < myholds.children.length; ++i) {
          var sprite = myholds.children[i].getComponent(cc.Sprite);
          this._myMJArr.push(sprite);
          sprite.spriteFrame = null;
        }
        var realwidth = cc.view.getVisibleSize().width;
        myholds.scaleX *= realwidth / 1280;
        myholds.scaleY *= realwidth / 1280;
        var sides = [ "myself", "right", "up", "left" ];
        for (var i = 0; i < sides.length; ++i) {
          var side = sides[i];
          var sideChild = gameChild.getChildByName(side);
          this._hupaiTips.push(sideChild.getChildByName("HuPai"));
          this._hupaiLists.push(sideChild.getChildByName("hupailist"));
          this._playEfxs.push(sideChild.getChildByName("play_efx").getComponent(cc.Animation));
          this._chupaiSprite.push(sideChild.getChildByName("ChuPai").children[0].getComponent(cc.Sprite));
          var opt = sideChild.getChildByName("opt");
          opt.active = false;
          var sprite = opt.getChildByName("pai").getComponent(cc.Sprite);
          var data = {
            node: opt,
            sprite: sprite
          };
          this._opts.push(data);
        }
        var opts = gameChild.getChildByName("ops");
        this._options = opts;
        this.hideOptions();
        this.hideChupai();
      },
      hideChupai: function hideChupai() {
        for (var i = 0; i < this._chupaiSprite.length; ++i) this._chupaiSprite[i].node.active = false;
      },
      initEventHandlers: function initEventHandlers() {
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        var self = this;
        this.node.on("game_holds", function(data) {
          self.initMahjongs();
          self.checkQueYiMen();
        });
        this.node.on("game_begin", function(data) {
          self.onGameBeign();
        });
        this.node.on("game_sync", function(data) {
          self.onGameBeign();
        });
        this.node.on("game_chupai", function(data) {
          self.hideChupai();
          self.checkQueYiMen();
          data.last != cc.vv.gameNetMgr.seatIndex && self.initMopai(data.last, null);
          cc.vv.replayMgr.isReplay() || data.turn == cc.vv.gameNetMgr.seatIndex || self.initMopai(data.turn, -1);
        });
        this.node.on("game_mopai", function(data) {
          self.hideChupai();
          data = data;
          var pai = data.pai;
          var localIndex = cc.vv.gameNetMgr.getLocalIndex(data.seatIndex);
          if (0 == localIndex) {
            var index = 13;
            var sprite = self._myMJArr[index];
            self.setSpriteFrameByMJID("M_", sprite, pai, index);
            sprite.node.mjId = pai;
          } else cc.vv.replayMgr.isReplay() && self.initMopai(data.seatIndex, pai);
        });
        this.node.on("game_action", function(data) {
          self.showAction(data);
        });
        this.node.on("hupai", function(data) {
          var data = data;
          var seatIndex = data.seatindex;
          var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
          var hupai = self._hupaiTips[localIndex];
          hupai.active = true;
          0 == localIndex && self.hideOptions();
          var seatData = cc.vv.gameNetMgr.seats[seatIndex];
          seatData.hued = true;
          if ("xlch" == cc.vv.gameNetMgr.conf.type) {
            hupai.getChildByName("sprHu").active = true;
            hupai.getChildByName("sprZimo").active = false;
            self.initHupai(localIndex, data.hupai);
            if (data.iszimo) if (seatData.seatindex == cc.vv.gameNetMgr.seatIndex) {
              seatData.holds.pop();
              self.initMahjongs();
            } else self.initOtherMahjongs(seatData);
          } else {
            hupai.getChildByName("sprHu").active = !data.iszimo;
            hupai.getChildByName("sprZimo").active = data.iszimo;
            data.iszimo && 0 == localIndex || self.initMopai(seatIndex, data.hupai);
          }
          if (true == cc.vv.replayMgr.isReplay() && "xlch" != cc.vv.gameNetMgr.conf.type) {
            var opt = self._opts[localIndex];
            opt.node.active = true;
            opt.sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", data.hupai);
          }
          data.iszimo ? self.playEfx(localIndex, "play_zimo") : self.playEfx(localIndex, "play_hu");
          cc.vv.audioMgr.playSFX("nv/hu.mp3");
        });
        this.node.on("mj_count", function(data) {
          self._mjcount.string = "\u5269\u4f59" + cc.vv.gameNetMgr.numOfMJ + "\u5f20";
        });
        this.node.on("game_num", function(data) {
          self._gamecount.string = cc.vv.gameNetMgr.numOfGames + "/" + cc.vv.gameNetMgr.maxNumOfGames + "\u5c40";
        });
        this.node.on("game_over", function(data) {
          self.gameRoot.active = false;
          self.prepareRoot.active = true;
        });
        this.node.on("game_chupai_notify", function(data) {
          console.log("\u51fa\u7684\u724c\u7684\u6570\u636e" + data);
          self.hideChupai();
          var seatData = data.seatData;
          seatData.seatindex == cc.vv.gameNetMgr.seatIndex ? self.initMahjongs() : self.initOtherMahjongs(seatData);
          self.showChupai();
          var audioUrl = cc.vv.mahjongmgr.getAudioURLByMJID(data.pai);
          cc.vv.audioMgr.playSFX(audioUrl);
        });
        this.node.on("guo_notify", function(data) {
          self.hideChupai();
          self.hideOptions();
          var seatData = data;
          seatData.seatindex == cc.vv.gameNetMgr.seatIndex && self.initMahjongs();
          cc.vv.audioMgr.playSFX("give.mp3");
        });
        this.node.on("guo_result", function(data) {
          self.hideOptions();
        });
        this.node.on("game_dingque_finish", function(data) {
          self.initMahjongs();
        });
        this.node.on("peng_notify", function(data) {
          self.hideChupai();
          var seatData = data;
          seatData.seatindex == cc.vv.gameNetMgr.seatIndex ? self.initMahjongs() : self.initOtherMahjongs(seatData);
          var localIndex = self.getLocalIndex(seatData.seatindex);
          self.playEfx(localIndex, "play_peng");
          cc.vv.audioMgr.playSFX("nv/peng.mp3");
          self.hideOptions();
        });
        this.node.on("gang_notify", function(data) {
          self.hideChupai();
          var data = data;
          var seatData = data.seatData;
          var gangtype = data.gangtype;
          seatData.seatindex == cc.vv.gameNetMgr.seatIndex ? self.initMahjongs() : self.initOtherMahjongs(seatData);
          var localIndex = self.getLocalIndex(seatData.seatindex);
          if ("wangang" == gangtype) {
            self.playEfx(localIndex, "play_guafeng");
            cc.vv.audioMgr.playSFX("guafeng.mp3");
          } else {
            self.playEfx(localIndex, "play_xiayu");
            cc.vv.audioMgr.playSFX("rain.mp3");
          }
        });
        this.node.on("hangang_notify", function(data) {
          var data = data;
          var localIndex = self.getLocalIndex(data);
          self.playEfx(localIndex, "play_gang");
          cc.vv.audioMgr.playSFX("nv/gang.mp3");
          self.hideOptions();
        });
      },
      showChupai: function showChupai() {
        var pai = cc.vv.gameNetMgr.chupai;
        if (pai >= 0) {
          var localIndex = this.getLocalIndex(cc.vv.gameNetMgr.turn);
          var sprite = this._chupaiSprite[localIndex];
          sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", pai);
          sprite.node.active = true;
        }
      },
      addOption: function addOption(btnName, pai) {
        for (var i = 0; i < this._options.childrenCount; ++i) {
          var child = this._options.children[i];
          if ("op" == child.name && false == child.active) {
            child.active = true;
            var sprite = child.getChildByName("opTarget").getComponent(cc.Sprite);
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID("M_", pai);
            var btn = child.getChildByName(btnName);
            btn.active = true;
            btn.pai = pai;
            return;
          }
        }
      },
      hideOptions: function hideOptions(data) {
        this._options.active = false;
        for (var i = 0; i < this._options.childrenCount; ++i) {
          var child = this._options.children[i];
          if ("op" == child.name) {
            child.active = false;
            child.getChildByName("btnPeng").active = false;
            child.getChildByName("btnGang").active = false;
            child.getChildByName("btnHu").active = false;
          }
        }
      },
      showAction: function showAction(data) {
        this._options.active && this.hideOptions();
        if (data && (data.hu || data.gang || data.peng)) {
          this._options.active = true;
          data.hu && this.addOption("btnHu", data.pai);
          data.peng && this.addOption("btnPeng", data.pai);
          if (data.gang) for (var i = 0; i < data.gangpai.length; ++i) {
            var gp = data.gangpai[i];
            this.addOption("btnGang", gp);
          }
        }
      },
      initWanfaLabel: function initWanfaLabel() {
        var wanfa = cc.find("Canvas/infobar/wanfa").getComponent(cc.Label);
        wanfa.string = cc.vv.gameNetMgr.getWanfa();
      },
      initHupai: function initHupai(localIndex, pai) {
        if ("xlch" == cc.vv.gameNetMgr.conf.type) {
          var hupailist = this._hupaiLists[localIndex];
          for (var i = 0; i < hupailist.children.length; ++i) {
            var hupainode = hupailist.children[i];
            if (false == hupainode.active) {
              var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
              hupainode.getComponent(cc.Sprite).spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, pai);
              hupainode.active = true;
              break;
            }
          }
        }
      },
      playEfx: function playEfx(index, name) {
        this._playEfxs[index].node.active = true;
        this._playEfxs[index].play(name);
      },
      onGameBeign: function onGameBeign() {
        for (var i = 0; i < this._playEfxs.length; ++i) this._playEfxs[i].node.active = false;
        for (var i = 0; i < this._hupaiLists.length; ++i) for (var j = 0; j < this._hupaiLists[i].childrenCount; ++j) this._hupaiLists[i].children[j].active = false;
        for (var i = 0; i < cc.vv.gameNetMgr.seats.length; ++i) {
          var seatData = cc.vv.gameNetMgr.seats[i];
          var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
          var hupai = this._hupaiTips[localIndex];
          hupai.active = seatData.hued;
          if (seatData.hued) {
            hupai.getChildByName("sprHu").active = !seatData.iszimo;
            hupai.getChildByName("sprZimo").active = seatData.iszimo;
          }
          if (seatData.huinfo) for (var j = 0; j < seatData.huinfo.length; ++j) {
            var info = seatData.huinfo[j];
            info.ishupai && this.initHupai(localIndex, info.pai);
          }
        }
        this.hideChupai();
        this.hideOptions();
        var sides = [ "right", "up", "left" ];
        var gameChild = this.node.getChildByName("game");
        for (var i = 0; i < sides.length; ++i) {
          var sideChild = gameChild.getChildByName(sides[i]);
          var holds = sideChild.getChildByName("holds");
          for (var j = 0; j < holds.childrenCount; ++j) {
            var nc = holds.children[j];
            nc.active = true;
            nc.scaleX = 1;
            nc.scaleY = 1;
            var sprite = nc.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.vv.mahjongmgr.holdsEmpty[i + 1];
          }
        }
        if ("" == cc.vv.gameNetMgr.gamestate && false == cc.vv.replayMgr.isReplay()) return;
        this.gameRoot.active = true;
        this.prepareRoot.active = false;
        this.initMahjongs();
        var seats = cc.vv.gameNetMgr.seats;
        for (var i in seats) {
          var seatData = seats[i];
          var localIndex = cc.vv.gameNetMgr.getLocalIndex(i);
          if (0 != localIndex) {
            this.initOtherMahjongs(seatData);
            i == cc.vv.gameNetMgr.turn ? this.initMopai(i, -1) : this.initMopai(i, null);
          }
        }
        this.showChupai();
        if (null != cc.vv.gameNetMgr.curaction) {
          this.showAction(cc.vv.gameNetMgr.curaction);
          cc.vv.gameNetMgr.curaction = null;
        }
        this.checkQueYiMen();
      },
      onMJClicked: function onMJClicked(event) {
        if (cc.vv.gameNetMgr.isHuanSanZhang) {
          this.node.emit("mj_clicked", event.target);
          return;
        }
        if (cc.vv.gameNetMgr.turn != cc.vv.gameNetMgr.seatIndex) {
          console.log("not your turn." + cc.vv.gameNetMgr.turn);
          return;
        }
        for (var i = 0; i < this._myMJArr.length; ++i) if (event.target == this._myMJArr[i].node) {
          if (event.target == this._selectedMJ) {
            console.log("\u6211\u7684\u724c\u7684ID" + this._selectedMJ.mjId);
            this.shoot(this._selectedMJ.mjId);
            this._selectedMJ.y = 0;
            this._selectedMJ = null;
            return;
          }
          null != this._selectedMJ && (this._selectedMJ.y = 0);
          event.target.y = 15;
          this._selectedMJ = event.target;
          return;
        }
      },
      shoot: function shoot(mjId) {
        if (null == mjId) {
          console.log("\u6211\u5411\u670d\u52a1\u5668\u4f20\u9001\u6211\u51fa\u7684\u724c" + mjId);
          return;
        }
        cc.vv.net.send("chupai", mjId);
      },
      getMJIndex: function getMJIndex(side, index) {
        if ("right" == side || "up" == side) return 13 - index;
        return index;
      },
      initMopai: function initMopai(seatIndex, pai) {
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");
        var lastIndex = this.getMJIndex(side, 13);
        var nc = holds.children[lastIndex];
        nc.scaleX = 1;
        nc.scaleY = 1;
        if (null == pai) nc.active = false; else if (pai >= 0) {
          nc.active = true;
          if ("up" == side) {
            nc.scaleX = .73;
            nc.scaleY = .73;
          }
          var sprite = nc.getComponent(cc.Sprite);
          sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, pai);
        } else if (null != pai) {
          nc.active = true;
          if ("up" == side) {
            nc.scaleX = 1;
            nc.scaleY = 1;
          }
          var sprite = nc.getComponent(cc.Sprite);
          sprite.spriteFrame = cc.vv.mahjongmgr.getHoldsEmptySpriteFrame(side);
        }
      },
      initEmptySprites: function initEmptySprites(seatIndex) {
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");
        var spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
        for (var i = 0; i < holds.childrenCount; ++i) {
          var nc = holds.children[i];
          nc.scaleX = 1;
          nc.scaleY = 1;
          var sprite = nc.getComponent(cc.Sprite);
          sprite.spriteFrame = spriteFrame;
        }
      },
      initOtherMahjongs: function initOtherMahjongs(seatData) {
        var localIndex = this.getLocalIndex(seatData.seatindex);
        if (0 == localIndex) return;
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        var sideHolds = sideRoot.getChildByName("holds");
        var num = seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length;
        num *= 3;
        for (var i = 0; i < num; ++i) {
          var idx = this.getMJIndex(side, i);
          sideHolds.children[idx].active = false;
        }
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        var holds = this.sortHolds(seatData);
        if (null != holds && holds.length > 0) {
          for (var i = 0; i < holds.length; ++i) {
            var idx = this.getMJIndex(side, i + num);
            var sprite = sideHolds.children[idx].getComponent(cc.Sprite);
            if ("up" == side) {
              sprite.node.scaleX = .73;
              sprite.node.scaleY = .73;
            }
            sprite.node.active = true;
            sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, holds[i]);
          }
          if (holds.length + num == 13) {
            var lasetIdx = this.getMJIndex(side, 13);
            sideHolds.children[lasetIdx].active = false;
          }
        }
      },
      sortHolds: function sortHolds(seatData) {
        var holds = seatData.holds;
        if (null == holds) return null;
        var mopai = null;
        var l = holds.length;
        2 != l && 5 != l && 8 != l && 11 != l && 14 != l || (mopai = holds.pop());
        var dingque = seatData.dingque;
        cc.vv.mahjongmgr.sortMJ(holds, dingque);
        null != mopai && holds.push(mopai);
        return holds;
      },
      initMahjongs: function initMahjongs() {
        var seats = cc.vv.gameNetMgr.seats;
        var seatData = seats[cc.vv.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if (null == holds) return;
        var lackingNum = 3 * (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length);
        for (var i = 0; i < holds.length; ++i) {
          var mjid = holds[i];
          var sprite = this._myMJArr[i + lackingNum];
          sprite.node.mjId = mjid;
          sprite.node.y = 0;
          this.setSpriteFrameByMJID("M_", sprite, mjid);
        }
        for (var i = 0; i < lackingNum; ++i) {
          var sprite = this._myMJArr[i];
          sprite.node.mjId = null;
          sprite.spriteFrame = null;
          sprite.node.active = false;
        }
        for (var i = lackingNum + holds.length; i < this._myMJArr.length; ++i) {
          var sprite = this._myMJArr[i];
          sprite.node.mjId = null;
          sprite.spriteFrame = null;
          sprite.node.active = false;
        }
      },
      setSpriteFrameByMJID: function setSpriteFrameByMJID(pre, sprite, mjid) {
        sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
      },
      checkQueYiMen: function checkQueYiMen() {
        if ("rzmj" != cc.vv.gameNetMgr.conf.type) if (null != cc.vv.gameNetMgr.conf && "xlch" == cc.vv.gameNetMgr.conf.type && cc.vv.gameNetMgr.getSelfData().hued) if (cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn) for (var i = 0; i < 14; ++i) {
          var sprite = this._myMJArr[i];
          true == sprite.node.active && (sprite.node.getComponent(cc.Button).interactable = 13 == i);
        } else for (var i = 0; i < 14; ++i) {
          var sprite = this._myMJArr[i];
          true == sprite.node.active && (sprite.node.getComponent(cc.Button).interactable = true);
        } else {
          var dingque = cc.vv.gameNetMgr.dingque;
          var hasQue = false;
          if (cc.vv.gameNetMgr.seatIndex == cc.vv.gameNetMgr.turn) for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            if (null != sprite.node.mjId) {
              var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
              if (type == dingque) {
                hasQue = true;
                break;
              }
            }
          }
          for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            if (null != sprite.node.mjId) {
              var type = cc.vv.mahjongmgr.getMahjongType(sprite.node.mjId);
              sprite.node.getComponent(cc.Button).interactable = !hasQue || type == dingque;
            }
          }
        }
      },
      getLocalIndex: function getLocalIndex(index) {
        var ret = (index - cc.vv.gameNetMgr.seatIndex + 4) % 4;
        return ret;
      },
      onOptionClicked: function onOptionClicked(event) {
        console.log(event.target.pai);
        "btnPeng" == event.target.name ? cc.vv.net.send("peng") : "btnGang" == event.target.name ? cc.vv.net.send("gang", event.target.pai) : "btnHu" == event.target.name ? cc.vv.net.send("hu") : "btnGuo" == event.target.name && cc.vv.net.send("guo");
      },
      update: function update(dt) {},
      onDestroy: function onDestroy() {
        console.log("onDestroy");
        cc.vv && cc.vv.gameNetMgr.clear();
      }
    });
    cc._RF.pop();
  }, {} ],
  MJRoom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "921dfQJZddJ+5GFUXqxmMmT", "MJRoom");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        lblRoomNo: {
          default: null,
          type: cc.Label
        },
        _seats: [],
        _seats2: [],
        _timeLabel: null,
        _voiceMsgQueue: [],
        _lastPlayingSeat: null,
        _playingSeat: null,
        _lastPlayTime: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this.initView();
        this.initSeats();
        this.initEventHandlers();
      },
      initView: function initView() {
        var prepare = this.node.getChildByName("prepare");
        var seats = prepare.getChildByName("seats");
        for (var i = 0; i < seats.children.length; ++i) this._seats.push(seats.children[i].getComponent("Seat"));
        this.refreshBtns();
        this.lblRoomNo = cc.find("Canvas/infobar/Z_room_txt/New Label").getComponent(cc.Label);
        this._timeLabel = cc.find("Canvas/infobar/time").getComponent(cc.Label);
        this.lblRoomNo.string = cc.vv.gameNetMgr.roomId;
        var gameChild = this.node.getChildByName("game");
        var sides = [ "myself", "right", "up", "left" ];
        for (var i = 0; i < sides.length; ++i) {
          var sideNode = gameChild.getChildByName(sides[i]);
          var seat = sideNode.getChildByName("seat");
          this._seats2.push(seat.getComponent("Seat"));
        }
        var btnWechat = cc.find("Canvas/prepare/btnWeichat");
        if (btnWechat) {
          btnWechat.active = false;
          cc.vv.utils.addClickEvent(btnWechat, this.node, "MJRoom", "onBtnWeichatClicked");
        }
        var titles = cc.find("Canvas/typeTitle");
        for (var i = 0; i < titles.children.length; ++i) titles.children[i].active = false;
        if (cc.vv.gameNetMgr.conf) {
          var type = cc.vv.gameNetMgr.conf.type;
          null != type && "" != type || (type = "xzdd");
        }
      },
      refreshBtns: function refreshBtns() {
        var prepare = this.node.getChildByName("prepare");
        var btnExit = prepare.getChildByName("btnExit");
        var btnDispress = prepare.getChildByName("btnDissolve");
        var btnWeichat = prepare.getChildByName("btnWeichat");
        var btnBack = prepare.getChildByName("btnBack");
        var isIdle = 0 == cc.vv.gameNetMgr.numOfGames;
        btnExit.active = !cc.vv.gameNetMgr.isOwner() && isIdle;
        btnDispress.active = cc.vv.gameNetMgr.isOwner() && isIdle;
        btnWeichat.active = isIdle;
        btnBack.active = isIdle;
      },
      initEventHandlers: function initEventHandlers() {
        var self = this;
        this.node.on("new_user", function(data) {
          self.initSingleSeat(data);
        });
        this.node.on("user_state_changed", function(data) {
          self.initSingleSeat(data);
        });
        this.node.on("game_begin", function(data) {
          self.refreshBtns();
          self.initSeats();
        });
        this.node.on("game_num", function(data) {
          self.refreshBtns();
        });
        this.node.on("game_huanpai", function(data) {
          for (var i in self._seats2) self._seats2[i].refreshXuanPaiState();
        });
        this.node.on("huanpai_notify", function(data) {
          var idx = data.seatindex;
          var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
          self._seats2[localIdx].refreshXuanPaiState();
        });
        this.node.on("game_huanpai_over", function(data) {
          for (var i in self._seats2) self._seats2[i].refreshXuanPaiState();
        });
        this.node.on("voice_msg", function(data) {
          self._voiceMsgQueue.push(data);
          self.playVoice();
        });
        this.node.on("chat_push", function(data) {
          var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
          var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
          self._seats[localIdx].chat(data.content);
          self._seats2[localIdx].chat(data.content);
        });
        this.node.on("quick_chat_push", function(data) {
          var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
          var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
          var index = data.content;
          var info = cc.vv.chat.getQuickChatInfo(index);
          self._seats[localIdx].chat(info.content);
          self._seats2[localIdx].chat(info.content);
          cc.vv.audioMgr.playSFX(info.sound);
        });
        this.node.on("emoji_push", function(data) {
          var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
          var localIdx = cc.vv.gameNetMgr.getLocalIndex(idx);
          console.log(data);
          self._seats[localIdx].emoji(data.content);
          self._seats2[localIdx].emoji(data.content);
        });
      },
      initSeats: function initSeats() {
        var seats = cc.vv.gameNetMgr.seats;
        for (var i = 0; i < seats.length; ++i) this.initSingleSeat(seats[i]);
      },
      initSingleSeat: function initSingleSeat(seat) {
        var index = cc.vv.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.vv.gameNetMgr.button;
        console.log("isOffline:" + isOffline);
        this._seats[index].setInfo(seat.name, seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        this._seats2[index].setInfo(seat.name, seat.score);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].voiceMsg(false);
        this._seats2[index].refreshXuanPaiState();
      },
      onBtnSettingsClicked: function onBtnSettingsClicked() {
        cc.vv.popupMgr.showSettings();
      },
      onBtnBackClicked: function onBtnBackClicked() {
        cc.vv.alert.show("\u8fd4\u56de\u5927\u5385", "\u8fd4\u56de\u5927\u5385\u623f\u95f4\u4ecd\u4f1a\u4fdd\u7559\uff0c\u5feb\u53bb\u9080\u8bf7\u5927\u4f19\u6765\u73a9\u5427\uff01", function() {
          cc.director.loadScene("hall");
        }, true);
      },
      onBtnChatClicked: function onBtnChatClicked() {},
      onBtnWeichatClicked: function onBtnWeichatClicked() {
        var title = "<\u8840\u6218\u5230\u5e95>";
        if ("xlch" == cc.vv.gameNetMgr.conf.type) var title = "<\u8840\u6d41\u6210\u6cb3>";
        cc.vv.anysdkMgr.share("\u8fbe\u8fbe\u9ebb\u5c06" + title, "\u623f\u53f7:" + cc.vv.gameNetMgr.roomId + " \u73a9\u6cd5:" + cc.vv.gameNetMgr.getWanfa());
      },
      onBtnDissolveClicked: function onBtnDissolveClicked() {
        cc.vv.alert.show("\u89e3\u6563\u623f\u95f4", "\u89e3\u6563\u623f\u95f4\u4e0d\u6263\u623f\u5361\uff0c\u662f\u5426\u786e\u5b9a\u89e3\u6563\uff1f", function() {
          cc.vv.net.send("dispress");
        }, true);
      },
      onBtnExit: function onBtnExit() {
        cc.vv.net.send("exit");
      },
      playVoice: function playVoice() {
        if (null == this._playingSeat && this._voiceMsgQueue.length) {
          console.log("playVoice2");
          var data = this._voiceMsgQueue.shift();
          var idx = cc.vv.gameNetMgr.getSeatIndexByID(data.sender);
          var localIndex = cc.vv.gameNetMgr.getLocalIndex(idx);
          this._playingSeat = localIndex;
          this._seats[localIndex].voiceMsg(true);
          this._seats2[localIndex].voiceMsg(true);
          var msgInfo = JSON.parse(data.content);
          var msgfile = "voicemsg.amr";
          console.log(msgInfo.msg.length);
          cc.vv.voiceMgr.writeVoice(msgfile, msgInfo.msg);
          cc.vv.voiceMgr.play(msgfile);
          this._lastPlayTime = Date.now() + msgInfo.time;
        }
      },
      update: function update(dt) {
        var minutes = Math.floor(Date.now() / 1e3 / 60);
        if (this._lastMinute != minutes) {
          this._lastMinute = minutes;
          var date = new Date();
          var h = date.getHours();
          h = h < 10 ? "0" + h : h;
          var m = date.getMinutes();
          m = m < 10 ? "0" + m : m;
          this._timeLabel.string = h + ":" + m;
        }
        if (null != this._lastPlayTime) {
          if (Date.now() > this._lastPlayTime + 200) {
            this.onPlayerOver();
            this._lastPlayTime = null;
          }
        } else this.playVoice();
      },
      onPlayerOver: function onPlayerOver() {
        cc.vv.audioMgr.resumeAll();
        console.log("onPlayCallback:" + this._playingSeat);
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
        this._seats2[localIndex].voiceMsg(false);
      },
      onDestroy: function onDestroy() {
        cc.vv.voiceMgr.stop();
      }
    });
    cc._RF.pop();
  }, {} ],
  MahjongMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0ecea6X+IFIK5XFdJe38hXa", "MahjongMgr");
    "use strict";
    var mahjongSprites = [];
    cc.Class({
      extends: cc.Component,
      properties: {
        leftAtlas: {
          default: null,
          type: cc.SpriteAtlas
        },
        rightAtlas: {
          default: null,
          type: cc.SpriteAtlas
        },
        bottomAtlas: {
          default: null,
          type: cc.SpriteAtlas
        },
        bottomFoldAtlas: {
          default: null,
          type: cc.SpriteAtlas
        },
        pengPrefabSelf: {
          default: null,
          type: cc.Prefab
        },
        pengPrefabLeft: {
          default: null,
          type: cc.Prefab
        },
        emptyAtlas: {
          default: null,
          type: cc.SpriteAtlas
        },
        holdsEmpty: {
          default: [],
          type: [ cc.SpriteFrame ]
        },
        _sides: null,
        _pres: null,
        _foldPres: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this._sides = [ "myself", "right", "up", "left" ];
        this._pres = [ "M_", "R_", "B_", "L_" ];
        this._foldPres = [ "B_", "R_", "B_", "L_" ];
        cc.vv.mahjongmgr = this;
        for (var i = 1; i < 10; ++i) mahjongSprites.push("dot_" + i);
        for (var i = 1; i < 10; ++i) mahjongSprites.push("bamboo_" + i);
        for (var i = 1; i < 10; ++i) mahjongSprites.push("character_" + i);
        mahjongSprites.push("red");
        mahjongSprites.push("green");
        mahjongSprites.push("white");
        mahjongSprites.push("wind_east");
        mahjongSprites.push("wind_west");
        mahjongSprites.push("wind_south");
        mahjongSprites.push("wind_north");
      },
      getMahjongSpriteByID: function getMahjongSpriteByID(id) {
        return mahjongSprites[id];
      },
      getMahjongType: function getMahjongType(id) {
        if (id >= 0 && id < 9) return 0;
        if (id >= 9 && id < 18) return 1;
        if (id >= 18 && id < 27) return 2;
        if (id >= 27 && id < 30) return 3;
        if (id >= 30 && id < 34) return 4;
      },
      getSpriteFrameByMJID: function getSpriteFrameByMJID(pre, mjid) {
        var spriteFrameName = this.getMahjongSpriteByID(mjid);
        spriteFrameName = pre + spriteFrameName;
        if ("M_" == pre) return this.bottomAtlas.getSpriteFrame(spriteFrameName);
        if ("B_" == pre) return this.bottomFoldAtlas.getSpriteFrame(spriteFrameName);
        if ("L_" == pre) return this.leftAtlas.getSpriteFrame(spriteFrameName);
        if ("R_" == pre) return this.rightAtlas.getSpriteFrame(spriteFrameName);
      },
      getAudioURLByMJID: function getAudioURLByMJID(id) {
        var realId = 0;
        id >= 0 && id < 9 ? realId = id + 21 : id >= 9 && id < 18 ? realId = id - 8 : id >= 18 && id < 27 && (realId = id - 7);
        return "nv/" + realId + ".mp3";
      },
      getEmptySpriteFrame: function getEmptySpriteFrame(side) {
        if ("up" == side) return this.emptyAtlas.getSpriteFrame("e_mj_b_up");
        if ("myself" == side) return this.emptyAtlas.getSpriteFrame("e_mj_b_bottom");
        if ("left" == side) return this.emptyAtlas.getSpriteFrame("e_mj_b_left");
        if ("right" == side) return this.emptyAtlas.getSpriteFrame("e_mj_b_right");
      },
      getHoldsEmptySpriteFrame: function getHoldsEmptySpriteFrame(side) {
        if ("up" == side) return this.emptyAtlas.getSpriteFrame("e_mj_up");
        if ("myself" == side) return null;
        if ("left" == side) return this.emptyAtlas.getSpriteFrame("e_mj_left");
        if ("right" == side) return this.emptyAtlas.getSpriteFrame("e_mj_right");
      },
      sortMJ: function sortMJ(mahjongs, dingque) {
        var self = this;
        mahjongs.sort(function(a, b) {
          if (dingque >= 0) {
            var t1 = self.getMahjongType(a);
            var t2 = self.getMahjongType(b);
            if (t1 != t2) {
              if (dingque == t1) return 1;
              if (dingque == t2) return -1;
            }
          }
          return a - b;
        });
      },
      getSide: function getSide(localIndex) {
        return this._sides[localIndex];
      },
      getPre: function getPre(localIndex) {
        return this._pres[localIndex];
      },
      getFoldPre: function getFoldPre(localIndex) {
        return this._foldPres[localIndex];
      }
    });
    cc._RF.pop();
  }, {} ],
  Net: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1cc9yRd15CXqFg0vTGKZUk", "Net");
    "use strict";
    null == window.io && (window.io = require("socket-io"));
    var Global = cc.Class({
      extends: cc.Component,
      statics: {
        ip: "",
        sio: null,
        isPinging: false,
        fnDisconnect: null,
        handlers: {},
        addHandler: function addHandler(event, fn) {
          if (this.handlers[event]) {
            console.log("event:" + event + "' handler has been registered.");
            return;
          }
          var handler = function handler(data) {
            "disconnect" != event && "string" == typeof data && (data = JSON.parse(data));
            fn(data);
          };
          this.handlers[event] = handler;
          if (this.sio) {
            console.log("register:function " + event);
            this.sio.on(event, handler);
          }
        },
        connect: function connect(fnConnect, fnError) {
          var self = this;
          var opts = {
            secure: false,
            reconnection: false,
            "force new connection": true,
            transports: [ "websocket", "polling" ]
          };
          this.sio = window.io.connect("https://" + this.ip, opts);
          this.sio.on("reconnect", function() {
            console.log("reconnection");
          });
          this.sio.on("connect", function(data) {
            self.sio.connected = true;
            fnConnect(data);
          });
          this.sio.on("disconnect", function(data) {
            console.log("disconnect");
            self.sio.connected = false;
            self.close();
          });
          this.sio.on("connect_failed", function() {
            console.log("connect_failed");
          });
          for (var key in this.handlers) {
            var value = this.handlers[key];
            if ("function" == typeof value) if ("disconnect" == key) this.fnDisconnect = value; else {
              console.log("register:function " + key);
              this.sio.on(key, value);
            }
          }
          this.startHearbeat();
        },
        startHearbeat: function startHearbeat() {
          this.sio.on("game_pong", function() {
            console.log("game_pong");
            self.lastRecieveTime = Date.now();
          });
          this.lastRecieveTime = Date.now();
          var self = this;
          console.log(1);
          if (!self.isPinging) {
            console.log(1);
            self.isPinging = true;
            setInterval(function() {
              console.log(3);
              if (self.sio) {
                console.log(4);
                Date.now() - self.lastRecieveTime > 1e4 ? self.close() : self.ping();
              }
            }, 5e3);
          }
        },
        send: function send(event, data) {
          if (this.sio.connected) {
            null != data && "object" == typeof data && (data = JSON.stringify(data));
            this.sio.emit(event, data);
          }
        },
        ping: function ping() {
          this.send("game_ping");
        },
        close: function close() {
          console.log("close");
          if (this.sio && this.sio.connected) {
            this.sio.connected = false;
            this.sio.disconnect();
            this.sio = null;
          }
          if (this.fnDisconnect) {
            this.fnDisconnect();
            this.fnDisconnect = null;
          }
        },
        test: function test(fnResult) {
          var xhr = null;
          var fn = function fn(ret) {
            fnResult(ret.isonline);
            xhr = null;
          };
          var arr = this.ip.split(":");
          var data = {
            account: cc.vv.userMgr.account,
            sign: cc.vv.userMgr.sign,
            ip: arr[0],
            port: arr[1]
          };
          xhr = cc.vv.http.sendRequest("/is_server_online", data, fn);
          setTimeout(function() {
            if (xhr) {
              xhr.abort();
              fnResult(false);
            }
          }, 1500);
        }
      }
    });
    cc._RF.pop();
  }, {
    "socket-io": "socket-io"
  } ],
  NoticeTip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "df61b4+FzFDvbpO5g8UNVIM", "NoticeTip");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _guohu: null,
        _info: null,
        _guohuTime: -1
      },
      onLoad: function onLoad() {
        this._guohu = cc.find("Canvas/tip_notice");
        this._guohu.active = false;
        this._info = cc.find("Canvas/tip_notice/info").getComponent(cc.Label);
        var self = this;
        this.node.on("push_notice", function(data) {
          var data = data.detail;
          self._guohu.active = true;
          self._guohuTime = data.time;
          self._info.string = data.info;
        });
      },
      update: function update(dt) {
        if (this._guohuTime > 0) {
          this._guohuTime -= dt;
          this._guohuTime < 0 && (this._guohu.active = false);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  OnBack: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6fd982Tyi5NOYJWt/fGY8Lj", "OnBack");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        var btn = this.node.getChildByName("btn_back");
        cc.vv.utils.addClickEvent(btn, this.node, "OnBack", "onBtnClicked");
      },
      onBtnClicked: function onBtnClicked(event) {
        "btn_back" == event.target.name && (this.node.active = false);
      }
    });
    cc._RF.pop();
  }, {} ],
  PengGangs: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "279d9pNFGRB3rD/ngr1LIXQ", "PengGangs");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        if (!cc.vv) return;
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName("myself");
        var pengangroot = myself.getChildByName("penggangs");
        var realwidth = cc.view.getVisibleSize().width;
        var scale = realwidth / 1280;
        pengangroot.scaleX *= scale;
        pengangroot.scaleY *= scale;
        var self = this;
        this.node.on("peng_notify", function(data) {
          self.onPengGangChanged(data);
        });
        this.node.on("gang_notify", function(data) {
          self.onPengGangChanged(data.seatData);
        });
        this.node.on("game_begin", function(data) {
          self.onGameBein();
        });
        var seats = cc.vv.gameNetMgr.seats;
        for (var i in seats) this.onPengGangChanged(seats[i]);
      },
      onGameBein: function onGameBein() {
        this.hideSide("myself");
        this.hideSide("right");
        this.hideSide("up");
        this.hideSide("left");
      },
      hideSide: function hideSide(side) {
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        if (pengangroot) for (var i = 0; i < pengangroot.childrenCount; ++i) pengangroot.children[i].active = false;
      },
      onPengGangChanged: function onPengGangChanged(seatData) {
        if (null == seatData.angangs && null == seatData.diangangs && null == seatData.wangangs && null == seatData.pengs) return;
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(seatData.seatindex);
        var side = cc.vv.mahjongmgr.getSide(localIndex);
        var pre = cc.vv.mahjongmgr.getFoldPre(localIndex);
        console.log("onPengGangChanged" + localIndex);
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        for (var i = 0; i < pengangroot.childrenCount; ++i) pengangroot.children[i].active = false;
        var index = 0;
        var gangs = seatData.angangs;
        for (var i = 0; i < gangs.length; ++i) {
          var mjid = gangs[i];
          this.initPengAndGangs(pengangroot, side, pre, index, mjid, "angang");
          index++;
        }
        var gangs = seatData.diangangs;
        for (var i = 0; i < gangs.length; ++i) {
          var mjid = gangs[i];
          this.initPengAndGangs(pengangroot, side, pre, index, mjid, "diangang");
          index++;
        }
        var gangs = seatData.wangangs;
        for (var i = 0; i < gangs.length; ++i) {
          var mjid = gangs[i];
          this.initPengAndGangs(pengangroot, side, pre, index, mjid, "wangang");
          index++;
        }
        var pengs = seatData.pengs;
        if (pengs) for (var i = 0; i < pengs.length; ++i) {
          var mjid = pengs[i];
          this.initPengAndGangs(pengangroot, side, pre, index, mjid, "peng");
          index++;
        }
      },
      initPengAndGangs: function initPengAndGangs(pengangroot, side, pre, index, mjid, flag) {
        var pgroot = null;
        if (pengangroot.childrenCount <= index) {
          pgroot = "left" == side || "right" == side ? cc.instantiate(cc.vv.mahjongmgr.pengPrefabLeft) : cc.instantiate(cc.vv.mahjongmgr.pengPrefabSelf);
          pengangroot.addChild(pgroot);
        } else {
          pgroot = pengangroot.children[index];
          pgroot.active = true;
        }
        if ("left" == side) pgroot.y = -25 * index * 3; else if ("right" == side) {
          pgroot.y = 25 * index * 3;
          pgroot.zIndex = -index;
        } else pgroot.x = "myself" == side ? 55 * index * 3 + 10 * index : -55 * index * 3;
        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        for (var s = 0; s < sprites.length; ++s) {
          var sprite = sprites[s];
          if ("gang" == sprite.node.name) {
            var isGang = "peng" != flag;
            sprite.node.active = isGang;
            sprite.node.scaleX = 1;
            sprite.node.scaleY = 1;
            if ("angang" == flag) {
              sprite.spriteFrame = cc.vv.mahjongmgr.getEmptySpriteFrame(side);
              if ("myself" == side || "up" == side) {
                sprite.node.scaleX = 1.4;
                sprite.node.scaleY = 1.4;
              }
            } else sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
          } else sprite.spriteFrame = cc.vv.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  PopupMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bc0d2VLgL1Avo166tHLsjCJ", "PopupMgr");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _popuproot: null,
        _settings: null,
        _dissolveNotice: null,
        _endTime: -1,
        _extraInfo: null,
        _noticeLabel: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        cc.vv.popupMgr = this;
        this._popuproot = cc.find("Canvas/popups");
        this._settings = cc.find("Canvas/popups/settings");
        this._dissolveNotice = cc.find("Canvas/popups/dissolve_notice");
        this._noticeLabel = this._dissolveNotice.getChildByName("info").getComponent(cc.Label);
        this.closeAll();
        this.addBtnHandler("settings/btn_close");
        this.addBtnHandler("settings/btn_sqjsfj");
        this.addBtnHandler("dissolve_notice/btn_agree");
        this.addBtnHandler("dissolve_notice/btn_reject");
        this.addBtnHandler("dissolve_notice/btn_ok");
        var self = this;
        this.node.on("dissolve_notice", function(event) {
          var data = event.detail;
          self.showDissolveNotice(data);
        });
        this.node.on("dissolve_cancel", function(event) {
          self.closeAll();
        });
      },
      start: function start() {
        cc.vv.gameNetMgr.dissoveData && this.showDissolveNotice(cc.vv.gameNetMgr.dissoveData);
      },
      addBtnHandler: function addBtnHandler(btnName) {
        var btn = cc.find("Canvas/popups/" + btnName);
        this.addClickEvent(btn, this.node, "PopupMgr", "onBtnClicked");
      },
      addClickEvent: function addClickEvent(node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
      },
      onBtnClicked: function onBtnClicked(event) {
        this.closeAll();
        var btnName = event.target.name;
        "btn_agree" == btnName ? cc.vv.net.send("dissolve_agree") : "btn_reject" == btnName ? cc.vv.net.send("dissolve_reject") : "btn_sqjsfj" == btnName && cc.vv.net.send("dissolve_request");
      },
      closeAll: function closeAll() {
        this._popuproot.active = false;
        this._settings.active = false;
        this._dissolveNotice.active = false;
      },
      showSettings: function showSettings() {
        this.closeAll();
        this._popuproot.active = true;
        this._settings.active = true;
      },
      showDissolveRequest: function showDissolveRequest() {
        this.closeAll();
        this._popuproot.active = true;
      },
      showDissolveNotice: function showDissolveNotice(data) {
        this._endTime = Date.now() / 1e3 + data.time;
        this._extraInfo = "";
        for (var i = 0; i < data.states.length; ++i) {
          var b = data.states[i];
          var name = cc.vv.gameNetMgr.seats[i].name;
          this._extraInfo += b ? "\n[\u5df2\u540c\u610f] " + name : "\n[\u5f85\u786e\u8ba4] " + name;
        }
        this.closeAll();
        this._popuproot.active = true;
        this._dissolveNotice.active = true;
      },
      update: function update(dt) {
        if (this._endTime > 0) {
          var lastTime = this._endTime - Date.now() / 1e3;
          lastTime < 0 && (this._endTime = -1);
          var m = Math.floor(lastTime / 60);
          var s = Math.ceil(lastTime - 60 * m);
          var str = "";
          m > 0 && (str += m + "\u5206");
          this._noticeLabel.string = str + s + "\u79d2\u540e\u623f\u95f4\u5c06\u81ea\u52a8\u89e3\u6563" + this._extraInfo;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  RadioButton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8d571y2U+9AiKntO+TSf0Fb", "RadioButton");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        target: cc.Node,
        sprite: cc.SpriteFrame,
        checkedSprite: cc.SpriteFrame,
        checked: false,
        groupId: -1
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        if (null == cc.vv.radiogroupmgr) {
          var RadioGroupMgr = require("RadioGroupMgr");
          cc.vv.radiogroupmgr = new RadioGroupMgr();
          cc.vv.radiogroupmgr.init();
        }
        console.log(typeof cc.vv.radiogroupmgr.add);
        cc.vv.radiogroupmgr.add(this);
        this.refresh();
      },
      refresh: function refresh() {
        var targetSprite = this.target.getComponent(cc.Sprite);
        this.checked ? targetSprite.spriteFrame = this.checkedSprite : targetSprite.spriteFrame = this.sprite;
      },
      check: function check(value) {
        this.checked = value;
        this.refresh();
      },
      onClicked: function onClicked() {
        cc.vv.radiogroupmgr.check(this);
      },
      onDestroy: function onDestroy() {
        cc.vv && cc.vv.radiogroupmgr && cc.vv.radiogroupmgr.del(this);
      }
    });
    cc._RF.pop();
  }, {
    RadioGroupMgr: "RadioGroupMgr"
  } ],
  RadioGroupMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "824eapeRYNKY4RJzg2Z4YA2", "RadioGroupMgr");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _groups: null
      },
      init: function init() {
        this._groups = {};
      },
      add: function add(radioButton) {
        var groupId = radioButton.groupId;
        var buttons = this._groups[groupId];
        if (null == buttons) {
          buttons = [];
          this._groups[groupId] = buttons;
        }
        buttons.push(radioButton);
      },
      del: function del(radioButton) {
        var groupId = radioButton.groupId;
        var buttons = this._groups[groupId];
        if (null == buttons) return;
        var idx = buttons.indexOf(radioButton);
        -1 != idx && buttons.splice(idx, 1);
        0 == buttons.length && delete this._groups[groupId];
      },
      check: function check(radioButton) {
        var groupId = radioButton.groupId;
        var buttons = this._groups[groupId];
        if (null == buttons) return;
        for (var i = 0; i < buttons.length; ++i) {
          var btn = buttons[i];
          btn == radioButton ? btn.check(true) : btn.check(false);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ReConnect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7f553G0boRH6KrTE7wACaXx", "ReConnect");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _reconnect: null,
        _lblTip: null,
        _lastPing: 0
      },
      onLoad: function onLoad() {
        this._reconnect = cc.find("Canvas/reconnect");
        this._lblTip = cc.find("Canvas/reconnect/tip").getComponent(cc.Label);
        var self = this;
        var fnTestServerOn = function fnTestServerOn() {
          cc.vv.net.test(function(ret) {
            ret ? cc.director.loadScene("hall") : setTimeout(fnTestServerOn, 3e3);
          });
        };
        var fn = function fn(data) {
          self.node.off("disconnect", fn);
          self._reconnect.active = true;
          fnTestServerOn();
        };
        console.log("adasfdasdfsdf");
        this.node.on("disconnect", fn);
      },
      update: function update(dt) {
        if (this._reconnect.active) {
          var t = Math.floor(Date.now() / 1e3) % 4;
          this._lblTip.string = "\u4e0e\u670d\u52a1\u5668\u65ad\u5f00\u8fde\u63a5\uff0c\u6b63\u5728\u5c1d\u8bd5\u91cd\u8fde";
          for (var i = 0; i < t; ++i) this._lblTip.string += ".";
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ReplayCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21e6a+ajGNDTJwDHbV3A72m", "ReplayCtrl");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _nextPlayTime: 1,
        _replay: null,
        _isPlaying: true
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this._replay = cc.find("Canvas/replay");
        this._replay.active = cc.vv.replayMgr.isReplay();
      },
      onBtnPauseClicked: function onBtnPauseClicked() {
        this._isPlaying = false;
      },
      onBtnPlayClicked: function onBtnPlayClicked() {
        this._isPlaying = true;
      },
      onBtnBackClicked: function onBtnBackClicked() {
        cc.vv.replayMgr.clear();
        cc.vv.gameNetMgr.reset();
        cc.vv.gameNetMgr.roomId = null;
        cc.director.loadScene("hall");
      },
      update: function update(dt) {
        if (cc.vv && this._isPlaying && true == cc.vv.replayMgr.isReplay() && this._nextPlayTime > 0) {
          this._nextPlayTime -= dt;
          this._nextPlayTime < 0 && (this._nextPlayTime = cc.vv.replayMgr.takeAction());
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ReplayMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1a6a1p86NFL6KZEZCnbu7tt", "ReplayMgr");
    "use strict";
    var ACTION_CHUPAI = 1;
    var ACTION_MOPAI = 2;
    var ACTION_PENG = 3;
    var ACTION_GANG = 4;
    var ACTION_HU = 5;
    cc.Class({
      extends: cc.Component,
      properties: {
        _lastAction: null,
        _actionRecords: null,
        _currentIndex: 0
      },
      onLoad: function onLoad() {},
      clear: function clear() {
        this._lastAction = null;
        this._actionRecords = null;
        this._currentIndex = 0;
      },
      init: function init(data) {
        this._actionRecords = data.action_records;
        null == this._actionRecords && (this._actionRecords = {});
        this._currentIndex = 0;
        this._lastAction = null;
      },
      isReplay: function isReplay() {
        return null != this._actionRecords;
      },
      getNextAction: function getNextAction() {
        if (this._currentIndex >= this._actionRecords.length) return null;
        var si = this._actionRecords[this._currentIndex++];
        var action = this._actionRecords[this._currentIndex++];
        var pai = this._actionRecords[this._currentIndex++];
        return {
          si: si,
          type: action,
          pai: pai
        };
      },
      takeAction: function takeAction() {
        var action = this.getNextAction();
        null != this._lastAction && this._lastAction.type == ACTION_CHUPAI && null != action && action.type != ACTION_PENG && action.type != ACTION_GANG && action.type != ACTION_HU && cc.vv.gameNetMgr.doGuo(this._lastAction.si, this._lastAction.pai);
        this._lastAction = action;
        if (null == action) return -1;
        var nextActionDelay = 1;
        if (action.type == ACTION_CHUPAI) {
          cc.vv.gameNetMgr.doChupai(action.si, action.pai);
          return 1;
        }
        if (action.type == ACTION_MOPAI) {
          cc.vv.gameNetMgr.doMopai(action.si, action.pai);
          cc.vv.gameNetMgr.doTurnChange(action.si);
          return .5;
        }
        if (action.type == ACTION_PENG) {
          cc.vv.gameNetMgr.doPeng(action.si, action.pai);
          cc.vv.gameNetMgr.doTurnChange(action.si);
          return 1;
        }
        if (action.type == ACTION_GANG) {
          cc.vv.gameNetMgr.dispatchEvent("hangang_notify", action.si);
          cc.vv.gameNetMgr.doGang(action.si, action.pai);
          cc.vv.gameNetMgr.doTurnChange(action.si);
          return 1;
        }
        if (action.type == ACTION_HU) {
          cc.vv.gameNetMgr.doHu({
            seatindex: action.si,
            hupai: action.pai,
            iszimo: false
          });
          return 1.5;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Seat: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "820870ltMZNDYlvzr+qCDEJ", "Seat");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _sprIcon: null,
        _zhuang: null,
        _ready: null,
        _offline: null,
        _lblName: null,
        _lblScore: null,
        _scoreBg: null,
        _nddayingjia: null,
        _voicemsg: null,
        _chatBubble: null,
        _emoji: null,
        _lastChatTime: -1,
        _userName: "",
        _score: 0,
        _dayingjia: false,
        _isOffline: false,
        _isReady: false,
        _isZhuang: false,
        _userId: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this._sprIcon = this.node.getChildByName("icon").getComponent("ImageLoader");
        this._lblName = this.node.getChildByName("name").getComponent(cc.Label);
        this._lblScore = this.node.getChildByName("score").getComponent(cc.Label);
        this._voicemsg = this.node.getChildByName("voicemsg");
        this._xuanpai = this.node.getChildByName("xuanpai");
        this.refreshXuanPaiState();
        this._voicemsg && (this._voicemsg.active = false);
        this._sprIcon && this._sprIcon.getComponent(cc.Button) && cc.vv.utils.addClickEvent(this._sprIcon, this.node, "Seat", "onIconClicked");
        this._offline = this.node.getChildByName("offline");
        this._ready = this.node.getChildByName("ready");
        this._zhuang = this.node.getChildByName("zhuang");
        this._scoreBg = this.node.getChildByName("Z_money_frame");
        this._nddayingjia = this.node.getChildByName("dayingjia");
        this._chatBubble = this.node.getChildByName("ChatBubble");
        null != this._chatBubble && (this._chatBubble.active = false);
        this._emoji = this.node.getChildByName("emoji");
        null != this._emoji && (this._emoji.active = false);
        this.refresh();
        this._sprIcon && this._userId && this._sprIcon.setUserID(this._userId);
      },
      onIconClicked: function onIconClicked() {
        var iconSprite = this._sprIcon.node.getComponent(cc.Sprite);
        if (null != this._userId && this._userId > 0) {
          var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
          var sex = 0;
          if (cc.vv.baseInfoMap) {
            var info = cc.vv.baseInfoMap[this._userId];
            info && (sex = info.sex);
          }
          cc.vv.userinfoShow.show(seat.name, seat.userid, iconSprite, sex, seat.ip);
        }
      },
      refresh: function refresh() {
        null != this._lblName && (this._lblName.string = this._userName);
        null != this._lblScore && (this._lblScore.string = this._score);
        null != this._nddayingjia && (this._nddayingjia.active = true == this._dayingjia);
        this._offline && (this._offline.active = this._isOffline && "" != this._userName);
        this._ready && (this._ready.active = this._isReady && cc.vv.gameNetMgr.numOfGames > 0);
        this._zhuang && (this._zhuang.active = this._isZhuang);
        this.node.active = null != this._userName && "" != this._userName;
      },
      setInfo: function setInfo(name, score, dayingjia) {
        this._userName = name;
        this._score = score;
        null == this._score && (this._score = 0);
        this._dayingjia = dayingjia;
        null != this._scoreBg && (this._scoreBg.active = null != this._score);
        null != this._lblScore && (this._lblScore.node.active = null != this._score);
        this.refresh();
      },
      setZhuang: function setZhuang(value) {
        this._zhuang && (this._zhuang.active = value);
      },
      setReady: function setReady(isReady) {
        this._isReady = isReady;
        this._ready && (this._ready.active = this._isReady && cc.vv.gameNetMgr.numOfGames > 0);
      },
      setID: function setID(id) {
        var idNode = this.node.getChildByName("id");
        if (idNode) {
          var lbl = idNode.getComponent(cc.Label);
          lbl.string = "ID:" + id;
        }
        this._userId = id;
        this._sprIcon && this._sprIcon.setUserID(id);
      },
      setOffline: function setOffline(isOffline) {
        this._isOffline = isOffline;
        this._offline && (this._offline.active = this._isOffline && "" != this._userName);
      },
      chat: function chat(content) {
        if (null == this._chatBubble || null == this._emoji) return;
        this._emoji.active = false;
        this._chatBubble.active = true;
        this._chatBubble.getComponent(cc.Label).string = content;
        this._chatBubble.getChildByName("New Label").getComponent(cc.Label).string = content;
        this._lastChatTime = 3;
      },
      emoji: function emoji(_emoji) {
        if (null == this._emoji || null == this._emoji) return;
        console.log(_emoji);
        this._chatBubble.active = false;
        this._emoji.active = true;
        this._emoji.getComponent(cc.Animation).play(_emoji);
        this._lastChatTime = 3;
      },
      voiceMsg: function voiceMsg(show) {
        this._voicemsg && (this._voicemsg.active = show);
      },
      refreshXuanPaiState: function refreshXuanPaiState() {
        if (null == this._xuanpai) return;
        this._xuanpai.active = cc.vv.gameNetMgr.isHuanSanZhang;
        if (false == cc.vv.gameNetMgr.isHuanSanZhang) return;
        this._xuanpai.getChildByName("xz").active = false;
        this._xuanpai.getChildByName("xd").active = false;
        var seat = cc.vv.gameNetMgr.getSeatByID(this._userId);
        seat && (null == seat.huanpais ? this._xuanpai.getChildByName("xz").active = true : this._xuanpai.getChildByName("xd").active = true);
      },
      update: function update(dt) {
        if (this._lastChatTime > 0) {
          this._lastChatTime -= dt;
          if (this._lastChatTime < 0) {
            this._chatBubble.active = false;
            this._emoji.active = false;
            this._emoji.getComponent(cc.Animation).stop();
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  Settings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4c04fyd89JAZY7qGjvubi+f", "Settings");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _btnYXOpen: null,
        _btnYXClose: null,
        _btnYYOpen: null,
        _btnYYClose: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this._btnYXOpen = this.node.getChildByName("yinxiao").getChildByName("btn_yx_open");
        this._btnYXClose = this.node.getChildByName("yinxiao").getChildByName("btn_yx_close");
        this._btnYYOpen = this.node.getChildByName("yinyue").getChildByName("btn_yy_open");
        this._btnYYClose = this.node.getChildByName("yinyue").getChildByName("btn_yy_close");
        this.initButtonHandler(this.node.getChildByName("btn_close"));
        this.initButtonHandler(this.node.getChildByName("btn_exit"));
        this.initButtonHandler(this._btnYXOpen);
        this.initButtonHandler(this._btnYXClose);
        this.initButtonHandler(this._btnYYOpen);
        this.initButtonHandler(this._btnYYClose);
        var slider = this.node.getChildByName("yinxiao").getChildByName("progress");
        cc.vv.utils.addSlideEvent(slider, this.node, "Settings", "onSlided");
        var slider = this.node.getChildByName("yinyue").getChildByName("progress");
        cc.vv.utils.addSlideEvent(slider, this.node, "Settings", "onSlided");
        this.refreshVolume();
      },
      onSlided: function onSlided(slider) {
        "yinxiao" == slider.node.parent.name ? cc.vv.audioMgr.setSFXVolume(slider.progress) : "yinyue" == slider.node.parent.name && cc.vv.audioMgr.setBGMVolume(slider.progress);
        this.refreshVolume();
      },
      initButtonHandler: function initButtonHandler(btn) {
        cc.vv.utils.addClickEvent(btn, this.node, "Settings", "onBtnClicked");
      },
      refreshVolume: function refreshVolume() {
        this._btnYXClose.active = cc.vv.audioMgr.sfxVolume > 0;
        this._btnYXOpen.active = !this._btnYXClose.active;
        var yx = this.node.getChildByName("yinxiao");
        var width = 430 * cc.vv.audioMgr.sfxVolume;
        var progress = yx.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.sfxVolume;
        progress.getChildByName("progress").width = width;
        this._btnYYClose.active = cc.vv.audioMgr.bgmVolume > 0;
        this._btnYYOpen.active = !this._btnYYClose.active;
        var yy = this.node.getChildByName("yinyue");
        var width = 430 * cc.vv.audioMgr.bgmVolume;
        var progress = yy.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.vv.audioMgr.bgmVolume;
        progress.getChildByName("progress").width = width;
      },
      onBtnClicked: function onBtnClicked(event) {
        if ("btn_close" == event.target.name) this.node.active = false; else if ("btn_exit" == event.target.name) {
          cc.sys.localStorage.removeItem("wx_account");
          cc.sys.localStorage.removeItem("wx_sign");
          cc.director.loadScene("login");
        } else if ("btn_yx_open" == event.target.name) {
          cc.vv.audioMgr.setSFXVolume(1);
          this.refreshVolume();
        } else if ("btn_yx_close" == event.target.name) {
          cc.vv.audioMgr.setSFXVolume(0);
          this.refreshVolume();
        } else if ("btn_yy_open" == event.target.name) {
          cc.vv.audioMgr.setBGMVolume(1);
          this.refreshVolume();
        } else if ("btn_yy_close" == event.target.name) {
          cc.vv.audioMgr.setBGMVolume(0);
          this.refreshVolume();
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  TimePointer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5b586erPK1H5bFfrMKWs+Y6", "TimePointer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _arrow: null,
        _pointer: null,
        _timeLabel: null,
        _time: -1,
        _alertTime: -1
      },
      onLoad: function onLoad() {
        var gameChild = this.node.getChildByName("game");
        this._arrow = gameChild.getChildByName("arrow");
        this._pointer = this._arrow.getChildByName("pointer");
        this.initPointer();
        this._timeLabel = this._arrow.getChildByName("lblTime").getComponent(cc.Label);
        this._timeLabel.string = "00";
        var self = this;
        this.node.on("game_begin", function(data) {
          self.initPointer();
        });
        this.node.on("game_chupai", function(data) {
          self.initPointer();
          self._time = 10;
          self._alertTime = 3;
        });
      },
      initPointer: function initPointer() {
        if (null == cc.vv) return;
        this._arrow.active = "playing" == cc.vv.gameNetMgr.gamestate;
        if (!this._arrow.active) return;
        var turn = cc.vv.gameNetMgr.turn;
        var localIndex = cc.vv.gameNetMgr.getLocalIndex(turn);
        for (var i = 0; i < this._pointer.children.length; ++i) this._pointer.children[i].active = i == localIndex;
      },
      update: function update(dt) {
        if (this._time > 0) {
          this._time -= dt;
          if (this._alertTime > 0 && this._time < this._alertTime) {
            cc.vv.audioMgr.playSFX("timeup_alarm.mp3");
            this._alertTime = -1;
          }
          var pre = "";
          this._time < 0 && (this._time = 0);
          var t = Math.ceil(this._time);
          t < 10 && (pre = "0");
          this._timeLabel.string = pre + t;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  UserInfoShow: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe4f16CAmpBlZphnpsH1ETv", "UserInfoShow");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _userinfo: null
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return;
        this._userinfo = cc.find("Canvas/userinfo");
        this._userinfo.active = false;
        cc.vv.utils.addClickEvent(this._userinfo, this.node, "UserInfoShow", "onClicked");
        cc.vv.userinfoShow = this;
      },
      show: function show(name, userId, iconSprite, sex, ip) {
        if (null != userId && userId > 0) {
          this._userinfo.active = true;
          this._userinfo.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = iconSprite.spriteFrame;
          this._userinfo.getChildByName("name").getComponent(cc.Label).string = name;
          this._userinfo.getChildByName("ip").getComponent(cc.Label).string = "IP: " + ip.replace("::ffff:", "");
          this._userinfo.getChildByName("id").getComponent(cc.Label).string = "ID: " + userId;
          var sex_female = this._userinfo.getChildByName("sex_female");
          sex_female.active = false;
          var sex_male = this._userinfo.getChildByName("sex_male");
          sex_male.active = false;
          1 == sex ? sex_male.active = true : 2 == sex && (sex_female.active = true);
        }
      },
      onClicked: function onClicked() {
        this._userinfo.active = false;
      }
    });
    cc._RF.pop();
  }, {} ],
  UserMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "74d78JBqHdDKY6hckY2YuL+", "UserMgr");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        account: null,
        userId: null,
        userName: null,
        lv: 0,
        exp: 0,
        coins: 0,
        gems: 0,
        sign: 0,
        ip: "",
        sex: 0,
        roomData: null,
        oldRoomId: null
      },
      guestAuth: function guestAuth() {
        var account = cc.args["account"];
        null == account;
        if (null == account) {
          account = Date.now();
          cc.sys.localStorage.setItem("account", account);
        }
        cc.vv.http.sendRequest("/guest", {
          account: account
        }, this.onAuth);
      },
      onAuth: function onAuth(ret) {
        var self = cc.vv.userMgr;
        if (0 !== ret.errcode) console.log(ret.errmsg); else {
          self.account = ret.account;
          self.sign = ret.sign;
          cc.vv.http.url = "https://" + cc.vv.SI.hall;
          self.login();
        }
      },
      login: function login() {
        var self = this;
        var onLogin = function onLogin(ret) {
          if (0 !== ret.errcode) console.log(ret.errmsg); else if (ret.userid) {
            console.log(ret);
            self.account = ret.account;
            self.userId = ret.userid;
            self.userName = ret.name;
            self.lv = ret.lv;
            self.exp = ret.exp;
            self.coins = ret.coins;
            self.gems = ret.gems;
            self.roomData = ret.roomid;
            self.sex = ret.sex;
            self.ip = ret.ip;
            cc.director.loadScene("hall");
          } else cc.director.loadScene("createrole");
        };
        cc.vv.wc.show("\u6b63\u5728\u767b\u5f55\u6e38\u620f");
        cc.vv.http.sendRequest("/login", {
          account: this.account,
          sign: this.sign
        }, onLogin);
      },
      create: function create(name) {
        var self = this;
        var onCreate = function onCreate(ret) {
          0 !== ret.errcode ? console.log(ret.errmsg) : self.login();
        };
        var data = {
          account: this.account,
          sign: this.sign,
          name: name
        };
        cc.vv.http.sendRequest("/create_user", data, onCreate);
      },
      enterRoom: function enterRoom(roomId, callback) {
        var self = this;
        var onEnter = function onEnter(ret) {
          if (0 !== ret.errcode) if (-1 == ret.errcode) setTimeout(function() {
            self.enterRoom(roomId, callback);
          }, 5e3); else {
            cc.vv.wc.hide();
            null != callback && callback(ret);
          } else {
            null != callback && callback(ret);
            cc.vv.gameNetMgr.connectGameServer(ret);
          }
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign,
          roomid: roomId
        };
        cc.vv.wc.show("\u6b63\u5728\u8fdb\u5165\u623f\u95f4 " + roomId);
        cc.vv.http.sendRequest("/enter_private_room", data, onEnter);
      },
      getHistoryList: function getHistoryList(callback) {
        var self = this;
        var onGet = function onGet(ret) {
          if (0 !== ret.errcode) console.log(ret.errmsg); else {
            console.log(ret.history);
            null != callback && callback(ret.history);
          }
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign
        };
        cc.vv.http.sendRequest("/get_history_list", data, onGet);
      },
      getGamesOfRoom: function getGamesOfRoom(uuid, callback) {
        var self = this;
        var onGet = function onGet(ret) {
          if (0 !== ret.errcode) console.log(ret.errmsg); else {
            console.log(ret.data);
            callback(ret.data);
          }
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign,
          uuid: uuid
        };
        cc.vv.http.sendRequest("/get_games_of_room", data, onGet);
      },
      getDetailOfGame: function getDetailOfGame(uuid, index, callback) {
        var self = this;
        var onGet = function onGet(ret) {
          if (0 !== ret.errcode) console.log(ret.errmsg); else {
            console.log(ret.data);
            callback(ret.data);
          }
        };
        var data = {
          account: cc.vv.userMgr.account,
          sign: cc.vv.userMgr.sign,
          uuid: uuid,
          index: index
        };
        cc.vv.http.sendRequest("/get_detail_of_game", data, onGet);
      }
    });
    cc._RF.pop();
  }, {} ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b717fzww0hNzIqvNbb1t9wx", "Utils");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      addClickEvent: function addClickEvent(node, target, component, handler) {
        console.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
      },
      addSlideEvent: function addSlideEvent(node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;
        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
      }
    });
    cc._RF.pop();
  }, {} ],
  VoiceMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1f066RbLAxKGJZtkDFO2kq/", "VoiceMgr");
    "use strict";
    var radix = 12;
    var base = 128 - radix;
    function crypto(value) {
      value -= base;
      var h = Math.floor(value / radix) + base;
      var l = value % radix + base;
      return String.fromCharCode(h) + String.fromCharCode(l);
    }
    var encodermap = {};
    var decodermap = {};
    for (var i = 0; i < 256; ++i) {
      var code = null;
      var v = i + 1;
      code = v >= base ? crypto(v) : String.fromCharCode(v);
      encodermap[i] = code;
      decodermap[code] = i;
    }
    function encode(data) {
      var content = "";
      var len = data.length;
      var a = len >> 24 & 255;
      var b = len >> 16 & 255;
      var c = len >> 8 & 255;
      var d = 255 & len;
      content += encodermap[a];
      content += encodermap[b];
      content += encodermap[c];
      content += encodermap[d];
      for (var i = 0; i < data.length; ++i) content += encodermap[data[i]];
      return content;
    }
    function getCode(content, index) {
      var c = content.charCodeAt(index);
      c = c >= base ? content.charAt(index) + content.charAt(index + 1) : content.charAt(index);
      return c;
    }
    function decode(content) {
      var index = 0;
      var len = 0;
      for (var i = 0; i < 4; ++i) {
        var c = getCode(content, index);
        index += c.length;
        var v = decodermap[c];
        len |= v << 8 * (3 - i);
      }
      var newData = new Uint8Array(len);
      var cnt = 0;
      while (index < content.length) {
        var c = getCode(content, index);
        index += c.length;
        newData[cnt] = decodermap[c];
        cnt++;
      }
      return newData;
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        onPlayCallback: null,
        _voiceMediaPath: null
      },
      init: function init() {},
      prepare: function prepare(filename) {},
      release: function release() {},
      cancel: function cancel() {},
      writeVoice: function writeVoice(filename, voiceData) {},
      clearCache: function clearCache(filename) {},
      play: function play(filename) {},
      stop: function stop() {},
      getVoiceLevel: function getVoiceLevel(maxLevel) {},
      getVoiceData: function getVoiceData(filename) {},
      download: function download() {},
      setStorageDir: function setStorageDir(dir) {}
    });
    cc._RF.pop();
  }, {} ],
  Voice: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6db9z0CxdEzpRVgU569dDu", "Voice");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        _lastTouchTime: null,
        _voice: null,
        _volume: null,
        _voice_failed: null,
        _lastCheckTime: -1,
        _timeBar: null,
        MAX_TIME: 15e3
      },
      onLoad: function onLoad() {
        this._voice = cc.find("Canvas/voice");
        this._voice.active = false;
        this._voice_failed = cc.find("Canvas/voice/voice_failed");
        this._voice_failed.active = false;
        this._timeBar = cc.find("Canvas/voice/time");
        this._timeBar.scaleX = 0;
        this._volume = cc.find("Canvas/voice/volume");
        for (var i = 1; i < this._volume.children.length; ++i) this._volume.children[i].active = false;
        var btnVoice = cc.find("Canvas/voice/voice_failed/btn_ok");
        btnVoice && cc.vv.utils.addClickEvent(btnVoice, this.node, "Voice", "onBtnOKClicked");
        var self = this;
        var btnVoice = cc.find("Canvas/btn_voice");
        if (btnVoice) {
          btnVoice.on(cc.Node.EventType.TOUCH_START, function() {
            console.log("cc.Node.EventType.TOUCH_START");
            cc.vv.voiceMgr.prepare("record.amr");
            self._lastTouchTime = Date.now();
            self._voice.active = true;
            self._voice_failed.active = false;
          });
          btnVoice.on(cc.Node.EventType.TOUCH_MOVE, function() {
            console.log("cc.Node.EventType.TOUCH_MOVE");
          });
          btnVoice.on(cc.Node.EventType.TOUCH_END, function() {
            console.log("cc.Node.EventType.TOUCH_END");
            if (Date.now() - self._lastTouchTime < 1e3) {
              self._voice_failed.active = true;
              cc.vv.voiceMgr.cancel();
            } else self.onVoiceOK();
            self._lastTouchTime = null;
          });
          btnVoice.on(cc.Node.EventType.TOUCH_CANCEL, function() {
            console.log("cc.Node.EventType.TOUCH_CANCEL");
            cc.vv.voiceMgr.cancel();
            self._lastTouchTime = null;
            self._voice.active = false;
          });
        }
      },
      onVoiceOK: function onVoiceOK() {
        if (null != this._lastTouchTime) {
          cc.vv.voiceMgr.release();
          var time = Date.now() - this._lastTouchTime;
          var msg = cc.vv.voiceMgr.getVoiceData("record.amr");
          cc.vv.net.send("voice_msg", {
            msg: msg,
            time: time
          });
        }
        this._voice.active = false;
      },
      onBtnOKClicked: function onBtnOKClicked() {
        this._voice.active = false;
      },
      update: function update(dt) {
        if (true == this._voice.active && false == this._voice_failed.active && Date.now() - this._lastCheckTime > 300) {
          for (var i = 0; i < this._volume.children.length; ++i) this._volume.children[i].active = false;
          var v = cc.vv.voiceMgr.getVoiceLevel(7);
          v >= 1 && v <= 7 && (this._volume.children[v - 1].active = true);
          this._lastCheckTime = Date.now();
        }
        if (this._lastTouchTime) {
          var time = Date.now() - this._lastTouchTime;
          if (time >= this.MAX_TIME) {
            this.onVoiceOK();
            this._lastTouchTime = null;
          } else {
            var percent = time / this.MAX_TIME;
            this._timeBar.scaleX = 1 - percent;
          }
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  WaitingConnection: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "10e32jDstpLhIGHWrQEq2vN", "WaitingConnection");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        target: cc.Node,
        _isShow: false,
        lblContent: cc.Label
      },
      onLoad: function onLoad() {
        if (null == cc.vv) return null;
        cc.vv.wc = this;
        this.node.active = this._isShow;
      },
      update: function update(dt) {
        this.target.angle = this.target.angle - 45 * dt;
      },
      show: function show(content) {
        this._isShow = true;
        this.node && (this.node.active = this._isShow);
        if (this.lblContent) {
          null == content && (content = "");
          this.lblContent.string = content;
        }
      },
      hide: function hide() {
        this._isShow = false;
        this.node && (this.node.active = this._isShow);
      }
    });
    cc._RF.pop();
  }, {} ],
  "socket-io": [ function(require, module, exports) {
    (function(global) {
      "use strict";
      cc._RF.push(module, "393290vPc1IIYfh8FrmxcNZ", "socket-io");
      "use strict";
      (true, cc.sys.isNative) || function(f) {
        if ("object" === typeof exports && "undefined" !== typeof module) module.exports = f(); else if ("function" === typeof define && define.amd) define([], f); else {
          var g;
          g = "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : this;
          g.io = f();
        }
      }(function() {
        var define, module, exports;
        return function e(t, n, r) {
          function s(o, u) {
            if (!n[o]) {
              if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f;
              }
              var l = n[o] = {
                exports: {}
              };
              t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n || e);
              }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
          }
          var i = "function" == typeof require && require;
          for (var o = 0; o < r.length; o++) s(r[o]);
          return s;
        }({
          1: [ function(_dereq_, module, exports) {
            module.exports = _dereq_("./lib/");
          }, {
            "./lib/": 2
          } ],
          2: [ function(_dereq_, module, exports) {
            module.exports = _dereq_("./socket");
            module.exports.parser = _dereq_("engine.io-parser");
          }, {
            "./socket": 3,
            "engine.io-parser": 19
          } ],
          3: [ function(_dereq_, module, exports) {
            (function(global) {
              var transports = _dereq_("./transports");
              var Emitter = _dereq_("component-emitter");
              var debug = _dereq_("debug")("engine.io-client:socket");
              var index = _dereq_("indexof");
              var parser = _dereq_("engine.io-parser");
              var parseuri = _dereq_("parseuri");
              var parsejson = _dereq_("parsejson");
              var parseqs = _dereq_("parseqs");
              module.exports = Socket;
              function noop() {}
              function Socket(uri, opts) {
                if (!(this instanceof Socket)) return new Socket(uri, opts);
                opts = opts || {};
                if (uri && "object" == typeof uri) {
                  opts = uri;
                  uri = null;
                }
                if (uri) {
                  uri = parseuri(uri);
                  opts.hostname = uri.host;
                  opts.secure = "https" == uri.protocol || "wss" == uri.protocol;
                  opts.port = uri.port;
                  uri.query && (opts.query = uri.query);
                } else opts.host && (opts.hostname = parseuri(opts.host).host);
                this.secure = null != opts.secure ? opts.secure : global.location && "https:" == location.protocol;
                opts.hostname && !opts.port && (opts.port = this.secure ? "443" : "80");
                this.agent = opts.agent || false;
                this.hostname = opts.hostname || (global.location ? location.hostname : "localhost");
                this.port = opts.port || (global.location && location.port ? location.port : this.secure ? 443 : 80);
                this.query = opts.query || {};
                "string" == typeof this.query && (this.query = parseqs.decode(this.query));
                this.upgrade = false !== opts.upgrade;
                this.path = (opts.path || "/engine.io").replace(/\/$/, "") + "/";
                this.forceJSONP = !!opts.forceJSONP;
                this.jsonp = false !== opts.jsonp;
                this.forceBase64 = !!opts.forceBase64;
                this.enablesXDR = !!opts.enablesXDR;
                this.timestampParam = opts.timestampParam || "t";
                this.timestampRequests = opts.timestampRequests;
                this.transports = opts.transports || [ "polling", "websocket" ];
                this.readyState = "";
                this.writeBuffer = [];
                this.policyPort = opts.policyPort || 843;
                this.rememberUpgrade = opts.rememberUpgrade || false;
                this.binaryType = null;
                this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;
                this.perMessageDeflate = false !== opts.perMessageDeflate && (opts.perMessageDeflate || {});
                true === this.perMessageDeflate && (this.perMessageDeflate = {});
                this.perMessageDeflate && null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024);
                this.pfx = opts.pfx || null;
                this.key = opts.key || null;
                this.passphrase = opts.passphrase || null;
                this.cert = opts.cert || null;
                this.ca = opts.ca || null;
                this.ciphers = opts.ciphers || null;
                this.rejectUnauthorized = void 0 === opts.rejectUnauthorized || opts.rejectUnauthorized;
                var freeGlobal = "object" == typeof global && global;
                freeGlobal.global === freeGlobal && opts.extraHeaders && Object.keys(opts.extraHeaders).length > 0 && (this.extraHeaders = opts.extraHeaders);
                this.open();
              }
              Socket.priorWebsocketSuccess = false;
              Emitter(Socket.prototype);
              Socket.protocol = parser.protocol;
              Socket.Socket = Socket;
              Socket.Transport = _dereq_("./transport");
              Socket.transports = _dereq_("./transports");
              Socket.parser = _dereq_("engine.io-parser");
              Socket.prototype.createTransport = function(name) {
                debug('creating transport "%s"', name);
                var query = clone(this.query);
                query.EIO = parser.protocol;
                query.transport = name;
                this.id && (query.sid = this.id);
                var transport = new transports[name]({
                  agent: this.agent,
                  hostname: this.hostname,
                  port: this.port,
                  secure: this.secure,
                  path: this.path,
                  query: query,
                  forceJSONP: this.forceJSONP,
                  jsonp: this.jsonp,
                  forceBase64: this.forceBase64,
                  enablesXDR: this.enablesXDR,
                  timestampRequests: this.timestampRequests,
                  timestampParam: this.timestampParam,
                  policyPort: this.policyPort,
                  socket: this,
                  pfx: this.pfx,
                  key: this.key,
                  passphrase: this.passphrase,
                  cert: this.cert,
                  ca: this.ca,
                  ciphers: this.ciphers,
                  rejectUnauthorized: this.rejectUnauthorized,
                  perMessageDeflate: this.perMessageDeflate,
                  extraHeaders: this.extraHeaders
                });
                return transport;
              };
              function clone(obj) {
                var o = {};
                for (var i in obj) obj.hasOwnProperty(i) && (o[i] = obj[i]);
                return o;
              }
              Socket.prototype.open = function() {
                var transport;
                if (this.rememberUpgrade && Socket.priorWebsocketSuccess && -1 != this.transports.indexOf("websocket")) transport = "websocket"; else {
                  if (0 === this.transports.length) {
                    var self = this;
                    setTimeout(function() {
                      self.emit("error", "No transports available");
                    }, 0);
                    return;
                  }
                  transport = this.transports[0];
                }
                this.readyState = "opening";
                try {
                  transport = this.createTransport(transport);
                } catch (e) {
                  this.transports.shift();
                  this.open();
                  return;
                }
                transport.open();
                this.setTransport(transport);
              };
              Socket.prototype.setTransport = function(transport) {
                debug("setting transport %s", transport.name);
                var self = this;
                if (this.transport) {
                  debug("clearing existing transport %s", this.transport.name);
                  this.transport.removeAllListeners();
                }
                this.transport = transport;
                transport.on("drain", function() {
                  self.onDrain();
                }).on("packet", function(packet) {
                  self.onPacket(packet);
                }).on("error", function(e) {
                  self.onError(e);
                }).on("close", function() {
                  self.onClose("transport close");
                });
              };
              Socket.prototype.probe = function(name) {
                debug('probing transport "%s"', name);
                var transport = this.createTransport(name, {
                  probe: 1
                }), failed = false, self = this;
                Socket.priorWebsocketSuccess = false;
                function onTransportOpen() {
                  if (self.onlyBinaryUpgrades) {
                    var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
                    failed = failed || upgradeLosesBinary;
                  }
                  if (failed) return;
                  debug('probe transport "%s" opened', name);
                  transport.send([ {
                    type: "ping",
                    data: "probe"
                  } ]);
                  transport.once("packet", function(msg) {
                    if (failed) return;
                    if ("pong" == msg.type && "probe" == msg.data) {
                      debug('probe transport "%s" pong', name);
                      self.upgrading = true;
                      self.emit("upgrading", transport);
                      if (!transport) return;
                      Socket.priorWebsocketSuccess = "websocket" == transport.name;
                      debug('pausing current transport "%s"', self.transport.name);
                      self.transport.pause(function() {
                        if (failed) return;
                        if ("closed" == self.readyState) return;
                        debug("changing transport and sending upgrade packet");
                        cleanup();
                        self.setTransport(transport);
                        transport.send([ {
                          type: "upgrade"
                        } ]);
                        self.emit("upgrade", transport);
                        transport = null;
                        self.upgrading = false;
                        self.flush();
                      });
                    } else {
                      debug('probe transport "%s" failed', name);
                      var err = new Error("probe error");
                      err.transport = transport.name;
                      self.emit("upgradeError", err);
                    }
                  });
                }
                function freezeTransport() {
                  if (failed) return;
                  failed = true;
                  cleanup();
                  transport.close();
                  transport = null;
                }
                function onerror(err) {
                  var error = new Error("probe error: " + err);
                  error.transport = transport.name;
                  freezeTransport();
                  debug('probe transport "%s" failed because of error: %s', name, err);
                  self.emit("upgradeError", error);
                }
                function onTransportClose() {
                  onerror("transport closed");
                }
                function onclose() {
                  onerror("socket closed");
                }
                function onupgrade(to) {
                  if (transport && to.name != transport.name) {
                    debug('"%s" works - aborting "%s"', to.name, transport.name);
                    freezeTransport();
                  }
                }
                function cleanup() {
                  transport.removeListener("open", onTransportOpen);
                  transport.removeListener("error", onerror);
                  transport.removeListener("close", onTransportClose);
                  self.removeListener("close", onclose);
                  self.removeListener("upgrading", onupgrade);
                }
                transport.once("open", onTransportOpen);
                transport.once("error", onerror);
                transport.once("close", onTransportClose);
                this.once("close", onclose);
                this.once("upgrading", onupgrade);
                transport.open();
              };
              Socket.prototype.onOpen = function() {
                debug("socket open");
                this.readyState = "open";
                Socket.priorWebsocketSuccess = "websocket" == this.transport.name;
                this.emit("open");
                this.flush();
                if ("open" == this.readyState && this.upgrade && this.transport.pause) {
                  debug("starting upgrade probes");
                  for (var i = 0, l = this.upgrades.length; i < l; i++) this.probe(this.upgrades[i]);
                }
              };
              Socket.prototype.onPacket = function(packet) {
                if ("opening" == this.readyState || "open" == this.readyState) {
                  debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
                  this.emit("packet", packet);
                  this.emit("heartbeat");
                  switch (packet.type) {
                   case "open":
                    this.onHandshake(parsejson(packet.data));
                    break;

                   case "pong":
                    this.setPing();
                    this.emit("pong");
                    break;

                   case "error":
                    var err = new Error("server error");
                    err.code = packet.data;
                    this.onError(err);
                    break;

                   case "message":
                    this.emit("data", packet.data);
                    this.emit("message", packet.data);
                  }
                } else debug('packet received with socket readyState "%s"', this.readyState);
              };
              Socket.prototype.onHandshake = function(data) {
                this.emit("handshake", data);
                this.id = data.sid;
                this.transport.query.sid = data.sid;
                this.upgrades = this.filterUpgrades(data.upgrades);
                this.pingInterval = data.pingInterval;
                this.pingTimeout = data.pingTimeout;
                this.onOpen();
                if ("closed" == this.readyState) return;
                this.setPing();
                this.removeListener("heartbeat", this.onHeartbeat);
                this.on("heartbeat", this.onHeartbeat);
              };
              Socket.prototype.onHeartbeat = function(timeout) {
                clearTimeout(this.pingTimeoutTimer);
                var self = this;
                self.pingTimeoutTimer = setTimeout(function() {
                  if ("closed" == self.readyState) return;
                  self.onClose("ping timeout");
                }, timeout || self.pingInterval + self.pingTimeout);
              };
              Socket.prototype.setPing = function() {
                var self = this;
                clearTimeout(self.pingIntervalTimer);
                self.pingIntervalTimer = setTimeout(function() {
                  debug("writing ping packet - expecting pong within %sms", self.pingTimeout);
                  self.ping();
                  self.onHeartbeat(self.pingTimeout);
                }, self.pingInterval);
              };
              Socket.prototype.ping = function() {
                var self = this;
                this.sendPacket("ping", function() {
                  self.emit("ping");
                });
              };
              Socket.prototype.onDrain = function() {
                this.writeBuffer.splice(0, this.prevBufferLen);
                this.prevBufferLen = 0;
                0 === this.writeBuffer.length ? this.emit("drain") : this.flush();
              };
              Socket.prototype.flush = function() {
                if ("closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
                  debug("flushing %d packets in socket", this.writeBuffer.length);
                  this.transport.send(this.writeBuffer);
                  this.prevBufferLen = this.writeBuffer.length;
                  this.emit("flush");
                }
              };
              Socket.prototype.write = Socket.prototype.send = function(msg, options, fn) {
                this.sendPacket("message", msg, options, fn);
                return this;
              };
              Socket.prototype.sendPacket = function(type, data, options, fn) {
                if ("function" == typeof data) {
                  fn = data;
                  data = void 0;
                }
                if ("function" == typeof options) {
                  fn = options;
                  options = null;
                }
                if ("closing" == this.readyState || "closed" == this.readyState) return;
                options = options || {};
                options.compress = false !== options.compress;
                var packet = {
                  type: type,
                  data: data,
                  options: options
                };
                this.emit("packetCreate", packet);
                this.writeBuffer.push(packet);
                fn && this.once("flush", fn);
                this.flush();
              };
              Socket.prototype.close = function() {
                if ("opening" == this.readyState || "open" == this.readyState) {
                  this.readyState = "closing";
                  var self = this;
                  this.writeBuffer.length ? this.once("drain", function() {
                    this.upgrading ? waitForUpgrade() : close();
                  }) : this.upgrading ? waitForUpgrade() : close();
                }
                function close() {
                  self.onClose("forced close");
                  debug("socket closing - telling transport to close");
                  self.transport.close();
                }
                function cleanupAndClose() {
                  self.removeListener("upgrade", cleanupAndClose);
                  self.removeListener("upgradeError", cleanupAndClose);
                  close();
                }
                function waitForUpgrade() {
                  self.once("upgrade", cleanupAndClose);
                  self.once("upgradeError", cleanupAndClose);
                }
                return this;
              };
              Socket.prototype.onError = function(err) {
                debug("socket error %j", err);
                Socket.priorWebsocketSuccess = false;
                this.emit("error", err);
                this.onClose("transport error", err);
              };
              Socket.prototype.onClose = function(reason, desc) {
                if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
                  debug('socket close with reason: "%s"', reason);
                  var self = this;
                  clearTimeout(this.pingIntervalTimer);
                  clearTimeout(this.pingTimeoutTimer);
                  this.transport.removeAllListeners("close");
                  this.transport.close();
                  this.transport.removeAllListeners();
                  this.readyState = "closed";
                  this.id = null;
                  this.emit("close", reason, desc);
                  self.writeBuffer = [];
                  self.prevBufferLen = 0;
                }
              };
              Socket.prototype.filterUpgrades = function(upgrades) {
                var filteredUpgrades = [];
                for (var i = 0, j = upgrades.length; i < j; i++) ~index(this.transports, upgrades[i]) && filteredUpgrades.push(upgrades[i]);
                return filteredUpgrades;
              };
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            "./transport": 4,
            "./transports": 5,
            "component-emitter": 15,
            debug: 17,
            "engine.io-parser": 19,
            indexof: 23,
            parsejson: 26,
            parseqs: 27,
            parseuri: 28
          } ],
          4: [ function(_dereq_, module, exports) {
            var parser = _dereq_("engine.io-parser");
            var Emitter = _dereq_("component-emitter");
            module.exports = Transport;
            function Transport(opts) {
              this.path = opts.path;
              this.hostname = opts.hostname;
              this.port = opts.port;
              this.secure = opts.secure;
              this.query = opts.query;
              this.timestampParam = opts.timestampParam;
              this.timestampRequests = opts.timestampRequests;
              this.readyState = "";
              this.agent = opts.agent || false;
              this.socket = opts.socket;
              this.enablesXDR = opts.enablesXDR;
              this.pfx = opts.pfx;
              this.key = opts.key;
              this.passphrase = opts.passphrase;
              this.cert = opts.cert;
              this.ca = opts.ca;
              this.ciphers = opts.ciphers;
              this.rejectUnauthorized = opts.rejectUnauthorized;
              this.extraHeaders = opts.extraHeaders;
            }
            Emitter(Transport.prototype);
            Transport.prototype.onError = function(msg, desc) {
              var err = new Error(msg);
              err.type = "TransportError";
              err.description = desc;
              this.emit("error", err);
              return this;
            };
            Transport.prototype.open = function() {
              if ("closed" == this.readyState || "" == this.readyState) {
                this.readyState = "opening";
                this.doOpen();
              }
              return this;
            };
            Transport.prototype.close = function() {
              if ("opening" == this.readyState || "open" == this.readyState) {
                this.doClose();
                this.onClose();
              }
              return this;
            };
            Transport.prototype.send = function(packets) {
              if ("open" != this.readyState) throw new Error("Transport not open");
              this.write(packets);
            };
            Transport.prototype.onOpen = function() {
              this.readyState = "open";
              this.writable = true;
              this.emit("open");
            };
            Transport.prototype.onData = function(data) {
              var packet = parser.decodePacket(data, this.socket.binaryType);
              this.onPacket(packet);
            };
            Transport.prototype.onPacket = function(packet) {
              this.emit("packet", packet);
            };
            Transport.prototype.onClose = function() {
              this.readyState = "closed";
              this.emit("close");
            };
          }, {
            "component-emitter": 15,
            "engine.io-parser": 19
          } ],
          5: [ function(_dereq_, module, exports) {
            (function(global) {
              var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");
              var XHR = _dereq_("./polling-xhr");
              var JSONP = _dereq_("./polling-jsonp");
              var websocket = _dereq_("./websocket");
              exports.polling = polling;
              exports.websocket = websocket;
              function polling(opts) {
                var xhr;
                var xd = false;
                var xs = false;
                var jsonp = false !== opts.jsonp;
                if (global.location) {
                  var isSSL = "https:" == location.protocol;
                  var port = location.port;
                  port || (port = isSSL ? 443 : 80);
                  xd = opts.hostname != location.hostname || port != opts.port;
                  xs = opts.secure != isSSL;
                }
                opts.xdomain = xd;
                opts.xscheme = xs;
                xhr = new XMLHttpRequest(opts);
                if ("open" in xhr && !opts.forceJSONP) return new XHR(opts);
                if (!jsonp) throw new Error("JSONP disabled");
                return new JSONP(opts);
              }
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            "./polling-jsonp": 6,
            "./polling-xhr": 7,
            "./websocket": 9,
            "xmlhttprequest-ssl": 10
          } ],
          6: [ function(_dereq_, module, exports) {
            (function(global) {
              var Polling = _dereq_("./polling");
              var inherit = _dereq_("component-inherit");
              module.exports = JSONPPolling;
              var rNewline = /\n/g;
              var rEscapedNewline = /\\n/g;
              var callbacks;
              var index = 0;
              function empty() {}
              function JSONPPolling(opts) {
                Polling.call(this, opts);
                this.query = this.query || {};
                if (!callbacks) {
                  global.___eio || (global.___eio = []);
                  callbacks = global.___eio;
                }
                this.index = callbacks.length;
                var self = this;
                callbacks.push(function(msg) {
                  self.onData(msg);
                });
                this.query.j = this.index;
                global.document && global.addEventListener && global.addEventListener("beforeunload", function() {
                  self.script && (self.script.onerror = empty);
                }, false);
              }
              inherit(JSONPPolling, Polling);
              JSONPPolling.prototype.supportsBinary = false;
              JSONPPolling.prototype.doClose = function() {
                if (this.script) {
                  this.script.parentNode.removeChild(this.script);
                  this.script = null;
                }
                if (this.form) {
                  this.form.parentNode.removeChild(this.form);
                  this.form = null;
                  this.iframe = null;
                }
                Polling.prototype.doClose.call(this);
              };
              JSONPPolling.prototype.doPoll = function() {
                var self = this;
                var script = document.createElement("script");
                if (this.script) {
                  this.script.parentNode.removeChild(this.script);
                  this.script = null;
                }
                script.async = true;
                script.src = this.uri();
                script.onerror = function(e) {
                  self.onError("jsonp poll error", e);
                };
                var insertAt = document.getElementsByTagName("script")[0];
                insertAt ? insertAt.parentNode.insertBefore(script, insertAt) : (document.head || document.body).appendChild(script);
                this.script = script;
                var isUAgecko = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                isUAgecko && setTimeout(function() {
                  var iframe = document.createElement("iframe");
                  document.body.appendChild(iframe);
                  document.body.removeChild(iframe);
                }, 100);
              };
              JSONPPolling.prototype.doWrite = function(data, fn) {
                var self = this;
                if (!this.form) {
                  var form = document.createElement("form");
                  var area = document.createElement("textarea");
                  var id = this.iframeId = "eio_iframe_" + this.index;
                  var iframe;
                  form.className = "socketio";
                  form.style.position = "absolute";
                  form.style.top = "-1000px";
                  form.style.left = "-1000px";
                  form.target = id;
                  form.method = "POST";
                  form.setAttribute("accept-charset", "utf-8");
                  area.name = "d";
                  form.appendChild(area);
                  document.body.appendChild(form);
                  this.form = form;
                  this.area = area;
                }
                this.form.action = this.uri();
                function complete() {
                  initIframe();
                  fn();
                }
                function initIframe() {
                  if (self.iframe) try {
                    self.form.removeChild(self.iframe);
                  } catch (e) {
                    self.onError("jsonp polling iframe removal error", e);
                  }
                  try {
                    var html = '<iframe src="javascript:0" name="' + self.iframeId + '">';
                    iframe = document.createElement(html);
                  } catch (e) {
                    iframe = document.createElement("iframe");
                    iframe.name = self.iframeId;
                    iframe.src = "javascript:0";
                  }
                  iframe.id = self.iframeId;
                  self.form.appendChild(iframe);
                  self.iframe = iframe;
                }
                initIframe();
                data = data.replace(rEscapedNewline, "\\\n");
                this.area.value = data.replace(rNewline, "\\n");
                try {
                  this.form.submit();
                } catch (e) {}
                this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                  "complete" == self.iframe.readyState && complete();
                } : this.iframe.onload = complete;
              };
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            "./polling": 8,
            "component-inherit": 16
          } ],
          7: [ function(_dereq_, module, exports) {
            (function(global) {
              var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");
              var Polling = _dereq_("./polling");
              var Emitter = _dereq_("component-emitter");
              var inherit = _dereq_("component-inherit");
              var debug = _dereq_("debug")("engine.io-client:polling-xhr");
              module.exports = XHR;
              module.exports.Request = Request;
              function empty() {}
              function XHR(opts) {
                Polling.call(this, opts);
                if (global.location) {
                  var isSSL = "https:" == location.protocol;
                  var port = location.port;
                  port || (port = isSSL ? 443 : 80);
                  this.xd = opts.hostname != global.location.hostname || port != opts.port;
                  this.xs = opts.secure != isSSL;
                } else this.extraHeaders = opts.extraHeaders;
              }
              inherit(XHR, Polling);
              XHR.prototype.supportsBinary = true;
              XHR.prototype.request = function(opts) {
                opts = opts || {};
                opts.uri = this.uri();
                opts.xd = this.xd;
                opts.xs = this.xs;
                opts.agent = this.agent || false;
                opts.supportsBinary = this.supportsBinary;
                opts.enablesXDR = this.enablesXDR;
                opts.pfx = this.pfx;
                opts.key = this.key;
                opts.passphrase = this.passphrase;
                opts.cert = this.cert;
                opts.ca = this.ca;
                opts.ciphers = this.ciphers;
                opts.rejectUnauthorized = this.rejectUnauthorized;
                opts.extraHeaders = this.extraHeaders;
                return new Request(opts);
              };
              XHR.prototype.doWrite = function(data, fn) {
                var isBinary = "string" !== typeof data && void 0 !== data;
                var req = this.request({
                  method: "POST",
                  data: data,
                  isBinary: isBinary
                });
                var self = this;
                req.on("success", fn);
                req.on("error", function(err) {
                  self.onError("xhr post error", err);
                });
                this.sendXhr = req;
              };
              XHR.prototype.doPoll = function() {
                debug("xhr poll");
                var req = this.request();
                var self = this;
                req.on("data", function(data) {
                  self.onData(data);
                });
                req.on("error", function(err) {
                  self.onError("xhr poll error", err);
                });
                this.pollXhr = req;
              };
              function Request(opts) {
                this.method = opts.method || "GET";
                this.uri = opts.uri;
                this.xd = !!opts.xd;
                this.xs = !!opts.xs;
                this.async = false !== opts.async;
                this.data = void 0 != opts.data ? opts.data : null;
                this.agent = opts.agent;
                this.isBinary = opts.isBinary;
                this.supportsBinary = opts.supportsBinary;
                this.enablesXDR = opts.enablesXDR;
                this.pfx = opts.pfx;
                this.key = opts.key;
                this.passphrase = opts.passphrase;
                this.cert = opts.cert;
                this.ca = opts.ca;
                this.ciphers = opts.ciphers;
                this.rejectUnauthorized = opts.rejectUnauthorized;
                this.extraHeaders = opts.extraHeaders;
                this.create();
              }
              Emitter(Request.prototype);
              Request.prototype.create = function() {
                var opts = {
                  agent: this.agent,
                  xdomain: this.xd,
                  xscheme: this.xs,
                  enablesXDR: this.enablesXDR
                };
                opts.pfx = this.pfx;
                opts.key = this.key;
                opts.passphrase = this.passphrase;
                opts.cert = this.cert;
                opts.ca = this.ca;
                opts.ciphers = this.ciphers;
                opts.rejectUnauthorized = this.rejectUnauthorized;
                var xhr = this.xhr = new XMLHttpRequest(opts);
                var self = this;
                try {
                  debug("xhr open %s: %s", this.method, this.uri);
                  xhr.open(this.method, this.uri, this.async);
                  try {
                    if (this.extraHeaders) {
                      xhr.setDisableHeaderCheck(true);
                      for (var i in this.extraHeaders) this.extraHeaders.hasOwnProperty(i) && xhr.setRequestHeader(i, this.extraHeaders[i]);
                    }
                  } catch (e) {}
                  this.supportsBinary && (xhr.responseType = "arraybuffer");
                  if ("POST" == this.method) try {
                    this.isBinary ? xhr.setRequestHeader("Content-type", "application/octet-stream") : xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                  } catch (e) {}
                  "withCredentials" in xhr && (xhr.withCredentials = true);
                  if (this.hasXDR()) {
                    xhr.onload = function() {
                      self.onLoad();
                    };
                    xhr.onerror = function() {
                      self.onError(xhr.responseText);
                    };
                  } else xhr.onreadystatechange = function() {
                    if (4 != xhr.readyState) return;
                    200 == xhr.status || 1223 == xhr.status ? self.onLoad() : setTimeout(function() {
                      self.onError(xhr.status);
                    }, 0);
                  };
                  debug("xhr data %s", this.data);
                  xhr.send(this.data);
                } catch (e) {
                  setTimeout(function() {
                    self.onError(e);
                  }, 0);
                  return;
                }
                if (global.document) {
                  this.index = Request.requestsCount++;
                  Request.requests[this.index] = this;
                }
              };
              Request.prototype.onSuccess = function() {
                this.emit("success");
                this.cleanup();
              };
              Request.prototype.onData = function(data) {
                this.emit("data", data);
                this.onSuccess();
              };
              Request.prototype.onError = function(err) {
                this.emit("error", err);
                this.cleanup(true);
              };
              Request.prototype.cleanup = function(fromError) {
                if ("undefined" == typeof this.xhr || null === this.xhr) return;
                this.hasXDR() ? this.xhr.onload = this.xhr.onerror = empty : this.xhr.onreadystatechange = empty;
                if (fromError) try {
                  this.xhr.abort();
                } catch (e) {}
                global.document && delete Request.requests[this.index];
                this.xhr = null;
              };
              Request.prototype.onLoad = function() {
                var data;
                try {
                  var contentType;
                  try {
                    contentType = this.xhr.getResponseHeader("Content-Type").split(";")[0];
                  } catch (e) {}
                  if ("application/octet-stream" === contentType) data = this.xhr.response; else if (this.supportsBinary) try {
                    data = String.fromCharCode.apply(null, new Uint8Array(this.xhr.response));
                  } catch (e) {
                    var ui8Arr = new Uint8Array(this.xhr.response);
                    var dataArray = [];
                    for (var idx = 0, length = ui8Arr.length; idx < length; idx++) dataArray.push(ui8Arr[idx]);
                    data = String.fromCharCode.apply(null, dataArray);
                  } else data = this.xhr.responseText;
                } catch (e) {
                  this.onError(e);
                }
                null != data && this.onData(data);
              };
              Request.prototype.hasXDR = function() {
                return "undefined" !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
              };
              Request.prototype.abort = function() {
                this.cleanup();
              };
              if (global.document) {
                Request.requestsCount = 0;
                Request.requests = {};
                global.attachEvent ? global.attachEvent("onunload", unloadHandler) : global.addEventListener && global.addEventListener("beforeunload", unloadHandler, false);
              }
              function unloadHandler() {
                for (var i in Request.requests) Request.requests.hasOwnProperty(i) && Request.requests[i].abort();
              }
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            "./polling": 8,
            "component-emitter": 15,
            "component-inherit": 16,
            debug: 17,
            "xmlhttprequest-ssl": 10
          } ],
          8: [ function(_dereq_, module, exports) {
            var Transport = _dereq_("../transport");
            var parseqs = _dereq_("parseqs");
            var parser = _dereq_("engine.io-parser");
            var inherit = _dereq_("component-inherit");
            var yeast = _dereq_("yeast");
            var debug = _dereq_("debug")("engine.io-client:polling");
            module.exports = Polling;
            var hasXHR2 = function() {
              var XMLHttpRequest = _dereq_("xmlhttprequest-ssl");
              var xhr = new XMLHttpRequest({
                xdomain: false
              });
              return null != xhr.responseType;
            }();
            function Polling(opts) {
              var forceBase64 = opts && opts.forceBase64;
              hasXHR2 && !forceBase64 || (this.supportsBinary = false);
              Transport.call(this, opts);
            }
            inherit(Polling, Transport);
            Polling.prototype.name = "polling";
            Polling.prototype.doOpen = function() {
              this.poll();
            };
            Polling.prototype.pause = function(onPause) {
              var pending = 0;
              var self = this;
              this.readyState = "pausing";
              function pause() {
                debug("paused");
                self.readyState = "paused";
                onPause();
              }
              if (this.polling || !this.writable) {
                var total = 0;
                if (this.polling) {
                  debug("we are currently polling - waiting to pause");
                  total++;
                  this.once("pollComplete", function() {
                    debug("pre-pause polling complete");
                    --total || pause();
                  });
                }
                if (!this.writable) {
                  debug("we are currently writing - waiting to pause");
                  total++;
                  this.once("drain", function() {
                    debug("pre-pause writing complete");
                    --total || pause();
                  });
                }
              } else pause();
            };
            Polling.prototype.poll = function() {
              debug("polling");
              this.polling = true;
              this.doPoll();
              this.emit("poll");
            };
            Polling.prototype.onData = function(data) {
              var self = this;
              debug("polling got data %s", data);
              var callback = function callback(packet, index, total) {
                "opening" == self.readyState && self.onOpen();
                if ("close" == packet.type) {
                  self.onClose();
                  return false;
                }
                self.onPacket(packet);
              };
              parser.decodePayload(data, this.socket.binaryType, callback);
              if ("closed" != this.readyState) {
                this.polling = false;
                this.emit("pollComplete");
                "open" == this.readyState ? this.poll() : debug('ignoring poll - transport state "%s"', this.readyState);
              }
            };
            Polling.prototype.doClose = function() {
              var self = this;
              function close() {
                debug("writing close packet");
                self.write([ {
                  type: "close"
                } ]);
              }
              if ("open" == this.readyState) {
                debug("transport open - closing");
                close();
              } else {
                debug("transport not open - deferring close");
                this.once("open", close);
              }
            };
            Polling.prototype.write = function(packets) {
              var self = this;
              this.writable = false;
              var callbackfn = function callbackfn() {
                self.writable = true;
                self.emit("drain");
              };
              var self = this;
              parser.encodePayload(packets, this.supportsBinary, function(data) {
                self.doWrite(data, callbackfn);
              });
            };
            Polling.prototype.uri = function() {
              var query = this.query || {};
              var schema = this.secure ? "https" : "http";
              var port = "";
              false !== this.timestampRequests && (query[this.timestampParam] = yeast());
              this.supportsBinary || query.sid || (query.b64 = 1);
              query = parseqs.encode(query);
              this.port && ("https" == schema && 443 != this.port || "http" == schema && 80 != this.port) && (port = ":" + this.port);
              query.length && (query = "?" + query);
              var ipv6 = -1 !== this.hostname.indexOf(":");
              return schema + "://" + (ipv6 ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query;
            };
          }, {
            "../transport": 4,
            "component-inherit": 16,
            debug: 17,
            "engine.io-parser": 19,
            parseqs: 27,
            "xmlhttprequest-ssl": 10,
            yeast: 30
          } ],
          9: [ function(_dereq_, module, exports) {
            (function(global) {
              var Transport = _dereq_("../transport");
              var parser = _dereq_("engine.io-parser");
              var parseqs = _dereq_("parseqs");
              var inherit = _dereq_("component-inherit");
              var yeast = _dereq_("yeast");
              var debug = _dereq_("debug")("engine.io-client:websocket");
              var BrowserWebSocket = global.WebSocket || global.MozWebSocket;
              var WebSocket = BrowserWebSocket;
              if (!WebSocket && "undefined" === typeof window) try {
                WebSocket = _dereq_("ws");
              } catch (e) {}
              module.exports = WS;
              function WS(opts) {
                var forceBase64 = opts && opts.forceBase64;
                forceBase64 && (this.supportsBinary = false);
                this.perMessageDeflate = opts.perMessageDeflate;
                Transport.call(this, opts);
              }
              inherit(WS, Transport);
              WS.prototype.name = "websocket";
              WS.prototype.supportsBinary = true;
              WS.prototype.doOpen = function() {
                if (!this.check()) return;
                var self = this;
                var uri = this.uri();
                var protocols = void 0;
                var opts = {
                  agent: this.agent,
                  perMessageDeflate: this.perMessageDeflate
                };
                opts.pfx = this.pfx;
                opts.key = this.key;
                opts.passphrase = this.passphrase;
                opts.cert = this.cert;
                opts.ca = this.ca;
                opts.ciphers = this.ciphers;
                opts.rejectUnauthorized = this.rejectUnauthorized;
                this.extraHeaders && (opts.headers = this.extraHeaders);
                this.ws = BrowserWebSocket ? new WebSocket(uri) : new WebSocket(uri, protocols, opts);
                void 0 === this.ws.binaryType && (this.supportsBinary = false);
                if (this.ws.supports && this.ws.supports.binary) {
                  this.supportsBinary = true;
                  this.ws.binaryType = "buffer";
                } else this.ws.binaryType = "arraybuffer";
                this.addEventListeners();
              };
              WS.prototype.addEventListeners = function() {
                var self = this;
                this.ws.onopen = function() {
                  self.onOpen();
                };
                this.ws.onclose = function() {
                  self.onClose();
                };
                this.ws.onmessage = function(ev) {
                  self.onData(ev.data);
                };
                this.ws.onerror = function(e) {
                  self.onError("websocket error", e);
                };
              };
              "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (WS.prototype.onData = function(data) {
                var self = this;
                setTimeout(function() {
                  Transport.prototype.onData.call(self, data);
                }, 0);
              });
              WS.prototype.write = function(packets) {
                var self = this;
                this.writable = false;
                var total = packets.length;
                for (var i = 0, l = total; i < l; i++) (function(packet) {
                  parser.encodePacket(packet, self.supportsBinary, function(data) {
                    if (!BrowserWebSocket) {
                      var opts = {};
                      packet.options && (opts.compress = packet.options.compress);
                      if (self.perMessageDeflate) {
                        var len = "string" == typeof data ? global.Buffer.byteLength(data) : data.length;
                        len < self.perMessageDeflate.threshold && (opts.compress = false);
                      }
                    }
                    try {
                      BrowserWebSocket ? self.ws.send(data) : self.ws.send(data, opts);
                    } catch (e) {
                      debug("websocket closed before onclose event");
                    }
                    --total || done();
                  });
                })(packets[i]);
                function done() {
                  self.emit("flush");
                  setTimeout(function() {
                    self.writable = true;
                    self.emit("drain");
                  }, 0);
                }
              };
              WS.prototype.onClose = function() {
                Transport.prototype.onClose.call(this);
              };
              WS.prototype.doClose = function() {
                "undefined" !== typeof this.ws && this.ws.close();
              };
              WS.prototype.uri = function() {
                var query = this.query || {};
                var schema = this.secure ? "wss" : "ws";
                var port = "";
                this.port && ("wss" == schema && 443 != this.port || "ws" == schema && 80 != this.port) && (port = ":" + this.port);
                this.timestampRequests && (query[this.timestampParam] = yeast());
                this.supportsBinary || (query.b64 = 1);
                query = parseqs.encode(query);
                query.length && (query = "?" + query);
                var ipv6 = -1 !== this.hostname.indexOf(":");
                return schema + "://" + (ipv6 ? "[" + this.hostname + "]" : this.hostname) + port + this.path + query;
              };
              WS.prototype.check = function() {
                return !!WebSocket && !("__initialize" in WebSocket && this.name === WS.prototype.name);
              };
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            "../transport": 4,
            "component-inherit": 16,
            debug: 17,
            "engine.io-parser": 19,
            parseqs: 27,
            ws: void 0,
            yeast: 30
          } ],
          10: [ function(_dereq_, module, exports) {
            var hasCORS = _dereq_("has-cors");
            module.exports = function(opts) {
              var xdomain = opts.xdomain;
              var xscheme = opts.xscheme;
              var enablesXDR = opts.enablesXDR;
              try {
                if ("undefined" != typeof XMLHttpRequest && (!xdomain || hasCORS)) return new XMLHttpRequest();
              } catch (e) {}
              try {
                if ("undefined" != typeof XDomainRequest && !xscheme && enablesXDR) return new XDomainRequest();
              } catch (e) {}
              if (!xdomain) try {
                return new ActiveXObject("Microsoft.XMLHTTP");
              } catch (e) {}
            };
          }, {
            "has-cors": 22
          } ],
          11: [ function(_dereq_, module, exports) {
            module.exports = after;
            function after(count, callback, err_cb) {
              var bail = false;
              err_cb = err_cb || noop;
              proxy.count = count;
              return 0 === count ? callback() : proxy;
              function proxy(err, result) {
                if (proxy.count <= 0) throw new Error("after called too many times");
                --proxy.count;
                if (err) {
                  bail = true;
                  callback(err);
                  callback = err_cb;
                } else 0 !== proxy.count || bail || callback(null, result);
              }
            }
            function noop() {}
          }, {} ],
          12: [ function(_dereq_, module, exports) {
            module.exports = function(arraybuffer, start, end) {
              var bytes = arraybuffer.byteLength;
              start = start || 0;
              end = end || bytes;
              if (arraybuffer.slice) return arraybuffer.slice(start, end);
              start < 0 && (start += bytes);
              end < 0 && (end += bytes);
              end > bytes && (end = bytes);
              if (start >= bytes || start >= end || 0 === bytes) return new ArrayBuffer(0);
              var abv = new Uint8Array(arraybuffer);
              var result = new Uint8Array(end - start);
              for (var i = start, ii = 0; i < end; i++, ii++) result[ii] = abv[i];
              return result.buffer;
            };
          }, {} ],
          13: [ function(_dereq_, module, exports) {
            (function(chars) {
              exports.encode = function(arraybuffer) {
                var bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = "";
                for (i = 0; i < len; i += 3) {
                  base64 += chars[bytes[i] >> 2];
                  base64 += chars[(3 & bytes[i]) << 4 | bytes[i + 1] >> 4];
                  base64 += chars[(15 & bytes[i + 1]) << 2 | bytes[i + 2] >> 6];
                  base64 += chars[63 & bytes[i + 2]];
                }
                len % 3 === 2 ? base64 = base64.substring(0, base64.length - 1) + "=" : len % 3 === 1 && (base64 = base64.substring(0, base64.length - 2) + "==");
                return base64;
              };
              exports.decode = function(base64) {
                var bufferLength = .75 * base64.length, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
                if ("=" === base64[base64.length - 1]) {
                  bufferLength--;
                  "=" === base64[base64.length - 2] && bufferLength--;
                }
                var arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
                for (i = 0; i < len; i += 4) {
                  encoded1 = chars.indexOf(base64[i]);
                  encoded2 = chars.indexOf(base64[i + 1]);
                  encoded3 = chars.indexOf(base64[i + 2]);
                  encoded4 = chars.indexOf(base64[i + 3]);
                  bytes[p++] = encoded1 << 2 | encoded2 >> 4;
                  bytes[p++] = (15 & encoded2) << 4 | encoded3 >> 2;
                  bytes[p++] = (3 & encoded3) << 6 | 63 & encoded4;
                }
                return arraybuffer;
              };
            })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
          }, {} ],
          14: [ function(_dereq_, module, exports) {
            (function(global) {
              var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MSBlobBuilder || global.MozBlobBuilder;
              var blobSupported = function() {
                try {
                  var a = new Blob([ "hi" ]);
                  return 2 === a.size;
                } catch (e) {
                  return false;
                }
              }();
              var blobSupportsArrayBufferView = blobSupported && function() {
                try {
                  var b = new Blob([ new Uint8Array([ 1, 2 ]) ]);
                  return 2 === b.size;
                } catch (e) {
                  return false;
                }
              }();
              var blobBuilderSupported = BlobBuilder && BlobBuilder.prototype.append && BlobBuilder.prototype.getBlob;
              function mapArrayBufferViews(ary) {
                for (var i = 0; i < ary.length; i++) {
                  var chunk = ary[i];
                  if (chunk.buffer instanceof ArrayBuffer) {
                    var buf = chunk.buffer;
                    if (chunk.byteLength !== buf.byteLength) {
                      var copy = new Uint8Array(chunk.byteLength);
                      copy.set(new Uint8Array(buf, chunk.byteOffset, chunk.byteLength));
                      buf = copy.buffer;
                    }
                    ary[i] = buf;
                  }
                }
              }
              function BlobBuilderConstructor(ary, options) {
                options = options || {};
                var bb = new BlobBuilder();
                mapArrayBufferViews(ary);
                for (var i = 0; i < ary.length; i++) bb.append(ary[i]);
                return options.type ? bb.getBlob(options.type) : bb.getBlob();
              }
              function BlobConstructor(ary, options) {
                mapArrayBufferViews(ary);
                return new Blob(ary, options || {});
              }
              module.exports = function() {
                return blobSupported ? blobSupportsArrayBufferView ? global.Blob : BlobConstructor : blobBuilderSupported ? BlobBuilderConstructor : void 0;
              }();
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {} ],
          15: [ function(_dereq_, module, exports) {
            module.exports = Emitter;
            function Emitter(obj) {
              if (obj) return mixin(obj);
            }
            function mixin(obj) {
              for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
              return obj;
            }
            Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
              this._callbacks = this._callbacks || {};
              (this._callbacks[event] = this._callbacks[event] || []).push(fn);
              return this;
            };
            Emitter.prototype.once = function(event, fn) {
              var self = this;
              this._callbacks = this._callbacks || {};
              function on() {
                self.off(event, on);
                fn.apply(this, arguments);
              }
              on.fn = fn;
              this.on(event, on);
              return this;
            };
            Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
              this._callbacks = this._callbacks || {};
              if (0 == arguments.length) {
                this._callbacks = {};
                return this;
              }
              var callbacks = this._callbacks[event];
              if (!callbacks) return this;
              if (1 == arguments.length) {
                delete this._callbacks[event];
                return this;
              }
              var cb;
              for (var i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb === fn || cb.fn === fn) {
                  callbacks.splice(i, 1);
                  break;
                }
              }
              return this;
            };
            Emitter.prototype.emit = function(event) {
              this._callbacks = this._callbacks || {};
              var args = [].slice.call(arguments, 1), callbacks = this._callbacks[event];
              if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
              }
              return this;
            };
            Emitter.prototype.listeners = function(event) {
              this._callbacks = this._callbacks || {};
              return this._callbacks[event] || [];
            };
            Emitter.prototype.hasListeners = function(event) {
              return !!this.listeners(event).length;
            };
          }, {} ],
          16: [ function(_dereq_, module, exports) {
            module.exports = function(a, b) {
              var fn = function fn() {};
              fn.prototype = b.prototype;
              a.prototype = new fn();
              a.prototype.constructor = a;
            };
          }, {} ],
          17: [ function(_dereq_, module, exports) {
            exports = module.exports = _dereq_("./debug");
            exports.log = log;
            exports.formatArgs = formatArgs;
            exports.save = save;
            exports.load = load;
            exports.useColors = useColors;
            exports.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : localstorage();
            exports.colors = [ "lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson" ];
            function useColors() {
              return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31;
            }
            exports.formatters.j = function(v) {
              return JSON.stringify(v);
            };
            function formatArgs() {
              var args = arguments;
              var useColors = this.useColors;
              args[0] = (useColors ? "%c" : "") + this.namespace + (useColors ? " %c" : " ") + args[0] + (useColors ? "%c " : " ") + "+" + exports.humanize(this.diff);
              if (!useColors) return args;
              var c = "color: " + this.color;
              args = [ args[0], c, "color: inherit" ].concat(Array.prototype.slice.call(args, 1));
              var index = 0;
              var lastC = 0;
              args[0].replace(/%[a-z%]/g, function(match) {
                if ("%%" === match) return;
                index++;
                "%c" === match && (lastC = index);
              });
              args.splice(lastC, 0, c);
              return args;
            }
            function log() {
              return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments);
            }
            function save(namespaces) {
              try {
                null == namespaces ? exports.storage.removeItem("debug") : exports.storage.debug = namespaces;
              } catch (e) {}
            }
            function load() {
              var r;
              try {
                r = exports.storage.debug;
              } catch (e) {}
              return r;
            }
            exports.enable(load());
            function localstorage() {
              try {
                return window.localStorage;
              } catch (e) {}
            }
          }, {
            "./debug": 18
          } ],
          18: [ function(_dereq_, module, exports) {
            exports = module.exports = debug;
            exports.coerce = coerce;
            exports.disable = disable;
            exports.enable = enable;
            exports.enabled = enabled;
            exports.humanize = _dereq_("ms");
            exports.names = [];
            exports.skips = [];
            exports.formatters = {};
            var prevColor = 0;
            var prevTime;
            function selectColor() {
              return exports.colors[prevColor++ % exports.colors.length];
            }
            function debug(namespace) {
              function disabled() {}
              disabled.enabled = false;
              function enabled() {
                var self = enabled;
                var curr = +new Date();
                var ms = curr - (prevTime || curr);
                self.diff = ms;
                self.prev = prevTime;
                self.curr = curr;
                prevTime = curr;
                null == self.useColors && (self.useColors = exports.useColors());
                null == self.color && self.useColors && (self.color = selectColor());
                var args = Array.prototype.slice.call(arguments);
                args[0] = exports.coerce(args[0]);
                "string" !== typeof args[0] && (args = [ "%o" ].concat(args));
                var index = 0;
                args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
                  if ("%%" === match) return match;
                  index++;
                  var formatter = exports.formatters[format];
                  if ("function" === typeof formatter) {
                    var val = args[index];
                    match = formatter.call(self, val);
                    args.splice(index, 1);
                    index--;
                  }
                  return match;
                });
                "function" === typeof exports.formatArgs && (args = exports.formatArgs.apply(self, args));
                var logFn = enabled.log || exports.log || console.log.bind(console);
                logFn.apply(self, args);
              }
              enabled.enabled = true;
              var fn = exports.enabled(namespace) ? enabled : disabled;
              fn.namespace = namespace;
              return fn;
            }
            function enable(namespaces) {
              exports.save(namespaces);
              var split = (namespaces || "").split(/[\s,]+/);
              var len = split.length;
              for (var i = 0; i < len; i++) {
                if (!split[i]) continue;
                namespaces = split[i].replace(/\*/g, ".*?");
                "-" === namespaces[0] ? exports.skips.push(new RegExp("^" + namespaces.substr(1) + "$")) : exports.names.push(new RegExp("^" + namespaces + "$"));
              }
            }
            function disable() {
              exports.enable("");
            }
            function enabled(name) {
              var i, len;
              for (i = 0, len = exports.skips.length; i < len; i++) if (exports.skips[i].test(name)) return false;
              for (i = 0, len = exports.names.length; i < len; i++) if (exports.names[i].test(name)) return true;
              return false;
            }
            function coerce(val) {
              if (val instanceof Error) return val.stack || val.message;
              return val;
            }
          }, {
            ms: 25
          } ],
          19: [ function(_dereq_, module, exports) {
            (function(global) {
              var keys = _dereq_("./keys");
              var hasBinary = _dereq_("has-binary");
              var sliceBuffer = _dereq_("arraybuffer.slice");
              var base64encoder = _dereq_("base64-arraybuffer");
              var after = _dereq_("after");
              var utf8 = _dereq_("utf8");
              var isAndroid = navigator.userAgent.match(/Android/i);
              var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);
              var dontSendBlobs = isAndroid || isPhantomJS;
              exports.protocol = 3;
              var packets = exports.packets = {
                open: 0,
                close: 1,
                ping: 2,
                pong: 3,
                message: 4,
                upgrade: 5,
                noop: 6
              };
              var packetslist = keys(packets);
              var err = {
                type: "error",
                data: "parser error"
              };
              var Blob = _dereq_("blob");
              exports.encodePacket = function(packet, supportsBinary, utf8encode, callback) {
                if ("function" == typeof supportsBinary) {
                  callback = supportsBinary;
                  supportsBinary = false;
                }
                if ("function" == typeof utf8encode) {
                  callback = utf8encode;
                  utf8encode = null;
                }
                var data = void 0 === packet.data ? void 0 : packet.data.buffer || packet.data;
                if (global.ArrayBuffer && data instanceof ArrayBuffer) return encodeArrayBuffer(packet, supportsBinary, callback);
                if (Blob && data instanceof global.Blob) return encodeBlob(packet, supportsBinary, callback);
                if (data && data.base64) return encodeBase64Object(packet, callback);
                var encoded = packets[packet.type];
                void 0 !== packet.data && (encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data));
                return callback("" + encoded);
              };
              function encodeBase64Object(packet, callback) {
                var message = "b" + exports.packets[packet.type] + packet.data.data;
                return callback(message);
              }
              function encodeArrayBuffer(packet, supportsBinary, callback) {
                if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
                var data = packet.data;
                var contentArray = new Uint8Array(data);
                var resultBuffer = new Uint8Array(1 + data.byteLength);
                resultBuffer[0] = packets[packet.type];
                for (var i = 0; i < contentArray.length; i++) resultBuffer[i + 1] = contentArray[i];
                return callback(resultBuffer.buffer);
              }
              function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
                if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
                var fr = new FileReader();
                fr.onload = function() {
                  packet.data = fr.result;
                  exports.encodePacket(packet, supportsBinary, true, callback);
                };
                return fr.readAsArrayBuffer(packet.data);
              }
              function encodeBlob(packet, supportsBinary, callback) {
                if (!supportsBinary) return exports.encodeBase64Packet(packet, callback);
                if (dontSendBlobs) return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
                var length = new Uint8Array(1);
                length[0] = packets[packet.type];
                var blob = new Blob([ length.buffer, packet.data ]);
                return callback(blob);
              }
              exports.encodeBase64Packet = function(packet, callback) {
                var message = "b" + exports.packets[packet.type];
                if (Blob && packet.data instanceof global.Blob) {
                  var fr = new FileReader();
                  fr.onload = function() {
                    var b64 = fr.result.split(",")[1];
                    callback(message + b64);
                  };
                  return fr.readAsDataURL(packet.data);
                }
                var b64data;
                try {
                  b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
                } catch (e) {
                  var typed = new Uint8Array(packet.data);
                  var basic = new Array(typed.length);
                  for (var i = 0; i < typed.length; i++) basic[i] = typed[i];
                  b64data = String.fromCharCode.apply(null, basic);
                }
                message += global.btoa(b64data);
                return callback(message);
              };
              exports.decodePacket = function(data, binaryType, utf8decode) {
                if ("string" == typeof data || void 0 === data) {
                  if ("b" == data.charAt(0)) return exports.decodeBase64Packet(data.substr(1), binaryType);
                  if (utf8decode) try {
                    data = utf8.decode(data);
                  } catch (e) {
                    return err;
                  }
                  var type = data.charAt(0);
                  if (Number(type) != type || !packetslist[type]) return err;
                  return data.length > 1 ? {
                    type: packetslist[type],
                    data: data.substring(1)
                  } : {
                    type: packetslist[type]
                  };
                }
                var asArray = new Uint8Array(data);
                var type = asArray[0];
                var rest = sliceBuffer(data, 1);
                Blob && "blob" === binaryType && (rest = new Blob([ rest ]));
                return {
                  type: packetslist[type],
                  data: rest
                };
              };
              exports.decodeBase64Packet = function(msg, binaryType) {
                var type = packetslist[msg.charAt(0)];
                if (!global.ArrayBuffer) return {
                  type: type,
                  data: {
                    base64: true,
                    data: msg.substr(1)
                  }
                };
                var data = base64encoder.decode(msg.substr(1));
                "blob" === binaryType && Blob && (data = new Blob([ data ]));
                return {
                  type: type,
                  data: data
                };
              };
              exports.encodePayload = function(packets, supportsBinary, callback) {
                if ("function" == typeof supportsBinary) {
                  callback = supportsBinary;
                  supportsBinary = null;
                }
                var isBinary = hasBinary(packets);
                if (supportsBinary && isBinary) {
                  if (Blob && !dontSendBlobs) return exports.encodePayloadAsBlob(packets, callback);
                  return exports.encodePayloadAsArrayBuffer(packets, callback);
                }
                if (!packets.length) return callback("0:");
                function setLengthHeader(message) {
                  return message.length + ":" + message;
                }
                function encodeOne(packet, doneCallback) {
                  exports.encodePacket(packet, !!isBinary && supportsBinary, true, function(message) {
                    doneCallback(null, setLengthHeader(message));
                  });
                }
                map(packets, encodeOne, function(err, results) {
                  return callback(results.join(""));
                });
              };
              function map(ary, each, done) {
                var result = new Array(ary.length);
                var next = after(ary.length, done);
                var eachWithIndex = function eachWithIndex(i, el, cb) {
                  each(el, function(error, msg) {
                    result[i] = msg;
                    cb(error, result);
                  });
                };
                for (var i = 0; i < ary.length; i++) eachWithIndex(i, ary[i], next);
              }
              exports.decodePayload = function(data, binaryType, callback) {
                if ("string" != typeof data) return exports.decodePayloadAsBinary(data, binaryType, callback);
                if ("function" === typeof binaryType) {
                  callback = binaryType;
                  binaryType = null;
                }
                var packet;
                if ("" == data) return callback(err, 0, 1);
                var length = "", n, msg;
                for (var i = 0, l = data.length; i < l; i++) {
                  var chr = data.charAt(i);
                  if (":" != chr) length += chr; else {
                    if ("" == length || length != (n = Number(length))) return callback(err, 0, 1);
                    msg = data.substr(i + 1, n);
                    if (length != msg.length) return callback(err, 0, 1);
                    if (msg.length) {
                      packet = exports.decodePacket(msg, binaryType, true);
                      if (err.type == packet.type && err.data == packet.data) return callback(err, 0, 1);
                      var ret = callback(packet, i + n, l);
                      if (false === ret) return;
                    }
                    i += n;
                    length = "";
                  }
                }
                if ("" != length) return callback(err, 0, 1);
              };
              exports.encodePayloadAsArrayBuffer = function(packets, callback) {
                if (!packets.length) return callback(new ArrayBuffer(0));
                function encodeOne(packet, doneCallback) {
                  exports.encodePacket(packet, true, true, function(data) {
                    return doneCallback(null, data);
                  });
                }
                map(packets, encodeOne, function(err, encodedPackets) {
                  var totalLength = encodedPackets.reduce(function(acc, p) {
                    var len;
                    len = "string" === typeof p ? p.length : p.byteLength;
                    return acc + len.toString().length + len + 2;
                  }, 0);
                  var resultArray = new Uint8Array(totalLength);
                  var bufferIndex = 0;
                  encodedPackets.forEach(function(p) {
                    var isString = "string" === typeof p;
                    var ab = p;
                    if (isString) {
                      var view = new Uint8Array(p.length);
                      for (var i = 0; i < p.length; i++) view[i] = p.charCodeAt(i);
                      ab = view.buffer;
                    }
                    resultArray[bufferIndex++] = isString ? 0 : 1;
                    var lenStr = ab.byteLength.toString();
                    for (var i = 0; i < lenStr.length; i++) resultArray[bufferIndex++] = parseInt(lenStr[i]);
                    resultArray[bufferIndex++] = 255;
                    var view = new Uint8Array(ab);
                    for (var i = 0; i < view.length; i++) resultArray[bufferIndex++] = view[i];
                  });
                  return callback(resultArray.buffer);
                });
              };
              exports.encodePayloadAsBlob = function(packets, callback) {
                function encodeOne(packet, doneCallback) {
                  exports.encodePacket(packet, true, true, function(encoded) {
                    var binaryIdentifier = new Uint8Array(1);
                    binaryIdentifier[0] = 1;
                    if ("string" === typeof encoded) {
                      var view = new Uint8Array(encoded.length);
                      for (var i = 0; i < encoded.length; i++) view[i] = encoded.charCodeAt(i);
                      encoded = view.buffer;
                      binaryIdentifier[0] = 0;
                    }
                    var len = encoded instanceof ArrayBuffer ? encoded.byteLength : encoded.size;
                    var lenStr = len.toString();
                    var lengthAry = new Uint8Array(lenStr.length + 1);
                    for (var i = 0; i < lenStr.length; i++) lengthAry[i] = parseInt(lenStr[i]);
                    lengthAry[lenStr.length] = 255;
                    if (Blob) {
                      var blob = new Blob([ binaryIdentifier.buffer, lengthAry.buffer, encoded ]);
                      doneCallback(null, blob);
                    }
                  });
                }
                map(packets, encodeOne, function(err, results) {
                  return callback(new Blob(results));
                });
              };
              exports.decodePayloadAsBinary = function(data, binaryType, callback) {
                if ("function" === typeof binaryType) {
                  callback = binaryType;
                  binaryType = null;
                }
                var bufferTail = data;
                var buffers = [];
                var numberTooLong = false;
                while (bufferTail.byteLength > 0) {
                  var tailArray = new Uint8Array(bufferTail);
                  var isString = 0 === tailArray[0];
                  var msgLength = "";
                  for (var i = 1; ;i++) {
                    if (255 == tailArray[i]) break;
                    if (msgLength.length > 310) {
                      numberTooLong = true;
                      break;
                    }
                    msgLength += tailArray[i];
                  }
                  if (numberTooLong) return callback(err, 0, 1);
                  bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
                  msgLength = parseInt(msgLength);
                  var msg = sliceBuffer(bufferTail, 0, msgLength);
                  if (isString) try {
                    msg = String.fromCharCode.apply(null, new Uint8Array(msg));
                  } catch (e) {
                    var typed = new Uint8Array(msg);
                    msg = "";
                    for (var i = 0; i < typed.length; i++) msg += String.fromCharCode(typed[i]);
                  }
                  buffers.push(msg);
                  bufferTail = sliceBuffer(bufferTail, msgLength);
                }
                var total = buffers.length;
                buffers.forEach(function(buffer, i) {
                  callback(exports.decodePacket(buffer, binaryType, true), i, total);
                });
              };
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            "./keys": 20,
            after: 11,
            "arraybuffer.slice": 12,
            "base64-arraybuffer": 13,
            blob: 14,
            "has-binary": 21,
            utf8: 29
          } ],
          20: [ function(_dereq_, module, exports) {
            module.exports = Object.keys || function keys(obj) {
              var arr = [];
              var has = Object.prototype.hasOwnProperty;
              for (var i in obj) has.call(obj, i) && arr.push(i);
              return arr;
            };
          }, {} ],
          21: [ function(_dereq_, module, exports) {
            (function(global) {
              var isArray = _dereq_("isarray");
              module.exports = hasBinary;
              function hasBinary(data) {
                function _hasBinary(obj) {
                  if (!obj) return false;
                  if (global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) return true;
                  if (isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) if (_hasBinary(obj[i])) return true;
                  } else if (obj && "object" == typeof obj) {
                    obj.toJSON && (obj = obj.toJSON());
                    for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) return true;
                  }
                  return false;
                }
                return _hasBinary(data);
              }
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            isarray: 24
          } ],
          22: [ function(_dereq_, module, exports) {
            try {
              module.exports = "undefined" !== typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest();
            } catch (err) {
              module.exports = false;
            }
          }, {} ],
          23: [ function(_dereq_, module, exports) {
            var indexOf = [].indexOf;
            module.exports = function(arr, obj) {
              if (indexOf) return arr.indexOf(obj);
              for (var i = 0; i < arr.length; ++i) if (arr[i] === obj) return i;
              return -1;
            };
          }, {} ],
          24: [ function(_dereq_, module, exports) {
            module.exports = Array.isArray || function(arr) {
              return "[object Array]" == Object.prototype.toString.call(arr);
            };
          }, {} ],
          25: [ function(_dereq_, module, exports) {
            var s = 1e3;
            var m = 60 * s;
            var h = 60 * m;
            var d = 24 * h;
            var y = 365.25 * d;
            module.exports = function(val, options) {
              options = options || {};
              if ("string" == typeof val) return parse(val);
              return options["long"] ? _long(val) : _short(val);
            };
            function parse(str) {
              str = "" + str;
              if (str.length > 1e4) return;
              var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
              if (!match) return;
              var n = parseFloat(match[1]);
              var type = (match[2] || "ms").toLowerCase();
              switch (type) {
               case "years":
               case "year":
               case "yrs":
               case "yr":
               case "y":
                return n * y;

               case "days":
               case "day":
               case "d":
                return n * d;

               case "hours":
               case "hour":
               case "hrs":
               case "hr":
               case "h":
                return n * h;

               case "minutes":
               case "minute":
               case "mins":
               case "min":
               case "m":
                return n * m;

               case "seconds":
               case "second":
               case "secs":
               case "sec":
               case "s":
                return n * s;

               case "milliseconds":
               case "millisecond":
               case "msecs":
               case "msec":
               case "ms":
                return n;
              }
            }
            function _short(ms) {
              if (ms >= d) return Math.round(ms / d) + "d";
              if (ms >= h) return Math.round(ms / h) + "h";
              if (ms >= m) return Math.round(ms / m) + "m";
              if (ms >= s) return Math.round(ms / s) + "s";
              return ms + "ms";
            }
            function _long(ms) {
              return plural(ms, d, "day") || plural(ms, h, "hour") || plural(ms, m, "minute") || plural(ms, s, "second") || ms + " ms";
            }
            function plural(ms, n, name) {
              if (ms < n) return;
              if (ms < 1.5 * n) return Math.floor(ms / n) + " " + name;
              return Math.ceil(ms / n) + " " + name + "s";
            }
          }, {} ],
          26: [ function(_dereq_, module, exports) {
            (function(global) {
              var rvalidchars = /^[\],:{}\s]*$/;
              var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
              var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
              var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
              var rtrimLeft = /^\s+/;
              var rtrimRight = /\s+$/;
              module.exports = function parsejson(data) {
                if ("string" != typeof data || !data) return null;
                data = data.replace(rtrimLeft, "").replace(rtrimRight, "");
                if (global.JSON && JSON.parse) return JSON.parse(data);
                if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) return new Function("return " + data)();
              };
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {} ],
          27: [ function(_dereq_, module, exports) {
            exports.encode = function(obj) {
              var str = "";
              for (var i in obj) if (obj.hasOwnProperty(i)) {
                str.length && (str += "&");
                str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
              }
              return str;
            };
            exports.decode = function(qs) {
              var qry = {};
              var pairs = qs.split("&");
              for (var i = 0, l = pairs.length; i < l; i++) {
                var pair = pairs[i].split("=");
                qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
              }
              return qry;
            };
          }, {} ],
          28: [ function(_dereq_, module, exports) {
            var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
            var parts = [ "source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor" ];
            module.exports = function parseuri(str) {
              var src = str, b = str.indexOf("["), e = str.indexOf("]");
              -1 != b && -1 != e && (str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length));
              var m = re.exec(str || ""), uri = {}, i = 14;
              while (i--) uri[parts[i]] = m[i] || "";
              if (-1 != b && -1 != e) {
                uri.source = src;
                uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
                uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
                uri.ipv6uri = true;
              }
              return uri;
            };
          }, {} ],
          29: [ function(_dereq_, module, exports) {
            (function(global) {
              (function(root) {
                var freeExports = "object" == typeof exports && exports;
                var freeModule = "object" == typeof module && module && module.exports == freeExports && module;
                var freeGlobal = "object" == typeof global && global;
                freeGlobal.global !== freeGlobal && freeGlobal.window !== freeGlobal || (root = freeGlobal);
                var stringFromCharCode = String.fromCharCode;
                function ucs2decode(string) {
                  var output = [];
                  var counter = 0;
                  var length = string.length;
                  var value;
                  var extra;
                  while (counter < length) {
                    value = string.charCodeAt(counter++);
                    if (value >= 55296 && value <= 56319 && counter < length) {
                      extra = string.charCodeAt(counter++);
                      if (56320 == (64512 & extra)) output.push(((1023 & value) << 10) + (1023 & extra) + 65536); else {
                        output.push(value);
                        counter--;
                      }
                    } else output.push(value);
                  }
                  return output;
                }
                function ucs2encode(array) {
                  var length = array.length;
                  var index = -1;
                  var value;
                  var output = "";
                  while (++index < length) {
                    value = array[index];
                    if (value > 65535) {
                      value -= 65536;
                      output += stringFromCharCode(value >>> 10 & 1023 | 55296);
                      value = 56320 | 1023 & value;
                    }
                    output += stringFromCharCode(value);
                  }
                  return output;
                }
                function checkScalarValue(codePoint) {
                  if (codePoint >= 55296 && codePoint <= 57343) throw Error("Lone surrogate U+" + codePoint.toString(16).toUpperCase() + " is not a scalar value");
                }
                function createByte(codePoint, shift) {
                  return stringFromCharCode(codePoint >> shift & 63 | 128);
                }
                function encodeCodePoint(codePoint) {
                  if (0 == (4294967168 & codePoint)) return stringFromCharCode(codePoint);
                  var symbol = "";
                  if (0 == (4294965248 & codePoint)) symbol = stringFromCharCode(codePoint >> 6 & 31 | 192); else if (0 == (4294901760 & codePoint)) {
                    checkScalarValue(codePoint);
                    symbol = stringFromCharCode(codePoint >> 12 & 15 | 224);
                    symbol += createByte(codePoint, 6);
                  } else if (0 == (4292870144 & codePoint)) {
                    symbol = stringFromCharCode(codePoint >> 18 & 7 | 240);
                    symbol += createByte(codePoint, 12);
                    symbol += createByte(codePoint, 6);
                  }
                  symbol += stringFromCharCode(63 & codePoint | 128);
                  return symbol;
                }
                function utf8encode(string) {
                  var codePoints = ucs2decode(string);
                  var length = codePoints.length;
                  var index = -1;
                  var codePoint;
                  var byteString = "";
                  while (++index < length) {
                    codePoint = codePoints[index];
                    byteString += encodeCodePoint(codePoint);
                  }
                  return byteString;
                }
                function readContinuationByte() {
                  if (byteIndex >= byteCount) throw Error("Invalid byte index");
                  var continuationByte = 255 & byteArray[byteIndex];
                  byteIndex++;
                  if (128 == (192 & continuationByte)) return 63 & continuationByte;
                  throw Error("Invalid continuation byte");
                }
                function decodeSymbol() {
                  var byte1;
                  var byte2;
                  var byte3;
                  var byte4;
                  var codePoint;
                  if (byteIndex > byteCount) throw Error("Invalid byte index");
                  if (byteIndex == byteCount) return false;
                  byte1 = 255 & byteArray[byteIndex];
                  byteIndex++;
                  if (0 == (128 & byte1)) return byte1;
                  if (192 == (224 & byte1)) {
                    var byte2 = readContinuationByte();
                    codePoint = (31 & byte1) << 6 | byte2;
                    if (codePoint >= 128) return codePoint;
                    throw Error("Invalid continuation byte");
                  }
                  if (224 == (240 & byte1)) {
                    byte2 = readContinuationByte();
                    byte3 = readContinuationByte();
                    codePoint = (15 & byte1) << 12 | byte2 << 6 | byte3;
                    if (codePoint >= 2048) {
                      checkScalarValue(codePoint);
                      return codePoint;
                    }
                    throw Error("Invalid continuation byte");
                  }
                  if (240 == (248 & byte1)) {
                    byte2 = readContinuationByte();
                    byte3 = readContinuationByte();
                    byte4 = readContinuationByte();
                    codePoint = (15 & byte1) << 18 | byte2 << 12 | byte3 << 6 | byte4;
                    if (codePoint >= 65536 && codePoint <= 1114111) return codePoint;
                  }
                  throw Error("Invalid UTF-8 detected");
                }
                var byteArray;
                var byteCount;
                var byteIndex;
                function utf8decode(byteString) {
                  byteArray = ucs2decode(byteString);
                  byteCount = byteArray.length;
                  byteIndex = 0;
                  var codePoints = [];
                  var tmp;
                  while (false !== (tmp = decodeSymbol())) codePoints.push(tmp);
                  return ucs2encode(codePoints);
                }
                var utf8 = {
                  version: "2.0.0",
                  encode: utf8encode,
                  decode: utf8decode
                };
                if ("function" == typeof define && "object" == typeof define.amd && define.amd) define(function() {
                  return utf8;
                }); else if (freeExports && !freeExports.nodeType) if (freeModule) freeModule.exports = utf8; else {
                  var object = {};
                  var hasOwnProperty = object.hasOwnProperty;
                  for (var key in utf8) hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
                } else root.utf8 = utf8;
              })(this);
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {} ],
          30: [ function(_dereq_, module, exports) {
            var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""), length = 64, map = {}, seed = 0, i = 0, prev;
            function encode(num) {
              var encoded = "";
              do {
                encoded = alphabet[num % length] + encoded;
                num = Math.floor(num / length);
              } while (num > 0);
              return encoded;
            }
            function decode(str) {
              var decoded = 0;
              for (i = 0; i < str.length; i++) decoded = decoded * length + map[str.charAt(i)];
              return decoded;
            }
            function yeast() {
              var now = encode(+new Date());
              if (now !== prev) return seed = 0, prev = now;
              return now + "." + encode(seed++);
            }
            for (;i < length; i++) map[alphabet[i]] = i;
            yeast.encode = encode;
            yeast.decode = decode;
            module.exports = yeast;
          }, {} ],
          31: [ function(_dereq_, module, exports) {
            var url = _dereq_("./url");
            var parser = _dereq_("socket.io-parser");
            var Manager = _dereq_("./manager");
            var debug = _dereq_("debug")("socket.io-client");
            module.exports = exports = lookup;
            var cache = exports.managers = {};
            function lookup(uri, opts) {
              if ("object" == typeof uri) {
                opts = uri;
                uri = void 0;
              }
              opts = opts || {};
              var parsed = url(uri);
              var source = parsed.source;
              var id = parsed.id;
              var path = parsed.path;
              var sameNamespace = cache[id] && path in cache[id].nsps;
              var newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
              var io;
              if (newConnection) {
                debug("ignoring socket cache for %s", source);
                io = Manager(source, opts);
              } else {
                if (!cache[id]) {
                  debug("new io instance for %s", source);
                  cache[id] = Manager(source, opts);
                }
                io = cache[id];
              }
              return io.socket(parsed.path);
            }
            exports.protocol = parser.protocol;
            exports.connect = lookup;
            exports.Manager = _dereq_("./manager");
            exports.Socket = _dereq_("./socket");
          }, {
            "./manager": 32,
            "./socket": 34,
            "./url": 35,
            debug: 39,
            "socket.io-parser": 47
          } ],
          32: [ function(_dereq_, module, exports) {
            var eio = _dereq_("engine.io-client");
            var Socket = _dereq_("./socket");
            var Emitter = _dereq_("component-emitter");
            var parser = _dereq_("socket.io-parser");
            var on = _dereq_("./on");
            var bind = _dereq_("component-bind");
            var debug = _dereq_("debug")("socket.io-client:manager");
            var indexOf = _dereq_("indexof");
            var Backoff = _dereq_("backo2");
            var has = Object.prototype.hasOwnProperty;
            module.exports = Manager;
            function Manager(uri, opts) {
              if (!(this instanceof Manager)) return new Manager(uri, opts);
              if (uri && "object" == typeof uri) {
                opts = uri;
                uri = void 0;
              }
              opts = opts || {};
              opts.path = opts.path || "/socket.io";
              this.nsps = {};
              this.subs = [];
              this.opts = opts;
              this.reconnection(false !== opts.reconnection);
              this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
              this.reconnectionDelay(opts.reconnectionDelay || 1e3);
              this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
              this.randomizationFactor(opts.randomizationFactor || .5);
              this.backoff = new Backoff({
                min: this.reconnectionDelay(),
                max: this.reconnectionDelayMax(),
                jitter: this.randomizationFactor()
              });
              this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
              this.readyState = "closed";
              this.uri = uri;
              this.connecting = [];
              this.lastPing = null;
              this.encoding = false;
              this.packetBuffer = [];
              this.encoder = new parser.Encoder();
              this.decoder = new parser.Decoder();
              this.autoConnect = false !== opts.autoConnect;
              this.autoConnect && this.open();
            }
            Manager.prototype.emitAll = function() {
              this.emit.apply(this, arguments);
              for (var nsp in this.nsps) has.call(this.nsps, nsp) && this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
            };
            Manager.prototype.updateSocketIds = function() {
              for (var nsp in this.nsps) has.call(this.nsps, nsp) && (this.nsps[nsp].id = this.engine.id);
            };
            Emitter(Manager.prototype);
            Manager.prototype.reconnection = function(v) {
              if (!arguments.length) return this._reconnection;
              this._reconnection = !!v;
              return this;
            };
            Manager.prototype.reconnectionAttempts = function(v) {
              if (!arguments.length) return this._reconnectionAttempts;
              this._reconnectionAttempts = v;
              return this;
            };
            Manager.prototype.reconnectionDelay = function(v) {
              if (!arguments.length) return this._reconnectionDelay;
              this._reconnectionDelay = v;
              this.backoff && this.backoff.setMin(v);
              return this;
            };
            Manager.prototype.randomizationFactor = function(v) {
              if (!arguments.length) return this._randomizationFactor;
              this._randomizationFactor = v;
              this.backoff && this.backoff.setJitter(v);
              return this;
            };
            Manager.prototype.reconnectionDelayMax = function(v) {
              if (!arguments.length) return this._reconnectionDelayMax;
              this._reconnectionDelayMax = v;
              this.backoff && this.backoff.setMax(v);
              return this;
            };
            Manager.prototype.timeout = function(v) {
              if (!arguments.length) return this._timeout;
              this._timeout = v;
              return this;
            };
            Manager.prototype.maybeReconnectOnOpen = function() {
              !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect();
            };
            Manager.prototype.open = Manager.prototype.connect = function(fn) {
              debug("readyState %s", this.readyState);
              if (~this.readyState.indexOf("open")) return this;
              debug("opening %s", this.uri);
              this.engine = eio(this.uri, this.opts);
              var socket = this.engine;
              var self = this;
              this.readyState = "opening";
              this.skipReconnect = false;
              var openSub = on(socket, "open", function() {
                self.onopen();
                fn && fn();
              });
              var errorSub = on(socket, "error", function(data) {
                debug("connect_error");
                self.cleanup();
                self.readyState = "closed";
                self.emitAll("connect_error", data);
                if (fn) {
                  var err = new Error("Connection error");
                  err.data = data;
                  fn(err);
                } else self.maybeReconnectOnOpen();
              });
              if (false !== this._timeout) {
                var timeout = this._timeout;
                debug("connect attempt will timeout after %d", timeout);
                var timer = setTimeout(function() {
                  debug("connect attempt timed out after %d", timeout);
                  openSub.destroy();
                  socket.close();
                  socket.emit("error", "timeout");
                  self.emitAll("connect_timeout", timeout);
                }, timeout);
                this.subs.push({
                  destroy: function destroy() {
                    clearTimeout(timer);
                  }
                });
              }
              this.subs.push(openSub);
              this.subs.push(errorSub);
              return this;
            };
            Manager.prototype.onopen = function() {
              debug("open");
              this.cleanup();
              this.readyState = "open";
              this.emit("open");
              var socket = this.engine;
              this.subs.push(on(socket, "data", bind(this, "ondata")));
              this.subs.push(on(socket, "ping", bind(this, "onping")));
              this.subs.push(on(socket, "pong", bind(this, "onpong")));
              this.subs.push(on(socket, "error", bind(this, "onerror")));
              this.subs.push(on(socket, "close", bind(this, "onclose")));
              this.subs.push(on(this.decoder, "decoded", bind(this, "ondecoded")));
            };
            Manager.prototype.onping = function() {
              this.lastPing = new Date();
              this.emitAll("ping");
            };
            Manager.prototype.onpong = function() {
              this.emitAll("pong", new Date() - this.lastPing);
            };
            Manager.prototype.ondata = function(data) {
              this.decoder.add(data);
            };
            Manager.prototype.ondecoded = function(packet) {
              this.emit("packet", packet);
            };
            Manager.prototype.onerror = function(err) {
              debug("error", err);
              this.emitAll("error", err);
            };
            Manager.prototype.socket = function(nsp) {
              var socket = this.nsps[nsp];
              if (!socket) {
                socket = new Socket(this, nsp);
                this.nsps[nsp] = socket;
                var self = this;
                socket.on("connecting", onConnecting);
                socket.on("connect", function() {
                  socket.id = self.engine.id;
                });
                this.autoConnect && onConnecting();
              }
              function onConnecting() {
                ~indexOf(self.connecting, socket) || self.connecting.push(socket);
              }
              return socket;
            };
            Manager.prototype.destroy = function(socket) {
              var index = indexOf(this.connecting, socket);
              ~index && this.connecting.splice(index, 1);
              if (this.connecting.length) return;
              this.close();
            };
            Manager.prototype.packet = function(packet) {
              debug("writing packet %j", packet);
              var self = this;
              if (self.encoding) self.packetBuffer.push(packet); else {
                self.encoding = true;
                this.encoder.encode(packet, function(encodedPackets) {
                  for (var i = 0; i < encodedPackets.length; i++) self.engine.write(encodedPackets[i], packet.options);
                  self.encoding = false;
                  self.processPacketQueue();
                });
              }
            };
            Manager.prototype.processPacketQueue = function() {
              if (this.packetBuffer.length > 0 && !this.encoding) {
                var pack = this.packetBuffer.shift();
                this.packet(pack);
              }
            };
            Manager.prototype.cleanup = function() {
              debug("cleanup");
              var sub;
              while (sub = this.subs.shift()) sub.destroy();
              this.packetBuffer = [];
              this.encoding = false;
              this.lastPing = null;
              this.decoder.destroy();
            };
            Manager.prototype.close = Manager.prototype.disconnect = function() {
              debug("disconnect");
              this.skipReconnect = true;
              this.reconnecting = false;
              "opening" == this.readyState && this.cleanup();
              this.backoff.reset();
              this.readyState = "closed";
              this.engine && this.engine.close();
            };
            Manager.prototype.onclose = function(reason) {
              debug("onclose");
              this.cleanup();
              this.backoff.reset();
              this.readyState = "closed";
              this.emit("close", reason);
              this._reconnection && !this.skipReconnect && this.reconnect();
            };
            Manager.prototype.reconnect = function() {
              if (this.reconnecting || this.skipReconnect) return this;
              var self = this;
              if (this.backoff.attempts >= this._reconnectionAttempts) {
                debug("reconnect failed");
                this.backoff.reset();
                this.emitAll("reconnect_failed");
                this.reconnecting = false;
              } else {
                var delay = this.backoff.duration();
                debug("will wait %dms before reconnect attempt", delay);
                this.reconnecting = true;
                var timer = setTimeout(function() {
                  if (self.skipReconnect) return;
                  debug("attempting reconnect");
                  self.emitAll("reconnect_attempt", self.backoff.attempts);
                  self.emitAll("reconnecting", self.backoff.attempts);
                  if (self.skipReconnect) return;
                  self.open(function(err) {
                    if (err) {
                      debug("reconnect attempt error");
                      self.reconnecting = false;
                      self.reconnect();
                      self.emitAll("reconnect_error", err.data);
                    } else {
                      debug("reconnect success");
                      self.onreconnect();
                    }
                  });
                }, delay);
                this.subs.push({
                  destroy: function destroy() {
                    clearTimeout(timer);
                  }
                });
              }
            };
            Manager.prototype.onreconnect = function() {
              var attempt = this.backoff.attempts;
              this.reconnecting = false;
              this.backoff.reset();
              this.updateSocketIds();
              this.emitAll("reconnect", attempt);
            };
          }, {
            "./on": 33,
            "./socket": 34,
            backo2: 36,
            "component-bind": 37,
            "component-emitter": 38,
            debug: 39,
            "engine.io-client": 1,
            indexof: 42,
            "socket.io-parser": 47
          } ],
          33: [ function(_dereq_, module, exports) {
            module.exports = on;
            function on(obj, ev, fn) {
              obj.on(ev, fn);
              return {
                destroy: function destroy() {
                  obj.removeListener(ev, fn);
                }
              };
            }
          }, {} ],
          34: [ function(_dereq_, module, exports) {
            var parser = _dereq_("socket.io-parser");
            var Emitter = _dereq_("component-emitter");
            var toArray = _dereq_("to-array");
            var on = _dereq_("./on");
            var bind = _dereq_("component-bind");
            var debug = _dereq_("debug")("socket.io-client:socket");
            var hasBin = _dereq_("has-binary");
            module.exports = exports = Socket;
            var events = {
              connect: 1,
              connect_error: 1,
              connect_timeout: 1,
              connecting: 1,
              disconnect: 1,
              error: 1,
              reconnect: 1,
              reconnect_attempt: 1,
              reconnect_failed: 1,
              reconnect_error: 1,
              reconnecting: 1,
              ping: 1,
              pong: 1
            };
            var emit = Emitter.prototype.emit;
            function Socket(io, nsp) {
              this.io = io;
              this.nsp = nsp;
              this.json = this;
              this.ids = 0;
              this.acks = {};
              this.receiveBuffer = [];
              this.sendBuffer = [];
              this.connected = false;
              this.disconnected = true;
              this.io.autoConnect && this.open();
            }
            Emitter(Socket.prototype);
            Socket.prototype.subEvents = function() {
              if (this.subs) return;
              var io = this.io;
              this.subs = [ on(io, "open", bind(this, "onopen")), on(io, "packet", bind(this, "onpacket")), on(io, "close", bind(this, "onclose")) ];
            };
            Socket.prototype.open = Socket.prototype.connect = function() {
              if (this.connected) return this;
              this.subEvents();
              this.io.open();
              "open" == this.io.readyState && this.onopen();
              this.emit("connecting");
              return this;
            };
            Socket.prototype.send = function() {
              var args = toArray(arguments);
              args.unshift("message");
              this.emit.apply(this, args);
              return this;
            };
            Socket.prototype.emit = function(ev) {
              if (events.hasOwnProperty(ev)) {
                emit.apply(this, arguments);
                return this;
              }
              var args = toArray(arguments);
              var parserType = parser.EVENT;
              hasBin(args) && (parserType = parser.BINARY_EVENT);
              var packet = {
                type: parserType,
                data: args
              };
              packet.options = {};
              packet.options.compress = !this.flags || false !== this.flags.compress;
              if ("function" == typeof args[args.length - 1]) {
                debug("emitting packet with ack id %d", this.ids);
                this.acks[this.ids] = args.pop();
                packet.id = this.ids++;
              }
              this.connected ? this.packet(packet) : this.sendBuffer.push(packet);
              delete this.flags;
              return this;
            };
            Socket.prototype.packet = function(packet) {
              packet.nsp = this.nsp;
              this.io.packet(packet);
            };
            Socket.prototype.onopen = function() {
              debug("transport is open - connecting");
              "/" != this.nsp && this.packet({
                type: parser.CONNECT
              });
            };
            Socket.prototype.onclose = function(reason) {
              debug("close (%s)", reason);
              this.connected = false;
              this.disconnected = true;
              delete this.id;
              this.emit("disconnect", reason);
            };
            Socket.prototype.onpacket = function(packet) {
              if (packet.nsp != this.nsp) return;
              switch (packet.type) {
               case parser.CONNECT:
                this.onconnect();
                break;

               case parser.EVENT:
               case parser.BINARY_EVENT:
                this.onevent(packet);
                break;

               case parser.ACK:
               case parser.BINARY_ACK:
                this.onack(packet);
                break;

               case parser.DISCONNECT:
                this.ondisconnect();
                break;

               case parser.ERROR:
                this.emit("error", packet.data);
              }
            };
            Socket.prototype.onevent = function(packet) {
              var args = packet.data || [];
              debug("emitting event %j", args);
              if (null != packet.id) {
                debug("attaching ack callback to event");
                args.push(this.ack(packet.id));
              }
              this.connected ? emit.apply(this, args) : this.receiveBuffer.push(args);
            };
            Socket.prototype.ack = function(id) {
              var self = this;
              var sent = false;
              return function() {
                if (sent) return;
                sent = true;
                var args = toArray(arguments);
                debug("sending ack %j", args);
                var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
                self.packet({
                  type: type,
                  id: id,
                  data: args
                });
              };
            };
            Socket.prototype.onack = function(packet) {
              var ack = this.acks[packet.id];
              if ("function" == typeof ack) {
                debug("calling ack %s with %j", packet.id, packet.data);
                ack.apply(this, packet.data);
                delete this.acks[packet.id];
              } else debug("bad ack %s", packet.id);
            };
            Socket.prototype.onconnect = function() {
              this.connected = true;
              this.disconnected = false;
              this.emit("connect");
              this.emitBuffered();
            };
            Socket.prototype.emitBuffered = function() {
              var i;
              for (i = 0; i < this.receiveBuffer.length; i++) emit.apply(this, this.receiveBuffer[i]);
              this.receiveBuffer = [];
              for (i = 0; i < this.sendBuffer.length; i++) this.packet(this.sendBuffer[i]);
              this.sendBuffer = [];
            };
            Socket.prototype.ondisconnect = function() {
              debug("server disconnect (%s)", this.nsp);
              this.destroy();
              this.onclose("io server disconnect");
            };
            Socket.prototype.destroy = function() {
              if (this.subs) {
                for (var i = 0; i < this.subs.length; i++) this.subs[i].destroy();
                this.subs = null;
              }
              this.io.destroy(this);
            };
            Socket.prototype.close = Socket.prototype.disconnect = function() {
              if (this.connected) {
                debug("performing disconnect (%s)", this.nsp);
                this.packet({
                  type: parser.DISCONNECT
                });
              }
              this.destroy();
              this.connected && this.onclose("io client disconnect");
              return this;
            };
            Socket.prototype.compress = function(compress) {
              this.flags = this.flags || {};
              this.flags.compress = compress;
              return this;
            };
          }, {
            "./on": 33,
            "component-bind": 37,
            "component-emitter": 38,
            debug: 39,
            "has-binary": 41,
            "socket.io-parser": 47,
            "to-array": 51
          } ],
          35: [ function(_dereq_, module, exports) {
            (function(global) {
              var parseuri = _dereq_("parseuri");
              var debug = _dereq_("debug")("socket.io-client:url");
              module.exports = url;
              function url(uri, loc) {
                var obj = uri;
                var loc = loc || global.location;
                null == uri && (uri = loc.protocol + "//" + loc.host);
                if ("string" == typeof uri) {
                  "/" == uri.charAt(0) && (uri = "/" == uri.charAt(1) ? loc.protocol + uri : loc.host + uri);
                  if (!/^(https?|wss?):\/\//.test(uri)) {
                    debug("protocol-less url %s", uri);
                    uri = "undefined" != typeof loc ? loc.protocol + "//" + uri : "https://" + uri;
                  }
                  debug("parse %s", uri);
                  obj = parseuri(uri);
                }
                obj.port || (/^(http|ws)$/.test(obj.protocol) ? obj.port = "80" : /^(http|ws)s$/.test(obj.protocol) && (obj.port = "443"));
                obj.path = obj.path || "/";
                var ipv6 = -1 !== obj.host.indexOf(":");
                var host = ipv6 ? "[" + obj.host + "]" : obj.host;
                obj.id = obj.protocol + "://" + host + ":" + obj.port;
                obj.href = obj.protocol + "://" + host + (loc && loc.port == obj.port ? "" : ":" + obj.port);
                return obj;
              }
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            debug: 39,
            parseuri: 45
          } ],
          36: [ function(_dereq_, module, exports) {
            module.exports = Backoff;
            function Backoff(opts) {
              opts = opts || {};
              this.ms = opts.min || 100;
              this.max = opts.max || 1e4;
              this.factor = opts.factor || 2;
              this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
              this.attempts = 0;
            }
            Backoff.prototype.duration = function() {
              var ms = this.ms * Math.pow(this.factor, this.attempts++);
              if (this.jitter) {
                var rand = Math.random();
                var deviation = Math.floor(rand * this.jitter * ms);
                ms = 0 == (1 & Math.floor(10 * rand)) ? ms - deviation : ms + deviation;
              }
              return 0 | Math.min(ms, this.max);
            };
            Backoff.prototype.reset = function() {
              this.attempts = 0;
            };
            Backoff.prototype.setMin = function(min) {
              this.ms = min;
            };
            Backoff.prototype.setMax = function(max) {
              this.max = max;
            };
            Backoff.prototype.setJitter = function(jitter) {
              this.jitter = jitter;
            };
          }, {} ],
          37: [ function(_dereq_, module, exports) {
            var slice = [].slice;
            module.exports = function(obj, fn) {
              "string" == typeof fn && (fn = obj[fn]);
              if ("function" != typeof fn) throw new Error("bind() requires a function");
              var args = slice.call(arguments, 2);
              return function() {
                return fn.apply(obj, args.concat(slice.call(arguments)));
              };
            };
          }, {} ],
          38: [ function(_dereq_, module, exports) {
            module.exports = Emitter;
            function Emitter(obj) {
              if (obj) return mixin(obj);
            }
            function mixin(obj) {
              for (var key in Emitter.prototype) obj[key] = Emitter.prototype[key];
              return obj;
            }
            Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
              this._callbacks = this._callbacks || {};
              (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
              return this;
            };
            Emitter.prototype.once = function(event, fn) {
              function on() {
                this.off(event, on);
                fn.apply(this, arguments);
              }
              on.fn = fn;
              this.on(event, on);
              return this;
            };
            Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
              this._callbacks = this._callbacks || {};
              if (0 == arguments.length) {
                this._callbacks = {};
                return this;
              }
              var callbacks = this._callbacks["$" + event];
              if (!callbacks) return this;
              if (1 == arguments.length) {
                delete this._callbacks["$" + event];
                return this;
              }
              var cb;
              for (var i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                if (cb === fn || cb.fn === fn) {
                  callbacks.splice(i, 1);
                  break;
                }
              }
              return this;
            };
            Emitter.prototype.emit = function(event) {
              this._callbacks = this._callbacks || {};
              var args = [].slice.call(arguments, 1), callbacks = this._callbacks["$" + event];
              if (callbacks) {
                callbacks = callbacks.slice(0);
                for (var i = 0, len = callbacks.length; i < len; ++i) callbacks[i].apply(this, args);
              }
              return this;
            };
            Emitter.prototype.listeners = function(event) {
              this._callbacks = this._callbacks || {};
              return this._callbacks["$" + event] || [];
            };
            Emitter.prototype.hasListeners = function(event) {
              return !!this.listeners(event).length;
            };
          }, {} ],
          39: [ function(_dereq_, module, exports) {
            arguments[4][17][0].apply(exports, arguments);
          }, {
            "./debug": 40,
            dup: 17
          } ],
          40: [ function(_dereq_, module, exports) {
            arguments[4][18][0].apply(exports, arguments);
          }, {
            dup: 18,
            ms: 44
          } ],
          41: [ function(_dereq_, module, exports) {
            (function(global) {
              var isArray = _dereq_("isarray");
              module.exports = hasBinary;
              function hasBinary(data) {
                function _hasBinary(obj) {
                  if (!obj) return false;
                  if (global.Buffer && global.Buffer.isBuffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer || global.Blob && obj instanceof Blob || global.File && obj instanceof File) return true;
                  if (isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) if (_hasBinary(obj[i])) return true;
                  } else if (obj && "object" == typeof obj) {
                    obj.toJSON && "function" == typeof obj.toJSON && (obj = obj.toJSON());
                    for (var key in obj) if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) return true;
                  }
                  return false;
                }
                return _hasBinary(data);
              }
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            isarray: 43
          } ],
          42: [ function(_dereq_, module, exports) {
            arguments[4][23][0].apply(exports, arguments);
          }, {
            dup: 23
          } ],
          43: [ function(_dereq_, module, exports) {
            arguments[4][24][0].apply(exports, arguments);
          }, {
            dup: 24
          } ],
          44: [ function(_dereq_, module, exports) {
            arguments[4][25][0].apply(exports, arguments);
          }, {
            dup: 25
          } ],
          45: [ function(_dereq_, module, exports) {
            arguments[4][28][0].apply(exports, arguments);
          }, {
            dup: 28
          } ],
          46: [ function(_dereq_, module, exports) {
            (function(global) {
              var isArray = _dereq_("isarray");
              var isBuf = _dereq_("./is-buffer");
              exports.deconstructPacket = function(packet) {
                var buffers = [];
                var packetData = packet.data;
                function _deconstructPacket(data) {
                  if (!data) return data;
                  if (isBuf(data)) {
                    var placeholder = {
                      _placeholder: true,
                      num: buffers.length
                    };
                    buffers.push(data);
                    return placeholder;
                  }
                  if (isArray(data)) {
                    var newData = new Array(data.length);
                    for (var i = 0; i < data.length; i++) newData[i] = _deconstructPacket(data[i]);
                    return newData;
                  }
                  if ("object" == typeof data && !(data instanceof Date)) {
                    var newData = {};
                    for (var key in data) newData[key] = _deconstructPacket(data[key]);
                    return newData;
                  }
                  return data;
                }
                var pack = packet;
                pack.data = _deconstructPacket(packetData);
                pack.attachments = buffers.length;
                return {
                  packet: pack,
                  buffers: buffers
                };
              };
              exports.reconstructPacket = function(packet, buffers) {
                var curPlaceHolder = 0;
                function _reconstructPacket(data) {
                  if (data && data._placeholder) {
                    var buf = buffers[data.num];
                    return buf;
                  }
                  if (isArray(data)) {
                    for (var i = 0; i < data.length; i++) data[i] = _reconstructPacket(data[i]);
                    return data;
                  }
                  if (data && "object" == typeof data) {
                    for (var key in data) data[key] = _reconstructPacket(data[key]);
                    return data;
                  }
                  return data;
                }
                packet.data = _reconstructPacket(packet.data);
                packet.attachments = void 0;
                return packet;
              };
              exports.removeBlobs = function(data, callback) {
                function _removeBlobs(obj, curKey, containingObject) {
                  if (!obj) return obj;
                  if (global.Blob && obj instanceof Blob || global.File && obj instanceof File) {
                    pendingBlobs++;
                    var fileReader = new FileReader();
                    fileReader.onload = function() {
                      containingObject ? containingObject[curKey] = this.result : bloblessData = this.result;
                      --pendingBlobs || callback(bloblessData);
                    };
                    fileReader.readAsArrayBuffer(obj);
                  } else if (isArray(obj)) for (var i = 0; i < obj.length; i++) _removeBlobs(obj[i], i, obj); else if (obj && "object" == typeof obj && !isBuf(obj)) for (var key in obj) _removeBlobs(obj[key], key, obj);
                }
                var pendingBlobs = 0;
                var bloblessData = data;
                _removeBlobs(bloblessData);
                pendingBlobs || callback(bloblessData);
              };
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {
            "./is-buffer": 48,
            isarray: 43
          } ],
          47: [ function(_dereq_, module, exports) {
            var debug = _dereq_("debug")("socket.io-parser");
            var json = _dereq_("json3");
            var isArray = _dereq_("isarray");
            var Emitter = _dereq_("component-emitter");
            var binary = _dereq_("./binary");
            var isBuf = _dereq_("./is-buffer");
            exports.protocol = 4;
            exports.types = [ "CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR" ];
            exports.CONNECT = 0;
            exports.DISCONNECT = 1;
            exports.EVENT = 2;
            exports.ACK = 3;
            exports.ERROR = 4;
            exports.BINARY_EVENT = 5;
            exports.BINARY_ACK = 6;
            exports.Encoder = Encoder;
            exports.Decoder = Decoder;
            function Encoder() {}
            Encoder.prototype.encode = function(obj, callback) {
              debug("encoding packet %j", obj);
              if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) encodeAsBinary(obj, callback); else {
                var encoding = encodeAsString(obj);
                callback([ encoding ]);
              }
            };
            function encodeAsString(obj) {
              var str = "";
              var nsp = false;
              str += obj.type;
              if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
                str += obj.attachments;
                str += "-";
              }
              if (obj.nsp && "/" != obj.nsp) {
                nsp = true;
                str += obj.nsp;
              }
              if (null != obj.id) {
                if (nsp) {
                  str += ",";
                  nsp = false;
                }
                str += obj.id;
              }
              if (null != obj.data) {
                nsp && (str += ",");
                str += json.stringify(obj.data);
              }
              debug("encoded %j as %s", obj, str);
              return str;
            }
            function encodeAsBinary(obj, callback) {
              function writeEncoding(bloblessData) {
                var deconstruction = binary.deconstructPacket(bloblessData);
                var pack = encodeAsString(deconstruction.packet);
                var buffers = deconstruction.buffers;
                buffers.unshift(pack);
                callback(buffers);
              }
              binary.removeBlobs(obj, writeEncoding);
            }
            function Decoder() {
              this.reconstructor = null;
            }
            Emitter(Decoder.prototype);
            Decoder.prototype.add = function(obj) {
              var packet;
              if ("string" == typeof obj) {
                packet = decodeString(obj);
                if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) {
                  this.reconstructor = new BinaryReconstructor(packet);
                  0 === this.reconstructor.reconPack.attachments && this.emit("decoded", packet);
                } else this.emit("decoded", packet);
              } else {
                if (!isBuf(obj) && !obj.base64) throw new Error("Unknown type: " + obj);
                if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                  this.reconstructor = null;
                  this.emit("decoded", packet);
                }
              }
            };
            function decodeString(str) {
              var p = {};
              var i = 0;
              p.type = Number(str.charAt(0));
              if (null == exports.types[p.type]) return error();
              if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
                var buf = "";
                while ("-" != str.charAt(++i)) {
                  buf += str.charAt(i);
                  if (i == str.length) break;
                }
                if (buf != Number(buf) || "-" != str.charAt(i)) throw new Error("Illegal attachments");
                p.attachments = Number(buf);
              }
              if ("/" == str.charAt(i + 1)) {
                p.nsp = "";
                while (++i) {
                  var c = str.charAt(i);
                  if ("," == c) break;
                  p.nsp += c;
                  if (i == str.length) break;
                }
              } else p.nsp = "/";
              var next = str.charAt(i + 1);
              if ("" !== next && Number(next) == next) {
                p.id = "";
                while (++i) {
                  var c = str.charAt(i);
                  if (null == c || Number(c) != c) {
                    --i;
                    break;
                  }
                  p.id += str.charAt(i);
                  if (i == str.length) break;
                }
                p.id = Number(p.id);
              }
              if (str.charAt(++i)) try {
                p.data = json.parse(str.substr(i));
              } catch (e) {
                return error();
              }
              debug("decoded %s as %j", str, p);
              return p;
            }
            Decoder.prototype.destroy = function() {
              this.reconstructor && this.reconstructor.finishedReconstruction();
            };
            function BinaryReconstructor(packet) {
              this.reconPack = packet;
              this.buffers = [];
            }
            BinaryReconstructor.prototype.takeBinaryData = function(binData) {
              this.buffers.push(binData);
              if (this.buffers.length == this.reconPack.attachments) {
                var packet = binary.reconstructPacket(this.reconPack, this.buffers);
                this.finishedReconstruction();
                return packet;
              }
              return null;
            };
            BinaryReconstructor.prototype.finishedReconstruction = function() {
              this.reconPack = null;
              this.buffers = [];
            };
            function error(data) {
              return {
                type: exports.ERROR,
                data: "parser error"
              };
            }
          }, {
            "./binary": 46,
            "./is-buffer": 48,
            "component-emitter": 49,
            debug: 39,
            isarray: 43,
            json3: 50
          } ],
          48: [ function(_dereq_, module, exports) {
            (function(global) {
              module.exports = isBuf;
              function isBuf(obj) {
                return global.Buffer && global.Buffer.isBuffer(obj) || global.ArrayBuffer && obj instanceof ArrayBuffer;
              }
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {} ],
          49: [ function(_dereq_, module, exports) {
            arguments[4][15][0].apply(exports, arguments);
          }, {
            dup: 15
          } ],
          50: [ function(_dereq_, module, exports) {
            (function(global) {
              (function() {
                var isLoader = "function" === typeof define && define.amd;
                var objectTypes = {
                  function: true,
                  object: true
                };
                var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
                var root = objectTypes[typeof window] && window || this, freeGlobal = freeExports && objectTypes[typeof module] && module && !module.nodeType && "object" == typeof global && global;
                !freeGlobal || freeGlobal["global"] !== freeGlobal && freeGlobal["window"] !== freeGlobal && freeGlobal["self"] !== freeGlobal || (root = freeGlobal);
                function runInContext(context, exports) {
                  context || (context = root["Object"]());
                  exports || (exports = root["Object"]());
                  var Number = context["Number"] || root["Number"], String = context["String"] || root["String"], Object = context["Object"] || root["Object"], Date = context["Date"] || root["Date"], SyntaxError = context["SyntaxError"] || root["SyntaxError"], TypeError = context["TypeError"] || root["TypeError"], Math = context["Math"] || root["Math"], nativeJSON = context["JSON"] || root["JSON"];
                  if ("object" == typeof nativeJSON && nativeJSON) {
                    exports.stringify = nativeJSON.stringify;
                    exports.parse = nativeJSON.parse;
                  }
                  var objectProto = Object.prototype, getClass = objectProto.toString, _isProperty, _forEach, undef;
                  var isExtended = new Date(-0xc782b5b800cec);
                  try {
                    isExtended = -109252 == isExtended.getUTCFullYear() && 0 === isExtended.getUTCMonth() && 1 === isExtended.getUTCDate() && 10 == isExtended.getUTCHours() && 37 == isExtended.getUTCMinutes() && 6 == isExtended.getUTCSeconds() && 708 == isExtended.getUTCMilliseconds();
                  } catch (exception) {}
                  function has(name) {
                    if (has[name] !== undef) return has[name];
                    var isSupported;
                    if ("bug-string-char-index" == name) isSupported = "a" != "a"[0]; else if ("json" == name) isSupported = has("json-stringify") && has("json-parse"); else {
                      var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                      if ("json-stringify" == name) {
                        var stringify = exports.stringify, stringifySupported = "function" == typeof stringify && isExtended;
                        if (stringifySupported) {
                          (value = function value() {
                            return 1;
                          }).toJSON = value;
                          try {
                            stringifySupported = "0" === stringify(0) && "0" === stringify(new Number()) && '""' == stringify(new String()) && stringify(getClass) === undef && stringify(undef) === undef && stringify() === undef && "1" === stringify(value) && "[1]" == stringify([ value ]) && "[null]" == stringify([ undef ]) && "null" == stringify(null) && "[null,null,null]" == stringify([ undef, getClass, null ]) && stringify({
                              a: [ value, true, false, null, "\0\b\n\f\r\t" ]
                            }) == serialized && "1" === stringify(null, value) && "[\n 1,\n 2\n]" == stringify([ 1, 2 ], null, 1) && '"-271821-04-20T00:00:00.000Z"' == stringify(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == stringify(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == stringify(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == stringify(new Date(-1));
                          } catch (exception) {
                            stringifySupported = false;
                          }
                        }
                        isSupported = stringifySupported;
                      }
                      if ("json-parse" == name) {
                        var parse = exports.parse;
                        if ("function" == typeof parse) try {
                          if (0 === parse("0") && !parse(false)) {
                            value = parse(serialized);
                            var parseSupported = 5 == value["a"].length && 1 === value["a"][0];
                            if (parseSupported) {
                              try {
                                parseSupported = !parse('"\t"');
                              } catch (exception) {}
                              if (parseSupported) try {
                                parseSupported = 1 !== parse("01");
                              } catch (exception) {}
                              if (parseSupported) try {
                                parseSupported = 1 !== parse("1.");
                              } catch (exception) {}
                            }
                          }
                        } catch (exception) {
                          parseSupported = false;
                        }
                        isSupported = parseSupported;
                      }
                    }
                    return has[name] = !!isSupported;
                  }
                  if (!has("json")) {
                    var functionClass = "[object Function]", dateClass = "[object Date]", numberClass = "[object Number]", stringClass = "[object String]", arrayClass = "[object Array]", booleanClass = "[object Boolean]";
                    var charIndexBuggy = has("bug-string-char-index");
                    if (!isExtended) {
                      var floor = Math.floor;
                      var Months = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ];
                      var getDay = function getDay(year, month) {
                        return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                      };
                    }
                    (_isProperty = objectProto.hasOwnProperty) || (_isProperty = function isProperty(property) {
                      var members = {}, constructor;
                      if ((members.__proto__ = null, members.__proto__ = {
                        toString: 1
                      }, members).toString != getClass) _isProperty = function isProperty(property) {
                        var original = this.__proto__, result = property in (this.__proto__ = null, this);
                        this.__proto__ = original;
                        return result;
                      }; else {
                        constructor = members.constructor;
                        _isProperty = function isProperty(property) {
                          var parent = (this.constructor || constructor).prototype;
                          return property in this && !(property in parent && this[property] === parent[property]);
                        };
                      }
                      members = null;
                      return _isProperty.call(this, property);
                    });
                    _forEach = function forEach(object, callback) {
                      var size = 0, Properties, members, property;
                      (Properties = function Properties() {
                        this.valueOf = 0;
                      }).prototype.valueOf = 0;
                      members = new Properties();
                      for (property in members) _isProperty.call(members, property) && size++;
                      Properties = members = null;
                      if (size) _forEach = 2 == size ? function forEach(object, callback) {
                        var members = {}, isFunction = getClass.call(object) == functionClass, property;
                        for (property in object) isFunction && "prototype" == property || _isProperty.call(members, property) || !(members[property] = 1) || !_isProperty.call(object, property) || callback(property);
                      } : function forEach(object, callback) {
                        var isFunction = getClass.call(object) == functionClass, property, isConstructor;
                        for (property in object) isFunction && "prototype" == property || !_isProperty.call(object, property) || (isConstructor = "constructor" === property) || callback(property);
                        (isConstructor || _isProperty.call(object, property = "constructor")) && callback(property);
                      }; else {
                        members = [ "valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor" ];
                        _forEach = function forEach(object, callback) {
                          var isFunction = getClass.call(object) == functionClass, property, length;
                          var hasProperty = !isFunction && "function" != typeof object.constructor && objectTypes[typeof object.hasOwnProperty] && object.hasOwnProperty || _isProperty;
                          for (property in object) isFunction && "prototype" == property || !hasProperty.call(object, property) || callback(property);
                          for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property)) ;
                        };
                      }
                      return _forEach(object, callback);
                    };
                    if (!has("json-stringify")) {
                      var Escapes = {
                        92: "\\\\",
                        34: '\\"',
                        8: "\\b",
                        12: "\\f",
                        10: "\\n",
                        13: "\\r",
                        9: "\\t"
                      };
                      var leadingZeroes = "000000";
                      var toPaddedString = function toPaddedString(width, value) {
                        return (leadingZeroes + (value || 0)).slice(-width);
                      };
                      var unicodePrefix = "\\u00";
                      var quote = function quote(value) {
                        var result = '"', index = 0, length = value.length, useCharIndex = !charIndexBuggy || length > 10;
                        var symbols = useCharIndex && (charIndexBuggy ? value.split("") : value);
                        for (;index < length; index++) {
                          var charCode = value.charCodeAt(index);
                          switch (charCode) {
                           case 8:
                           case 9:
                           case 10:
                           case 12:
                           case 13:
                           case 34:
                           case 92:
                            result += Escapes[charCode];
                            break;

                           default:
                            if (charCode < 32) {
                              result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                              break;
                            }
                            result += useCharIndex ? symbols[index] : value.charAt(index);
                          }
                        }
                        return result + '"';
                      };
                      var serialize = function serialize(property, object, callback, properties, whitespace, indentation, stack) {
                        var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                        try {
                          value = object[property];
                        } catch (exception) {}
                        if ("object" == typeof value && value) {
                          className = getClass.call(value);
                          if (className != dateClass || _isProperty.call(value, "toJSON")) "function" == typeof value.toJSON && (className != numberClass && className != stringClass && className != arrayClass || _isProperty.call(value, "toJSON")) && (value = value.toJSON(property)); else if (value > -1 / 0 && value < 1 / 0) {
                            if (getDay) {
                              date = floor(value / 864e5);
                              for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++) ;
                              for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++) ;
                              date = 1 + date - getDay(year, month);
                              time = (value % 864e5 + 864e5) % 864e5;
                              hours = floor(time / 36e5) % 24;
                              minutes = floor(time / 6e4) % 60;
                              seconds = floor(time / 1e3) % 60;
                              milliseconds = time % 1e3;
                            } else {
                              year = value.getUTCFullYear();
                              month = value.getUTCMonth();
                              date = value.getUTCDate();
                              hours = value.getUTCHours();
                              minutes = value.getUTCMinutes();
                              seconds = value.getUTCSeconds();
                              milliseconds = value.getUTCMilliseconds();
                            }
                            value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) + "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) + "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) + "." + toPaddedString(3, milliseconds) + "Z";
                          } else value = null;
                        }
                        callback && (value = callback.call(object, property, value));
                        if (null === value) return "null";
                        className = getClass.call(value);
                        if (className == booleanClass) return "" + value;
                        if (className == numberClass) return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                        if (className == stringClass) return quote("" + value);
                        if ("object" == typeof value) {
                          for (length = stack.length; length--; ) if (stack[length] === value) throw TypeError();
                          stack.push(value);
                          results = [];
                          prefix = indentation;
                          indentation += whitespace;
                          if (className == arrayClass) {
                            for (index = 0, length = value.length; index < length; index++) {
                              element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                              results.push(element === undef ? "null" : element);
                            }
                            result = results.length ? whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : "[" + results.join(",") + "]" : "[]";
                          } else {
                            _forEach(properties || value, function(property) {
                              var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                              element !== undef && results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                            });
                            result = results.length ? whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : "{" + results.join(",") + "}" : "{}";
                          }
                          stack.pop();
                          return result;
                        }
                      };
                      exports.stringify = function(source, filter, width) {
                        var whitespace, callback, properties, className;
                        if (objectTypes[typeof filter] && filter) if ((className = getClass.call(filter)) == functionClass) callback = filter; else if (className == arrayClass) {
                          properties = {};
                          for (var index = 0, length = filter.length, value; index < length; value = filter[index++], 
                          (className = getClass.call(value), className == stringClass || className == numberClass) && (properties[value] = 1)) ;
                        }
                        if (width) if ((className = getClass.call(width)) == numberClass) {
                          if ((width -= width % 1) > 0) for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ") ;
                        } else className == stringClass && (whitespace = width.length <= 10 ? width : width.slice(0, 10));
                        return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                      };
                    }
                    if (!has("json-parse")) {
                      var fromCharCode = String.fromCharCode;
                      var Unescapes = {
                        92: "\\",
                        34: '"',
                        47: "/",
                        98: "\b",
                        116: "\t",
                        110: "\n",
                        102: "\f",
                        114: "\r"
                      };
                      var Index, Source;
                      var abort = function abort() {
                        Index = Source = null;
                        throw SyntaxError();
                      };
                      var lex = function lex() {
                        var source = Source, length = source.length, value, begin, position, isSigned, charCode;
                        while (Index < length) {
                          charCode = source.charCodeAt(Index);
                          switch (charCode) {
                           case 9:
                           case 10:
                           case 13:
                           case 32:
                            Index++;
                            break;

                           case 123:
                           case 125:
                           case 91:
                           case 93:
                           case 58:
                           case 44:
                            value = charIndexBuggy ? source.charAt(Index) : source[Index];
                            Index++;
                            return value;

                           case 34:
                            for (value = "@", Index++; Index < length; ) {
                              charCode = source.charCodeAt(Index);
                              if (charCode < 32) abort(); else if (92 == charCode) {
                                charCode = source.charCodeAt(++Index);
                                switch (charCode) {
                                 case 92:
                                 case 34:
                                 case 47:
                                 case 98:
                                 case 116:
                                 case 110:
                                 case 102:
                                 case 114:
                                  value += Unescapes[charCode];
                                  Index++;
                                  break;

                                 case 117:
                                  begin = ++Index;
                                  for (position = Index + 4; Index < position; Index++) {
                                    charCode = source.charCodeAt(Index);
                                    charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70 || abort();
                                  }
                                  value += fromCharCode("0x" + source.slice(begin, Index));
                                  break;

                                 default:
                                  abort();
                                }
                              } else {
                                if (34 == charCode) break;
                                charCode = source.charCodeAt(Index);
                                begin = Index;
                                while (charCode >= 32 && 92 != charCode && 34 != charCode) charCode = source.charCodeAt(++Index);
                                value += source.slice(begin, Index);
                              }
                            }
                            if (34 == source.charCodeAt(Index)) {
                              Index++;
                              return value;
                            }
                            abort();

                           default:
                            begin = Index;
                            if (45 == charCode) {
                              isSigned = true;
                              charCode = source.charCodeAt(++Index);
                            }
                            if (charCode >= 48 && charCode <= 57) {
                              48 == charCode && (charCode = source.charCodeAt(Index + 1), charCode >= 48 && charCode <= 57) && abort();
                              isSigned = false;
                              for (;Index < length && (charCode = source.charCodeAt(Index), charCode >= 48 && charCode <= 57); Index++) ;
                              if (46 == source.charCodeAt(Index)) {
                                position = ++Index;
                                for (;position < length && (charCode = source.charCodeAt(position), charCode >= 48 && charCode <= 57); position++) ;
                                position == Index && abort();
                                Index = position;
                              }
                              charCode = source.charCodeAt(Index);
                              if (101 == charCode || 69 == charCode) {
                                charCode = source.charCodeAt(++Index);
                                43 != charCode && 45 != charCode || Index++;
                                for (position = Index; position < length && (charCode = source.charCodeAt(position), 
                                charCode >= 48 && charCode <= 57); position++) ;
                                position == Index && abort();
                                Index = position;
                              }
                              return +source.slice(begin, Index);
                            }
                            isSigned && abort();
                            if ("true" == source.slice(Index, Index + 4)) {
                              Index += 4;
                              return true;
                            }
                            if ("false" == source.slice(Index, Index + 5)) {
                              Index += 5;
                              return false;
                            }
                            if ("null" == source.slice(Index, Index + 4)) {
                              Index += 4;
                              return null;
                            }
                            abort();
                          }
                        }
                        return "$";
                      };
                      var get = function get(value) {
                        var results, hasMembers;
                        "$" == value && abort();
                        if ("string" == typeof value) {
                          if ("@" == (charIndexBuggy ? value.charAt(0) : value[0])) return value.slice(1);
                          if ("[" == value) {
                            results = [];
                            for (;;hasMembers || (hasMembers = true)) {
                              value = lex();
                              if ("]" == value) break;
                              if (hasMembers) if ("," == value) {
                                value = lex();
                                "]" == value && abort();
                              } else abort();
                              "," == value && abort();
                              results.push(get(value));
                            }
                            return results;
                          }
                          if ("{" == value) {
                            results = {};
                            for (;;hasMembers || (hasMembers = true)) {
                              value = lex();
                              if ("}" == value) break;
                              if (hasMembers) if ("," == value) {
                                value = lex();
                                "}" == value && abort();
                              } else abort();
                              "," != value && "string" == typeof value && "@" == (charIndexBuggy ? value.charAt(0) : value[0]) && ":" == lex() || abort();
                              results[value.slice(1)] = get(lex());
                            }
                            return results;
                          }
                          abort();
                        }
                        return value;
                      };
                      var update = function update(source, property, callback) {
                        var element = walk(source, property, callback);
                        element === undef ? delete source[property] : source[property] = element;
                      };
                      var walk = function walk(source, property, callback) {
                        var value = source[property], length;
                        if ("object" == typeof value && value) if (getClass.call(value) == arrayClass) for (length = value.length; length--; ) update(value, length, callback); else _forEach(value, function(property) {
                          update(value, property, callback);
                        });
                        return callback.call(source, property, value);
                      };
                      exports.parse = function(source, callback) {
                        var result, value;
                        Index = 0;
                        Source = "" + source;
                        result = get(lex());
                        "$" != lex() && abort();
                        Index = Source = null;
                        return callback && getClass.call(callback) == functionClass ? walk((value = {}, 
                        value[""] = result, value), "", callback) : result;
                      };
                    }
                  }
                  exports["runInContext"] = runInContext;
                  return exports;
                }
                if (freeExports && !isLoader) runInContext(root, freeExports); else {
                  var nativeJSON = root.JSON, previousJSON = root["JSON3"], isRestored = false;
                  var JSON3 = runInContext(root, root["JSON3"] = {
                    noConflict: function noConflict() {
                      if (!isRestored) {
                        isRestored = true;
                        root.JSON = nativeJSON;
                        root["JSON3"] = previousJSON;
                        nativeJSON = previousJSON = null;
                      }
                      return JSON3;
                    }
                  });
                  root.JSON = {
                    parse: JSON3.parse,
                    stringify: JSON3.stringify
                  };
                }
                isLoader && define(function() {
                  return JSON3;
                });
              }).call(this);
            }).call(this, "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : "undefined" !== typeof global ? global : {});
          }, {} ],
          51: [ function(_dereq_, module, exports) {
            module.exports = toArray;
            function toArray(list, index) {
              var array = [];
              index = index || 0;
              for (var i = index || 0; i < list.length; i++) array[i - index] = list[i];
              return array;
            }
          }, {} ]
        }, {}, [ 31 ])(31);
      });
      cc._RF.pop();
    }).call(this, "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {} ],
  "use_v2.0.x_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d73bphCDVEYaRhLvqEa5kV", "use_v2.0.x_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_check = true);
    cc._RF.pop();
  }, {} ]
}, {}, [ "use_v2.0.x_cc.Toggle_event", "socket-io", "AnysdkMgr", "AudioMgr", "GameNetMgr", "Global", "HTTP", "HotUpdate", "MahjongMgr", "Net", "ReplayMgr", "UserMgr", "Utils", "VoiceMgr", "Alert", "Chat", "CheckBox", "CreateRole", "CreateRoom", "DingQue", "Folds", "GameOver", "GameResult", "Hall", "History", "HuanSanZhang", "ImageLoader", "JoinGameInput", "LoadingLogic", "Login", "MJGame", "MJRoom", "NoticeTip", "OnBack", "PengGangs", "PopupMgr", "RadioButton", "RadioGroupMgr", "ReConnect", "ReplayCtrl", "Seat", "Settings", "TimePointer", "UserInfoShow", "Voice", "WaitingConnection" ]);
//# sourceMappingURL=index.js.map
