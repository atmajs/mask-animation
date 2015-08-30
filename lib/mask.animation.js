/* jshint -W053 */


// source ../src/umd-head.js
(function (root, factory) {
    'use strict';

    if (root == null && typeof global !== 'undefined'){
        root = global;
    }

	var construct = function(){
            return factory(root, root.mask);
        };

    if (typeof exports === 'object') {
        module.exports = construct();
    } else if (typeof define === 'function' && define.amd) {
        define(construct);
    } else {
        var Lib = construct();

		for (var key in Lib) {
			root.mask[key] = Lib[key];
		}
    }
}(this, function (global, mask) {
    'use strict';

// end:source ../src/umd-head.js

	// source ../src/vars.js
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
	
	// end:source ../src/vars.js
    
    // source ../src/utils/arr.js
    function arr_isArray(arr) {
        return arr instanceof Array;
    }
    // end:source ../src/utils/arr.js
    // source ../src/utils/fn.js
    function fn_isFunction(fn) {
        return typeof fn === 'function';
    }
    
    function fn_proxy(ctx, fn) {
        return function(){
    		switch(arguments.length){
    			case 0:
    				return fn.call(ctx);
    			case 1:
    				return fn.call(ctx, arguments[0]);
    			case 2:
    				return fn.call(ctx, arguments[1]);
    			default:
    				return fn.apply(ctx, arguments);		
    		}
    	};
    }
    // end:source ../src/utils/fn.js
    
	// source ../src/model/Model.js
	
	// source Transform.js
	
	var TransformModel = (function() {
		var regexp = /([\w]+)\([^\)]+\)/g;
	
		function extract(str) {
			var props = null;
			regexp.lastIndex = 0;
			while (1) {
				var match = regexp.exec(str);
				if (!match) {
					return props;
				}
				(props || (props = {}))[match[1]] = match[0];
			}
		}
	
		function stringify(props) {
			var keys = Object.keys(props).sort().reverse();
			for (var i = 0; i < keys.length; i++) {
				keys[i] = props[keys[i]];
			}
			return keys.join(' ');
		}
	
		function TransformModel() {
			this.transforms = {};
		}
	
		TransformModel.prototype = {
			constructor: TransformModel,
			handle:  function(data) {
				var start = extract(data.from),
					end = extract(data.to),
					prop = null;
	
				if (start) {
					for (prop in this.transforms) {
						if (prop in start === false) {
							//console.log('from', prop, this.transforms[prop]);
							start[prop] = this.transforms[prop];
						}
					}
					data.from = stringify(start);
	
					for (prop in start) {
						this.transforms[prop] = start[prop];
					}
				}
	
				for (prop in this.transforms) {
					if (prop in end === false) {
						end[prop] = this.transforms[prop];
					}
				}
				data.to = stringify(end);
	
				for (prop in end) {
					this.transforms[prop] = end[prop];
				}
			}
		};
		
		return TransformModel;
	})();
	
	// end:source Transform.js
	// source Data.js
	var ModelData = (function() {
	
		var vendorProperties = {
			'transform': null
		};
	
		function parse(model) {
			var arr = model.split(/ *\| */g),
				data = {},
				length = arr.length;
	
			data.prop = arr[0] in vendorProperties
				? vendorPrfx + arr[0]
				: arr[0]
				;
	
			var vals = arr[1].split(/ *> */);
	
			if (vals[0]) {
				data.from = vals[0];
			}
	
			data.to = vals[vals.length - 1];
	
			if (length > 2) {
				var info = /(\d+m?s)?\s*([a-z]+[^\s]*)?\s*(\d+m?s)?/.exec(arr[2]);
				if (info != null) {
					data.duration = info[1] || '200ms';
					data.timing = info[2] || 'linear';
					data.delay = info[3] || '0';
	
					return data;
				}
			}
			data.duration = '200ms';
			data.timing = 'linear';
			data.delay = '0';
	
	
			return data;
		}
	
		function ModelData(data, parent) {
			this.parent = parent;
	
			this.transformModel = parent && parent.transformModel || new TransformModel();
	
			var model = data.model || data;
	
	
	
			if (arr_isArray(model)) {
				this.model = [];
				for (var i = 0, length = model.length; i < length; i++) {
					this.model.push(new ModelData(model[i], this));
				}
			} else if (model instanceof Object) {
	
				if (model === data) {
					console.error('Animation Object Model has no "model" property', data);
					this.modelCount = this.nextCount = this.state = 0;
					return;
				}
	
				this.model = [new ModelData(model, this)];
			} else if (typeof model === 'string') {
				this.model = parse(model);
	
				if (~this.model.prop.indexOf('transform')) {
					this.transformModel.handle(this.model);
				}
			}
	
			if (data.next != null) {
				this.next = new ModelData(data.next, this);
			}
	
			this.state = 0;
			this.nextCount = 0;
			this.modelCount = arr_isArray(this.model)
				? this.model.length
				: 1;
			
	
			if (this.next != null) {
				this.nextCount = arr_isArray(this.next)
					? this.next.length
					: 1;
			}
		}
	
		function model_resetMany(model) {
			var isarray = arr_isArray(model),
				length = isarray ? model.length : 1,
				x = null,
				i = 0;
			for (; isarray ? i < length : i < 1; i++) {
				x = isarray ? model[i] : model;
				x.reset && x.reset();
			}
		}
		
		function time_fromString(str){
			if (!str) 
				return 0;
			
			if (str.indexOf('ms') !== -1) 
				return parseInt(str);
			
			if (str.indexOf('s')) 
				return parseFloat(str) * 1000;
			
			console.warn('<mask:animation> parsing time', str);
			return 0;
		}
		
		function model_getDuration(model) {
		
			var isarray = arr_isArray(model),
				length = isarray ? model.length : 1,
				x = null,
				i = 0,
				max = 0;
			for (; isarray ? i < length : i < 1; i++) {
				x = isarray ? model[i] : model;
				
				
				var ms;
				
				if (fn_isFunction(x.getDuration)) {
					ms = x.getDuration();
				} else {
					
					ms = time_fromString(model.duration) + time_fromString(model.delay);
				}
				
				if (ms > max) 
					max = ms;
			}
			
			return max;
		}
		
		function model_getFinalCss(model, css){
			if (model == null) 
				return;
			
			var isarray = arr_isArray(model),
				length = isarray ? model.length : 1,
				x = null,
				i = 0;
			for (; isarray ? i < length : i < 1; i++) {
				x = isarray ? model[i] : model;
				
				
				if (fn_isFunction(x.getFinalCss)) {
					x.getFinalCss(css);
					continue;
				}
				
				css[x.prop] = x.to;
			}
			
		}
	
		ModelData.prototype = {
			constructor: ModelData,
			reset: function() {
				this.state = 0;
				this.nextCount = 0;
				this.modelCount = arr_isArray(this.model)
					? this.model.length
					: 1;
				
	
				if (this.next != null) {
					this.nextCount = arr_isArray(this.next)
						? this.next.length
						: 1;
				}
	
				this.model && model_resetMany(this.model);
				this.next && model_resetMany(this.next);
			},
			getNext: function() {
				//-console.log('getNext', this.state, this.modelCount, this.nextCount, this.model.prop, this);
				if (this.state === 0) {
					this.state = 1;
					return this;
				}
	
				if (this.state === 1 && this.modelCount > 0) {
					--this.modelCount;
				}
				if (this.state === 1 && this.modelCount === 0) {
					this.state = 2;
					if (this.next) {
						return this.next;
					}
				}
				if (this.state === 2 && this.nextCount > 0) {
					--this.nextCount;
				}
	
				if (this.state === 2 && this.nextCount === 0 && this.parent) {
					return this.parent.getNext && this.parent.getNext();
				}
				return null;
			},
			getDuration: function(){
				var ms = 0;
				
				if (this.model)
					ms += model_getDuration(this.model);
				
				if (this.next)
					ms += model_getDuration(this.next);
				
				return ms;
			},
			getFinalCss: function(css){
				if (css == null) {
					css = {};
				}
				
				model_getFinalCss(this.model, css);
				model_getFinalCss(this.next, css);
				
				return css;
			}
		};
	
		return ModelData;
	}());
	
	// end:source Data.js
	// source Stack.js
	var Stack = (function() {
	
		function Stack() {
			this.arr = [];
		}
	
		Stack.prototype = {
			constructor: Stack,
			put: function(modelData) {
				if (modelData == null) {
					return false;
				}
	
				var next = modelData.getNext(),
					result = false,
					length, i;
	
				if (next == null) {
					return false;
				}
	
	
				if (arr_isArray(next)) {
					for (i = 0, length = next.length; i < length; i++) {
						if (this.put(next[i]) === true) {
							result = true;
						}
					}
					return result;
				}
	
				if (next.state === 0) {
					next.state = 1;
				}
	
				if (next.model instanceof Array) {
					result = false;
					for (i = 0, length = next.model.length; i < length; i++) {
						if (this.put(next.model[i]) === true) {
							result = true;
						}
					}
					return result;
				}
	
	
				/* Resolve css property if this already animating,
				* as we start new animation with this prop */
				this.resolve(next.model.prop);
	
				this.arr.push(next);
				return true;
			},
			resolve: function(prop) {
				for (var i = 0, x, length = this.arr.length; i < length; i++) {
					x = this.arr[i];
					if (x.model.prop === prop) { // XX strict compare
						this.arr.splice(i, 1);
						return this.put(x);
					}
				}
				return false;
			},
			getCss: function(startCss, css) {
				var i, length, key, x;
	
				for (i = 0, length = this.arr.length; i < length; i++) {
					x = this.arr[i];
					if ('from' in x.model) {
						startCss[x.model.prop] = x.model.from;
					}
					css[x.model.prop] = x.model.to;
	
					for (key in I) {
						(css[I[key]] || (css[I[key]] = [])).push(x.model[key]);
					}
				}
				for (key in I) {
					css[I[key]] = css[I[key]].join(',');
				}
			},
			clear: function() {
				this.arr.length = 0;
			}
		};
	
		return Stack;
	
	}());
	
	// end:source Stack.js
	
	
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
	
	// end:source ../src/model/Model.js
	// source ../src/Sprite.js
	var Sprite = (function() {
		var keyframes = {},
			vendor = null,
			initVendorStrings = function() {
				
				vendor = {
					keyframes: "@" + vendorPrfx + "keyframes",
					AnimationIterationCount: prfx + 'AnimationIterationCount',
					AnimationDuration: prfx + 'AnimationDuration',
					AnimationTimingFunction: prfx + 'AnimationTimingFunction',
					AnimationFillMode: prfx + 'AnimationFillMode',
					AnimationName: prfx + 'AnimationName'
				};
			};
	
			return {
				/**
				 * {id, frameWidth, frames, frameStart?, property?}
				 */
				create: function(data) {
					if (vendor == null) {
						initVendorStrings();
					}
					if (keyframes[data.id] == null) {
	
						var pos = document.styleSheets[0].insertRule(vendor.keyframes + " " + data.id + " {}", 0),
							keyFrameAnimation = document.styleSheets[0].cssRules[pos],
							frames = data.frames - (data.frameStart || 0),
							step = 100 / frames,
							property = data.property || 'background-position-x';
	
						for (var i = 0; i < frames; i++) {
							var rule = (step * (i + 1)) + '% { ' + property + ': ' + (-data.frameWidth * (i + (data.frameStart || 0))) + 'px}';
							keyFrameAnimation.insertRule(rule);
						}
						keyFrameAnimation.iterationCount = data.iterationCount;
						keyFrameAnimation.frameToStop = data.frameToStop;
	
						keyframes[data.id] = keyFrameAnimation;
					}
				},
				start: function(element, animationId, msperframe) {
					var style = element.style;
	
					style[vendor.AnimationName] = 'none';
					setTimeout(function() {
						var keyframe = keyframes[animationId];
	
						if (style[vendor.AnimationFillMode] === 'forwards') {
							Sprite.stop(element);
							return;
						}
						element.addEventListener(vendor + 'AnimationEnd', function() {
							var css;
							if (keyframe.frameToStop) {
								//TODO: now only last cssRule is taken
								var styles = keyframe.cssRules[keyframe.cssRules.length - 1].style;
								css = {};
								for (var i = 0; i < styles.length; i++) {
									css[styles[i]] = styles[styles[i]];
								}
							}
							Sprite.stop(element, css);
						}, false);
	
						style[vendor.AnimationIterationCount] = keyframe.iterationCount || 1;
						style[vendor.AnimationDuration] = (keyframe.cssRules.length * msperframe) + 'ms';
						style[vendor.AnimationTimingFunction] = 'step-start';
						style[vendor.AnimationFillMode] = keyframe.frameToStop ? 'forwards' : 'none';
						style[vendor.AnimationName] = animationId;
	
					}, 0);
				},
				stop: function(element, css) {
					var style = element.style;
					style[vendor.AnimationFillMode] = 'none';
					style[vendor.AnimationName] = '';
					if (css != null) {
						$(element).css(css);
					}
				}
			};
	}());
	
	// end:source ../src/Sprite.js

	// source ../src/compo/animation.js
	
	(function(){
	
		var Compo = global.Compo;
		if (Compo == null) {
			console.warn('To use :animation component, Compo should be defined');
			return;
		}
	
		// source helper.js
		
		function mask_toJSON(node) {
		
			if (node == null) {
				return null;
			}
		
			if (node instanceof Array) {
				if (node.length === 1) {
					return mask_toJSON(node[0]);
				}
		
				var	nodes = node,
					Type = mask_getType(nodes),
					json = new Type();
		
				for(var i = 0, x, length = nodes.length; i < length; i++){
					x = nodes[i];
		
					if (Type === Array) {
						json.push(mask_toJSON(x));
						continue;
					}
		
					if (Type === Object) {
						json[mask_getTagName(x)] = mask_toJSON(x.nodes);
					}
				}
		
				return json;
			}
		
			if (mask.Dom.TEXTNODE === node.type) {
				return node.content;
			}
		
			if (mask.Dom.FRAGMENT === node.type) {
				return mask_toJSON(node.nodes);
			}
		
			if (mask.Dom.NODE) {
		
				var result = {};
		
				result[mask_getTagName(node)] = mask_toJSON(node.nodes);
		
				return result;
			}
		
			return null;
		}
		
		function mask_getTagName(node) {
			var tagName = node.tagName;
		
			return tagName.charCodeAt(0) === 64 /* @ */ ? tagName.substring(1) : tagName;
		}
		
		function mask_getType(nodes) {
			var keys = {};
			for(var i = 0, x, length = nodes.length; i < length; i++){
				x = nodes[i];
				switch (x.type) {
					case mask.Dom.TEXTNODE:
					case mask.Dom.FRAGMENT:
						return Array;
					case mask.Dom.NODE:
						if (keys[x.tagName] === 1) {
							return Array;
						}
						keys[x.tagName] = 1;
						break;
				}
			}
			return Object;
		}
		
		// end:source helper.js
		
		var state_READY = 1,
			state_ANIMATE = 2
			;
	
		function AnimationCompo() {}
	
		AnimationCompo.prototype = {
			constructor: AnimationCompo,
			state: state_READY,
			repeat: 1,
			step: 1,
			delayTimer: null,
			slots: null,
			pipes: null,
			attr: null,
			render: function(model, ctx, container){
	
				if (this.nodes == null) {
					console.warn('No Animation Model');
					return;
				}
	
				var slots = this.attr['x-slots'],
					i, imax, x;
				if (slots != null) {
					slots = slots.split(';');
	
					this.slots = {};
	
					for(i = 0, imax = slots.length; i < imax; i++){
						x = slots[i].trim();
						this.slots[x] = this.start;
					}
				}
	
				var pipes = this.attr['x-pipes'],
					dot, name;
				if (pipes != null) {
					pipes = pipes.split(';');
	
					this.pipes = {};
	
					for(i = 0, imax = pipes.length; i < imax; i++){
						x = pipes[i].trim();
	
						dot = x.indexOf('.');
						if (dot === -1) {
							console.error(':animation - pipeName.slotName : dot not found');
							continue;
						}
						name = x.substring(0, dot);
	
						(this.pipes[name] || (this.pipes[name] = {}))[x.substring(++dot)] = this.start;
					}
	
					Compo.pipe.addController(this);
				}
	
				this.model = new Model(mask_toJSON(this.nodes));
				this.container = container;
				
				if (this.attr['x-repeat']) {
					this.repeat = this.attr['x-repeat'] << 0 || Infinity; 
				}
				if (this.attr['x-autostart']) {
					this.slots = this.slots || {};
					this.slots.domInsert = this.start.bind(this);
				}
			},
	
			start: function(callback, element){
				if (this.delayTimer) 
					clearTimeout(this.delayTimer);
				
				var delay = this.attr['x-delay'];
				if (delay != null) {
					this.delayTimer = setTimeout(this._start.bind(this, callback, element), delay << 0);
					return this;
				}
				this._start(callback, element);
				return this;
			},
			_start: function(callback, element){
				if (this.state === state_ANIMATE) 
					this.stop();
				
				this.element = element || this.container;
				this.state = state_ANIMATE;
				this.callback = callback;
				
				this.step = 1;
				this.model.start(this.element, fn_proxy(this, this.nextStep));
			},
			
			stop: function(){
				// Not Completely Implemented
				
				if (this.callback) 
					this.callback(this);
				
				this.model.stop();
				this.element = null;
				this.callback = null;
				this.state = state_READY;
				
			},
			nextStep: function(){
				if (++this.step > this.repeat) 
					return this.stop();
				
				this.model.start(this.element, fn_proxy(this, this.nextStep));
			},
			
			dispose: function(){
				if (this.state !== state_READY) {
					this.model.onComplete = null;
					this.model.stop();
					this.element = null;
					this.callback = null;
				}
			}
		};
	
		mask.registerHandler(':animation', AnimationCompo);
	
	
		Compo.prototype.animate = function(id, callback, element /*?*/){
			var animation = this.find('#' + id);
			if (animation == null) {
				console.warn('Animation is not found', id);
				callback && callback();
				return;
			}
	
			return animation.start(callback, element);
		};
	
	}());
	
	// end:source ../src/compo/animation.js
	// source ../src/compo/sprite.js
	(function(){
	
		function SpriteHandler() {}
	
		/**
		 *	id
		 *	frameWidth / frame width (same height)
		 *	frames / frame count
		 *	frameStart?
		 *	property? / background-position-x
		 */
		mask.registerHandler(':animation:sprite', SpriteHandler);
	
		SpriteHandler.prototype = {
			constructor: SpriteHandler,
			render: function(model, cntx, element){
	
				var attr = this.attr,
					src = attr.src,
					id = attr.id,
					frames = attr.frames,
	
					property = attr.property,
					width = attr.frameWidth,
					height = attr.frameHeight,
	
					iterationCount = attr.iterationCount,
					msperframe = attr.msperframe,
					delay = attr.delay;
	
	
	
				var style = (element.getAttribute('style') || '') //
				+';background: url(' //
				+ src + ') 0 0 no-repeat; width:' //
				+ width + 'px; height:' //
				+ height + 'px;'
	
				element.setAttribute('style', style);
	
				Sprite.create({
					id: id,
					frameWidth: width,
					frames: frames,
					property: property,
					iterationCount: iterationCount,
					delay: delay
				});
	
				if (attr.autostart) {
					Sprite.start(element, id, msperframe);
				}
			}
		}
	
	}());
	
	// end:source ../src/compo/sprite.js
	// source ../src/export.js
	
	return {
		animate: function(element, model, onend){
			new Model(model).start(element, onend);
		},
		sprite: Sprite
	};
	
	// end:source ../src/export.js


}));

