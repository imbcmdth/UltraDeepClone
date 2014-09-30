var vows = require('vows'),
    assert = require('assert'),
    deepCopy = require('../');

var testConstructor = function() { this.foo = "test_foo"; };
testConstructor.prototype = { bar: "test_bar" };
testConstructor.baz = "test_baz";

var testTimestamp = Date.now();
var testDate = new Date(testTimestamp);
var testNumber = 12345;
var testString = "12345";
var testArray = ["foo", "bar"];
var testRegExp = /./g;
var testBoolean = true;
var testFunction = function _test() { return "test"; };
var testObject = { foo: "test_foo" };
var testTypedArray = new Int32Array(3);
testTypedArray[0] = 6;
testTypedArray[1] = 3;
testTypedArray[2] = -99;

var testComplexObject = {
	number : testNumber,
	string : testString,
	regexp : new RegExp(testRegExp),
	"null" : null,
	"undefined" : undefined,
	boolean : testBoolean,
	date : testDate,
	"function" : testFunction,
	constructor : testConstructor,
	constructed : new testConstructor(),
	object : testObject,
	array : testArray,
	cycles : {},
	cycles2 :{},
	typedArray: testTypedArray
};

//add some cycles
testComplexObject.cycles.parent = testComplexObject;
testComplexObject.cycles2.other = testComplexObject.cycles;
testComplexObject.cycles.complex = testComplexObject.object;

//we pre-exec the regex to add some internal state
testComplexObject.regexp.exec(testString);

vows.describe('Deep Clone').addBatch({
	'Number': {
		topic: function(){ return deepCopy(testNumber); },
		'Correct Value' : function (clone) {
			assert.equal (clone, testNumber);
		}
	},
	'String': {
		topic: function(){ return deepCopy(testString); },
		'Correct Value' : function (clone) {
			assert.equal (clone, testString);
		}
	},
	'Date': {
		topic: function(){ return deepCopy(testDate); },
		'Correct Value' : function (clone) {
			assert.equal (clone.getTime(), testDate.getTime());
		}
	},
	'Boolean': {
		topic: function(){ return deepCopy(testBoolean); },
		'Correct Value' : function (clone) {
			assert.equal (clone, testBoolean);
		}
	},
	'Array': {
		topic: function(){ return deepCopy(testArray); },
		'Correct Value' : function (clone) {
			assert.deepEqual (clone, testArray);
		},
		'Changes Independently' : function (clone) {
			clone[0] = 'something';
			clone[1] = 'different';
			assert.equal (testArray[0], "foo");
			assert.equal (testArray[1], "bar");
		}
	},
	'Function': {
		topic: function(){ return deepCopy(testFunction); },
		'Correct Value' : function (clone) {
			assert.equal (clone(), testFunction());
		}
	},
	'Typed Array': {
		topic: function(){ return deepCopy(testTypedArray); },
		'Correct Value' : function (clone) {
			assert.deepEqual (clone, testTypedArray);
		},
		'Changes Independently' : function (clone) {
			clone[0] = 0;
			assert.equal (testTypedArray[0], 6);
		}
	},
	'Simple Object': {
		topic: function(){ return deepCopy(testObject); },
		'Correct Value' : function (clone) {
			assert.deepEqual (clone, testObject);
		},
		'Changes Independently' : function (clone) {
			clone.foo = 'different';
			assert.equal (testObject.foo, "test_foo");
		}
	},
	'Complex Object': {
		topic: function(){ return deepCopy(testComplexObject); },

		'number' : function (clone) {
			assert.equal (clone.number, testNumber);
			clone.number = 14;
			assert.equal (testComplexObject.number, testNumber);
		},
		'string': function (clone) {
			assert.equal (clone.string, testString);
			clone.string = 'changed';
			assert.equal (testComplexObject.string, testString);
		},
		'regexp': function (clone) {
			assert.deepEqual (clone.regexp.exec(testString)[0], "1");
			assert.equal (clone.regexp.exec(testString)[0], "2");
			assert.equal (testComplexObject.regexp.exec(testString)[0], "2");
		},
		'null': function (clone) {
			assert.equal (clone.null, null);
		},
		'undefined' : function(clone) {
			assert.equal (typeof clone.undefined, 'undefined');
		},
		'boolean' : function(clone) {
			assert.isTrue (clone.boolean);
			clone.boolean = false;
			assert.isTrue (testComplexObject.boolean);
		},
		'date' : function(clone) {
			assert.equal (clone.date.getTime(), testTimestamp);
			clone.date = new Date();
			assert.equal (testComplexObject.date.getTime(), testTimestamp);
		},
		'function' : function(clone) {
			assert.equal (clone.function(), 'test');
			assert.equal (clone.function.name, '_test');
			clone.function.name = 'changed';
			assert.equal (testComplexObject.function(), 'test');
			assert.equal (testComplexObject.function.name, '_test');
		},
		'constructor' : function(clone) {
			assert.isFalse (clone.constructor === testComplexObject.constructor);
			assert.equal (clone.constructor.baz, 'test_baz');
			clone.constructor.baz = 'changed';
			assert.equal (testComplexObject.constructor.baz, 'test_baz');
		},
		'constructed' : function(clone) {
			assert.isFalse (clone.constructed === testComplexObject.constructed);

			assert.equal (clone.constructed.foo, 'test_foo');
			clone.constructed.foo = 'changed';
			assert.equal (testComplexObject.constructed.foo, 'test_foo');

			assert.equal (clone.constructed.bar, 'test_bar');
			Object.getPrototypeOf(clone.constructed).bar = 'changed';
			assert.equal (testComplexObject.constructed.bar, 'changed');
		},
		'object' : function(clone) {
			assert.equal (clone.object.foo, 'test_foo');
			clone.object.foo = 'changed';
			assert.equal (testComplexObject.object.foo, 'test_foo');
		},
		'array' : function(clone) {
			assert.deepEqual (clone.array, ['foo', 'bar']);
			clone.array[0] = 'changed';
			assert.deepEqual (testComplexObject.array, ['foo', 'bar']);
		},
		'cycles' : function(clone) {
			assert.equal (clone.cycles2.other, clone.cycles);
			assert.equal (clone, clone.cycles.parent);
		},
		'typed array' : function (clone) {
			assert.deepEqual (clone.typedArray, testTypedArray);
			clone.typedArray[0] = 0;
			assert.equal (testTypedArray[0], 6);
		}
	}
}).export(module);
