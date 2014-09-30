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

		// Node.js has a lot of silly properties on their "TypedArray" implementation
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

		var cloneFunctions = {
			"[object Null]" : primitiveCloner,
			"[object Undefined]" : primitiveCloner,
			"[object Number]" : primitiveCloner,
			"[object String]" : primitiveCloner,
			"[object Boolean]" : primitiveCloner,
			"[object RegExp]" : makeCloner(cloneRegExp),
			"[object Date]" : makeCloner(cloneDate),
			"[object Function]" : makeRecursiveCloner(makeCloner(cloneFunction), functionPropertyFilter),
			"[object Object]" : makeRecursiveCloner(makeCloner(cloneObject)),
			"[object Array]" : makeRecursiveCloner(makeCloner(cloneArray)),
			"[object Int8Array]" : typedArrayCloner,
			"[object Uint8Array]" : typedArrayCloner,
			"[object Uint8ClampedArray]" : typedArrayCloner,
			"[object Int16Array]" : typedArrayCloner,
			"[object Uint16Array]" : typedArrayCloner,
			"[object Int32Array]" : typedArrayCloner,
			"[object Uint32Array]" : typedArrayCloner,
			"[object Float32Array]" : typedArrayCloner,
			"[object Float64Array]" :typedArrayCloner
		};

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
