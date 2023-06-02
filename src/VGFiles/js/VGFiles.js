class VGFiles {
	constructor(container, arg) {
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
			isInfo: true
		}, arg);

		this.files = [];

		if (this.container) {
			let $toggle = this.container.querySelector('[data-vg-toggle="files"]');
			if ($toggle) {
				this.id = $toggle.getAttribute('id') || undefined;
				this.name = $toggle.getAttribute('name') || undefined;
				this.accept = $toggle.getAttribute('accept') || undefined;

				if (this.id && this.name) this.toggle($toggle);
			}
		} else {
			console.error('Initialization failed')
		}
	}

	toggle($toggle) {
		const _this = this;

		$toggle.onchange = function (e) {
			let values = this.files,
				append_files = [];

			_this.clear();

			if (values.length) {
				if (_this.settings.limits.count !== 1) {
					this.removeAttribute('id');
					this.removeAttribute('data-vg-toggle');
					this.classList.add(_this.classes.fake);

					let accept = this.accept ? 'accept="' + this.accept + '"' : '';

					_this.container.insertAdjacentHTML('beforeEnd', '<input type="file" name="'+ this.name +'" id="'+ this.id +'" data-toggle="vg-files" ' + accept + ' multiple>');
				}

				append_files = _this.append(values);
			}

			console.log(append_files, 'as')

			return false;
		}
	}

	append(values) {

	}

	clear() {
		const _this = this;

		let $filesInfo = _this.container.querySelector('.' + this.classes.info);
		if ($filesInfo) {
			if (_this.settings.isImage) {
				let $filesInfoImages = $filesInfo.querySelector('.' + this.classes.images);
				if ($filesInfoImages) {
					let $images = $filesInfoImages.querySelectorAll('span');
					if($images.length) {
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
	}
}

function ready() {
	let $vgfiles = document.querySelectorAll('.vg-files');
	for (const $vgfile of $vgfiles) {
		new VGFiles($vgfile, {})
	}
}

document.addEventListener("DOMContentLoaded", ready);

export default VGFiles;