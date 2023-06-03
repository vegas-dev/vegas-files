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
		this.settings = Object.assign({
			limits: {
				count: 0,
				sizes: 0
			},
			isImage: false,
			isInfo: true,
			types: ['image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff"]
		}, arg);
		this.files = [];

		if (this.container) {
			this.id = this.container.querySelector('[data-vg-toggle]').getAttribute('id') || undefined;
			this.name = this.container.querySelector('[data-vg-toggle]').getAttribute('name') || undefined;
			this.accept = this.container.querySelector('[data-vg-toggle]').getAttribute('accept') || undefined;

			this.settings.isImage = this.container.dataset.imagePreview || false;
			this.settings.Info = this.container.dataset.infoList !== 'false';

			const _this = this;

			listener('change', '[data-vg-toggle="files"]', function (element) {
				_this.change(element);
			});

			listener('click', '[data-dismiss="vg-files"]', function (element) {
				_this.clear('all');
			});

			function listener(event, el, callback) {
				document.addEventListener(event, function (e) {
					let selectors = _this.container.querySelectorAll(el),
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
				let $selector = document.createElement('div');
				$selector.classList.add(_this.classes.images);
				$fileInfo.prepend($selector);

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
				let $selector = document.createElement('div');
				$selector.classList.add(_this.classes.list);
				$fileInfo.append($selector);

				let i = 1;
				for (const file of files) {
					let size = this.getSizes(file.size);
					$selector.insertAdjacentHTML('beforeEnd', '<li><span>'+ (i) + '.</span><span>' + file.name + '</span><span>['+ size +']</span></li>');
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

		let $filesInfo = _this.container.querySelector('.' + this.classes.info);
		if ($filesInfo) {
			if (_this.settings.isImage) {
				let $filesInfoImages = $filesInfo.querySelector('.' + this.classes.images);
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
				let $filesInfoList = $filesInfo.querySelector('.' + this.classes.list);
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