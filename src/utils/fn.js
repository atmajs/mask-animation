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