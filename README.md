CSS3 and Sprite Animations
-----
[![Bower version](https://badge.fury.io/bo/mask-animation.svg)](http://badge.fury.io/bo/mask-animation)
[![Bower version](https://badge.fury.io/bo/mask-animation.svg)](http://badge.fury.io/bo/mask-animation)

Declare and run the animation in your `Mask` templates or direct from `JavaScript`

Features:
- Animation models: from simple to complex and deep-nested animations
- Can contain not animatable properties within the model - _like 'display` property_.
- CssTransforms: Prefix-less declaration
- CssTransforms will be tracked, so if you animate `translate`, and in `next` model animate `scale` - 'translate' will be kept in element 'transform' style
- Starting animation model: when not specified the model is taken from the actual current state.


### Animation Models
- `AnimationProperty`:`string`

	```javascript
	propertyName | ?	 > to | time timing delay
	```

	| Key          | Required |Description |
	|--------------|----------|------------|
	|`propertyName`|`required`| **Any** css property, like `height`, `transform`, `left`, `display`, `visibility`, `bottom`, etc.|
	|`from`        |`optional`| Initial css value for the property. Default is the current value for the property|
	|`to`          |`required`| Target css value|
	|`time`        |`optional`| Animation duration. Definition is like in `CSSTransition`, e.g.: `21s`, `450ms`. Default is `200ms`|
	|`timing`      |`optional`| `CSSTransition` timing function, e.g.: `linear`, `ease-in`, `cubic-bezier(.13,.83,.83,.41)`.|
	|`delay`       |`optional`| Delay time before starting the animation, e.g: `100ms`.|

- `AnimationSet`:`Array<AnimationProperty>`

	An array of `AnimationProperty`s. Starts the animation of the properties simultaneously. Each animation property can contain its own `time`, `timing` and `delay`

- `AnimationObject`: `object`

	```javascript
	AnimationObject = {
		model: AnimationObject | AnimationModelSet | AnimationProperty
		next: AnimationObject | AnimationModelSet | AnimationProperty
	}
	```
	| Key          | Required |Description |
	|--------------|----------|------------|
	|`model`       |`required`| Defines animation model. :exclamation: Can be an `AnimationObject` itself |
	|`next`        |`optional`| Defines animation wich will be started after `model` is finished |

### Mask
##### Attributes
```mask
Animation #myAnimationID x-slots='slotName' x-pipes='pipeName.slotName'
```
| Key          | Description |
|--------------|------------|
|`id`          | The animation component can be found via this id. Or any ancestor component can start the animation by id. `this.animation('myAnimationID')`  |
|`x-slots`     | Starts animation for a signal(s). `;` delimited slot names |
|`x-pipes`     | Starts animation for a piped signal(s). `;` delimited slot names |

##### AnimationProperty
```mask
	Animation {
		'height | 0px > 100px | 200ms linear'
	}
}
```
##### AnimationSet
```mask
	Animation {
		'height | 0px > 100px | 200ms linear'
		'transform | translateX(0%) > translateX(100%) | 100ms ease-in'
		'background-color | green > red | 200ms ease-in 50ms'
	}
}
```
##### AnimationObject
```mask
	Animation {
		@model {
			@model > 'height | 0px > 100px | 200ms linear'
			@next > 'border-radius | 0% > 50% | 100ms linear'
		}
		@next {
			'background-color | > cyan | 100ms linear
		}
	}
}
```

### JavaScript

```javascript
	mask.animate(element:Element, model: AnimationProperty | AnimationSet | AnimationObject, ?onComplete: Function);
```

##### AnimationProperty
```javascript
mask.animate(document.body, 'background-color | > red | 1s linear');
```
##### AnimationSet
```javascript
mask.animate(document.body, [
	'background-color | > red | 1s linear',
	'padding | 0px > 20px | 1s linear',
]);
```
##### AnimationObject
```javascript
mask.animate(document.body, {
	model: [
		'background-color | > red | 1s linear',
		'padding | 0px > 20px | 500ms linear',
	],
	next: 'visibility | > hidden'
});
```

[Simple Demo](http://atmajs.com/mask)

#### Animation Property Declaration

String with a pattern:
```javascript
'propertyName | from > to | time timing delay'
```

Defaults:
* timing = linear
* delay = 0
* from = current value

Example:
```mask
Animation {
	'opacity | 0.1 > .9 | 500ms ease-in'
	'transform | > translate(50px, 150px) | 1s'
}

```

#### Complex Animation Model Sample
```mask
@model {
	@model {
		'transform | > rotate(45deg) | 1s linear' // rotate to 45 degrees from initial state
	}
	@next {
		'transform | scale(0) > scale(2) | 500ms' // scale from 0 to 2, rotation will be kept
	}
}
@next {
	@model {
		@model {
			// animate background-color for 3 seconds after upper model is ready, that means, after scale animation end.
			'background-color | white > red | 3s ease-out'
		}
		@next {
			// dissolve the element
			'transform | > scale(5) | 5s'
			'opacity | 1 > 0 | 4s'
		}
	}
	@next {
		'display | > none' // hide element -> end animation -> call onComplete callback
	}
}
```

#### Signals
Slots and piped-slots can be defined, so that the animation will be started, when the signal is emited in controllers tree or in a pipe

##### Slots
```mask
div {
	Animation #aniID x-slots='slotName; anyOtherName' {
		// ... animation model
	}
}
```

So now if some parent controller emits the signal downwards, and it reaches the animation handler, then element will be animated:
```javascript
this.emitIn('slotName');
```

Controller can start animation also manually with, and if needed - override animate element.
```javascript
this.animation('aniID').start(?onAnimationEnd, ?element);
```

##### Pipes
```mask
div {
	Animation #aniID x-pipes='pipeName.slotName; otherPipe.otherSlot' {
		//...
	}
}
```

Animation Handler will be binded to specified pipes, and when the signal is emitted there, the animation will be started.

Emit a signal in a pipe with:
```javascript
Compo.pipe('pipeName').emit('signalName', ?argsArray);
```



----
:copyright: `MIT` _Atma.js Project_