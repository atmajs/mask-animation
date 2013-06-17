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
	supportTransitions = (function(){
		var array = [
			'transition' ,
			'webkitTransition',
			'MozTransition',
			'OTransition',
			'msTransition'
		];
		
		for (var i = 0, x, imax = array.length; i < imax; i++){
			if (array[i] in el.style) {
				return true;
			}
		}
		
		return false;
	
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

	console.warn('Support' + supportTransitions);