
(function(){

	var Compo = global.Compo;
	if (Compo == null) {
		console.warn('To use :animation component, Compo should be defined');
		return;
	}

	// import helper.js
	
	var state_READY = 1,
		state_ANIMATE = 2
		;

	function AnimationCompo() {}

	AnimationCompo.prototype = {
		constructor: AnimationCompo,
		state: state_READY,
		repeat: 1,
		step: 1,
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
			
			
			if (this.state === state_ANIMATE) {
				this.stop();
			}
			
			this.element = element || this.container;
			this.state = state_ANIMATE;
			this.callback = callback;
			
			this.step = 1;
			this.model.start(this.element, fn_proxy(this, this.nextStep));
			
			return this;
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