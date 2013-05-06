# UltraDeepClone (or UDC)

The last deep-clone implementation you will *ever* need!

Features:

* Clones (almost) everything: *functions*, *objects*, *arrays*, *primitives* (*numbers*, *strings*, *booleans*), *regexp*, *dates* and even *null* and *undefined*!

* Handles cycles - objects that contain references to themselves or a parent object.

## Installation

### Node.js

For *Node.js*, use `npm`:

````console
npm install UltraDeepClone
````

..then `require` UltraDeepClone:

````javascript
var UltraDeepClone = require('UltraDeepClone');
````

### In the browser, traditional

For the *browser*, add the following to your pages:

````html
<script src="UltraDeepClone/index.js"></script>
````

And the global function `UltraDeepClone` will be available.

### In the browser, using AMD (require.js)

...Or using AMD in the browser:

````javascript
require(["UltraDeepClone"], function(UltraDeepClone) {
	// ...
});
````

## Usage

````javascript
var newObject = UltraDeepClone(oldObject); 
````

## Caveats

This will not clone *constructed* objects properly. Objects built using a constructor function will be cloned as well as possible but the values passed into the 

## License - MIT

> Copyright (C) 2012 Jon-Carlos Rivera
> 
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
