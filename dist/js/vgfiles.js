"use strict";

window.VegasFiles = {
  container: '.vg-files',
  defaults: {
    limits: {
      count: 0,
      sizes: 0
    },
    image: false,
    types: ['image/png', "image/jpeg", "image/bmp", "image/ico", "image/gif", "image/jfif", "image/tiff"]
  },
  files: [],
  fileList: [],
  init: function init($self) {
    VegasFiles.defaults.limits.count = $self.data('count') || VegasFiles.defaults.limits.count;
    VegasFiles.defaults.limits.size = $self.data('size') || VegasFiles.defaults.limits.size;
    VegasFiles.defaults.image = $self.data('image-preview') || false;
  },
  change: function change($self) {
    var $container = $self.closest(this.container),
        $file_info = $container.find(this.container + '__info'),
        $file_info_name = $file_info.find(this.container + '__info--name'),
        $file_info_image = $file_info.find(this.container + '__info--image'),
        values = $self[0].files,
        id = $container.find('label').attr('for'),
        accept = 'accept="' + $self.attr('accept') + '"' || '',
        append_files = [];
    $file_info_name.find('li').remove();
    $file_info_image.find('span').remove();

    if (values.length) {
      $self.removeAttr('id');
      $self.removeAttr('data-toggle');
      $self.addClass('vg-files__fake');

      if (VegasFiles.defaults.limits.count === 0) {
        $container.append('<input type="file" name="files[]" id="' + id + '" data-toggle="vg-files" ' + accept + ' multiple>');
      }

      append_files = this.append(values);
    }

    if (append_files.length) {
      $file_info.fadeIn().css('display', 'block');
      $file_info.find(this.container + '__info--count').html(append_files.length + '<span>[' + this.getSizes(append_files, true) + ']</span>');

      for (var i = 0; i <= append_files.length - 1; i++) {
        if (VegasFiles.defaults.image) {
          if (this.checkType(append_files[i].type)) {
            var src = URL.createObjectURL(append_files[i]);
            $file_info_image.append('<span><img src="' + src + '" alt="#"></span>');
          }
        }

        var size = this.getSizes(append_files[i].size);
        $file_info_name.append('<li><span>' + (i + 1) + '.</span><span>' + append_files[i].name + '</span><span>[' + size + ']</span></li>');
      }
    }

    return false;
  },
  append: function append(files) {
    this.files.push(files);
    return pushFiles(this.files, VegasFiles.defaults.limits.count);

    function pushFiles(files, limit) {
      var arr = [];

      for (var i = 0; i <= files.length - 1; i++) {
        $.map(files[i], function (file, cnt) {
          var count = cnt + 1;

          if (limit === 0) {
            arr.push(file);
          } else {
            if (count <= limit) {
              arr.unshift(file);
            }
          }
        });
      }

      if (limit > 0 && arr.length > limit) {
        arr.splice(limit, arr.length - limit);
      }

      return arr;
    }
  },
  checkType: function checkType(type) {
    return VegasFiles.defaults.types.includes(type);
  },
  getSizes: function getSizes(size) {
    var array = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var size_kb = size / 1024,
        size_mb = size_kb / 1024,
        size_gb = size_mb / 1024,
        size_tb = size_gb / 1024;
    var output = 0;

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
      var arrSizes = [];
      $.map(size, function (el) {
        arrSizes.push(el.size);
      });
      output = arrSizes.reduce(function (a, b) {
        return a + b;
      });
      output = VegasFiles.getSizes(output);
    }

    return output;
  },
  clear: function clear($self) {
    var $container = $self.closest(this.container);
    $container.find(this.container + '__fake').remove();
    $container.find(this.container + '__info').fadeOut();
    $container.find(this.container + '__info--name li').remove();
    $container.find(this.container + '__info--image span').remove();
    this.files = [];
    return false;
  }
};
$(document).ready(function () {
  var $container = $('.vg-files');

  if ($container.length) {
    $container.each(function () {
      VegasFiles.init($(this));
    });
  }
});
$(document).on('change', '[data-toggle=vg-files]', function () {
  VegasFiles.change($(this));
  return false;
});
$(document).on('click', '[data-dismiss=vg-files]', function () {
  VegasFiles.clear($(this));
  return false;
});
