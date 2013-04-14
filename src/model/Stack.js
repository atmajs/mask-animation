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


			if (next instanceof Array) {
				for (i = 0, length = next.length; i < length; i++) {
					if (this.put(next[i]) === true) {
						r = true;
					}
				}
				return r;
			}

			if (next.state === 0) {
				next.state = 1;
			}

			if (next.model instanceof Array) {
				r = false;
				for (i = 0, length = next.model.length; i < length; i++) {
					if (this.put(next.model[i]) === true) {
						r = true;
					}
				}
				return r;
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
				if (x.model.prop == prop) {
					//-console.log('resolve',prop, x);
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
			this.arr = [];
		}
	};

	return Stack;

}());
