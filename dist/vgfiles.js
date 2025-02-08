var vg;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/VGFiles/index.js":
/*!******************************!*\
  !*** ./src/VGFiles/index.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VGFiles: () => (/* reexport safe */ _js_VGFiles__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _js_VGFiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/VGFiles */ "./src/VGFiles/js/VGFiles.js");
/**
 * --------------------------------------------------------------------------
 * Export Public Api
 * Автор: Vegas Studio
 * Лицензия: смотри LICENSE.md
 * --------------------------------------------------------------------------
 */




/***/ }),

/***/ "./src/VGFiles/js/VGFiles.js":
/*!***********************************!*\
  !*** ./src/VGFiles/js/VGFiles.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const mergeDeepObject = function (...objects) {
  const isObject = obj => obj && typeof obj === 'object';
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach(key => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeepObject(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
};
const listener = function (event, el, callback) {
  document.addEventListener(event, function (e) {
    let selectors = document.body.querySelectorAll(el),
      element = e.target,
      index = -1;
    while (element && (index = Array.prototype.indexOf.call(selectors, element)) === -1) {
      element = element.parentElement;
    }
    if (index > -1) {
      (function () {
        if (typeof callback === "function") {
          callback(element);
        }
        e.preventDefault();
      }).call(element, e);
    }
  });
};
const defaultParams = {
  limits: {
    count: 0,
    sizes: 0
  },
  isImage: false,
  isInfo: true,
  types: ['image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff"]
};
class VGFiles {
  constructor(container, arg = {}) {
    this.container = container || undefined;
    this.classes = {
      container: 'vg-files',
      label: 'vg-files-label',
      info: 'vg-files-info',
      images: 'vg-files-info--images',
      list: 'vg-files-info--list',
      fake: 'vg-files-fake'
    };
    this.settings = mergeDeepObject(defaultParams, arg);
    this.files = [];
    if (this.container) {
      this.isInitChange = false;
      this.init();
    }
  }
  init() {
    const _this = this;
    _this.id = _this.container.querySelector('[data-vg-toggle]').getAttribute('id') || undefined;
    _this.name = _this.container.querySelector('[data-vg-toggle]').getAttribute('name') || undefined;
    _this.accept = _this.container.querySelector('[data-vg-toggle]').getAttribute('accept') || undefined;
    _this.settings.isImage = _this.container.dataset.imagePreview === 'true' || false;
    _this.settings.isInfo = _this.container.dataset.infoList !== 'false';
    _this.settings.limits.count = parseInt(_this.container.dataset.limitCount) || 0;
    _this.settings.limits.sizes = parseInt(_this.container.dataset.limitSize) || 0;
    _this.changeListener();
    let $dismiss = _this.container.querySelector('[data-dismiss="vg-files"]');
    $dismiss.onclick = function () {
      _this.clear(true);
      return false;
    };
  }
  change(self) {
    const _this = this;
    let values = self.files,
      appended_files = [];
    _this.clear();
    if (values.length) {
      if (_this.settings.limits.count !== 1) {
        self.removeAttribute('id');
        self.removeAttribute('data-vg-toggle');
        self.classList.add(_this.classes.fake);
        self.onchange = null;
        let accept = _this.accept ? 'accept="' + _this.accept + '"' : '';
        _this.container.insertAdjacentHTML('beforeEnd', '<input type="file" name="' + _this.name + '" id="' + _this.id + '" data-vg-toggle="files" ' + accept + ' multiple>');
        _this.changeListener();
      }
      appended_files = _this.append(values);
      if (appended_files.length) {
        let $fileInfo = _this.container.querySelector('.' + this.classes.info);
        $fileInfo.classList.add('show');
        let $count = $fileInfo.querySelector('.' + _this.classes.info + '--wrapper-count');
        if ($count) $count.innerHTML = appended_files.length + '<span>[' + _this.getSizes(appended_files, true) + ']</span>';
        _this.setImages(appended_files);
        _this.setInfoList(appended_files);
      }
    }
  }
  changeListener() {
    const _this = this;
    let $toggle = _this.container.querySelectorAll('[data-vg-toggle="files"]');
    [...$toggle].forEach(function (el) {
      el.addEventListener('change', function () {
        _this.change(this);
      });
    });
  }
  append(values) {
    const _this = this;
    _this.files.push(values);
    return pushFiles(_this.files, _this.settings.limits.count);
    function pushFiles(files, limit) {
      let arr = [];
      for (let i = 0; i <= files.length - 1; i++) {
        let count = 1;
        for (const file of files[i]) {
          if (limit === 0) {
            arr.push(file);
          } else {
            if (count <= limit) {
              arr.unshift(file);
            }
          }
          count++;
        }
      }
      if (limit > 0 && arr.length > limit) {
        arr.splice(limit, arr.length - limit);
      }
      return arr;
    }
  }
  setImages(files) {
    let _this = this;
    if (_this.settings.isImage) {
      const $fileInfo = _this.container.querySelector('.' + _this.classes.info);
      if ($fileInfo) {
        let $selector = $fileInfo.querySelector('.' + _this.classes.images);
        if (!$selector) {
          $selector = document.createElement('div');
          $selector.classList.add(_this.classes.images);
          $fileInfo.prepend($selector);
        }
        for (const file of files) {
          if (this.checkType(file.type)) {
            let src = URL.createObjectURL(file);
            $selector.insertAdjacentHTML('beforeEnd', '<span><img src="' + src + '" alt="#"></span>');
          }
        }
      }
    }
  }
  setInfoList(files) {
    let _this = this;
    if (_this.settings.isInfo) {
      const $fileInfo = _this.container.querySelector('.' + _this.classes.info);
      if ($fileInfo) {
        let $list = $fileInfo.querySelector('.' + _this.classes.list);
        if (!$list) {
          $list = document.createElement('ul');
          $list.classList.add(_this.classes.list);
          $fileInfo.append($list);
        }
        let i = 1;
        for (const file of files) {
          let size = this.getSizes(file.size);
          $list.insertAdjacentHTML('beforeEnd', '<li><span>' + i + '.</span><span>' + file.name + '</span><span>[' + size + ']</span></li>');
          i++;
        }
      }
    }
  }
  checkType(type) {
    return this.settings.types.includes(type);
  }
  getSizes(size, array = false) {
    const _this = this;
    let size_kb = size / 1024,
      size_mb = size_kb / 1024,
      size_gb = size_mb / 1024,
      size_tb = size_gb / 1024;
    let output = 0;
    if (size_kb <= 1024) {
      output = size_kb.toFixed(3) + ' Kb';
    } else if (size_kb >= 1024 && size_mb <= 1024) {
      output = size_mb.toFixed(3) + ' Mb';
    } else if (size_mb >= 1024 && size_gb <= 1024) {
      output = size_gb.toFixed(3) + ' Gb';
    } else {
      output = size_tb.toFixed(3) + ' Tb';
    }
    if (array) {
      let arrSizes = [];
      size.map(function (el) {
        arrSizes.push(el.size);
      });
      output = arrSizes.reduce(function (a, b) {
        return a + b;
      });
      output = _this.getSizes(output);
    }
    return output;
  }
  clear(all = false) {
    const _this = this;
    let $filesInfo = _this.container.querySelector('.' + _this.classes.info);
    if ($filesInfo) {
      if (_this.settings.isImage) {
        let $filesInfoImages = $filesInfo.querySelector('.' + _this.classes.images);
        if ($filesInfoImages) {
          let $images = $filesInfoImages.querySelectorAll('span');
          if ($images.length) {
            for (const $image of $images) {
              $image.parentNode.removeChild($image);
            }
          }
        }
      }
      if (_this.settings.isInfo) {
        let $filesInfoList = $filesInfo.querySelector('.' + _this.classes.list);
        if ($filesInfoList) {
          let $li = $filesInfoList.querySelectorAll('li');
          if ($li.length) {
            for (const $item of $li) {
              $item.parentNode.removeChild($item);
            }
          }
        }
      }
    }
    if (all) {
      _this.container.querySelector('[type="file"]').value = '';
      let fakeInputs = _this.container.querySelectorAll('.' + _this.classes.fake);
      if (fakeInputs.length) {
        for (const fakeInput of fakeInputs) {
          fakeInput.remove();
        }
      }
      if ($filesInfo) {
        $filesInfo.classList.remove('show');
      }
      _this.files = [];
    }
  }
}
function ready() {
  let $selectors = document.querySelectorAll('.vg-files');
  if ($selectors.length) {
    for (const $selector of $selectors) {
      new VGFiles($selector);
    }
  }
}
document.addEventListener("DOMContentLoaded", ready);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (VGFiles);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!******************!*\
  !*** ./index.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VGFiles: () => (/* reexport safe */ _src_VGFiles__WEBPACK_IMPORTED_MODULE_0__.VGFiles)
/* harmony export */ });
/* harmony import */ var _src_VGFiles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/VGFiles */ "./src/VGFiles/index.js");


})();

vg = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmdmaWxlcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7OztBQ1JBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTs7Ozs7O0FDbFVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBOzs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUNOQSIsInNvdXJjZXMiOlsid2VicGFjazovL3ZnLy4vc3JjL1ZHRmlsZXMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vdmcvLi9zcmMvVkdGaWxlcy9qcy9WR0ZpbGVzLmpzIiwid2VicGFjazovL3ZnL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly92Zy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZnL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vdmcvLi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICogRXhwb3J0IFB1YmxpYyBBcGlcclxuICog0JDQstGC0L7RgDogVmVnYXMgU3R1ZGlvXHJcbiAqINCb0LjRhtC10L3Qt9C40Y86INGB0LzQvtGC0YDQuCBMSUNFTlNFLm1kXHJcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqL1xyXG5cclxuaW1wb3J0IFZHRmlsZXMgZnJvbSBcIi4vanMvVkdGaWxlc1wiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR0ZpbGVzXHJcbn07IiwiY29uc3QgbWVyZ2VEZWVwT2JqZWN0ID0gZnVuY3Rpb24gKC4uLm9iamVjdHMpIHtcclxuXHRjb25zdCBpc09iamVjdCA9IG9iaiA9PiBvYmogJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCc7XHJcblxyXG5cdHJldHVybiBvYmplY3RzLnJlZHVjZSgocHJldiwgb2JqKSA9PiB7XHJcblx0XHRPYmplY3Qua2V5cyhvYmopLmZvckVhY2goa2V5ID0+IHtcclxuXHRcdFx0Y29uc3QgcFZhbCA9IHByZXZba2V5XTtcclxuXHRcdFx0Y29uc3Qgb1ZhbCA9IG9ialtrZXldO1xyXG5cclxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkocFZhbCkgJiYgQXJyYXkuaXNBcnJheShvVmFsKSkge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IHBWYWwuY29uY2F0KC4uLm9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGlzT2JqZWN0KHBWYWwpICYmIGlzT2JqZWN0KG9WYWwpKSB7XHJcblx0XHRcdFx0cHJldltrZXldID0gbWVyZ2VEZWVwT2JqZWN0KHBWYWwsIG9WYWwpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHByZXZba2V5XSA9IG9WYWw7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdHJldHVybiBwcmV2O1xyXG5cdH0sIHt9KTtcclxufVxyXG5cclxuY29uc3QgbGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCwgZWwsIGNhbGxiYWNrKSB7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuY3Rpb24gKGUpIHtcclxuXHRcdGxldCBzZWxlY3RvcnMgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3JBbGwoZWwpLFxyXG5cdFx0XHRlbGVtZW50ID0gZS50YXJnZXQsXHJcblx0XHRcdGluZGV4ID0gLTE7XHJcblxyXG5cdFx0d2hpbGUgKGVsZW1lbnQgJiYgKChpbmRleCA9IEFycmF5LnByb3RvdHlwZS5pbmRleE9mLmNhbGwoc2VsZWN0b3JzLCBlbGVtZW50KSkgPT09IC0xKSkge1xyXG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChpbmRleCA+IC0xKSB7XHJcblx0XHRcdChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XHJcblx0XHRcdFx0XHRjYWxsYmFjayhlbGVtZW50KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0fSkuY2FsbChlbGVtZW50LCBlKTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdFBhcmFtcyA9IHtcclxuXHRsaW1pdHM6IHtcclxuXHRcdGNvdW50OiAwLFxyXG5cdFx0c2l6ZXM6IDBcclxuXHR9LFxyXG5cdGlzSW1hZ2U6IGZhbHNlLFxyXG5cdGlzSW5mbzogdHJ1ZSxcclxuXHR0eXBlczogWydpbWFnZS9wbmcnLCBcImltYWdlL2pwZWdcIiwgXCJpbWFnZS9ibXBcIiwgXCJpbWFnZS9pY29cIiwgXCJpbWFnZS9naWZcIiwgXCJpbWFnZS9qZmlmXCIsIFwiaW1hZ2UvdGlmZlwiXVxyXG59XHJcblxyXG5jbGFzcyBWR0ZpbGVzIHtcclxuXHRjb25zdHJ1Y3Rvcihjb250YWluZXIsIGFyZyA9IHt9KSB7XHJcblx0XHR0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lciB8fCB1bmRlZmluZWQ7XHJcblx0XHR0aGlzLmNsYXNzZXMgPSB7XHJcblx0XHRcdGNvbnRhaW5lcjogJ3ZnLWZpbGVzJyxcclxuXHRcdFx0bGFiZWw6ICd2Zy1maWxlcy1sYWJlbCcsXHJcblx0XHRcdGluZm86ICd2Zy1maWxlcy1pbmZvJyxcclxuXHRcdFx0aW1hZ2VzOiAndmctZmlsZXMtaW5mby0taW1hZ2VzJyxcclxuXHRcdFx0bGlzdDogJ3ZnLWZpbGVzLWluZm8tLWxpc3QnLFxyXG5cdFx0XHRmYWtlOiAndmctZmlsZXMtZmFrZSdcclxuXHRcdH07XHJcblx0XHR0aGlzLnNldHRpbmdzID0gbWVyZ2VEZWVwT2JqZWN0KGRlZmF1bHRQYXJhbXMsIGFyZyk7XHJcblx0XHR0aGlzLmZpbGVzID0gW107XHJcblxyXG5cdFx0aWYgKHRoaXMuY29udGFpbmVyKSB7XHJcblx0XHRcdHRoaXMuaXNJbml0Q2hhbmdlID0gZmFsc2U7XHJcblx0XHRcdHRoaXMuaW5pdCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0aW5pdCgpIHtcclxuXHRcdGNvbnN0IF90aGlzID0gdGhpcztcclxuXHJcblx0XHRfdGhpcy5pZCAgICAgPSBfdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtdmctdG9nZ2xlXScpLmdldEF0dHJpYnV0ZSgnaWQnKSB8fCB1bmRlZmluZWQ7XHJcblx0XHRfdGhpcy5uYW1lICAgPSBfdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtdmctdG9nZ2xlXScpLmdldEF0dHJpYnV0ZSgnbmFtZScpIHx8IHVuZGVmaW5lZDtcclxuXHRcdF90aGlzLmFjY2VwdCA9IF90aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS12Zy10b2dnbGVdJykuZ2V0QXR0cmlidXRlKCdhY2NlcHQnKSB8fCB1bmRlZmluZWQ7XHJcblxyXG5cdFx0X3RoaXMuc2V0dGluZ3MuaXNJbWFnZSAgICAgID0gIF90aGlzLmNvbnRhaW5lci5kYXRhc2V0LmltYWdlUHJldmlldyA9PT0gJ3RydWUnIHx8IGZhbHNlO1xyXG5cdFx0X3RoaXMuc2V0dGluZ3MuaXNJbmZvICAgICAgID0gIF90aGlzLmNvbnRhaW5lci5kYXRhc2V0LmluZm9MaXN0ICE9PSAnZmFsc2UnO1xyXG5cdFx0X3RoaXMuc2V0dGluZ3MubGltaXRzLmNvdW50ID0gIHBhcnNlSW50KF90aGlzLmNvbnRhaW5lci5kYXRhc2V0LmxpbWl0Q291bnQpIHx8IDA7XHJcblx0XHRfdGhpcy5zZXR0aW5ncy5saW1pdHMuc2l6ZXMgPSAgcGFyc2VJbnQoX3RoaXMuY29udGFpbmVyLmRhdGFzZXQubGltaXRTaXplKSB8fCAwO1xyXG5cclxuXHRcdF90aGlzLmNoYW5nZUxpc3RlbmVyKCk7XHJcblxyXG5cdFx0bGV0ICRkaXNtaXNzID0gX3RoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWRpc21pc3M9XCJ2Zy1maWxlc1wiXScpO1xyXG5cdFx0JGRpc21pc3Mub25jbGljayA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0X3RoaXMuY2xlYXIodHJ1ZSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjaGFuZ2Uoc2VsZikge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGxldCB2YWx1ZXMgPSBzZWxmLmZpbGVzLFxyXG5cdFx0XHRhcHBlbmRlZF9maWxlcyA9IFtdO1xyXG5cclxuXHRcdF90aGlzLmNsZWFyKCk7XHJcblxyXG5cdFx0aWYgKHZhbHVlcy5sZW5ndGgpIHtcclxuXHRcdFx0aWYgKF90aGlzLnNldHRpbmdzLmxpbWl0cy5jb3VudCAhPT0gMSkge1xyXG5cdFx0XHRcdHNlbGYucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xyXG5cdFx0XHRcdHNlbGYucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXZnLXRvZ2dsZScpO1xyXG5cdFx0XHRcdHNlbGYuY2xhc3NMaXN0LmFkZChfdGhpcy5jbGFzc2VzLmZha2UpO1xyXG5cdFx0XHRcdHNlbGYub25jaGFuZ2UgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRsZXQgYWNjZXB0ID0gX3RoaXMuYWNjZXB0ID8gJ2FjY2VwdD1cIicgKyBfdGhpcy5hY2NlcHQgKyAnXCInIDogJyc7XHJcblxyXG5cdFx0XHRcdF90aGlzLmNvbnRhaW5lci5pbnNlcnRBZGphY2VudEhUTUwoJ2JlZm9yZUVuZCcsICc8aW5wdXQgdHlwZT1cImZpbGVcIiBuYW1lPVwiJysgX3RoaXMubmFtZSArJ1wiIGlkPVwiJysgX3RoaXMuaWQgKydcIiBkYXRhLXZnLXRvZ2dsZT1cImZpbGVzXCIgJyArIGFjY2VwdCArICcgbXVsdGlwbGU+Jyk7XHJcblxyXG5cdFx0XHRcdF90aGlzLmNoYW5nZUxpc3RlbmVyKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGFwcGVuZGVkX2ZpbGVzID0gX3RoaXMuYXBwZW5kKHZhbHVlcyk7XHJcblxyXG5cdFx0XHRpZiAoYXBwZW5kZWRfZmlsZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0bGV0ICRmaWxlSW5mbyA9IF90aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuJyArIHRoaXMuY2xhc3Nlcy5pbmZvKTtcclxuXHRcdFx0XHQkZmlsZUluZm8uY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG5cclxuXHRcdFx0XHRsZXQgJGNvdW50ID0gJGZpbGVJbmZvLnF1ZXJ5U2VsZWN0b3IoJy4nICsgX3RoaXMuY2xhc3Nlcy5pbmZvICsgJy0td3JhcHBlci1jb3VudCcpO1xyXG5cdFx0XHRcdGlmICgkY291bnQpICRjb3VudC5pbm5lckhUTUwgPSBhcHBlbmRlZF9maWxlcy5sZW5ndGggKyAnPHNwYW4+WycgKyBfdGhpcy5nZXRTaXplcyhhcHBlbmRlZF9maWxlcywgdHJ1ZSkgKyAnXTwvc3Bhbj4nO1xyXG5cclxuXHRcdFx0XHRfdGhpcy5zZXRJbWFnZXMoYXBwZW5kZWRfZmlsZXMpO1xyXG5cdFx0XHRcdF90aGlzLnNldEluZm9MaXN0KGFwcGVuZGVkX2ZpbGVzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2hhbmdlTGlzdGVuZXIoKSB7XHJcblx0XHRjb25zdCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0bGV0ICR0b2dnbGUgPSBfdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdmctdG9nZ2xlPVwiZmlsZXNcIl0nKTtcclxuXHRcdFsuLi4kdG9nZ2xlXS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0X3RoaXMuY2hhbmdlKHRoaXMpXHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblx0YXBwZW5kKHZhbHVlcykge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdF90aGlzLmZpbGVzLnB1c2godmFsdWVzKTtcclxuXHRcdHJldHVybiBwdXNoRmlsZXMoX3RoaXMuZmlsZXMsIF90aGlzLnNldHRpbmdzLmxpbWl0cy5jb3VudCk7XHJcblxyXG5cdFx0ZnVuY3Rpb24gcHVzaEZpbGVzIChmaWxlcywgbGltaXQpIHtcclxuXHRcdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8PSBmaWxlcy5sZW5ndGggLSAxOyBpKyspIHtcclxuXHRcdFx0XHRsZXQgY291bnQgPSAxO1xyXG5cdFx0XHRcdGZvciAoY29uc3QgZmlsZSBvZiBmaWxlc1tpXSkge1xyXG5cdFx0XHRcdFx0aWYgKGxpbWl0ID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdGFyci5wdXNoKGZpbGUpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYgKGNvdW50IDw9IGxpbWl0KSB7XHJcblx0XHRcdFx0XHRcdFx0YXJyLnVuc2hpZnQoZmlsZSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRjb3VudCsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGxpbWl0ID4gMCAmJiBhcnIubGVuZ3RoID4gbGltaXQpIHtcclxuXHRcdFx0XHRhcnIuc3BsaWNlKGxpbWl0LCBhcnIubGVuZ3RoIC0gbGltaXQpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gYXJyO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0SW1hZ2VzKGZpbGVzKSB7XHJcblx0XHRsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGlmIChfdGhpcy5zZXR0aW5ncy5pc0ltYWdlKSB7XHJcblx0XHRcdGNvbnN0ICRmaWxlSW5mbyA9IF90aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuJyArIF90aGlzLmNsYXNzZXMuaW5mbyk7XHJcblx0XHRcdGlmICgkZmlsZUluZm8pIHtcclxuXHRcdFx0XHRsZXQgJHNlbGVjdG9yID0gJGZpbGVJbmZvLnF1ZXJ5U2VsZWN0b3IoJy4nICsgX3RoaXMuY2xhc3Nlcy5pbWFnZXMpO1xyXG5cdFx0XHRcdGlmICghJHNlbGVjdG9yKSB7XHJcblx0XHRcdFx0XHQkc2VsZWN0b3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHRcdFx0XHRcdCRzZWxlY3Rvci5jbGFzc0xpc3QuYWRkKF90aGlzLmNsYXNzZXMuaW1hZ2VzKTtcclxuXHRcdFx0XHRcdCRmaWxlSW5mby5wcmVwZW5kKCRzZWxlY3Rvcik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLmNoZWNrVHlwZShmaWxlLnR5cGUpKSB7XHJcblx0XHRcdFx0XHRcdGxldCBzcmMgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xyXG5cdFx0XHRcdFx0XHQkc2VsZWN0b3IuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCAnPHNwYW4+PGltZyBzcmM9XCInKyBzcmMgKydcIiBhbHQ9XCIjXCI+PC9zcGFuPicpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0c2V0SW5mb0xpc3QoZmlsZXMpIHtcclxuXHRcdGxldCBfdGhpcyA9IHRoaXM7XHJcblxyXG5cdFx0aWYgKF90aGlzLnNldHRpbmdzLmlzSW5mbykge1xyXG5cdFx0XHRjb25zdCAkZmlsZUluZm8gPSBfdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvcignLicgKyBfdGhpcy5jbGFzc2VzLmluZm8pO1xyXG5cdFx0XHRpZiAoJGZpbGVJbmZvKSB7XHJcblx0XHRcdFx0bGV0ICRsaXN0ID0gJGZpbGVJbmZvLnF1ZXJ5U2VsZWN0b3IoJy4nICsgX3RoaXMuY2xhc3Nlcy5saXN0KTtcclxuXHRcdFx0XHRpZiAoISRsaXN0KSB7XHJcblx0XHRcdFx0XHQkbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XHJcblx0XHRcdFx0XHQkbGlzdC5jbGFzc0xpc3QuYWRkKF90aGlzLmNsYXNzZXMubGlzdCk7XHJcblx0XHRcdFx0XHQkZmlsZUluZm8uYXBwZW5kKCRsaXN0KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGxldCBpID0gMTtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcclxuXHRcdFx0XHRcdGxldCBzaXplID0gdGhpcy5nZXRTaXplcyhmaWxlLnNpemUpO1xyXG5cdFx0XHRcdFx0JGxpc3QuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCAnPGxpPjxzcGFuPicrIChpKSArICcuPC9zcGFuPjxzcGFuPicgKyBmaWxlLm5hbWUgKyAnPC9zcGFuPjxzcGFuPlsnKyBzaXplICsnXTwvc3Bhbj48L2xpPicpO1xyXG5cdFx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y2hlY2tUeXBlKHR5cGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnNldHRpbmdzLnR5cGVzLmluY2x1ZGVzKHR5cGUpO1xyXG5cdH1cclxuXHJcblx0Z2V0U2l6ZXMoc2l6ZSwgYXJyYXkgPSBmYWxzZSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGxldCBzaXplX2tiID0gc2l6ZSAvIDEwMjQsXHJcblx0XHRcdHNpemVfbWIgPSBzaXplX2tiIC8gMTAyNCxcclxuXHRcdFx0c2l6ZV9nYiA9IHNpemVfbWIgLyAxMDI0LFxyXG5cdFx0XHRzaXplX3RiID0gc2l6ZV9nYiAvIDEwMjQ7XHJcblxyXG5cdFx0bGV0IG91dHB1dCA9IDA7XHJcblxyXG5cdFx0aWYgKHNpemVfa2IgPD0gMTAyNCkge1xyXG5cdFx0XHRvdXRwdXQgPSBzaXplX2tiLnRvRml4ZWQoMykgKyAnIEtiJztcclxuXHRcdH0gZWxzZSBpZiAoc2l6ZV9rYiA+PSAxMDI0ICYmIHNpemVfbWIgPD0gMTAyNCkge1xyXG5cdFx0XHRvdXRwdXQgPSBzaXplX21iLnRvRml4ZWQoMykgKyAnIE1iJztcclxuXHRcdH0gZWxzZSBpZiAoc2l6ZV9tYiA+PSAxMDI0ICYmIHNpemVfZ2IgPD0gMTAyNCkge1xyXG5cdFx0XHRvdXRwdXQgPSBzaXplX2diLnRvRml4ZWQoMykgKyAnIEdiJztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG91dHB1dCA9IHNpemVfdGIudG9GaXhlZCgzKSArICcgVGInO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChhcnJheSkge1xyXG5cdFx0XHRsZXQgYXJyU2l6ZXMgPSBbXTtcclxuXHRcdFx0c2l6ZS5tYXAoZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0YXJyU2l6ZXMucHVzaChlbC5zaXplKTtcclxuXHRcdFx0fSlcclxuXHJcblx0XHRcdG91dHB1dCA9IGFyclNpemVzLnJlZHVjZSggZnVuY3Rpb24gKGEsIGIpIHtcclxuXHRcdFx0XHRyZXR1cm4gYSArIGJcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRvdXRwdXQgPSBfdGhpcy5nZXRTaXplcyhvdXRwdXQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBvdXRwdXQ7XHJcblx0fVxyXG5cclxuXHRjbGVhcihhbGwgPSBmYWxzZSkge1xyXG5cdFx0Y29uc3QgX3RoaXMgPSB0aGlzO1xyXG5cclxuXHRcdGxldCAkZmlsZXNJbmZvID0gX3RoaXMuY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy4nICsgX3RoaXMuY2xhc3Nlcy5pbmZvKTtcclxuXHRcdGlmICgkZmlsZXNJbmZvKSB7XHJcblx0XHRcdGlmIChfdGhpcy5zZXR0aW5ncy5pc0ltYWdlKSB7XHJcblx0XHRcdFx0bGV0ICRmaWxlc0luZm9JbWFnZXMgPSAkZmlsZXNJbmZvLnF1ZXJ5U2VsZWN0b3IoJy4nICsgX3RoaXMuY2xhc3Nlcy5pbWFnZXMpO1xyXG5cdFx0XHRcdGlmICgkZmlsZXNJbmZvSW1hZ2VzKSB7XHJcblx0XHRcdFx0XHRsZXQgJGltYWdlcyA9ICRmaWxlc0luZm9JbWFnZXMucXVlcnlTZWxlY3RvckFsbCgnc3BhbicpO1xyXG5cdFx0XHRcdFx0aWYgKCRpbWFnZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdGZvciAoY29uc3QgJGltYWdlIG9mICRpbWFnZXMpIHtcclxuXHRcdFx0XHRcdFx0XHQkaW1hZ2UucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkaW1hZ2UpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoX3RoaXMuc2V0dGluZ3MuaXNJbmZvKSB7XHJcblx0XHRcdFx0bGV0ICRmaWxlc0luZm9MaXN0ID0gJGZpbGVzSW5mby5xdWVyeVNlbGVjdG9yKCcuJyArIF90aGlzLmNsYXNzZXMubGlzdCk7XHJcblx0XHRcdFx0aWYgKCRmaWxlc0luZm9MaXN0KSB7XHJcblx0XHRcdFx0XHRsZXQgJGxpID0gJGZpbGVzSW5mb0xpc3QucXVlcnlTZWxlY3RvckFsbCgnbGknKTtcclxuXHRcdFx0XHRcdGlmICgkbGkubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdGZvciAoY29uc3QgJGl0ZW0gb2YgJGxpKSB7XHJcblx0XHRcdFx0XHRcdFx0JGl0ZW0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCgkaXRlbSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoYWxsKSB7XHJcblx0XHRcdF90aGlzLmNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbdHlwZT1cImZpbGVcIl0nKS52YWx1ZSA9ICcnO1xyXG5cclxuXHRcdFx0bGV0IGZha2VJbnB1dHMgPSBfdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnLicgKyBfdGhpcy5jbGFzc2VzLmZha2UpO1xyXG5cdFx0XHRpZiAoZmFrZUlucHV0cy5sZW5ndGgpIHtcclxuXHRcdFx0XHRmb3IgKGNvbnN0IGZha2VJbnB1dCBvZiBmYWtlSW5wdXRzKSB7XHJcblx0XHRcdFx0XHRmYWtlSW5wdXQucmVtb3ZlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoJGZpbGVzSW5mbykge1xyXG5cdFx0XHRcdCRmaWxlc0luZm8uY2xhc3NMaXN0LnJlbW92ZSgnc2hvdycpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRfdGhpcy5maWxlcyA9IFtdO1xyXG5cdFx0fVxyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gcmVhZHkoKSB7XHJcblx0bGV0ICRzZWxlY3RvcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcudmctZmlsZXMnKTtcclxuXHRpZiAoJHNlbGVjdG9ycy5sZW5ndGgpIHtcclxuXHRcdGZvciAoY29uc3QgJHNlbGVjdG9yIG9mICRzZWxlY3RvcnMpIHtcclxuXHRcdFx0bmV3IFZHRmlsZXMoJHNlbGVjdG9yKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIHJlYWR5KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZHRmlsZXM7XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtWR0ZpbGVzfSBmcm9tIFwiLi9zcmMvVkdGaWxlc1wiO1xyXG5cclxuZXhwb3J0IHtcclxuXHRWR0ZpbGVzXHJcbn0iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=