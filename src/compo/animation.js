
(function(){

	var Compo = mask.Compo;

	// import helper.js

	var state_READY = 1,
		state_ANIMATE = 2
		;

	var AnimationCompo = mask.class.create({
		meta: {
			template: 'merge'
		},
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
					this.slots[x] = this.startFromSlot;
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
						console.error('Animation - pipeName.slotName : dot not found');
						continue;
					}
					name = x.substring(0, dot);

					(this.pipes[name] || (this.pipes[name] = {}))[x.substring(++dot)] = this.startFromPipe;
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
		startFromSlot: function(sender, element){
			var el = element instanceof Node ? element : null;
			this.start(null, el);
		},
		startFromPipe: function(element){
			var el = element instanceof Node ? element : null;
			this.start(null, el);
		},
		start: function(callback, element){
			if (this.delayTimer) {
				clearTimeout(this.delayTimer);
			}

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
	});

	mask.registerHandler(':animation', AnimationCompo);
	mask.registerHandler('Animation', AnimationCompo);

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
