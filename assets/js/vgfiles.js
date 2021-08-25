window.VegasFiles = {
	container: '.vg-files',
	defaults: {
		limits: {
			count: 0,
			sizes: 0
		}
	},
	files: [],
	fileList: [],
	init: function () {

	},
	change: function ($self) {
		let $container = $self.closest(this.container),
			$file_info = $container.find(this.container + '__info'),
			$file_info_name = $file_info.find(this.container + '__info--name'),
			values = $self[0].files,
			append_files = [];

		$file_info_name.find('li').remove();

		if (values.length) {
			$self.removeAttr('id');
			$self.removeAttr('data-toggle');
			$self.addClass('vg-files__fake');
			$container.append('<input type="file" name="files[]" id="vg-files-input" data-toggle="vg-files" multiple>');

			append_files = this.append(values);
		}

		if (append_files.length) {
			$file_info.fadeIn().css('display', 'block');
			$file_info.find(this.container + '__info--count').html(append_files.length + '<span>[' + this.getSizes(append_files, true) + ']</span>');

			for(let i = 0; i <= append_files.length - 1; i++) {
				let size = this.getSizes(append_files[i].size);
				$file_info_name.append('<li><span>'+ (i + 1) + '.</span><span>' + append_files[i].name + '</span><span>['+ size +']</span></li>');
			}
		}

		return false;
	},
	append: function (files) {
		this.files.push(files);

		let arr = [];
		for (let i = 0; i <= this.files.length -1; i++) {
			$.map(this.files[i], function (file) {
				arr.push(file);
			});
		}

		return arr;
	},
	clear: function ($self) {
		let $container = $self.closest(this.container);

		$container.find(this.container + '__fake').remove();
		$container.find(this.container + '__info').fadeOut();
		$container.find(this.container + '__info--name li').remove();
		this.files = [];

		return false;
	},
	getSizes: function (size, array = false) {
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
			$.map(size, function (el) {
				arrSizes.push(el.size);
			})

			output = arrSizes.reduce( function (a, b) {
				return a + b
			});

			output = VegasFiles.getSizes(output);
		}

		return output;
	}
};

$(document).on('change', '[data-toggle=vg-files]', function () {
	VegasFiles.change($(this));

	return false;
});

$(document).on('click', '[data-dismiss=vg-files]', function () {
	VegasFiles.clear($(this));

	return false;
});