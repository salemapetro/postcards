(function () {
	'use strict';

	var $ = window.jQuery;
	var Transformer = window.Transformer;
	var math = window.MathUtil;
	var operation = null;
	var $selected = null;
	var start = null;
	var mode = 'move';

	function clear_element($element) {
		if (window.aloha && $element.length > 0) {
			window.aloha.mahalo($element[0]);
		}
		return $element.css('cursor', '')
					   .removeClass('moving')
					   .removeClass('editing')
					   .removeClass('vertical-editing')
					   .removeClass('resizing')
					   .removeClass('rotating')
					   .removeClass('selected');
	}

	function change_mode(new_mode, element) {
		mode = new_mode;

		clear_element($('.selected'));
		var $element = $(element).addClass('selected');

		switch (mode) {
		case 'move':
			return Transformer.style_markers('squares');
		case 'resize':
			$element.addClass('resizing');
			return Transformer.style_markers('squares');
		case 'rotate':
			return Transformer.style_markers('circles');
		case 'edit':
			$element.addClass('editing');
			if (window.aloha && $element.length > 0) {
				window.aloha($element[0]);
			}
			var angle = Transformer.get_element_rotation($element);
			var direction = Transformer.get_compass_direction('n', angle);
			if ('w' === direction || 'e' === direction) {
				$element.addClass('vertical-editing');
			}
			return Transformer.mark(operation);
		default:
			return Transformer.unmark();
		}
	}

	function mousedown_on_marker(event) {
		if ('rotate' === mode) {
			operation = Transformer.start('rotate', $selected, event);
		} else {
			var $marker = $(event.target);
			operation = Transformer.start('resize', $selected, event, $marker);
			$selected.add('body').css('cursor', $marker.css('cursor'));
		}
	}

	function get_box(element) {
		return $(element).closest('.box');
	}

	function mousedown_on_element(event) {
		var $element = get_box(event.target);
		var is_same_element = $element.is($selected);

		if (is_same_element && 'edit' === mode) {
			return;
		}

		if (!is_same_element) {
			mode = 'move';
			start = null;
		} else {
			start = [event.pageX, event.pageY];
		}

		change_mode(mode, $element);
		operation = Transformer.start(mode, $element, event);
		Transformer.mark(operation[mode]);

		$('.' + Transformer.MARKER_CLASS)
			.css('cursor', 'rotate' === mode ? 'default' : '');

		$selected = $element;
	}

	function mousedown_on_document(event) {
		if (0 === $(event.target).closest(window.canvas).length) {
			return;
		}
		if (window.creating_mode) {
			var $element = $('<div class="box"></div>').appendTo(window.canvas);
			event.target = $element[0];
			change_mode('move', $element);
			operation = Transformer.start('create', $element, event);
		}
		if (0 === $(event.target).closest('.box,.' + Transformer.MARKER_CLASS).length) {
			change_mode(null);
			$selected = null;
		}
	}

	function mouseup_on_document(event) {
		if (operation) {
			window.onStopOperation(operation);
			var $element = Transformer.end(operation).$element;
			$('body').css('cursor', '');
			clear_element($element).addClass('selected');
			var has_moved = !start || event.pageX !== start[0] || event.pageY !== start[1];
			if (!has_moved) {
				change_mode(('rotate' === mode) ? 'move' : 'rotate', $element);
			}
			if ('rotate' === mode) {
				$('.' + Transformer.MARKER_CLASS).css('cursor', 'default');
			} else {
				Transformer.mark(operation.move || operation.resize || operation.rotate);
			}
			operation = null;
		}
	}

	function mousemove_on_document(event) {
		if (!operation) {
			return;
		}
		Transformer.mark(Transformer.update(operation, event));
		var $element = operation.move
					 ? operation.move.$element.addClass('moving')
					 : operation.rotate
					 ? operation.rotate.$element.addClass('rotating')
					 : null;
		if ($element) {
			$('body').css('cursor', $element.css('cursor'));
		}
	}

	function dblclick_on_element(event) {
		if ('edit' !== mode) {
			change_mode('edit', get_box(event.target));
		}
	}

	function key_down(event) {
		if ($selected) {
			switch (event.keyCode) {
			case 46: // DEL
				$selected.remove();
				$selected = null;
				change_mode(null);
				return Transformer.unmark();
			case 18: // X
				if (event.ctrlKey) {
					$selected.remove();
					$selected = null;
					change_mode(null);
					break;
				}
				return Transformer.unmark();
			case 27: // ESC
				operation = null;
				$selected = null;
				change_mode(null);
				return Transformer.unmark();
			}
		}
	}

	$(document)
		.on('mousedown', mousedown_on_document)
		.on('mouseup', mouseup_on_document)
		.on('mousemove', mousemove_on_document)
		.on('mousedown', '.' + Transformer.MARKER_CLASS, mousedown_on_marker)
		.on('mousedown', '.box', mousedown_on_element)
		.on('dblclick', '.box', dblclick_on_element)
		.on('keydown', key_down);

	/*
	(function show_grid() {
		var size = 20;
		var w = $(window).width() + size;
		var h = $(window).height() + size;
		var rows = Math.ceil(h / size);
		var cols = Math.ceil(w / size);
		var i;
		$('.transformer-grid-line').remove();
		for (i = 0; i < rows; i++) {
			$('<div class="transformer-grid-line"></div>').css({
				position: 'absolute',
				borderTop: '1px dashed rgba(255,255,255,0.1)',
				width: w,
				height: 1,
				left: 0,
				top: size * i
			}).appendTo('body');
		}
		for (i = 0; i < cols; i++) {
			$('<div class="transformer-grid-line"></div>').css({
				position: 'absolute',
				borderLeft: '1px dashed rgba(255,255,255,0.1)',
				width: 1,
				height: h,
				left: size * i,
				top: 0
			}).appendTo('body');
		}
		var timer;
		$(window).resize(function () {
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(show_grid, 200);
		});
	}());
	*/
}());
