(function() {

	var KEY_ARROW_RIGHT = 39,
		KEY_ARROW_LEFT = 37,
        KEY_ESC = 27;

	function proxy(callback, context) {
		return function() {
			return callback.apply(context, arguments);
		}
	}

	window.photoviewer = window.photoviewer || new function() {

		var $photoviewer = $('\
			<div id="photoviewer">\
				<span class="photoviewer-close" title="Close">&times;</span>\
				<div class="photoviewer-content">\
					<div class="photoviewer-item">\
						<img src="" />\
					</div>\
				</div>\
				<div class="photoviewer-control left">\
					<i class="icon icon-angle-left" title="Previous">&lt;</i>\
				</div>\
				<div class="photoviewer-control right">\
					<i class="icon icon-angle-right" title="Next">&gt;</i>\
				</div>\
				<div class="photoviewer-shadow"></div>\
			</div>\
		');

		var $item = $photoviewer.find('.photoviewer-item');

		var itemscount = null;
		var cur = null;
		var urllist = null;

		function loadImageUrls() {
			/* urls of already loaded images from the page */
			var urls = [];
			$(document).find('.photo-item').each(function(i, obj) {
				urls.push($(obj).find('img').attr('src'));
			});
			return urls;
		}

		this.show = function() {
			$photoviewer.fadeIn(300);
			$('body').data('overflow', $('body').css('overflow') || 'auto').css('overflow', 'hidden');
		}

		this.hide = function () {
			$photoviewer.fadeOut(300);
			$('body').css('overflow', $('body').data('overflow'));
		}

		this.to = function(n) {
			if (n >= itemscount) {
				cur = 0;
			}
			else if (n < 0) {
				cur = itemscount - 1;
			}
			n = cur;

			$item.find('img').attr("src", urllist[n]);
		}

		function init() {

            $(document).ready(function(e) {

                urllist = loadImageUrls()
                itemscount = urllist.length;

                var $body = $('body');

                if($body.find('#photoviewer').length == 0) {
                    $body.append($photoviewer);
                }

                $(document).find('.photo-item').each(function(i, obj) {
                    $(obj).attr('data-item-num', i);
                });
            });

			$photoviewer.find('.photoviewer-close').bind('click', proxy(function(e) {
				this.hide();
				e.preventDefault();
			}, this));

			$(document).bind('click', proxy(function(e) {
				if(!$(e.target).closest(".photoviewer-item").length) {
					if($photoviewer.find('.photoviewer-item').is(':visible')) {
						this.hide();
					}
				}
			}, this));

			$photoviewer.find('.photoviewer-control.left').bind('click', proxy(function(e) {
				cur -= 1;
				this.to(cur);
				return false;
			}, this));

			$photoviewer.find('.photoviewer-control.right').bind('click', proxy(function(e) {
				cur += 1;
				this.to(cur);
				return false;
			}, this));

			$(document).bind('keyup', proxy(function(e) {
				if($photoviewer.is(':visible')) {
					if(e.keyCode === KEY_ARROW_RIGHT) { 
						cur += 1;
						this.to(cur);
					} else if (e.keyCode === KEY_ARROW_LEFT) {
						cur -= 1;
						this.to(cur);
					} else if (e.keyCode === KEY_ESC) {
                        this.hide();
                    }
				}
			}, this));

			$(document).on('click', '.photo-item a', proxy(function(e) {
				if (!window.IS_MOBILE) {
					cur = parseInt($(e.currentTarget).parents('.photo-item').attr('data-item-num')); 
					this.show();
					this.to(cur);
				}
				return false;
			}, this));
		}

		init.call(this);
	}

})();
