(function(){

	function SpriteHandler() {}

	/**
	 *	id
	 *	frameWidth / frame width (same height)
	 *	frames / frame count
	 *	frameStart?
	 *	property? / background-position-x
	 */
	mask.registerHandler(':animation:sprite', SpriteHandler);

	SpriteHandler.prototype = {
		constructor: SpriteHandler,
		render: function(model, cntx, element){

			var attr = this.attr,
				src = attr.src,
				id = attr.id,
				frames = attr.frames,

				property = attr.property,
				width = attr.frameWidth,
				height = attr.frameHeight,

				iterationCount = attr.iterationCount,
				msperframe = attr.msperframe,
				delay = attr.delay;



			var style = (element.getAttribute('style') || '') //
			+';background: url(' //
			+ src + ') 0 0 no-repeat; width:' //
			+ width + 'px; height:' //
			+ height + 'px;'

			element.setAttribute('style', style);

			Sprite.create({
				id: id,
				frameWidth: width,
				frames: frames,
				property: property,
				iterationCount: iterationCount,
				delay: delay
			});

			if (attr.autostart) {
				Sprite.start(element, id, msperframe);
			}
		}
	}

}());
