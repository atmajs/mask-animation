Mask Animation Handler
----


````css
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
````
#### Animation Property Declaration
Is a TextNode with a structure
````javascript
'propertyName | from > to | time timing delay'
````

Defaults
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
* transformation will be tracked, so if you animate 'translate', and in '@next' model animate 'scale' - 'translate' will be kept in element 'transform' style
* non animatable properties are also supported, such as 'display', 'visibility' - they should have no "from" property, and the duration is 0s

#### Animation Model Tree

Consists of ```@model``` and ```@next``` tags. And they can be nested within each other.
When ```@model``` (and all inner ```@model``` and all inner ```@next```) animation is ready then ```@next``` will be animated.
All ```@next``` models are optional

Sample
````javascript
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
````

#### Signals
As Mask supports signal/slots and pipes technics, so slots and piped-slots can be defined, so when the signal is emited in controllers tree or in a pipe
the animation will be started

##### Slots
````css :animation #aniID x-slots='slotName; anyOtherName' { // model ````

So now if some controller emits a signal downwards, and the signal reaches the animation handler, then element will be animated
````javascript this.emitIn('slotName'); ````

Controller can start animation also manually with, and if needed - override animate element.
````javascript this.animation('aniID').start(?onAnimationEnd, ?element); ````

##### Pipes
```` :animation #aniID x-pipes='pipeName.slotName; otherPipe.otherSlot' { // model ````

Animation Handler will be binded to a specified pipes, and if there a signal is emitted, then it will start the animation.

You emit a signal in a pipe with:
````javascript Compo.pipe('pipeName').emit('signalName', ?argsArray); ````



