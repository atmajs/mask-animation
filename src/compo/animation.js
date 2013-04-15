
(function(){

	var Compo = global.Compo;
	if (Compo == null) {
		console.warn('To use :animation component, Compo should be defined');
		return;
	}

	// import helper.js

	function AnimationCompo() {

	}

	AnimationCompo.prototype = {
		constructor: AnimationCompo,

		render: function(model, cntx, container){

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
		},

		start: function(callback, element){
			this.model.start(element || this.container, callback);
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

		animation.start(callback, element);
	};

}());
