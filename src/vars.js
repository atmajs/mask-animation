var el = document.createElement('div'),
	prfx = (function() {

		if ('transform' in el.style) {
			return '';
		}
		if ('webkitTransform' in el.style) {
			return 'webkit';
		}
		if ('MozTransform' in el.style) {
			return 'Moz';
		}
		if ('OTransform' in el.style) {
			return 'O';
		}
		if ('msTransform' in el.style) {
			return 'ms';
		}
		return '';

	}()),
	vendorPrfx = prfx ? '-' + prfx.toLowerCase() + '-' : '',
	getTransitionEndEvent = function() {
		var el = document.createElement('div'),
			transitions = {
				'transition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'MSTransition': 'msTransitionEnd',
				'MozTransition': 'transitionend',
				'WebkitTransition': 'webkitTransitionEnd'
			},
			event = null;

		for (var t in transitions) {
			if (el.style[t] !== undefined) {
				event = transitions[t];
				break;
			}
		}

		getTransitionEndEvent = function() {
			return event;
		};

		el = null;
		transitions = null;
		return getTransitionEndEvent();
	},
	I = {
		prop: vendorPrfx + 'transition-property',
		duration: vendorPrfx + 'transition-duration',
		timing: vendorPrfx + 'transition-timing-function',
		delay: vendorPrfx + 'transition-delay'
	};
