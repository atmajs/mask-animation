function fn_isFunction(fn) {
    return typeof fn === 'function';
}

function fn_proxy(ctx, fn) {
    return function(){
		return fn.apply(ctx, arguments);
	};
}