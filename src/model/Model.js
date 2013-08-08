
// import Transform.js
// import Data.js
// import Stack.js


var Model = (function() {
	
	var transitionNames = [
		'WebKitTransitionEvent',
		'mozTransitionEvent',
		'oTransitionEvent',
		'TransitionEvent'
	];
	
	var TransitionEvent,
		TransitionEventName;
	
	for (var i = 0; i < transitionNames.length; i++) {
		if (transitionNames[i] in window) {
			TransitionEventName = transitionNames[i];
			TransitionEvent = window[TransitionEventName];
			break;
		}
	}
	if (TransitionEventName == null) {
		TransitionEventName = 'TransitionEvent';
	}
	
	var ImmediateCss = {
			'display': 1,
			'font-family': 1,
			'visibility': 1
		};
		
	
	try {
		// check if valid constructor
		new TransitionEvent(getTransitionEndEvent(), {
			propertyName: 'opacity',
			bubbles: true,
			cancelable: true
		});
	} catch(e) {
		TransitionEvent = function(eventName, data){
			var event = document.createEvent(TransitionEventName),
				fn = 'init'
					+ TransitionEventName[0].toUpperCase()
					+ TransitionEventName.substring(1);
			
			
			event[fn](getTransitionEndEvent(), true, true, data.propertyName, 0);
			return event;
		};
			
	}


	function Model(models) {
		this.stack = new Stack();
		this.model = new ModelData(models);
		this.transitionEnd = this.transitionEnd.bind(this);
	}

	Model.prototype = {
		constructor: Model,
		start: function(element, onComplete) {
			this.onComplete = onComplete;
			var startCss = {},
				css = {};

			this.model.reset();
			this.stack.clear();
			this.stack.put(this.model);
			this.stack.getCss(startCss, css);



			element.addEventListener(getTransitionEndEvent(), this.transitionEnd, false);
			this.element = element;
			this.apply(startCss, css);
			
			if (onComplete && supportTransitions === false) {
				onComplete();
			}
		},
		transitionEnd: function(event) {
			
			// some other css3 transition could be in nested elements
			if (event.target !== event.currentTarget) {
				return;
			}
			
			if (this.stack.resolve(event.propertyName) === true) {
				var startCss = {},
					css = {};
					
				this.stack.getCss(startCss, css);
				this.apply(startCss, css);
				return;
			}
			
			if (this.stack.arr.length < 1) {

				this.element.removeEventListener(getTransitionEndEvent(), this.transitionEnd, false);
				this.onComplete && this.onComplete();
			}
		

		},

		apply: function(startCss, css) {
			startCss[vendorPrfx + 'transition'] = 'none';

			var style = this.element.style,
				element = this.element;

			if (startCss != null) {
				for (var key in startCss) {
					style.setProperty(key, startCss[key], '');
					//-style[key] = startCss[key];
				}
			}

			
			
			if (env_isMoz === true) {
				//setTimout(.., 0) doesnt solve layout racing in Moz
				getComputedStyle(element).width
			}
			
			setTimeout(function() {
				var fire;
				for (var key in css) {
					style.setProperty(key, css[key], '');
					if (ImmediateCss.hasOwnProperty(key)) {
						(fire || (fire = [])).push(key);
					}
				}

				if (fire == null || TransitionEvent == null) {
					return;
				}

				var eventName = getTransitionEndEvent();

				for (var i = 0; i < fire.length; i++) {
					var event = new TransitionEvent(eventName, {
						propertyName: fire[i],
						bubbles: true,
						cancelable: true
					});

					element.dispatchEvent(event);
				}

			}, 0);
		}
	};


	return Model;
}());
