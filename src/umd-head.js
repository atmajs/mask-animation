(function (root, factory) {
    'use strict';

    if (root == null && typeof global !== 'undefined'){
        root = global;
    }

	var construct = function(){
            return factory(root, mask);
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
