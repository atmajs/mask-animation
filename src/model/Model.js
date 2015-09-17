
// import Transform.js
// import TimingFns.js
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

		/**
		 * @Workaround - calculate duration in javascript, not to relay on transitionend event,
		 * as it could be not fired on some situations, like setting display:none to the parent.
		 *
		 * Should we wait till there were some more transition events, like transitioninterrupt.
		 */
		this.duration = this.model.getDuration();

		this._transitionEnd = fn_proxy(this, this._transitionEnd);

		this.finish = fn_proxy(this, this.finish);
		this.finishTimeout = null;
	}

	Model.prototype = {
		constructor: Model,
		start: function(element, onComplete) {

			this.element = element;

			if (supportTransitions === false) {
				this.apply(this.model.getFinalCss());

				onComplete && onComplete();
				return;
			}

			element.addEventListener(getTransitionEndEvent(), this._transitionEnd, false);


			var startCss = {},
				css = {};

			this.onComplete = onComplete;
			this.model.reset();
			this.stack.clear();
			this.stack.put(this.model);
			this.stack.getCss(startCss, css);
			this.apply(startCss, css);


			this.finishTimeout = setTimeout(this.finish, this.duration);
		},

		// alias
		stop: function(){
			this.finish();
		},

		finish: function(){
			if (this.element == null)
				return;

			this.element.style.setProperty(vendorPrfx + 'transition', 'none');
			this.element.removeEventListener(
				getTransitionEndEvent(), this._transitionEnd, false
			);

			var fn = this.onComplete;
			this.onComplete = null;
			this.element = null;

			if (fn_isFunction(fn))
				fn();
		},
		_transitionEnd: function(event) {

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

			//////if (this.stack.arr.length < 1) {
			//////
			//////	this.element.removeEventListener(getTransitionEndEvent(), this.transitionEnd, false);
			//////	this.onComplete && this.onComplete();
			//////}


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




			// Layout racing. (Better then just the setTimout(.., 0))
			getComputedStyle(element).width

			var fire;
			for (var key in css) {
				style.setProperty(key, css[key], '');
				if (ImmediateCss.hasOwnProperty(key)) {
					(fire || (fire = [])).push(key);
				}
			}

			if (fire == null || TransitionEvent == null)
				return;

			var eventName = getTransitionEndEvent();
			for (var i = 0; i < fire.length; i++) {
				var event = new TransitionEvent(eventName, {
					propertyName: fire[i],
					bubbles: true,
					cancelable: true
				});
				element.dispatchEvent(event);
			}
		}
	};


	return Model;
}());
