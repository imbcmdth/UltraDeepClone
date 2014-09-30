# UltraDeepClone (or UDC)

The last deep-clone implementation you will *ever* need!

Features:

* Clones (almost\*) everything: *functions*, *objects*, *arrays*, *regexp*, *dates*, *numbers*, *strings*, *booleans*, *typed arrays*, and even *null* and *undefined*!

* Handles cycles or circular references - objects that contain references to themselves or a parent object.

## Installation

### Node.js

For *Node.js*, use `npm`:

````console
npm install udc
````

..then `require` UltraDeepClone:

````javascript
var UltraDeepClone = require('udc');
````

### In the browser, traditional

For the *browser*, add the following to your pages:

````html
<script src="udc.js"></script>
````

And the global function `UltraDeepClone` will be available.

### In the browser, using AMD (require.js)

...Or using AMD in the browser:

````javascript
require(["udc"], function(UltraDeepClone) {
	// ...
});
````

## Usage

````javascript
var newObject = UltraDeepClone(oldObject); 
````

## \*Note

This will **not** clone *constructed* objects properly. An object built with a constructor function can have hidden state (within the closure) that simply can not be recovered. Also since the value of the arguments passed to the constructor can not be recovered, we can't reconstruct a similar object.

Therefore, objects built using a constructor function will be cloned as well as possible and will have the same properties but they will probably **not** work correctly!

## License - MIT

> Copyright (C) 2012 Jon-Carlos Rivera
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
