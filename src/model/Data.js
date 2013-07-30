var ModelData = (function() {

	var vendorProperties = {
		'transform': null
	};

	function parse(model) {
		var arr = model.split(/ *\| */g),
			data = {},
			length = arr.length;

		data.prop = arr[0] in vendorProperties ? vendorPrfx + arr[0] : arr[0];


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



		if (model instanceof Array) {
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
		this.modelCount = this.model instanceof Array ? this.model.length : 1;
		this.nextCount = 0;

		if (this.next != null) {
			this.nextCount = this.next instanceof Array ? this.next.length : 1;
		}
	}

	function model_resetMany(model) {
		var isarray = model instanceof Array,
			length = isarray ? model.length : 1,
			x = null,
			i = 0;
		for (; isarray ? i < length : i < 1; i++) {
			x = isarray ? model[i] : model;
			x.reset && x.reset();
		}
	}

	ModelData.prototype = {
		constructor: ModelData,
		reset: function() {
			this.state = 0;
			this.modelCount = this.model instanceof Array ? this.model.length : 1;
			this.nextCount = 0;

			if (this.next != null) {
				this.nextCount = this.next instanceof Array ? this.next.length : 1;
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
		}
	};

	return ModelData;
}());
