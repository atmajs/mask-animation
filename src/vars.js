var style = document.createElement('div').style,
	prfx = (function() {

		if ('transform' in style) {
			return '';
		}
		if ('webkitTransform' in style) {
			return 'webkit';
		}
		if ('MozTransform' in style) {
			return 'Moz';
		}
		if ('OTransform' in style) {
			return 'O';
		}
		if ('msTransform' in style) {
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
			if (array[i] in style) {
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
				'msTransition': 'msTransitionEnd',
				'MozTransition': 'transitionend',
				'WebkitTransition': 'webkitTransitionEnd'
			},
			event = null;

		for (var t in transitions) {
			if (style[t] !== undefined) {
				event = transitions[t];
				break;
			}
		}

		getTransitionEndEvent = function() {
			return event;
		};

		return getTransitionEndEvent();
	},
	I = {
		prop: vendorPrfx + 'transition-property',
		duration: vendorPrfx + 'transition-duration',
		timing: vendorPrfx + 'transition-timing-function',
		delay: vendorPrfx + 'transition-delay'
	};
	
var env_isMoz = 'MozTransition' in style,
	env_isMs = 'msTransition' in style;
