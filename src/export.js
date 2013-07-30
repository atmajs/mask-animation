
return {
	animate: function(element, model, onend){
		new Model(model).start(element, onend);
	},
	sprite: Sprite
};
