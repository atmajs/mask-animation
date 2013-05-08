var Sprite = (function() {
	var keyframes = {},
		vendor = null,
		initVendorStrings = function() {
			
			vendor = {
				keyframes: "@" + vendorPrfx + "keyframes",
				AnimationIterationCount: prfx + 'AnimationIterationCount',
				AnimationDuration: prfx + 'AnimationDuration',
				AnimationTimingFunction: prfx + 'AnimationTimingFunction',
				AnimationFillMode: prfx + 'AnimationFillMode',
				AnimationName: prfx + 'AnimationName'
			};
		};

		return {
			/**
			 * {id, frameWidth, frames, frameStart?, property?}
			 */
			create: function(data) {
				if (vendor == null) {
					initVendorStrings();
				}
				if (keyframes[data.id] == null) {

					var pos = document.styleSheets[0].insertRule(vendor.keyframes + " " + data.id + " {}", 0),
						keyFrameAnimation = document.styleSheets[0].cssRules[pos],
						frames = data.frames - (data.frameStart || 0),
						step = 100 / frames | 0,
						property = data.property || 'background-position-x';

					for (var i = 0; i < frames; i++) {
						var rule = (step * (i + 1)) + '% { ' + property + ': ' + (-data.frameWidth * (i + (data.frameStart || 0))) + 'px}';
						keyFrameAnimation.insertRule(rule);
					}
					keyFrameAnimation.iterationCount = data.iterationCount;
					keyFrameAnimation.frameToStop = data.frameToStop;

					keyframes[data.id] = keyFrameAnimation;
				}
			},
			start: function(element, animationId, msperframe) {
				var style = element.style;

				style[vendor.AnimationName] = 'none';
				setTimeout(function() {
					var keyframe = keyframes[animationId];

					if (style[vendor.AnimationFillMode] === 'forwards') {
						Sprite.stop(element);
						return;
					}
					element.addEventListener(vendor + 'AnimationEnd', function() {
						var css;
						if (keyframe.frameToStop) {
							//TODO: now only last cssRule is taken
							var styles = keyframe.cssRules[keyframe.cssRules.length - 1].style;
							css = {};
							for (var i = 0; i < styles.length; i++) {
								css[styles[i]] = styles[styles[i]];
							}
						}
						Sprite.stop(element, css);
					}, false);

					style[vendor.AnimationIterationCount] = keyframe.iterationCount || 1;
					style[vendor.AnimationDuration] = (keyframe.cssRules.length * msperframe) + 'ms';
					style[vendor.AnimationTimingFunction] = 'step-start';
					style[vendor.AnimationFillMode] = keyframe.frameToStop ? 'forwards' : 'none';
					style[vendor.AnimationName] = animationId;

				}, 0);
			},
			stop: function(element, css) {
				var style = element.style;
				style[vendor.AnimationFillMode] = 'none';
				style[vendor.AnimationName] = '';
				if (css != null) {
					$(element).css(css);
				}
			}
		};
}());
