CSS3 and Sprite Animations
-----
[![Bower version](https://badge.fury.io/bo/mask-animation.svg)](http://badge.fury.io/bo/mask-animation)


```css
div {
    :animation #myAnimationID x-slots='slotName' x-pipes='pipeName.slotName' {
        @model {
    		// property declaration
        	'propertyName | from > to | time timing delay'
        	'otherProperty ...'
        }
        @next {
            // when upper model is ready
            '(property declaration)'
    	}
    }
}
```
[Simple Demo](http://atmajs.com/mask)

#### Animation Property Declaration
is a TextNode with a structure:
```javascript
'propertyName | from > to | time timing delay'
```

Defaults:
* timing = linear
* delay = 0
* from = current value

Example:
```javascript
@model {
	'opacity | 0.1 > .9 | 500ms ease-in'   // note: this is mask syntax, so no commas in the list
	'transform | > translate(50px, 150px) | 1s'
}

```

Features:
* transform - can be used without a vendor prefix - it will be auto added (if needed)
* transformation will be tracked, so if you animate `translate`, and in `@next` model animate `scale` - 'translate' will be kept in element 'transform' style
* not-animatable properties are also supported, such as `display`, `visibility` - they should have no "from" property, and the duration is 0s

#### Animation Model Tree

Consists of `@model` and `@next` tags. And they can be nested within each other.
When `@model` (and all inner `@model` and all inner `@next`) animation is ready then `@next` will be animated.
All `@next` models are optional

Sample
```javascript
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
```scss
div {
	:animation #aniID x-slots='slotName; anyOtherName' {
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
```scss
div {
	:animation #aniID x-pipes='pipeName.slotName; otherPipe.otherSlot' {
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
_(c) MIT. Atma.js Project