const mergeDeepObject = function (...objects) {
	const isObject = obj => obj && typeof obj === 'object';

	return objects.reduce((prev, obj) => {
		Object.keys(obj).forEach(key => {
			const pVal = prev[key];
			const oVal = obj[key];

			if (Array.isArray(pVal) && Array.isArray(oVal)) {
				prev[key] = pVal.concat(...oVal);
			}
			else if (isObject(pVal) && isObject(oVal)) {
				prev[key] = mergeDeepObject(pVal, oVal);
			}
			else {
				prev[key] = oVal;
			}
		});

		return prev;
	}, {});
}

const listener = function(event, el, callback) {
	document.addEventListener(event, function (e) {
		let selectors = document.body.querySelectorAll(el),
			element = e.target,
			index = -1;

		while (element && ((index = Array.prototype.indexOf.call(selectors, element)) === -1)) {
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
}

const defaultParams = {
	limits: {
		count: 0,
		sizes: 0
	},
	isImage: false,
	isInfo: true,
	types: ['image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff", "image/webp"]
}

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

		_this.id     = _this.container.querySelector('[data-vg-toggle]').getAttribute('id') || undefined;
		_this.name   = _this.container.querySelector('[data-vg-toggle]').getAttribute('name') || undefined;
		_this.accept = _this.container.querySelector('[data-vg-toggle]').getAttribute('accept') || undefined;

		_this.settings.isImage      =  _this.container.dataset.imagePreview === 'true' || false;
		_this.settings.isInfo       =  _this.container.dataset.infoList !== 'false';
		_this.settings.limits.count =  parseInt(_this.container.dataset.limitCount) || 0;
		_this.settings.limits.sizes =  parseInt(_this.container.dataset.limitSize) || 0;

		_this.changeListener();

		let $dismiss = _this.container.querySelector('[data-dismiss="vg-files"]');
		$dismiss.onclick = function () {
			_this.clear(true);

			return false;
		}
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

				_this.container.insertAdjacentHTML('beforeEnd', '<input type="file" name="'+ _this.name +'" id="'+ _this.id +'" data-vg-toggle="files" ' + accept + ' multiple>');

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
				_this.change(this)
			})
		})
	}

	append(values) {
		const _this = this;

		_this.files.push(values);
		return pushFiles(_this.files, _this.settings.limits.count);

		function pushFiles (files, limit) {
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
						$selector.insertAdjacentHTML('beforeEnd', '<span><img src="'+ src +'" alt="#"></span>');
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
					$list.insertAdjacentHTML('beforeEnd', '<li><span>'+ (i) + '.</span><span>' + file.name + '</span><span>['+ size +']</span></li>');
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
			})

			output = arrSizes.reduce( function (a, b) {
				return a + b
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

export default VGFiles;
