(function (root, factory) {
		"use strict";

		if (typeof exports === 'object') {
			module.exports = factory();
		} else if (typeof define === 'function' && define.amd) {
			define(factory);
		} else {
			root.UltraDeepClone = factory();
		}
	}(this, function () {

		var functionPropertyFilter = [
			"caller",
			"arguments"
		];

		// Node.js has a lot of silly enumeral properties on its "TypedArray" implementation
		var typedArrayPropertyFilter = [
			'BYTES_PER_ELEMENT',
			'get',
			'set',
			'slice',
			'subarray',
			'buffer',
			'length',
			'byteOffset',
			'byteLength'
		];

		var primitiveCloner  = makeCloner(clonePrimitive);
		var typedArrayCloner = makeRecursiveCloner(makeCloner(cloneTypedArray), typedArrayPropertyFilter);

		function typeString (type) {
			return '[object ' + type + ']';
		}

		var cloneFunctions = {};

		cloneFunctions[typeString('RegExp')] = makeCloner(cloneRegExp);
		cloneFunctions[typeString('Date')] = makeCloner(cloneDate);
		cloneFunctions[typeString('Function')] = makeRecursiveCloner(makeCloner(cloneFunction), functionPropertyFilter);
		cloneFunctions[typeString('Object')] = makeRecursiveCloner(makeCloner(cloneObject));
		cloneFunctions[typeString('Array')] = makeRecursiveCloner(makeCloner(cloneArray));

		['Null', 'Undefined', 'Number', 'String', 'Boolean']
			.map(typeString)
			.forEach(function (type) {
				cloneFunctions[type] = primitiveCloner;
			});

		['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array',
		 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array']
			.map(typeString)
			.forEach(function (type) {
				cloneFunctions[type] = typedArrayCloner;
			});

		function makeArguments (numberOfArgs) {
			var letters = [];
			for ( var i = 1; i <= numberOfArgs; i++ ) letters.push("arg" + i);
			return letters;
		}

		function wrapFunctionWithArity (callback) {
			var argList = makeArguments(callback.length);
			var functionCode = 'return false || function ';
			functionCode += callback.name + '(';
			functionCode += argList.join(', ') + ') {\n';
			functionCode += 'return fn.apply(this, arguments);\n';
			functionCode += '};'

			return Function("fn", functionCode)(callback);
		}

		function makeCloner (cloneThing) {
			return function(thing, thingStack, copyStack) {
				thingStack.push(thing);
				var copy = cloneThing(thing);
				copyStack.push(copy);
				return copy;
			};
		}

		function clonePrimitive (primitive) {
			return primitive;
		}

		function cloneRegExp (regexp) {
			return new RegExp(regexp);
		}

		function cloneDate (date) {
			return new Date(date.getTime());
		}

		// We can't really clone functions but we can wrap them in a new function that will
		// recieve clones of any properties the original function may have had
		function cloneFunction (fn) {
			return wrapFunctionWithArity(fn);
		}

		// This will not properly clone `constructed` objects because
		// it is impossible to know with what arguments the constructor
		// was originally invoked.
		function cloneObject (object) {
			return Object.create(Object.getPrototypeOf(object));
		}

		function cloneArray (array) {
			return [];
		}

		function cloneTypedArray (typedArray) {
			var len = typedArray.length;
			return new typedArray.constructor(len);
		}

		function makeRecursiveCloner (cloneThing, propertyFilter) {
			return function(thing, thingStack, copyStack) {
				var clone = this;

				return Object.getOwnPropertyNames(thing)
					.filter(function(prop){
						return !propertyFilter || propertyFilter.indexOf(prop) === -1;
					})
					.reduce(function(copy, prop) {
						var thingOffset = thingStack.indexOf(thing[prop]);

						if (thingOffset === -1) {
							copy[prop] = clone(thing[prop]);
						} else {
							copy[prop] = copyStack[thingOffset];
						}

						return copy;
					}, cloneThing(thing, thingStack, copyStack));
			};
		}

		return function _ultraDeepClone (source) {

			var thingStack = [];
			var copyStack = [];

			function clone (thing) {
				var typeOfThing = Object.prototype.toString.call(thing);
				return cloneFunctions[typeOfThing].call(clone, thing, thingStack, copyStack);
			};

			return clone(source);
		};
}));
