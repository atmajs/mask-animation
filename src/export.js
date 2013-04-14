
//////r.animate = Animate;
//////r.animate.Model = Model;
//////r.animate.sprite = Sprite;

return {
	animate: function(element, model, onend){
		new Model(model).start(element, onend);
	}
};
