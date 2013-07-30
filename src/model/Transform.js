
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
