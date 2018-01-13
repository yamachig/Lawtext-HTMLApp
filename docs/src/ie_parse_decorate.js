"use strict";
// Transcrypt'ed from Python, 2018-01-13 18:59:23

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _parse_decorate() {
				var __symbols__ = ['__py3.6__', '__esv5__'];
				var __all__ = {};
				var __world__ = __all__;

				// Nested object creator, part of the nesting may already exist and have attributes
				var __nest__ = function __nest__(headObject, tailNames, value) {
								// In some cases this will be a global object, e.g. 'window'
								var current = headObject;

								if (tailNames != '') {
												// Split on empty string doesn't give empty list
												// Find the last already created object in tailNames
												var tailChain = tailNames.split('.');
												var firstNewIndex = tailChain.length;
												for (var index = 0; index < tailChain.length; index++) {
																if (!current.hasOwnProperty(tailChain[index])) {
																				firstNewIndex = index;
																				break;
																}
																current = current[tailChain[index]];
												}

												// Create the rest of the objects, if any
												for (var index = firstNewIndex; index < tailChain.length; index++) {
																current[tailChain[index]] = {};
																current = current[tailChain[index]];
												}
								}

								// Insert it new attributes, it may have been created earlier and have other attributes
								for (var attrib in value) {
												current[attrib] = value[attrib];
								}
				};
				__all__.__nest__ = __nest__;

				// Initialize module if not yet done and return its globals
				var _init__ = function _init__(module) {
								if (!module.__inited__) {
												module.__all__.__init__(module.__all__);
												module.__inited__ = true;
								}
								return module.__all__;
				};
				__all__.__init__ = _init__;

				// Since we want to assign functions, a = b.f should make b.f produce a bound function
				// So __get__ should be called by a property rather then a function
				// Factory __get__ creates one of three curried functions for func
				// Which one is produced depends on what's to the left of the dot of the corresponding JavaScript property
				var __get__ = function __get__(self, func, quotedFuncName) {
								if (self) {
												if (self.hasOwnProperty('__class__') || typeof self == 'string' || self instanceof String) {
																// Object before the dot
																if (quotedFuncName) {
																				// Memoize call since fcall is on, by installing bound function in instance
																				Object.defineProperty(self, quotedFuncName, { // Will override the non-own property, next time it will be called directly
																								value: function value() {
																												// So next time just call curry function that calls function
																												var args = [].slice.apply(arguments);
																												return func.apply(null, [self].concat(args));
																								},
																								writable: true,
																								enumerable: true,
																								configurable: true
																				});
																}
																return function () {
																				// Return bound function, code dupplication for efficiency if no memoizing
																				var args = [].slice.apply(arguments); // So multilayer search prototype, apply __get__, call curry func that calls func
																				return func.apply(null, [self].concat(args));
																};
												} else {
																// Class before the dot
																return func; // Return static method
												}
								} else {
												// Nothing before the dot
												return func; // Return free function
								}
				};
				__all__.__get__ = __get__;

				var __getcm__ = function __getcm__(self, func, quotedFuncName) {
								if (self.hasOwnProperty('__class__')) {
												return function () {
																var args = [].slice.apply(arguments);
																return func.apply(null, [self.__class__].concat(args));
												};
								} else {
												return function () {
																var args = [].slice.apply(arguments);
																return func.apply(null, [self].concat(args));
												};
								}
				};
				__all__.__getcm__ = __getcm__;

				var __getsm__ = function __getsm__(self, func, quotedFuncName) {
								return func;
				};
				__all__.__getsm__ = __getsm__;

				// Mother of all metaclasses        
				var py_metatype = {
								__name__: 'type',
								__bases__: [],

								// Overridable class creation worker
								__new__: function __new__(meta, name, bases, attribs) {
												// Create the class cls, a functor, which the class creator function will return
												var cls = function cls() {
																// If cls is called with arg0, arg1, etc, it calls its __new__ method with [arg0, arg1, etc]
																var args = [].slice.apply(arguments); // It has a __new__ method, not yet but at call time, since it is copied from the parent in the loop below
																return cls.__new__(args); // Each Python class directly or indirectly derives from object, which has the __new__ method
												}; // If there are no bases in the Python source, the compiler generates [object] for this parameter

												// Copy all methods, including __new__, properties and static attributes from base classes to new cls object
												// The new class object will simply be the prototype of its instances
												// JavaScript prototypical single inheritance will do here, since any object has only one class
												// This has nothing to do with Python multiple inheritance, that is implemented explictly in the copy loop below
												for (var index = bases.length - 1; index >= 0; index--) {
																// Reversed order, since class vars of first base should win
																var base = bases[index];
																for (var attrib in base) {
																				var descrip = Object.getOwnPropertyDescriptor(base, attrib);
																				Object.defineProperty(cls, attrib, descrip);
																}
												}

												// Add class specific attributes to the created cls object
												cls.__metaclass__ = meta;
												cls.__name__ = name;
												cls.__bases__ = bases;

												// Add own methods, properties and own static attributes to the created cls object
												for (var attrib in attribs) {
																var descrip = Object.getOwnPropertyDescriptor(attribs, attrib);
																Object.defineProperty(cls, attrib, descrip);
												}
												// Return created cls object
												return cls;
								}
				};
				py_metatype.__metaclass__ = py_metatype;
				__all__.py_metatype = py_metatype;

				// Mother of all classes
				var object = {
								__init__: function __init__(self) {},

								__metaclass__: py_metatype, // By default, all classes have metaclass type, since they derive from object
								__name__: 'object',
								__bases__: [],

								// Object creator function, is inherited by all classes (so could be global)
								__new__: function __new__(args) {
												// Args are just the constructor args       
												// In JavaScript the Python class is the prototype of the Python object
												// In this way methods and static attributes will be available both with a class and an object before the dot
												// The descriptor produced by __get__ will return the right method flavor
												var instance = Object.create(this, { __class__: { value: this, enumerable: true } });

												// Call constructor
												this.__init__.apply(null, [instance].concat(args));

												// Return constructed instance
												return instance;
								}
				};
				__all__.object = object;

				// Class creator facade function, calls class creation worker
				var __class__ = function __class__(name, bases, attribs, meta) {
								// Parameter meta is optional
								if (meta == undefined) {
												meta = bases[0].__metaclass__;
								}

								return meta.__new__(meta, name, bases, attribs);
				};
				__all__.__class__ = __class__;

				// Define __pragma__ to preserve '<all>' and '</all>', since it's never generated as a function, must be done early, so here
				var __pragma__ = function __pragma__() {};
				__all__.__pragma__ = __pragma__;

				__nest__(__all__, 'org.transcrypt.__base__', {
								__all__: {
												__inited__: false,
												__init__: function __init__(__all__) {
																var __Envir__ = __class__('__Envir__', [object], {
																				get __init__() {
																								return __get__(this, function (self) {
																												self.interpreter_name = 'python';
																												self.transpiler_name = 'transcrypt';
																												self.transpiler_version = '3.6.56';
																												self.target_subdir = '__javascript__';
																								}, '__init__');
																				}
																});
																var __envir__ = __Envir__();
																__pragma__('<all>');
																__all__.__Envir__ = __Envir__;
																__all__.__envir__ = __envir__;
																__pragma__('</all>');
												}
								}
				});
				__nest__(__all__, 'org.transcrypt.__standard__', {
								__all__: {
												__inited__: false,
												__init__: function __init__(__all__) {
																var Exception = __class__('Exception', [object], {
																				get __init__() {
																								return __get__(this, function (self) {
																												var kwargs = dict();
																												if (arguments.length) {
																																var __ilastarg0__ = arguments.length - 1;
																																if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
																																				var __allkwargs0__ = arguments[__ilastarg0__--];
																																				for (var __attrib0__ in __allkwargs0__) {
																																								switch (__attrib0__) {
																																												case 'self':
																																																var self = __allkwargs0__[__attrib0__];break;
																																												default:
																																																kwargs[__attrib0__] = __allkwargs0__[__attrib0__];
																																								}
																																				}
																																				delete kwargs.__kwargtrans__;
																																}
																																var args = tuple([].slice.apply(arguments).slice(1, __ilastarg0__ + 1));
																												} else {
																																var args = tuple();
																												}
																												self.__args__ = args;
																												try {
																																self.stack = kwargs.error.stack;
																												} catch (__except0__) {
																																self.stack = 'No stack trace available';
																												}
																								}, '__init__');
																				},
																				get __repr__() {
																								return __get__(this, function (self) {
																												if (len(self.__args__)) {
																																return '{}{}'.format(self.__class__.__name__, repr(tuple(self.__args__)));
																												} else {
																																return '{}()'.format(self.__class__.__name__);
																												}
																								}, '__repr__');
																				},
																				get __str__() {
																								return __get__(this, function (self) {
																												if (len(self.__args__) > 1) {
																																return str(tuple(self.__args__));
																												} else if (len(self.__args__)) {
																																return str(self.__args__[0]);
																												} else {
																																return '';
																												}
																								}, '__str__');
																				}
																});
																var IterableError = __class__('IterableError', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, error) {
																												Exception.__init__(self, "Can't iterate over non-iterable", __kwargtrans__({ error: error }));
																								}, '__init__');
																				}
																});
																var StopIteration = __class__('StopIteration', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, error) {
																												Exception.__init__(self, 'Iterator exhausted', __kwargtrans__({ error: error }));
																								}, '__init__');
																				}
																});
																var ValueError = __class__('ValueError', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, message, error) {
																												Exception.__init__(self, message, __kwargtrans__({ error: error }));
																								}, '__init__');
																				}
																});
																var KeyError = __class__('KeyError', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, message, error) {
																												Exception.__init__(self, message, __kwargtrans__({ error: error }));
																								}, '__init__');
																				}
																});
																var AssertionError = __class__('AssertionError', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, message, error) {
																												if (message) {
																																Exception.__init__(self, message, __kwargtrans__({ error: error }));
																												} else {
																																Exception.__init__(self, __kwargtrans__({ error: error }));
																												}
																								}, '__init__');
																				}
																});
																var NotImplementedError = __class__('NotImplementedError', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, message, error) {
																												Exception.__init__(self, message, __kwargtrans__({ error: error }));
																								}, '__init__');
																				}
																});
																var IndexError = __class__('IndexError', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, message, error) {
																												Exception.__init__(self, message, __kwargtrans__({ error: error }));
																								}, '__init__');
																				}
																});
																var AttributeError = __class__('AttributeError', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, message, error) {
																												Exception.__init__(self, message, __kwargtrans__({ error: error }));
																								}, '__init__');
																				}
																});
																var Warning = __class__('Warning', [Exception], {});
																var UserWarning = __class__('UserWarning', [Warning], {});
																var DeprecationWarning = __class__('DeprecationWarning', [Warning], {});
																var RuntimeWarning = __class__('RuntimeWarning', [Warning], {});
																var __sort__ = function __sort__(iterable, key, reverse) {
																				if (typeof key == 'undefined' || key != null && key.hasOwnProperty("__kwargtrans__")) {
																								;
																								var key = null;
																				};
																				if (typeof reverse == 'undefined' || reverse != null && reverse.hasOwnProperty("__kwargtrans__")) {
																								;
																								var reverse = false;
																				};
																				if (arguments.length) {
																								var __ilastarg0__ = arguments.length - 1;
																								if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
																												var __allkwargs0__ = arguments[__ilastarg0__--];
																												for (var __attrib0__ in __allkwargs0__) {
																																switch (__attrib0__) {
																																				case 'iterable':
																																								var iterable = __allkwargs0__[__attrib0__];break;
																																				case 'key':
																																								var key = __allkwargs0__[__attrib0__];break;
																																				case 'reverse':
																																								var reverse = __allkwargs0__[__attrib0__];break;
																																}
																												}
																								}
																				} else {}
																				if (key) {
																								iterable.sort(function __lambda__(a, b) {
																												if (arguments.length) {
																																var __ilastarg0__ = arguments.length - 1;
																																if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
																																				var __allkwargs0__ = arguments[__ilastarg0__--];
																																				for (var __attrib0__ in __allkwargs0__) {
																																								switch (__attrib0__) {
																																												case 'a':
																																																var a = __allkwargs0__[__attrib0__];break;
																																												case 'b':
																																																var b = __allkwargs0__[__attrib0__];break;
																																								}
																																				}
																																}
																												} else {}
																												return key(a) > key(b) ? 1 : -1;
																								});
																				} else {
																								iterable.sort();
																				}
																				if (reverse) {
																								iterable.reverse();
																				}
																};
																var sorted = function sorted(iterable, key, reverse) {
																				if (typeof key == 'undefined' || key != null && key.hasOwnProperty("__kwargtrans__")) {
																								;
																								var key = null;
																				};
																				if (typeof reverse == 'undefined' || reverse != null && reverse.hasOwnProperty("__kwargtrans__")) {
																								;
																								var reverse = false;
																				};
																				if (arguments.length) {
																								var __ilastarg0__ = arguments.length - 1;
																								if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
																												var __allkwargs0__ = arguments[__ilastarg0__--];
																												for (var __attrib0__ in __allkwargs0__) {
																																switch (__attrib0__) {
																																				case 'iterable':
																																								var iterable = __allkwargs0__[__attrib0__];break;
																																				case 'key':
																																								var key = __allkwargs0__[__attrib0__];break;
																																				case 'reverse':
																																								var reverse = __allkwargs0__[__attrib0__];break;
																																}
																												}
																								}
																				} else {}
																				if (py_typeof(iterable) == dict) {
																								var result = copy(iterable.py_keys());
																				} else {
																								var result = copy(iterable);
																				}
																				__sort__(result, key, reverse);
																				return result;
																};
																var map = function map(func, iterable) {
																				return function () {
																								var __accu0__ = [];
																								var __iterable0__ = iterable;
																								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																												var item = __iterable0__[__index0__];
																												__accu0__.append(func(item));
																								}
																								return __accu0__;
																				}();
																};
																var filter = function filter(func, iterable) {
																				if (func == null) {
																								var func = bool;
																				}
																				return function () {
																								var __accu0__ = [];
																								var __iterable0__ = iterable;
																								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																												var item = __iterable0__[__index0__];
																												if (func(item)) {
																																__accu0__.append(item);
																												}
																								}
																								return __accu0__;
																				}();
																};
																var __Terminal__ = __class__('__Terminal__', [object], {
																				get __init__() {
																								return __get__(this, function (self) {
																												self.buffer = '';
																												try {
																																self.element = document.getElementById('__terminal__');
																												} catch (__except0__) {
																																self.element = null;
																												}
																												if (self.element) {
																																self.element.style.overflowX = 'auto';
																																self.element.style.boxSizing = 'border-box';
																																self.element.style.padding = '5px';
																																self.element.innerHTML = '_';
																												}
																								}, '__init__');
																				},
																				get print() {
																								return __get__(this, function (self) {
																												var sep = ' ';
																												var end = '\n';
																												if (arguments.length) {
																																var __ilastarg0__ = arguments.length - 1;
																																if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
																																				var __allkwargs0__ = arguments[__ilastarg0__--];
																																				for (var __attrib0__ in __allkwargs0__) {
																																								switch (__attrib0__) {
																																												case 'self':
																																																var self = __allkwargs0__[__attrib0__];break;
																																												case 'sep':
																																																var sep = __allkwargs0__[__attrib0__];break;
																																												case 'end':
																																																var end = __allkwargs0__[__attrib0__];break;
																																								}
																																				}
																																}
																																var args = tuple([].slice.apply(arguments).slice(1, __ilastarg0__ + 1));
																												} else {
																																var args = tuple();
																												}
																												self.buffer = '{}{}{}'.format(self.buffer, sep.join(function () {
																																var __accu0__ = [];
																																var __iterable0__ = args;
																																for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																				var arg = __iterable0__[__index0__];
																																				__accu0__.append(str(arg));
																																}
																																return __accu0__;
																												}()), end).__getslice__(-4096, null, 1);
																												if (self.element) {
																																self.element.innerHTML = self.buffer.py_replace('\n', '<br>');
																																self.element.scrollTop = self.element.scrollHeight;
																												} else {
																																console.log(sep.join(function () {
																																				var __accu0__ = [];
																																				var __iterable0__ = args;
																																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																								var arg = __iterable0__[__index0__];
																																								__accu0__.append(str(arg));
																																				}
																																				return __accu0__;
																																}()));
																												}
																								}, 'print');
																				},
																				get input() {
																								return __get__(this, function (self, question) {
																												if (arguments.length) {
																																var __ilastarg0__ = arguments.length - 1;
																																if (arguments[__ilastarg0__] && arguments[__ilastarg0__].hasOwnProperty("__kwargtrans__")) {
																																				var __allkwargs0__ = arguments[__ilastarg0__--];
																																				for (var __attrib0__ in __allkwargs0__) {
																																								switch (__attrib0__) {
																																												case 'self':
																																																var self = __allkwargs0__[__attrib0__];break;
																																												case 'question':
																																																var question = __allkwargs0__[__attrib0__];break;
																																								}
																																				}
																																}
																												} else {}
																												self.print('{}'.format(question), __kwargtrans__({ end: '' }));
																												var answer = window.prompt('\n'.join(self.buffer.py_split('\n').__getslice__(-16, null, 1)));
																												self.print(answer);
																												return answer;
																								}, 'input');
																				}
																});
																var __terminal__ = __Terminal__();
																__pragma__('<all>');
																__all__.AssertionError = AssertionError;
																__all__.AttributeError = AttributeError;
																__all__.DeprecationWarning = DeprecationWarning;
																__all__.Exception = Exception;
																__all__.IndexError = IndexError;
																__all__.IterableError = IterableError;
																__all__.KeyError = KeyError;
																__all__.NotImplementedError = NotImplementedError;
																__all__.RuntimeWarning = RuntimeWarning;
																__all__.StopIteration = StopIteration;
																__all__.UserWarning = UserWarning;
																__all__.ValueError = ValueError;
																__all__.Warning = Warning;
																__all__.__Terminal__ = __Terminal__;
																__all__.__sort__ = __sort__;
																__all__.__terminal__ = __terminal__;
																__all__.filter = filter;
																__all__.map = map;
																__all__.sorted = sorted;
																__pragma__('</all>');
												}
								}
				});
				var __call__ = function __call__() /* <callee>, <this>, <params>* */{
								// Needed for __base__ and __standard__ if global 'opov' switch is on
								var args = [].slice.apply(arguments);
								if (_typeof(args[0]) == 'object' && '__call__' in args[0]) {
												// Overloaded
												return args[0].__call__.apply(args[1], args.slice(2));
								} else {
												// Native
												return args[0].apply(args[1], args.slice(2));
								}
				};
				__all__.__call__ = __call__;

				// Initialize non-nested modules __base__ and __standard__ and make its names available directly and via __all__
				// They can't do that itself, because they're regular Python modules
				// The compiler recognizes their names and generates them inline rather than nesting them
				// In this way it isn't needed to import them everywhere

				// __base__

				__nest__(__all__, '', _init__(__all__.org.transcrypt.__base__));
				var __envir__ = __all__.__envir__;

				// __standard__

				__nest__(__all__, '', _init__(__all__.org.transcrypt.__standard__));

				var Exception = __all__.Exception;
				var IterableError = __all__.IterableError;
				var StopIteration = __all__.StopIteration;
				var ValueError = __all__.ValueError;
				var KeyError = __all__.KeyError;
				var AssertionError = __all__.AssertionError;
				var NotImplementedError = __all__.NotImplementedError;
				var IndexError = __all__.IndexError;
				var AttributeError = __all__.AttributeError;

				// Warnings Exceptions
				var Warning = __all__.Warning;
				var UserWarning = __all__.UserWarning;
				var DeprecationWarning = __all__.DeprecationWarning;
				var RuntimeWarning = __all__.RuntimeWarning;

				var __sort__ = __all__.__sort__;
				var sorted = __all__.sorted;

				var map = __all__.map;
				var filter = __all__.filter;

				__all__.print = __all__.__terminal__.print;
				__all__.input = __all__.__terminal__.input;

				var __terminal__ = __all__.__terminal__;
				var print = __all__.print;
				var input = __all__.input;

				// Complete __envir__, that was created in __base__, for non-stub mode
				__envir__.executor_name = __envir__.transpiler_name;

				// Make make __main__ available in browser
				var __main__ = { __file__: '' };
				__all__.main = __main__;

				// Define current exception, there's at most one exception in the air at any time
				var __except__ = null;
				__all__.__except__ = __except__;

				// Creator of a marked dictionary, used to pass **kwargs parameter
				var __kwargtrans__ = function __kwargtrans__(anObject) {
								anObject.__kwargtrans__ = null; // Removable marker
								anObject.constructor = Object;
								return anObject;
				};
				__all__.__kwargtrans__ = __kwargtrans__;

				// 'Oneshot' dict promotor, used to enrich __all__ and help globals () return a true dict
				var __globals__ = function __globals__(anObject) {
								if (isinstance(anObject, dict)) {
												// Don't attempt to promote (enrich) again, since it will make a copy
												return anObject;
								} else {
												return dict(anObject);
								}
				};
				__all__.__globals__ = __globals__;

				// Partial implementation of super () .<methodName> (<params>)
				var __super__ = function __super__(aClass, methodName) {
								// Lean and fast, no C3 linearization, only call first implementation encountered
								// Will allow __super__ ('<methodName>') (self, <params>) rather than only <className>.<methodName> (self, <params>)

								for (var index = 0; index < aClass.__bases__.length; index++) {
												var base = aClass.__bases__[index];
												if (methodName in base) {
																return base[methodName];
												}
								}

								throw new Exception('Superclass method not found'); // !!! Improve!
				};
				__all__.__super__ = __super__;

				// Python property installer function, no member since that would bloat classes
				var property = function property(getter, setter) {
								// Returns a property descriptor rather than a property
								if (!setter) {
												// ??? Make setter optional instead of dummy?
												setter = function setter() {};
								}
								return { get: function get() {
																return getter(this);
												}, set: function set(value) {
																setter(this, value);
												}, enumerable: true };
				};
				__all__.property = property;

				// Conditional JavaScript property installer function, prevents redefinition of properties if multiple Transcrypt apps are on one page
				var __setProperty__ = function __setProperty__(anObject, name, descriptor) {
								if (!anObject.hasOwnProperty(name)) {
												Object.defineProperty(anObject, name, descriptor);
								}
				};
				__all__.__setProperty__ = __setProperty__;

				// Assert function, call to it only generated when compiling with --dassert option
				function assert(condition, message) {
								// Message may be undefined
								if (!condition) {
												throw AssertionError(message, new Error());
								}
				}

				__all__.assert = assert;

				var __merge__ = function __merge__(object0, object1) {
								var result = {};
								for (var attrib in object0) {
												result[attrib] = object0[attrib];
								}
								for (var attrib in object1) {
												result[attrib] = object1[attrib];
								}
								return result;
				};
				__all__.__merge__ = __merge__;

				// Manipulating attributes by name

				var dir = function dir(obj) {
								var aList = [];
								for (var aKey in obj) {
												aList.push(aKey);
								}
								aList.sort();
								return aList;
				};
				__all__.dir = dir;

				var setattr = function setattr(obj, name, value) {
								obj[name] = value;
				};
				__all__.setattr = setattr;

				var getattr = function getattr(obj, name) {
								return obj[name];
				};
				__all__.getattr = getattr;

				var hasattr = function hasattr(obj, name) {
								try {
												return name in obj;
								} catch (exception) {
												return false;
								}
				};
				__all__.hasattr = hasattr;

				var delattr = function delattr(obj, name) {
								delete obj[name];
				};
				__all__.delattr = delattr;

				// The __in__ function, used to mimic Python's 'in' operator
				// In addition to CPython's semantics, the 'in' operator is also allowed to work on objects, avoiding a counterintuitive separation between Python dicts and JavaScript objects
				// In general many Transcrypt compound types feature a deliberate blend of Python and JavaScript facilities, facilitating efficient integration with JavaScript libraries
				// If only Python objects and Python dicts are dealt with in a certain context, the more pythonic 'hasattr' is preferred for the objects as opposed to 'in' for the dicts
				var __in__ = function __in__(element, container) {
								if (py_typeof(container) == dict) {
												// Currently only implemented as an augmented JavaScript object
												return container.hasOwnProperty(element);
								} else {
												// Parameter 'element' itself is an array, string or a plain, non-dict JavaScript object
												return container.indexOf ? // If it has an indexOf
												container.indexOf(element) > -1 : // it's an array or a string,
												container.hasOwnProperty(element) // else it's a plain, non-dict JavaScript object
												;
								}
				};
				__all__.__in__ = __in__;

				// Find out if an attribute is special
				var __specialattrib__ = function __specialattrib__(attrib) {
								return attrib.startswith('__') && attrib.endswith('__') || attrib == 'constructor' || attrib.startswith('py_');
				};
				__all__.__specialattrib__ = __specialattrib__;

				// Compute length of any object
				var len = function len(anObject) {
								if (anObject === undefined || anObject === null) {
												return 0;
								}

								if (anObject.__len__ instanceof Function) {
												return anObject.__len__();
								}

								if (anObject.length !== undefined) {
												return anObject.length;
								}

								var length = 0;
								for (var attr in anObject) {
												if (!__specialattrib__(attr)) {
																length++;
												}
								}

								return length;
				};
				__all__.len = len;

				// General conversions

				function __i__(any) {
								//  Conversion to iterable
								return py_typeof(any) == dict ? any.py_keys() : any;
				}

				// If the target object is somewhat true, return it. Otherwise return false.
				// Try to follow Python conventions of truthyness
				function __t__(target) {
								return (
												// Avoid invalid checks
												target === undefined || target === null ? false :

												// Take a quick shortcut if target is a simple type
												['boolean', 'number'].indexOf(typeof target === 'undefined' ? 'undefined' : _typeof(target)) >= 0 ? target :

												// Use __bool__ (if present) to decide if target is true
												target.__bool__ instanceof Function ? target.__bool__() ? target : false :

												// There is no __bool__, use __len__ (if present) instead
												target.__len__ instanceof Function ? target.__len__() !== 0 ? target : false :

												// There is no __bool__ and no __len__, declare Functions true.
												// Python objects are transpiled into instances of Function and if
												// there is no __bool__ or __len__, the object in Python is true.
												target instanceof Function ? target :

												// Target is something else, compute its len to decide
												len(target) !== 0 ? target :

												// When all else fails, declare target as false
												false
								);
				}
				__all__.__t__ = __t__;

				var bool = function bool(any) {
								// Always truly returns a bool, rather than something truthy or falsy
								return !!__t__(any);
				};
				bool.__name__ = 'bool'; // So it can be used as a type with a name
				__all__.bool = bool;

				var float = function float(any) {
								if (any == 'inf') {
												return Infinity;
								} else if (any == '-inf') {
												return -Infinity;
								} else if (isNaN(parseFloat(any))) {
												// Call to parseFloat needed to exclude '', ' ' etc.
												if (any === false) {
																return 0;
												} else if (any === true) {
																return 1;
												} else {
																// Needed e.g. in autoTester.check, so "return any ? true : false" won't do
																throw ValueError("could not convert string to float: '" + str(any) + "'", new Error());
												}
								} else {
												return +any;
								}
				};
				float.__name__ = 'float';
				__all__.float = float;

				var int = function int(any) {
								return float(any) | 0;
				};
				int.__name__ = 'int';
				__all__.int = int;

				var py_typeof = function py_typeof(anObject) {
								var aType = typeof anObject === 'undefined' ? 'undefined' : _typeof(anObject);
								if (aType == 'object') {
												// Directly trying '__class__ in anObject' turns out to wreck anObject in Chrome if its a primitive
												try {
																return anObject.__class__;
												} catch (exception) {
																return aType;
												}
								} else {
												return (// Odly, the braces are required here
																aType == 'boolean' ? bool : aType == 'string' ? str : aType == 'number' ? anObject % 1 == 0 ? int : float : null
												);
								}
				};
				__all__.py_typeof = py_typeof;

				var isinstance = function isinstance(anObject, classinfo) {
								function isA(queryClass) {
												if (queryClass == classinfo) {
																return true;
												}
												for (var index = 0; index < queryClass.__bases__.length; index++) {
																if (isA(queryClass.__bases__[index], classinfo)) {
																				return true;
																}
												}
												return false;
								}

								if (classinfo instanceof Array) {
												// Assume in most cases it isn't, then making it recursive rather than two functions saves a call
												for (var index = 0; index < classinfo.length; index++) {
																var aClass = classinfo[index];
																if (isinstance(anObject, aClass)) {
																				return true;
																}
												}
												return false;
								}

								try {
												// Most frequent use case first
												return '__class__' in anObject ? isA(anObject.__class__) : anObject instanceof classinfo;
								} catch (exception) {
												// Using isinstance on primitives assumed rare
												var aType = py_typeof(anObject);
												return aType == classinfo || aType == bool && classinfo == int;
								}
				};
				__all__.isinstance = isinstance;

				var callable = function callable(anObject) {
								if ((typeof anObject === 'undefined' ? 'undefined' : _typeof(anObject)) == 'object' && '__call__' in anObject) {
												return true;
								} else {
												return typeof anObject === 'function';
								}
				};
				__all__.callable = callable;

				// Repr function uses __repr__ method, then __str__, then toString
				var repr = function repr(anObject) {
								try {
												return anObject.__repr__();
								} catch (exception) {
												try {
																return anObject.__str__();
												} catch (exception) {
																// anObject has no __repr__ and no __str__
																try {
																				if (anObject == null) {
																								return 'None';
																				} else if (anObject.constructor == Object) {
																								var result = '{';
																								var comma = false;
																								for (var attrib in anObject) {
																												if (!__specialattrib__(attrib)) {
																																if (attrib.isnumeric()) {
																																				var attribRepr = attrib; // If key can be interpreted as numerical, we make it numerical
																																} // So we accept that '1' is misrepresented as 1
																																else {
																																								var attribRepr = '\'' + attrib + '\''; // Alpha key in dict
																																				}

																																if (comma) {
																																				result += ', ';
																																} else {
																																				comma = true;
																																}
																																result += attribRepr + ': ' + repr(anObject[attrib]);
																												}
																								}
																								result += '}';
																								return result;
																				} else {
																								return typeof anObject == 'boolean' ? anObject.toString().capitalize() : anObject.toString();
																				}
																} catch (exception) {
																				return '<object of type: ' + (typeof anObject === 'undefined' ? 'undefined' : _typeof(anObject)) + '>';
																}
												}
								}
				};
				__all__.repr = repr;

				// Char from Unicode or ASCII
				var chr = function chr(charCode) {
								return String.fromCharCode(charCode);
				};
				__all__.chr = chr;

				// Unicode or ASCII from char
				var ord = function ord(aChar) {
								return aChar.charCodeAt(0);
				};
				__all__.ord = ord;

				// Maximum of n numbers
				var max = Math.max;
				__all__.max = max;

				// Minimum of n numbers
				var min = Math.min;
				__all__.min = min;

				// Absolute value
				var abs = Math.abs;
				__all__.abs = abs;

				// Bankers rounding
				var round = function round(number, ndigits) {
								if (ndigits) {
												var scale = Math.pow(10, ndigits);
												number *= scale;
								}

								var rounded = Math.round(number);
								if (rounded - number == 0.5 && rounded % 2) {
												// Has rounded up to odd, should have rounded down to even
												rounded -= 1;
								}

								if (ndigits) {
												rounded /= scale;
								}

								return rounded;
				};
				__all__.round = round;

				// BEGIN unified iterator model

				function __jsUsePyNext__() {
								// Add as 'next' method to make Python iterator JavaScript compatible
								try {
												var result = this.__next__();
												return { value: result, done: false };
								} catch (exception) {
												return { value: undefined, done: true };
								}
				}

				function __pyUseJsNext__() {
								// Add as '__next__' method to make JavaScript iterator Python compatible
								var result = this.next();
								if (result.done) {
												throw StopIteration(new Error());
								} else {
												return result.value;
								}
				}

				function py_iter(iterable) {
								// Alias for Python's iter function, produces a universal iterator / iterable, usable in Python and JavaScript
								if (typeof iterable == 'string' || '__iter__' in iterable) {
												// JavaScript Array or string or Python iterable (string has no 'in')
												var result = iterable.__iter__(); // Iterator has a __next__
												result.next = __jsUsePyNext__; // Give it a next
								} else if ('selector' in iterable) {
												// Assume it's a JQuery iterator
												var result = list(iterable).__iter__(); // Has a __next__
												result.next = __jsUsePyNext__; // Give it a next
								} else if ('next' in iterable) {
												// It's a JavaScript iterator already,  maybe a generator, has a next and may have a __next__
												var result = iterable;
												if (!('__next__' in result)) {
																// If there's no danger of recursion
																result.__next__ = __pyUseJsNext__; // Give it a __next__
												}
								} else if (Symbol.iterator in iterable) {
												// It's a JavaScript iterable such as a typed array, but not an iterator
												var result = iterable[Symbol.iterator](); // Has a next
												result.__next__ = __pyUseJsNext__; // Give it a __next__
								} else {
												throw IterableError(new Error()); // No iterator at all
								}
								result[Symbol.iterator] = function () {
												return result;
								};
								return result;
				}

				function py_next(iterator) {
								// Called only in a Python context, could receive Python or JavaScript iterator
								try {
												// Primarily assume Python iterator, for max speed
												var result = iterator.__next__();
								} catch (exception) {
												// JavaScript iterators are the exception here
												var result = iterator.next();
												if (result.done) {
																throw StopIteration(new Error());
												} else {
																return result.value;
												}
								}
								if (result == undefined) {
												throw StopIteration(new Error());
								} else {
												return result;
								}
				}

				function __PyIterator__(iterable) {
								this.iterable = iterable;
								this.index = 0;
				}

				__PyIterator__.prototype.__next__ = function () {
								if (this.index < this.iterable.length) {
												return this.iterable[this.index++];
								} else {
												throw StopIteration(new Error());
								}
				};

				function __JsIterator__(iterable) {
								this.iterable = iterable;
								this.index = 0;
				}

				__JsIterator__.prototype.next = function () {
								if (this.index < this.iterable.py_keys.length) {
												return { value: this.index++, done: false };
								} else {
												return { value: undefined, done: true };
								}
				};

				// END unified iterator model

				// Reversed function for arrays
				var py_reversed = function py_reversed(iterable) {
								iterable = iterable.slice();
								iterable.reverse();
								return iterable;
				};
				__all__.py_reversed = py_reversed;

				// Zip method for arrays and strings
				var zip = function zip() {
								var args = [].slice.call(arguments);
								for (var i = 0; i < args.length; i++) {
												if (typeof args[i] == 'string') {
																args[i] = args[i].split('');
												} else if (!Array.isArray(args[i])) {
																args[i] = Array.from(args[i]);
												}
								}
								var shortest = args.length == 0 ? [] : args.reduce( // Find shortest array in arguments
								function (array0, array1) {
												return array0.length < array1.length ? array0 : array1;
								});
								return shortest.map( // Map each element of shortest array
								function (current, index) {
												// To the result of this function
												return args.map( // Map each array in arguments
												function (current) {
																// To the result of this function
																return current[index]; // Namely it's index't entry
												});
								});
				};
				__all__.zip = zip;

				// Range method, returning an array
				function range(start, stop, step) {
								if (stop == undefined) {
												// one param defined
												stop = start;
												start = 0;
								}
								if (step == undefined) {
												step = 1;
								}
								if (step > 0 && start >= stop || step < 0 && start <= stop) {
												return [];
								}
								var result = [];
								for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
												result.push(i);
								}
								return result;
				};
				__all__.range = range;

				// Any, all and sum

				function any(iterable) {
								for (var index = 0; index < iterable.length; index++) {
												if (bool(iterable[index])) {
																return true;
												}
								}
								return false;
				}
				function all(iterable) {
								for (var index = 0; index < iterable.length; index++) {
												if (!bool(iterable[index])) {
																return false;
												}
								}
								return true;
				}
				function sum(iterable) {
								var result = 0;
								for (var index = 0; index < iterable.length; index++) {
												result += iterable[index];
								}
								return result;
				}

				__all__.any = any;
				__all__.all = all;
				__all__.sum = sum;

				// Enumerate method, returning a zipped list
				function enumerate(iterable) {
								return zip(range(len(iterable)), iterable);
				}
				__all__.enumerate = enumerate;

				// Shallow and deepcopy

				function copy(anObject) {
								if (anObject == null || (typeof anObject === 'undefined' ? 'undefined' : _typeof(anObject)) == "object") {
												return anObject;
								} else {
												var result = {};
												for (var attrib in obj) {
																if (anObject.hasOwnProperty(attrib)) {
																				result[attrib] = anObject[attrib];
																}
												}
												return result;
								}
				}
				__all__.copy = copy;

				function deepcopy(anObject) {
								if (anObject == null || (typeof anObject === 'undefined' ? 'undefined' : _typeof(anObject)) == "object") {
												return anObject;
								} else {
												var result = {};
												for (var attrib in obj) {
																if (anObject.hasOwnProperty(attrib)) {
																				result[attrib] = deepcopy(anObject[attrib]);
																}
												}
												return result;
								}
				}
				__all__.deepcopy = deepcopy;

				// List extensions to Array

				function list(iterable) {
								// All such creators should be callable without new
								var instance = iterable ? [].slice.apply(iterable) : []; // Spread iterable, n.b. array.slice (), so array before dot
								// Sort is the normal JavaScript sort, Python sort is a non-member function
								return instance;
				}
				__all__.list = list;
				Array.prototype.__class__ = list; // All arrays are lists (not only if constructed by the list ctor), unless constructed otherwise
				list.__name__ = 'list';

				/*
    Array.from = function (iterator) { // !!! remove
        result = [];
        for (item of iterator) {
            result.push (item);
        }
        return result;
    }
    */

				Array.prototype.__iter__ = function () {
								return new __PyIterator__(this);
				};

				Array.prototype.__getslice__ = function (start, stop, step) {
								if (start < 0) {
												start = this.length + start;
								}

								if (stop == null) {
												stop = this.length;
								} else if (stop < 0) {
												stop = this.length + stop;
								} else if (stop > this.length) {
												stop = this.length;
								}

								var result = list([]);
								for (var index = start; index < stop; index += step) {
												result.push(this[index]);
								}

								return result;
				};

				Array.prototype.__setslice__ = function (start, stop, step, source) {
								if (start < 0) {
												start = this.length + start;
								}

								if (stop == null) {
												stop = this.length;
								} else if (stop < 0) {
												stop = this.length + stop;
								}

								if (step == null) {
												// Assign to 'ordinary' slice, replace subsequence
												Array.prototype.splice.apply(this, [start, stop - start].concat(source));
								} else {
												// Assign to extended slice, replace designated items one by one
												var sourceIndex = 0;
												for (var targetIndex = start; targetIndex < stop; targetIndex += step) {
																this[targetIndex] = source[sourceIndex++];
												}
								}
				};

				Array.prototype.__repr__ = function () {
								if (this.__class__ == set && !this.length) {
												return 'set()';
								}

								var result = !this.__class__ || this.__class__ == list ? '[' : this.__class__ == tuple ? '(' : '{';

								for (var index = 0; index < this.length; index++) {
												if (index) {
																result += ', ';
												}
												result += repr(this[index]);
								}

								if (this.__class__ == tuple && this.length == 1) {
												result += ',';
								}

								result += !this.__class__ || this.__class__ == list ? ']' : this.__class__ == tuple ? ')' : '}';;
								return result;
				};

				Array.prototype.__str__ = Array.prototype.__repr__;

				Array.prototype.append = function (element) {
								this.push(element);
				};

				Array.prototype.clear = function () {
								this.length = 0;
				};

				Array.prototype.extend = function (aList) {
								this.push.apply(this, aList);
				};

				Array.prototype.insert = function (index, element) {
								this.splice(index, 0, element);
				};

				Array.prototype.remove = function (element) {
								var index = this.indexOf(element);
								if (index == -1) {
												throw ValueError("list.remove(x): x not in list", new Error());
								}
								this.splice(index, 1);
				};

				Array.prototype.index = function (element) {
								return this.indexOf(element);
				};

				Array.prototype.py_pop = function (index) {
								if (index == undefined) {
												return this.pop(); // Remove last element
								} else {
												return this.splice(index, 1)[0];
								}
				};

				Array.prototype.py_sort = function () {
								__sort__.apply(null, [this].concat([].slice.apply(arguments))); // Can't work directly with arguments
								// Python params: (iterable, key = None, reverse = False)
								// py_sort is called with the Transcrypt kwargs mechanism, and just passes the params on to __sort__
								// __sort__ is def'ed with the Transcrypt kwargs mechanism
				};

				Array.prototype.__add__ = function (aList) {
								return list(this.concat(aList));
				};

				Array.prototype.__mul__ = function (scalar) {
								var result = this;
								for (var i = 1; i < scalar; i++) {
												result = result.concat(this);
								}
								return result;
				};

				Array.prototype.__rmul__ = Array.prototype.__mul__;

				// Tuple extensions to Array

				function tuple(iterable) {
								var instance = iterable ? [].slice.apply(iterable) : [];
								instance.__class__ = tuple; // Not all arrays are tuples
								return instance;
				}
				__all__.tuple = tuple;
				tuple.__name__ = 'tuple';

				// Set extensions to Array
				// N.B. Since sets are unordered, set operations will occasionally alter the 'this' array by sorting it

				function set(iterable) {
								var instance = [];
								if (iterable) {
												for (var index = 0; index < iterable.length; index++) {
																instance.add(iterable[index]);
												}
								}
								instance.__class__ = set; // Not all arrays are sets
								return instance;
				}
				__all__.set = set;
				set.__name__ = 'set';

				Array.prototype.__bindexOf__ = function (element) {
								// Used to turn O (n^2) into O (n log n)
								// Since sorting is lex, compare has to be lex. This also allows for mixed lists

								element += '';

								var mindex = 0;
								var maxdex = this.length - 1;

								while (mindex <= maxdex) {
												var index = (mindex + maxdex) / 2 | 0;
												var middle = this[index] + '';

												if (middle < element) {
																mindex = index + 1;
												} else if (middle > element) {
																maxdex = index - 1;
												} else {
																return index;
												}
								}

								return -1;
				};

				Array.prototype.add = function (element) {
								if (this.indexOf(element) == -1) {
												// Avoid duplicates in set
												this.push(element);
								}
				};

				Array.prototype.discard = function (element) {
								var index = this.indexOf(element);
								if (index != -1) {
												this.splice(index, 1);
								}
				};

				Array.prototype.isdisjoint = function (other) {
								this.sort();
								for (var i = 0; i < other.length; i++) {
												if (this.__bindexOf__(other[i]) != -1) {
																return false;
												}
								}
								return true;
				};

				Array.prototype.issuperset = function (other) {
								this.sort();
								for (var i = 0; i < other.length; i++) {
												if (this.__bindexOf__(other[i]) == -1) {
																return false;
												}
								}
								return true;
				};

				Array.prototype.issubset = function (other) {
								return set(other.slice()).issuperset(this); // Sort copy of 'other', not 'other' itself, since it may be an ordered sequence
				};

				Array.prototype.union = function (other) {
								var result = set(this.slice().sort());
								for (var i = 0; i < other.length; i++) {
												if (result.__bindexOf__(other[i]) == -1) {
																result.push(other[i]);
												}
								}
								return result;
				};

				Array.prototype.intersection = function (other) {
								this.sort();
								var result = set();
								for (var i = 0; i < other.length; i++) {
												if (this.__bindexOf__(other[i]) != -1) {
																result.push(other[i]);
												}
								}
								return result;
				};

				Array.prototype.difference = function (other) {
								var sother = set(other.slice().sort());
								var result = set();
								for (var i = 0; i < this.length; i++) {
												if (sother.__bindexOf__(this[i]) == -1) {
																result.push(this[i]);
												}
								}
								return result;
				};

				Array.prototype.symmetric_difference = function (other) {
								return this.union(other).difference(this.intersection(other));
				};

				Array.prototype.py_update = function () {
								// O (n)
								var updated = [].concat.apply(this.slice(), arguments).sort();
								this.clear();
								for (var i = 0; i < updated.length; i++) {
												if (updated[i] != updated[i - 1]) {
																this.push(updated[i]);
												}
								}
				};

				Array.prototype.__eq__ = function (other) {
								// Also used for list
								if (this.length != other.length) {
												return false;
								}
								if (this.__class__ == set) {
												this.sort();
												other.sort();
								}
								for (var i = 0; i < this.length; i++) {
												if (this[i] != other[i]) {
																return false;
												}
								}
								return true;
				};

				Array.prototype.__ne__ = function (other) {
								// Also used for list
								return !this.__eq__(other);
				};

				Array.prototype.__le__ = function (other) {
								return this.issubset(other);
				};

				Array.prototype.__ge__ = function (other) {
								return this.issuperset(other);
				};

				Array.prototype.__lt__ = function (other) {
								return this.issubset(other) && !this.issuperset(other);
				};

				Array.prototype.__gt__ = function (other) {
								return this.issuperset(other) && !this.issubset(other);
				};

				// String extensions

				function str(stringable) {
								try {
												return stringable.__str__();
								} catch (exception) {
												try {
																return repr(stringable);
												} catch (exception) {
																return String(stringable); // No new, so no permanent String object but a primitive in a temporary 'just in time' wrapper
												}
								}
				};
				__all__.str = str;

				String.prototype.__class__ = str; // All strings are str
				str.__name__ = 'str';

				String.prototype.__iter__ = function () {
								new __PyIterator__(this);
				};

				String.prototype.__repr__ = function () {
								return (this.indexOf('\'') == -1 ? '\'' + this + '\'' : '"' + this + '"').py_replace('\t', '\\t').py_replace('\n', '\\n');
				};

				String.prototype.__str__ = function () {
								return this;
				};

				String.prototype.capitalize = function () {
								return this.charAt(0).toUpperCase() + this.slice(1);
				};

				String.prototype.endswith = function (suffix) {
								return suffix == '' || this.slice(-suffix.length) == suffix;
				};

				String.prototype.find = function (sub, start) {
								return this.indexOf(sub, start);
				};

				String.prototype.__getslice__ = function (start, stop, step) {
								if (start < 0) {
												start = this.length + start;
								}

								if (stop == null) {
												stop = this.length;
								} else if (stop < 0) {
												stop = this.length + stop;
								}

								var result = '';
								if (step == 1) {
												result = this.substring(start, stop);
								} else {
												for (var index = start; index < stop; index += step) {
																result = result.concat(this.charAt(index));
												}
								}
								return result;
				};

				// Since it's worthwhile for the 'format' function to be able to deal with *args, it is defined as a property
				// __get__ will produce a bound function if there's something before the dot
				// Since a call using *args is compiled to e.g. <object>.<function>.apply (null, args), the function has to be bound already
				// Otherwise it will never be, because of the null argument
				// Using 'this' rather than 'null' contradicts the requirement to be able to pass bound functions around
				// The object 'before the dot' won't be available at call time in that case, unless implicitly via the function bound to it
				// While for Python methods this mechanism is generated by the compiler, for JavaScript methods it has to be provided manually
				// Call memoizing is unattractive here, since every string would then have to hold a reference to a bound format method
				__setProperty__(String.prototype, 'format', {
								get: function get() {
												return __get__(this, function (self) {
																var args = tuple([].slice.apply(arguments).slice(1));
																var autoIndex = 0;
																return self.replace(/\{(\w*)\}/g, function (match, key) {
																				if (key == '') {
																								key = autoIndex++;
																				}
																				if (key == +key) {
																								// So key is numerical
																								return args[key] == undefined ? match : str(args[key]);
																				} else {
																								// Key is a string
																								for (var index = 0; index < args.length; index++) {
																												// Find first 'dict' that has that key and the right field
																												if (_typeof(args[index]) == 'object' && args[index][key] != undefined) {
																																return str(args[index][key]); // Return that field field
																												}
																								}
																								return match;
																				}
																});
												});
								},
								enumerable: true
				});

				String.prototype.isalnum = function () {
								return (/^[0-9a-zA-Z]{1,}$/.test(this)
								);
				};

				String.prototype.isalpha = function () {
								return (/^[a-zA-Z]{1,}$/.test(this)
								);
				};

				String.prototype.isdecimal = function () {
								return (/^[0-9]{1,}$/.test(this)
								);
				};

				String.prototype.isdigit = function () {
								return this.isdecimal();
				};

				String.prototype.islower = function () {
								return (/^[a-z]{1,}$/.test(this)
								);
				};

				String.prototype.isupper = function () {
								return (/^[A-Z]{1,}$/.test(this)
								);
				};

				String.prototype.isspace = function () {
								return (/^[\s]{1,}$/.test(this)
								);
				};

				String.prototype.isnumeric = function () {
								return !isNaN(parseFloat(this)) && isFinite(this);
				};

				String.prototype.join = function (strings) {
								return strings.join(this);
				};

				String.prototype.lower = function () {
								return this.toLowerCase();
				};

				String.prototype.py_replace = function (old, aNew, maxreplace) {
								return this.split(old, maxreplace).join(aNew);
				};

				String.prototype.lstrip = function () {
								return this.replace(/^\s*/g, '');
				};

				String.prototype.rfind = function (sub, start) {
								return this.lastIndexOf(sub, start);
				};

				String.prototype.rsplit = function (sep, maxsplit) {
								// Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
								if (sep == undefined || sep == null) {
												sep = /\s+/;
												var stripped = this.strip();
								} else {
												var stripped = this;
								}

								if (maxsplit == undefined || maxsplit == -1) {
												return stripped.split(sep);
								} else {
												var result = stripped.split(sep);
												if (maxsplit < result.length) {
																var maxrsplit = result.length - maxsplit;
																return [result.slice(0, maxrsplit).join(sep)].concat(result.slice(maxrsplit));
												} else {
																return result;
												}
								}
				};

				String.prototype.rstrip = function () {
								return this.replace(/\s*$/g, '');
				};

				String.prototype.py_split = function (sep, maxsplit) {
								// Combination of general whitespace sep and positive maxsplit neither supported nor checked, expensive and rare
								if (sep == undefined || sep == null) {
												sep = /\s+/;
												var stripped = this.strip();
								} else {
												var stripped = this;
								}

								if (maxsplit == undefined || maxsplit == -1) {
												return stripped.split(sep);
								} else {
												var result = stripped.split(sep);
												if (maxsplit < result.length) {
																return result.slice(0, maxsplit).concat([result.slice(maxsplit).join(sep)]);
												} else {
																return result;
												}
								}
				};

				String.prototype.startswith = function (prefix) {
								return this.indexOf(prefix) == 0;
				};

				String.prototype.strip = function () {
								return this.trim();
				};

				String.prototype.upper = function () {
								return this.toUpperCase();
				};

				String.prototype.__mul__ = function (scalar) {
								var result = this;
								for (var i = 1; i < scalar; i++) {
												result = result + this;
								}
								return result;
				};

				String.prototype.__rmul__ = String.prototype.__mul__;

				// Dict extensions to object

				function __keys__() {
								var keys = [];
								for (var attrib in this) {
												if (!__specialattrib__(attrib)) {
																keys.push(attrib);
												}
								}
								return keys;
				}

				function __items__() {
								var items = [];
								for (var attrib in this) {
												if (!__specialattrib__(attrib)) {
																items.push([attrib, this[attrib]]);
												}
								}
								return items;
				}

				function __del__(key) {
								delete this[key];
				}

				function __clear__() {
								for (var attrib in this) {
												delete this[attrib];
								}
				}

				function __getdefault__(aKey, aDefault) {
								// Each Python object already has a function called __get__, so we call this one __getdefault__
								var result = this[aKey];
								return result == undefined ? aDefault == undefined ? null : aDefault : result;
				}

				function __setdefault__(aKey, aDefault) {
								var result = this[aKey];
								if (result != undefined) {
												return result;
								}
								var val = aDefault == undefined ? null : aDefault;
								this[aKey] = val;
								return val;
				}

				function __pop__(aKey, aDefault) {
								var result = this[aKey];
								if (result != undefined) {
												delete this[aKey];
												return result;
								} else {
												// Identify check because user could pass None
												if (aDefault === undefined) {
																throw KeyError(aKey, new Error());
												}
								}
								return aDefault;
				}

				function __popitem__() {
								var aKey = Object.keys(this)[0];
								if (aKey == null) {
												throw KeyError("popitem(): dictionary is empty", new Error());
								}
								var result = tuple([aKey, this[aKey]]);
								delete this[aKey];
								return result;
				}

				function __update__(aDict) {
								for (var aKey in aDict) {
												this[aKey] = aDict[aKey];
								}
				}

				function __values__() {
								var values = [];
								for (var attrib in this) {
												if (!__specialattrib__(attrib)) {
																values.push(this[attrib]);
												}
								}
								return values;
				}

				function __dgetitem__(aKey) {
								return this[aKey];
				}

				function __dsetitem__(aKey, aValue) {
								this[aKey] = aValue;
				}

				function dict(objectOrPairs) {
								var instance = {};
								if (!objectOrPairs || objectOrPairs instanceof Array) {
												// It's undefined or an array of pairs
												if (objectOrPairs) {
																for (var index = 0; index < objectOrPairs.length; index++) {
																				var pair = objectOrPairs[index];
																				if (!(pair instanceof Array) || pair.length != 2) {
																								throw ValueError("dict update sequence element #" + index + " has length " + pair.length + "; 2 is required", new Error());
																				}
																				var key = pair[0];
																				var val = pair[1];
																				if (!(objectOrPairs instanceof Array) && objectOrPairs instanceof Object) {
																								// User can potentially pass in an object
																								// that has a hierarchy of objects. This
																								// checks to make sure that these objects
																								// get converted to dict objects instead of
																								// leaving them as js objects.

																								if (!isinstance(objectOrPairs, dict)) {
																												val = dict(val);
																								}
																				}
																				instance[key] = val;
																}
												}
								} else {
												if (isinstance(objectOrPairs, dict)) {
																// Passed object is a dict already so we need to be a little careful
																// N.B. - this is a shallow copy per python std - so
																// it is assumed that children have already become
																// python objects at some point.

																var aKeys = objectOrPairs.py_keys();
																for (var index = 0; index < aKeys.length; index++) {
																				var key = aKeys[index];
																				instance[key] = objectOrPairs[key];
																}
												} else if (objectOrPairs instanceof Object) {
																// Passed object is a JavaScript object but not yet a dict, don't copy it
																instance = objectOrPairs;
												} else {
																// We have already covered Array so this indicates
																// that the passed object is not a js object - i.e.
																// it is an int or a string, which is invalid.

																throw ValueError("Invalid type of object for dict creation", new Error());
												}
								}

								// Trancrypt interprets e.g. {aKey: 'aValue'} as a Python dict literal rather than a JavaScript object literal
								// So dict literals rather than bare Object literals will be passed to JavaScript libraries
								// Some JavaScript libraries call all enumerable callable properties of an object that's passed to them
								// So the properties of a dict should be non-enumerable
								__setProperty__(instance, '__class__', { value: dict, enumerable: false, writable: true });
								__setProperty__(instance, 'py_keys', { value: __keys__, enumerable: false });
								__setProperty__(instance, '__iter__', { value: function value() {
																new __PyIterator__(this.py_keys());
												}, enumerable: false });
								__setProperty__(instance, Symbol.iterator, { value: function value() {
																new __JsIterator__(this.py_keys());
												}, enumerable: false });
								__setProperty__(instance, 'py_items', { value: __items__, enumerable: false });
								__setProperty__(instance, 'py_del', { value: __del__, enumerable: false });
								__setProperty__(instance, 'py_clear', { value: __clear__, enumerable: false });
								__setProperty__(instance, 'py_get', { value: __getdefault__, enumerable: false });
								__setProperty__(instance, 'py_setdefault', { value: __setdefault__, enumerable: false });
								__setProperty__(instance, 'py_pop', { value: __pop__, enumerable: false });
								__setProperty__(instance, 'py_popitem', { value: __popitem__, enumerable: false });
								__setProperty__(instance, 'py_update', { value: __update__, enumerable: false });
								__setProperty__(instance, 'py_values', { value: __values__, enumerable: false });
								__setProperty__(instance, '__getitem__', { value: __dgetitem__, enumerable: false }); // Needed since compound keys necessarily
								__setProperty__(instance, '__setitem__', { value: __dsetitem__, enumerable: false }); // trigger overloading to deal with slices
								return instance;
				}

				__all__.dict = dict;
				dict.__name__ = 'dict';

				// Docstring setter

				function __setdoc__(docString) {
								this.__doc__ = docString;
								return this;
				}

				// Python classes, methods and functions are all translated to JavaScript functions
				__setProperty__(Function.prototype, '__setdoc__', { value: __setdoc__, enumerable: false });

				// General operator overloading, only the ones that make most sense in matrix and complex operations

				var __neg__ = function __neg__(a) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__neg__' in a) {
												return a.__neg__();
								} else {
												return -a;
								}
				};
				__all__.__neg__ = __neg__;

				var __matmul__ = function __matmul__(a, b) {
								return a.__matmul__(b);
				};
				__all__.__matmul__ = __matmul__;

				var __pow__ = function __pow__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__pow__' in a) {
												return a.__pow__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rpow__' in b) {
												return b.__rpow__(a);
								} else {
												return Math.pow(a, b);
								}
				};
				__all__.pow = __pow__;

				var __jsmod__ = function __jsmod__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__mod__' in a) {
												return a.__mod__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rpow__' in b) {
												return b.__rmod__(a);
								} else {
												return a % b;
								}
				};
				__all__.__jsmod__ = __jsmod__;

				var __mod__ = function __mod__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__mod__' in a) {
												return a.__mod__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rpow__' in b) {
												return b.__rmod__(a);
								} else {
												return (a % b + b) % b;
								}
				};
				__all__.mod = __mod__;

				// Overloaded binary arithmetic

				var __mul__ = function __mul__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__mul__' in a) {
												return a.__mul__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rmul__' in b) {
												return b.__rmul__(a);
								} else if (typeof a == 'string') {
												return a.__mul__(b);
								} else if (typeof b == 'string') {
												return b.__rmul__(a);
								} else {
												return a * b;
								}
				};
				__all__.__mul__ = __mul__;

				var __truediv__ = function __truediv__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__truediv__' in a) {
												return a.__truediv__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rtruediv__' in b) {
												return b.__rtruediv__(a);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__div__' in a) {
												return a.__div__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rdiv__' in b) {
												return b.__rdiv__(a);
								} else {
												return a / b;
								}
				};
				__all__.__truediv__ = __truediv__;

				var __floordiv__ = function __floordiv__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__floordiv__' in a) {
												return a.__floordiv__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rfloordiv__' in b) {
												return b.__rfloordiv__(a);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__div__' in a) {
												return a.__div__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rdiv__' in b) {
												return b.__rdiv__(a);
								} else {
												return Math.floor(a / b);
								}
				};
				__all__.__floordiv__ = __floordiv__;

				var __add__ = function __add__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__add__' in a) {
												return a.__add__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__radd__' in b) {
												return b.__radd__(a);
								} else {
												return a + b;
								}
				};
				__all__.__add__ = __add__;

				var __sub__ = function __sub__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__sub__' in a) {
												return a.__sub__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rsub__' in b) {
												return b.__rsub__(a);
								} else {
												return a - b;
								}
				};
				__all__.__sub__ = __sub__;

				// Overloaded binary bitwise

				var __lshift__ = function __lshift__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__lshift__' in a) {
												return a.__lshift__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rlshift__' in b) {
												return b.__rlshift__(a);
								} else {
												return a << b;
								}
				};
				__all__.__lshift__ = __lshift__;

				var __rshift__ = function __rshift__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__rshift__' in a) {
												return a.__rshift__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rrshift__' in b) {
												return b.__rrshift__(a);
								} else {
												return a >> b;
								}
				};
				__all__.__rshift__ = __rshift__;

				var __or__ = function __or__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__or__' in a) {
												return a.__or__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__ror__' in b) {
												return b.__ror__(a);
								} else {
												return a | b;
								}
				};
				__all__.__or__ = __or__;

				var __xor__ = function __xor__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__xor__' in a) {
												return a.__xor__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rxor__' in b) {
												return b.__rxor__(a);
								} else {
												return a ^ b;
								}
				};
				__all__.__xor__ = __xor__;

				var __and__ = function __and__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__and__' in a) {
												return a.__and__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rand__' in b) {
												return b.__rand__(a);
								} else {
												return a & b;
								}
				};
				__all__.__and__ = __and__;

				// Overloaded binary compare

				var __eq__ = function __eq__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__eq__' in a) {
												return a.__eq__(b);
								} else {
												return a == b;
								}
				};
				__all__.__eq__ = __eq__;

				var __ne__ = function __ne__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__ne__' in a) {
												return a.__ne__(b);
								} else {
												return a != b;
								}
				};
				__all__.__ne__ = __ne__;

				var __lt__ = function __lt__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__lt__' in a) {
												return a.__lt__(b);
								} else {
												return a < b;
								}
				};
				__all__.__lt__ = __lt__;

				var __le__ = function __le__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__le__' in a) {
												return a.__le__(b);
								} else {
												return a <= b;
								}
				};
				__all__.__le__ = __le__;

				var __gt__ = function __gt__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__gt__' in a) {
												return a.__gt__(b);
								} else {
												return a > b;
								}
				};
				__all__.__gt__ = __gt__;

				var __ge__ = function __ge__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__ge__' in a) {
												return a.__ge__(b);
								} else {
												return a >= b;
								}
				};
				__all__.__ge__ = __ge__;

				// Overloaded augmented general

				var __imatmul__ = function __imatmul__(a, b) {
								if ('__imatmul__' in a) {
												return a.__imatmul__(b);
								} else {
												return a.__matmul__(b);
								}
				};
				__all__.__imatmul__ = __imatmul__;

				var __ipow__ = function __ipow__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__pow__' in a) {
												return a.__ipow__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__ipow__' in a) {
												return a.__pow__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rpow__' in b) {
												return b.__rpow__(a);
								} else {
												return Math.pow(a, b);
								}
				};
				__all__.ipow = __ipow__;

				var __ijsmod__ = function __ijsmod__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__imod__' in a) {
												return a.__ismod__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__mod__' in a) {
												return a.__mod__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rpow__' in b) {
												return b.__rmod__(a);
								} else {
												return a % b;
								}
				};
				__all__.ijsmod__ = __ijsmod__;

				var __imod__ = function __imod__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__imod__' in a) {
												return a.__imod__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__mod__' in a) {
												return a.__mod__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rpow__' in b) {
												return b.__rmod__(a);
								} else {
												return (a % b + b) % b;
								}
				};
				__all__.imod = __imod__;

				// Overloaded augmented arithmetic

				var __imul__ = function __imul__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__imul__' in a) {
												return a.__imul__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__mul__' in a) {
												return a = a.__mul__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rmul__' in b) {
												return a = b.__rmul__(a);
								} else if (typeof a == 'string') {
												return a = a.__mul__(b);
								} else if (typeof b == 'string') {
												return a = b.__rmul__(a);
								} else {
												return a *= b;
								}
				};
				__all__.__imul__ = __imul__;

				var __idiv__ = function __idiv__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__idiv__' in a) {
												return a.__idiv__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__div__' in a) {
												return a = a.__div__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rdiv__' in b) {
												return a = b.__rdiv__(a);
								} else {
												return a /= b;
								}
				};
				__all__.__idiv__ = __idiv__;

				var __iadd__ = function __iadd__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__iadd__' in a) {
												return a.__iadd__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__add__' in a) {
												return a = a.__add__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__radd__' in b) {
												return a = b.__radd__(a);
								} else {
												return a += b;
								}
				};
				__all__.__iadd__ = __iadd__;

				var __isub__ = function __isub__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__isub__' in a) {
												return a.__isub__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__sub__' in a) {
												return a = a.__sub__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rsub__' in b) {
												return a = b.__rsub__(a);
								} else {
												return a -= b;
								}
				};
				__all__.__isub__ = __isub__;

				// Overloaded augmented bitwise

				var __ilshift__ = function __ilshift__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__ilshift__' in a) {
												return a.__ilshift__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__lshift__' in a) {
												return a = a.__lshift__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rlshift__' in b) {
												return a = b.__rlshift__(a);
								} else {
												return a <<= b;
								}
				};
				__all__.__ilshift__ = __ilshift__;

				var __irshift__ = function __irshift__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__irshift__' in a) {
												return a.__irshift__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__rshift__' in a) {
												return a = a.__rshift__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rrshift__' in b) {
												return a = b.__rrshift__(a);
								} else {
												return a >>= b;
								}
				};
				__all__.__irshift__ = __irshift__;

				var __ior__ = function __ior__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__ior__' in a) {
												return a.__ior__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__or__' in a) {
												return a = a.__or__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__ror__' in b) {
												return a = b.__ror__(a);
								} else {
												return a |= b;
								}
				};
				__all__.__ior__ = __ior__;

				var __ixor__ = function __ixor__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__ixor__' in a) {
												return a.__ixor__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__xor__' in a) {
												return a = a.__xor__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rxor__' in b) {
												return a = b.__rxor__(a);
								} else {
												return a ^= b;
								}
				};
				__all__.__ixor__ = __ixor__;

				var __iand__ = function __iand__(a, b) {
								if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__iand__' in a) {
												return a.__iand__(b);
								} else if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) == 'object' && '__and__' in a) {
												return a = a.__and__(b);
								} else if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) == 'object' && '__rand__' in b) {
												return a = b.__rand__(a);
								} else {
												return a &= b;
								}
				};
				__all__.__iand__ = __iand__;

				// Indices and slices

				var __getitem__ = function __getitem__(container, key) {
								// Slice c.q. index, direct generated call to runtime switch
								if ((typeof container === 'undefined' ? 'undefined' : _typeof(container)) == 'object' && '__getitem__' in container) {
												return container.__getitem__(key); // Overloaded on container
								} else {
												return container[key]; // Container must support bare JavaScript brackets
								}
				};
				__all__.__getitem__ = __getitem__;

				var __setitem__ = function __setitem__(container, key, value) {
								// Slice c.q. index, direct generated call to runtime switch
								if ((typeof container === 'undefined' ? 'undefined' : _typeof(container)) == 'object' && '__setitem__' in container) {
												container.__setitem__(key, value); // Overloaded on container
								} else {
												container[key] = value; // Container must support bare JavaScript brackets
								}
				};
				__all__.__setitem__ = __setitem__;

				var __getslice__ = function __getslice__(container, lower, upper, step) {
								// Slice only, no index, direct generated call to runtime switch
								if ((typeof container === 'undefined' ? 'undefined' : _typeof(container)) == 'object' && '__getitem__' in container) {
												return container.__getitem__([lower, upper, step]); // Container supports overloaded slicing c.q. indexing
								} else {
												return container.__getslice__(lower, upper, step); // Container only supports slicing injected natively in prototype
								}
				};
				__all__.__getslice__ = __getslice__;

				var __setslice__ = function __setslice__(container, lower, upper, step, value) {
								// Slice, no index, direct generated call to runtime switch
								if ((typeof container === 'undefined' ? 'undefined' : _typeof(container)) == 'object' && '__setitem__' in container) {
												container.__setitem__([lower, upper, step], value); // Container supports overloaded slicing c.q. indexing
								} else {
												container.__setslice__(lower, upper, step, value); // Container only supports slicing injected natively in prototype
								}
				};
				__all__.__setslice__ = __setslice__;
				__nest__(__all__, 'lawtext.analyze', {
								__all__: {
												__inited__: false,
												__init__: function __init__(__all__) {
																var re = {};
																__nest__(re, '', _init__(__world__.re));
																var re_LawNum = re.compile('(?P<era>明治|大正|昭和|平成)(?P<year>[一二三四五六七八九十]+)年(?P<law_type>\\S+?)第(?P<num>[一二三四五六七八九十百千]+)号');
																var replace_lawnum = function replace_lawnum(text) {
																				var repl = function repl(match) {
																								var s = match.group(0);
																								var t = '<span class="lawtext-analyzed lawtext-analyzed-lawnum" data-lawnum="{}">{}</span>'.format(s, s);
																								return t;
																				};
																				return re_LawNum.sub(repl, text);
																};
																var re_ParStartAny = re.compile('[(（「]');
																var re_ParEndAny = re.compile('[)）」]');
																var re_ParStartSquare = re.compile('[」]');
																var re_ParEndSquare = re.compile('[」]');
																var replace_parenthesis = function replace_parenthesis(mixed) {
																				var square_count = 0;
																				var start_pos = list([]);
																				var pairs = list([]);
																				var ret = list(mixed);
																				var __iterable0__ = enumerate(mixed);
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var __left0__ = __iterable0__[__index0__];
																								var i = __left0__[0];
																								var node = __left0__[1];
																								if (!isinstance(node, str)) {
																												continue;
																								}
																								var text = node;
																								var search_start_pos = 0;
																								while (true) {
																												if (len(text) <= search_start_pos) {
																																break;
																												}
																												if (square_count) {
																																var s_match = re_ParStartSquare.search(text.__getslice__(search_start_pos, null, 1));
																																var e_match = re_ParEndSquare.search(text.__getslice__(search_start_pos, null, 1));
																												} else {
																																var s_match = re_ParStartAny.search(text.__getslice__(search_start_pos, null, 1));
																																var e_match = re_ParEndAny.search(text.__getslice__(search_start_pos, null, 1));
																												}
																												if (!s_match && !e_match) {
																																break;
																												}
																												if (s_match && e_match) {
																																if (s_match.start() < e_match.start()) {
																																				var e_match = null;
																																} else {
																																				var s_match = null;
																																}
																												}
																												if (s_match) {
																																start_pos.append(tuple([i, s_match.start() + search_start_pos, s_match.end() + search_start_pos]));
																																if (re_ParStartSquare.match(s_match.group(0))) {
																																				square_count++;
																																}
																																search_start_pos += s_match.end();
																												} else if (e_match) {
																																if (len(start_pos) > 0) {
																																				var __left0__ = start_pos.py_pop();
																																				var s_i = __left0__[0];
																																				var s_start = __left0__[1];
																																				var s_end = __left0__[2];
																																				pairs.append(tuple([tuple([s_i, s_start, s_end]), tuple([i, e_match.start() + search_start_pos, e_match.end() + search_start_pos])]));
																																}
																																if (square_count) {
																																				square_count--;
																																}
																																search_start_pos += e_match.end();
																												}
																								}
																				}
																				var positions = list([]);
																				var __iterable0__ = pairs;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var __left0__ = __iterable0__[__index0__];
																								var s_i = __left0__[0][0];
																								var s_start = __left0__[0][1];
																								var s_end = __left0__[0][2];
																								var e_i = __left0__[1][0];
																								var e_start = __left0__[1][1];
																								var e_end = __left0__[1][2];
																								positions.append(tuple([s_i, s_start, s_end, 'start']));
																								positions.append(tuple([e_i, e_start, e_end, 'end']));
																				}
																				var positions = sorted(positions, __kwargtrans__({ key: function __lambda__(x) {
																												return x[0] * 1000000000000 + x[1] * 1000000 + x[2];
																								}, reverse: true }));
																				var __iterable0__ = positions;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var __left0__ = __iterable0__[__index0__];
																								var i = __left0__[0];
																								var start = __left0__[1];
																								var end = __left0__[2];
																								var _type = __left0__[3];
																								var text = mixed[i].__getslice__(start, end, 1);
																								var rep = text;
																								if (_type == 'start') {
																												if (__in__(text, tuple(['(', '（']))) {
																																var rep = '<span class="lawtext-analyzed lawtext-analyzed-round-parentheses"><span class="lawtext-analyzed lawtext-analyzed-round-parenthesis-start">{}</span><span class="lawtext-analyzed lawtext-analyzed-round-parentheses-content">'.format(text);
																												} else if (__in__(text, tuple(['「']))) {
																																var rep = '<span class="lawtext-analyzed lawtext-analyzed-square-parentheses"><span class="lawtext-analyzed lawtext-analyzed-square-parenthesis-start">{}</span><span class="lawtext-analyzed lawtext-analyzed-square-parentheses-content">'.format(text);
																												}
																								} else if (_type == 'end') {
																												if (__in__(text, tuple([')', '）']))) {
																																var rep = '</span><span class="lawtext-analyzed lawtext-analyzed-round-parenthesis-end">{}</span></span>'.format(text);
																												} else if (__in__(text, tuple(['」']))) {
																																var rep = '</span><span class="lawtext-analyzed lawtext-analyzed-square-parenthesis-end">{}</span></span>'.format(text);
																												}
																								}
																								ret[i] = ret[i].__getslice__(0, start, 1) + rep + ret[i].__getslice__(end, null, 1);
																				}
																				return ret;
																};
																var analyze_mixed = function analyze_mixed(mixed) {
																				var ret = list([]);
																				var mixed = replace_parenthesis(mixed);
																				var __iterable0__ = mixed;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var node = __iterable0__[__index0__];
																								if (isinstance(node, str)) {
																												ret.append(replace_lawnum(node));
																								} else {
																												ret.append(node);
																								}
																				}
																				return ret;
																};
																var analyze = function analyze(el) {
																				var el_children = el['children'];
																				var mixed = false;
																				var __iterable0__ = el_children;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var se = __iterable0__[__index0__];
																								if (isinstance(se, str)) {
																												var mixed = true;
																												break;
																								}
																				}
																				if (mixed) {
																								var children = analyze_mixed(el_children);
																				} else {
																								var children = function () {
																												var __accu0__ = [];
																												var __iterable0__ = el_children;
																												for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																var subel = __iterable0__[__index0__];
																																__accu0__.append(analyze(subel));
																												}
																												return __accu0__;
																								}();
																				}
																				return dict({ 'tag': el['tag'], 'attr': el['attr'], 'children': children });
																};
																__pragma__('<use>' + 're' + '</use>');
																__pragma__('<all>');
																__all__.analyze = analyze;
																__all__.analyze_mixed = analyze_mixed;
																__all__.re_LawNum = re_LawNum;
																__all__.re_ParEndAny = re_ParEndAny;
																__all__.re_ParEndSquare = re_ParEndSquare;
																__all__.re_ParStartAny = re_ParStartAny;
																__all__.re_ParStartSquare = re_ParStartSquare;
																__all__.replace_lawnum = replace_lawnum;
																__all__.replace_parenthesis = replace_parenthesis;
																__pragma__('</all>');
												}
								}
				});
				__nest__(__all__, 'lawtext.decorate', {
								__all__: {
												__inited__: false,
												__init__: function __init__(__all__) {
																var re = {};
																__nest__(re, '', _init__(__world__.re));
																var re_JpNum = re.compile('^(?P<s1000>(?P<d1000>\\S*)千)?(?P<s100>(?P<d100>\\S*)百)?(?P<s10>(?P<d10>\\S*)十)?(?P<d1>\\S*)?$');
																var jpnum_digits = dict({ '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9 });
																var parse_jpnum = function parse_jpnum(text) {
																				var match = re_JpNum.match(text);
																				if (match) {
																								var d1000 = jpnum_digits.py_get(match.group(2), match.group(1) ? 1 : 0);
																								var d100 = jpnum_digits.py_get(match.group(4), match.group(3) ? 1 : 0);
																								var d10 = jpnum_digits.py_get(match.group(6), match.group(5) ? 1 : 0);
																								var d1 = jpnum_digits.py_get(match.group(7), 0);
																								return str(d1000 * 1000 + d100 * 100 + d10 * 10 + d1);
																				}
																				return null;
																};
																var parse_romannum = function parse_romannum(text) {
																				var num = 0;
																				var __iterable0__ = enumerate(text);
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var __left0__ = __iterable0__[__index0__];
																								var i = __left0__[0];
																								var char = __left0__[1];
																								if (__in__(char, tuple(['i', 'I', 'ｉ', 'Ｉ']))) {
																												if (i + 1 < len(text) && __in__(text[i + 1], tuple(['x', 'X', 'ｘ', 'Ｘ']))) {
																																num--;
																												} else {
																																num++;
																												}
																								}
																								if (__in__(char, tuple(['x', 'X', 'ｘ', 'Ｘ']))) {
																												num += 10;
																								}
																				}
																				return num;
																};
																var eras = dict({ '明治': 'Meiji', '大正': 'Taisho', '昭和': 'Showa', '平成': 'Heisei' });
																var re_LawTypes = list([tuple([re.compile('^法律$'), 'Act']), tuple([re.compile('^政令$'), 'CabinetOrder']), tuple([re.compile('^勅令$'), 'ImperialOrder']), tuple([re.compile('^\\S*[^政勅]令$'), 'MinisterialOrdinance']), tuple([re.compile('^\\S*規則$'), 'Rule'])]);
																var re_LawNum = re.compile('(?P<era>\\S+?)(?P<year>[一二三四五六七八九十]+)年(?P<law_type>\\S+?)第(?P<num>[一二三四五六七八九十百千]+)号');
																var decorate_law = function decorate_law(el) {
																				el['attr']['Lang'] = 'ja';
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (subel['tag'] == 'LawNum' && len(subel['children'])) {
																												var law_num = subel['children'][0];
																												var match = re_LawNum.match(law_num);
																												if (match) {
																																var era = eras.py_get(match.group(1));
																																if (era) {
																																				el['attr']['Era'] = era;
																																}
																																var year = parse_jpnum(match.group(2));
																																if (year) {
																																				el['attr']['Year'] = str(year);
																																}
																																var __iterable1__ = re_LawTypes;
																																for (var __index1__ = 0; __index1__ < __iterable1__.length; __index1__++) {
																																				var __left0__ = __iterable1__[__index1__];
																																				var re_LawType = __left0__[0];
																																				var law_type = __left0__[1];
																																				var law_type_match = re_LawType.match(match.group(3));
																																				if (law_type_match) {
																																								el['attr']['LawType'] = law_type;
																																								break;
																																				}
																																}
																																var num = parse_jpnum(match.group(4));
																																if (num) {
																																				el['attr']['Num'] = num;
																																}
																												}
																								}
																				}
																};
																var WIDE_NUMS = dict({ '０': '0', '１': '1', '２': '2', '３': '3', '４': '4', '５': '5', '６': '6', '７': '7', '８': '8', '９': '9' });
																var replace_wide_num = function replace_wide_num(text) {
																				var ret = text;
																				var __iterable0__ = WIDE_NUMS.py_items();
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var __left0__ = __iterable0__[__index0__];
																								var wide = __left0__[0];
																								var narrow = __left0__[1];
																								var ret = ret.py_replace(wide, narrow);
																				}
																				return ret;
																};
																var re_NamedNum = re.compile('^(?P<circle>○?)第?(?P<num>[一二三四五六七八九十百千]+)\\S*?(?P<branch>の\\S+)?$');
																var IROHA_CHARS = 'イロハニホヘトチリヌルヲワカヨタレソツネナラムウヰノオクヤマケフコエテアサキユメミシヱヒモセスン';
																var re_ItemNum = re.compile('^\\D*(?P<num>\\d+)\\D*$');
																var parse_named_num = function parse_named_num(text) {
																				var nums_group = list([]);
																				var __iterable0__ = text.py_replace('及び', '、').py_replace('から', '、').py_replace('まで', '').py_replace('～', '、').py_replace('・', '、').py_split('、');
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subtext = __iterable0__[__index0__];
																								var match = re_NamedNum.match(subtext);
																								if (match) {
																												var nums = list([parse_jpnum(match.group(2))]);
																												if (match.group(3)) {
																																nums.extend(function () {
																																				var __accu0__ = [];
																																				var __iterable1__ = match.group(3).py_split('の');
																																				for (var __index1__ = 0; __index1__ < __iterable1__.length; __index1__++) {
																																								var b = __iterable1__[__index1__];
																																								if (b) {
																																												__accu0__.append(parse_jpnum(b));
																																								}
																																				}
																																				return __accu0__;
																																}());
																												}
																												nums_group.append('_'.join(map(str, nums)));
																												continue;
																								}
																								var iroha_char_detected = false;
																								var __iterable1__ = enumerate(IROHA_CHARS);
																								for (var __index1__ = 0; __index1__ < __iterable1__.length; __index1__++) {
																												var __left0__ = __iterable1__[__index1__];
																												var i = __left0__[0];
																												var char = __left0__[1];
																												if (__in__(char, subtext)) {
																																nums_group.append(str(i + 1));
																																var iroha_char_detected = true;
																																break;
																												}
																								}
																								if (!iroha_char_detected) {
																												var subtext = replace_wide_num(subtext);
																												var match = re_ItemNum.match(subtext);
																												if (match) {
																																nums_group.append(match.group(1));
																																continue;
																												}
																								}
																								var roman_num = parse_romannum(subtext);
																								if (roman_num) {
																												nums_group.append(str(roman_num));
																								}
																				}
																				return ':'.join(nums_group);
																};
																var decorate_toc_article_group = function decorate_toc_article_group(el) {
																				el['attr']['Delete'] = 'false';
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (__in__(subel['tag'], tuple(['PartTitle', 'ChapterTitle', 'SectionTitle', 'SubsectionTitle', 'DivisionTitle', 'ArticleTitle'])) && len(subel['children'])) {
																												var body = subel['children'][0];
																												var num = parse_named_num(body.py_split()[0]);
																												if (num) {
																																el['attr']['Num'] = num;
																												}
																								}
																				}
																};
																var decorate_article_group = function decorate_article_group(el) {
																				el['attr']['Delete'] = 'false';
																				el['attr']['Hide'] = 'false';
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (__in__(subel['tag'], tuple(['PartTitle', 'ChapterTitle', 'SectionTitle', 'SubsectionTitle', 'DivisionTitle', 'ArticleTitle'])) && len(subel['children'])) {
																												var body = subel['children'][0];
																												var num = parse_named_num(body.py_split()[0]);
																												if (num) {
																																el['attr']['Num'] = num;
																												}
																								}
																				}
																};
																var decorate_article = function decorate_article(el) {
																				el['attr']['Delete'] = 'false';
																				el['attr']['Hide'] = 'false';
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (subel['tag'] == 'ArticleTitle' && len(subel['children'])) {
																												var body = subel['children'][0];
																												var num = parse_named_num(body.py_split()[0]);
																												if (num) {
																																el['attr']['Num'] = num;
																												}
																								}
																				}
																};
																var decorate_paragraph = function decorate_paragraph(el) {
																				el['attr']['Hide'] = 'false';
																				el['attr']['OldStyle'] = 'false';
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (subel['tag'] == 'ParagraphNum') {
																												if (len(subel['children'])) {
																																var paragraph_num = subel['children'][0];
																																var num = parse_named_num(paragraph_num);
																												} else {
																																var num = '1';
																												}
																												if (num) {
																																el['attr']['Num'] = num;
																												}
																								}
																				}
																};
																var decorate_item = function decorate_item(el) {
																				el['attr']['Delete'] = 'false';
																				el['attr']['Hide'] = 'false';
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (__in__(subel['tag'], tuple(['ItemTitle', 'Subitem1Title', 'Subitem2Title', 'Subitem3Title', 'Subitem4Title', 'Subitem5Title', 'Subitem6Title', 'Subitem7Title', 'Subitem8Title', 'Subitem9Title', 'Subitem10Title']))) {
																												var body = subel['children'][0];
																												var num = parse_named_num(body.py_split()[0]);
																												if (num) {
																																el['attr']['Num'] = num;
																												}
																								}
																				}
																};
																var decorate_column_sentence_group = function decorate_column_sentence_group(el) {
																				var column_sentences = list([]);
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (__in__(subel['tag'], tuple(['Column', 'Sentence']))) {
																												column_sentences.append(subel);
																								}
																				}
																				var proviso_nums = list([]);
																				var __iterable0__ = enumerate(column_sentences);
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var __left0__ = __iterable0__[__index0__];
																								var i = __left0__[0];
																								var subel = __left0__[1];
																								if (len(column_sentences) > 1) {
																												subel['attr']['Num'] = str(i + 1);
																								}
																								if (subel['tag'] == 'Column') {
																												subel['attr']['LineBreak'] = 'false';
																								}
																								if (subel['tag'] == 'Sentence' && len(subel['children']) && (subel['children'][0].startswith('ただし、') || subel['children'][0].startswith('但し、'))) {
																												proviso_nums.append(i);
																								}
																				}
																				if (len(proviso_nums)) {
																								var __iterable0__ = enumerate(column_sentences);
																								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																												var __left0__ = __iterable0__[__index0__];
																												var i = __left0__[0];
																												var subel = __left0__[1];
																												subel['attr']['Function'] = __in__(i, proviso_nums) ? 'proviso' : 'main';
																								}
																				}
																};
																var decorate_sentence = function decorate_sentence(el) {
																				el['attr']['WritingMode'] = 'vertical';
																};
																var decorate_table = function decorate_table(el) {
																				el['attr']['WritingMode'] = 'vertical';
																};
																var decorate_table_column = function decorate_table_column(el) {
																				el['attr']['BorderTop'] = 'solid';
																				el['attr']['BorderRight'] = 'solid';
																				el['attr']['BorderBottom'] = 'solid';
																				el['attr']['BorderLeft'] = 'solid';
																};
																var appdx_table_title = function appdx_table_title(el) {
																				el['attr']['WritingMode'] = 'vertical';
																};
																var decorate = function decorate(el) {
																				if (el['tag'] == 'Law') {
																								decorate_law(el);
																				} else if (__in__(el['tag'], tuple(['TOCPart', 'TOCChapter', 'TOCSection', 'TOCSubsection', 'TOCDivision', 'TOCArticle']))) {
																								decorate_toc_article_group(el);
																				} else if (__in__(el['tag'], tuple(['Part', 'Chapter', 'Section', 'Subsection', 'Division']))) {
																								decorate_article_group(el);
																				} else if (el['tag'] == 'Article') {
																								decorate_article(el);
																				} else if (el['tag'] == 'Paragraph') {
																								decorate_paragraph(el);
																				} else if (el['tag'] == 'Sentence') {
																								decorate_sentence(el);
																				} else if (__in__(el['tag'], tuple(['Item', 'Subitem1', 'Subitem2', 'Subitem3', 'Subitem4', 'Subitem5', 'Subitem6', 'Subitem7', 'Subitem8', 'Subitem9', 'Subitem10']))) {
																								decorate_item(el);
																				} else if (__in__(el['tag'], tuple(['ParagraphSentence', 'ItemSentence', 'Subitem1Sentence', 'Subitem2Sentence', 'Subitem3Sentence', 'Subitem4Sentence', 'Subitem5Sentence', 'Subitem6Sentence', 'Subitem7Sentence', 'Subitem8Sentence', 'Subitem9Sentence', 'Subitem10Sentence', 'Column']))) {
																								decorate_column_sentence_group(el);
																				} else if (el['tag'] == 'Table') {
																								decorate_table(el);
																				} else if (el['tag'] == 'TableColumn') {
																								decorate_table_column(el);
																				} else if (el['tag'] == 'AppdxTableTitle') {
																								appdx_table_title(el);
																				}
																				var __iterable0__ = el['children'];
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var subel = __iterable0__[__index0__];
																								if (isinstance(subel, str)) {
																												continue;
																								}
																								decorate(subel);
																				}
																};
																__pragma__('<use>' + 're' + '</use>');
																__pragma__('<all>');
																__all__.IROHA_CHARS = IROHA_CHARS;
																__all__.WIDE_NUMS = WIDE_NUMS;
																__all__.appdx_table_title = appdx_table_title;
																__all__.decorate = decorate;
																__all__.decorate_article = decorate_article;
																__all__.decorate_article_group = decorate_article_group;
																__all__.decorate_column_sentence_group = decorate_column_sentence_group;
																__all__.decorate_item = decorate_item;
																__all__.decorate_law = decorate_law;
																__all__.decorate_paragraph = decorate_paragraph;
																__all__.decorate_sentence = decorate_sentence;
																__all__.decorate_table = decorate_table;
																__all__.decorate_table_column = decorate_table_column;
																__all__.decorate_toc_article_group = decorate_toc_article_group;
																__all__.eras = eras;
																__all__.jpnum_digits = jpnum_digits;
																__all__.parse_jpnum = parse_jpnum;
																__all__.parse_named_num = parse_named_num;
																__all__.parse_romannum = parse_romannum;
																__all__.re_ItemNum = re_ItemNum;
																__all__.re_JpNum = re_JpNum;
																__all__.re_LawNum = re_LawNum;
																__all__.re_LawTypes = re_LawTypes;
																__all__.re_NamedNum = re_NamedNum;
																__all__.replace_wide_num = replace_wide_num;
																__pragma__('</all>');
												}
								}
				});
				__nest__(__all__, 're', {
								__all__: {
												__inited__: false,
												__init__: function __init__(__all__) {
																var translate = _init__(__world__.re.translate).translate;
																var T = 1 << 0;
																var TEMPLATE = T;
																var I = 1 << 1;
																var IGNORECASE = I;
																var L = 1 << 2;
																var LOCALE = L;
																var M = 1 << 3;
																var MULTILINE = M;
																var S = 1 << 4;
																var DOTALL = S;
																var U = 1 << 5;
																var UNICODE = U;
																var X = 1 << 6;
																var VERBOSE = X;
																var DEBUG = 1 << 7;
																var A = 1 << 8;
																var ASCII = A;
																var Y = 1 << 16;
																var STICKY = Y;
																var G = 1 << 17;
																var GLOBAL = G;
																var J = 1 << 19;
																var JSSTRICT = J;
																var error = __class__('error', [Exception], {
																				get __init__() {
																								return __get__(this, function (self, msg, error, pattern, flags, pos) {
																												if (typeof pattern == 'undefined' || pattern != null && pattern.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pattern = null;
																												};
																												if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																																;
																																var flags = 0;
																												};
																												if (typeof pos == 'undefined' || pos != null && pos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pos = null;
																												};
																												Exception.__init__(self, msg, __kwargtrans__({ error: error }));
																												self.pattern = pattern;
																												self.flags = flags;
																												self.pos = pos;
																								}, '__init__');
																				}
																});
																var ReIndexError = __class__('ReIndexError', [IndexError], {
																				get __init__() {
																								return __get__(this, function (self) {
																												IndexError.__init__(self, 'no such group');
																								}, '__init__');
																				}
																});
																var Match = __class__('Match', [object], {
																				get __init__() {
																								return __get__(this, function (self, mObj, string, pos, endpos, rObj, namedGroups) {
																												if (typeof namedGroups == 'undefined' || namedGroups != null && namedGroups.hasOwnProperty("__kwargtrans__")) {
																																;
																																var namedGroups = null;
																												};
																												var __iterable0__ = enumerate(mObj);
																												for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																var __left0__ = __iterable0__[__index0__];
																																var index = __left0__[0];
																																var match = __left0__[1];
																																mObj[index] = mObj[index] == undefined ? null : mObj[index];
																												}
																												self._obj = mObj;
																												self._pos = pos;
																												self._endpos = endpos;
																												self._re = rObj;
																												self._string = string;
																												self._namedGroups = namedGroups;
																												self._lastindex = self._lastMatchGroup();
																												if (self._namedGroups !== null) {
																																self._lastgroup = self._namedGroups[self._lastindex];
																												} else {
																																self._lastgroup = null;
																												}
																								}, '__init__');
																				},
																				get _getPos() {
																								return __get__(this, function (self) {
																												return self._pos;
																								}, '_getPos');
																				},
																				get _setPos() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setPos');
																				},
																				get _getEndPos() {
																								return __get__(this, function (self) {
																												return self._endpos;
																								}, '_getEndPos');
																				},
																				get _setEndPos() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setEndPos');
																				},
																				get _getRe() {
																								return __get__(this, function (self) {
																												return self._re;
																								}, '_getRe');
																				},
																				get _setRe() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setRe');
																				},
																				get _getString() {
																								return __get__(this, function (self) {
																												return self._string;
																								}, '_getString');
																				},
																				get _setString() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setString');
																				},
																				get _getLastGroup() {
																								return __get__(this, function (self) {
																												return self._lastgroup;
																								}, '_getLastGroup');
																				},
																				get _setLastGroup() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setLastGroup');
																				},
																				get _getLastIndex() {
																								return __get__(this, function (self) {
																												return self._lastindex;
																								}, '_getLastIndex');
																				},
																				get _setLastIndex() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setLastIndex');
																				},
																				get _lastMatchGroup() {
																								return __get__(this, function (self) {
																												if (len(self._obj) > 1) {
																																for (var i = len(self._obj) - 1; i > 0; i--) {
																																				if (self._obj[i] !== null) {
																																								return i;
																																				}
																																}
																																return null;
																												} else {
																																return null;
																												}
																								}, '_lastMatchGroup');
																				},
																				get expand() {
																								return __get__(this, function (self, template) {
																												var __except0__ = NotImplementedError();
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, 'expand');
																				},
																				get group() {
																								return __get__(this, function (self) {
																												var args = tuple([].slice.apply(arguments).slice(1));
																												var ret = list([]);
																												if (len(args) > 0) {
																																var __iterable0__ = args;
																																for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																				var index = __iterable0__[__index0__];
																																				if (py_typeof(index) === str) {
																																								if (self._namedGroups !== null) {
																																												if (!__in__(index, self._namedGroups.py_keys())) {
																																																var __except0__ = ReIndexError();
																																																__except0__.__cause__ = null;
																																																throw __except0__;
																																												}
																																												ret.append(self._obj[self._namedGroups[index]]);
																																								} else {
																																												var __except0__ = NotImplementedError('No NamedGroups Available');
																																												__except0__.__cause__ = null;
																																												throw __except0__;
																																								}
																																				} else {
																																								if (index >= len(self._obj)) {
																																												var __except0__ = ReIndexError();
																																												__except0__.__cause__ = null;
																																												throw __except0__;
																																								}
																																								ret.append(self._obj[index]);
																																				}
																																}
																												} else {
																																ret.append(self._obj[0]);
																												}
																												if (len(ret) == 1) {
																																return ret[0];
																												} else {
																																return tuple(ret);
																												}
																								}, 'group');
																				},
																				get groups() {
																								return __get__(this, function (self, py_default) {
																												if (typeof py_default == 'undefined' || py_default != null && py_default.hasOwnProperty("__kwargtrans__")) {
																																;
																																var py_default = null;
																												};
																												if (len(self._obj) > 1) {
																																var ret = self._obj.__getslice__(1, null, 1);
																																return tuple(function () {
																																				var __accu0__ = [];
																																				var __iterable0__ = ret;
																																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																								var x = __iterable0__[__index0__];
																																								__accu0__.append(x !== null ? x : py_default);
																																				}
																																				return __accu0__;
																																}());
																												} else {
																																return tuple();
																												}
																								}, 'groups');
																				},
																				get groupdict() {
																								return __get__(this, function (self, py_default) {
																												if (typeof py_default == 'undefined' || py_default != null && py_default.hasOwnProperty("__kwargtrans__")) {
																																;
																																var py_default = null;
																												};
																												if (self._namedGroups !== null) {
																																var ret = dict({});
																																var __iterable0__ = self._namedGroups.py_items();
																																for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																				var __left0__ = __iterable0__[__index0__];
																																				var gName = __left0__[0];
																																				var gId = __left0__[1];
																																				var value = self._obj[gId];
																																				ret[gName] = value !== null ? value : py_default;
																																}
																																return ret;
																												} else {
																																var __except0__ = NotImplementedError('No NamedGroups Available');
																																__except0__.__cause__ = null;
																																throw __except0__;
																												}
																								}, 'groupdict');
																				},
																				get start() {
																								return __get__(this, function (self, group) {
																												if (typeof group == 'undefined' || group != null && group.hasOwnProperty("__kwargtrans__")) {
																																;
																																var group = 0;
																												};
																												var gId = 0;
																												if (py_typeof(group) === str) {
																																if (self._namedGroups !== null) {
																																				if (!__in__(group, self._namedGroups.py_keys())) {
																																								var __except0__ = ReIndexError();
																																								__except0__.__cause__ = null;
																																								throw __except0__;
																																				}
																																				var gId = self._namedGroups[group];
																																} else {
																																				var __except0__ = NotImplementedError('No NamedGroups Available');
																																				__except0__.__cause__ = null;
																																				throw __except0__;
																																}
																												} else {
																																var gId = group;
																												}
																												if (gId >= len(self._obj)) {
																																var __except0__ = ReIndexError();
																																__except0__.__cause__ = null;
																																throw __except0__;
																												}
																												if (gId == 0) {
																																return self._obj.index;
																												} else if (self._obj[gId] !== null) {
																																var r = compile(escape(self._obj[gId]), self._re.flags);
																																var m = r.search(self._obj[0]);
																																if (m) {
																																				return self._obj.index + m.start();
																																} else {
																																				var __except0__ = Exception('Failed to find capture group');
																																				__except0__.__cause__ = null;
																																				throw __except0__;
																																}
																												} else {
																																return -1;
																												}
																								}, 'start');
																				},
																				get end() {
																								return __get__(this, function (self, group) {
																												if (typeof group == 'undefined' || group != null && group.hasOwnProperty("__kwargtrans__")) {
																																;
																																var group = 0;
																												};
																												var gId = 0;
																												if (py_typeof(group) === str) {
																																if (self._namedGroups !== null) {
																																				if (!__in__(group, self._namedGroups.py_keys())) {
																																								var __except0__ = ReIndexError();
																																								__except0__.__cause__ = null;
																																								throw __except0__;
																																				}
																																				var gId = self._namedGroups[group];
																																} else {
																																				var __except0__ = NotImplementedError('No NamedGroups Available');
																																				__except0__.__cause__ = null;
																																				throw __except0__;
																																}
																												} else {
																																var gId = group;
																												}
																												if (gId >= len(self._obj)) {
																																var __except0__ = ReIndexError();
																																__except0__.__cause__ = null;
																																throw __except0__;
																												}
																												if (gId == 0) {
																																return self._obj.index + len(self._obj[0]);
																												} else if (self._obj[gId] !== null) {
																																var r = compile(escape(self._obj[gId]), self._re.flags);
																																var m = r.search(self._obj[0]);
																																if (m) {
																																				return self._obj.index + m.end();
																																} else {
																																				var __except0__ = Exception('Failed to find capture group');
																																				__except0__.__cause__ = null;
																																				throw __except0__;
																																}
																												} else {
																																return -1;
																												}
																								}, 'end');
																				},
																				get span() {
																								return __get__(this, function (self, group) {
																												if (typeof group == 'undefined' || group != null && group.hasOwnProperty("__kwargtrans__")) {
																																;
																																var group = 0;
																												};
																												return tuple([self.start(group), self.end(group)]);
																								}, 'span');
																				}
																});
																Object.defineProperty(Match, 'pos', property.call(Match, Match._getPos, Match._setPos));;
																Object.defineProperty(Match, 'endpos', property.call(Match, Match._getEndPos, Match._setEndPos));;
																Object.defineProperty(Match, 're', property.call(Match, Match._getRe, Match._setRe));;
																Object.defineProperty(Match, 'string', property.call(Match, Match._getString, Match._setString));;
																Object.defineProperty(Match, 'lastgroup', property.call(Match, Match._getLastGroup, Match._setLastGroup));;
																Object.defineProperty(Match, 'lastindex', property.call(Match, Match._getLastIndex, Match._setLastIndex));;
																var Regex = __class__('Regex', [object], {
																				get __init__() {
																								return __get__(this, function (self, pattern, flags) {
																												if (!((flags & ASCII) > 0)) {
																																flags |= UNICODE;
																												}
																												self._flags = flags;
																												var __left0__ = self._compileWrapper(pattern, flags);
																												self._jsFlags = __left0__[0];
																												self._obj = __left0__[1];
																												self._jspattern = pattern;
																												self._pypattern = pattern;
																												var __left0__ = self._compileWrapper(pattern + '|', flags);
																												var _ = __left0__[0];
																												var groupCounterRegex = __left0__[1];
																												self._groups = groupCounterRegex.exec('').length - 1;
																												self._groupindex = null;
																								}, '__init__');
																				},
																				get _getPattern() {
																								return __get__(this, function (self) {
																												var ret = self._pypattern.py_replace('\\', '\\\\');
																												return ret;
																								}, '_getPattern');
																				},
																				get _setPattern() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setPattern');
																				},
																				get _getFlags() {
																								return __get__(this, function (self) {
																												return self._flags;
																								}, '_getFlags');
																				},
																				get _setFlags() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setFlags');
																				},
																				get _getGroups() {
																								return __get__(this, function (self) {
																												return self._groups;
																								}, '_getGroups');
																				},
																				get _setGroups() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setGroups');
																				},
																				get _getGroupIndex() {
																								return __get__(this, function (self) {
																												if (self._groupindex === null) {
																																return dict({});
																												} else {
																																return self._groupindex;
																												}
																								}, '_getGroupIndex');
																				},
																				get _setGroupIndex() {
																								return __get__(this, function (self, val) {
																												var __except0__ = AttributeError('readonly attribute');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, '_setGroupIndex');
																				},
																				get _compileWrapper() {
																								return __get__(this, function (self, pattern, flags) {
																												if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																																;
																																var flags = 0;
																												};
																												var jsFlags = self._convertFlags(flags);
																												var rObj = null;
																												var errObj = null;

																												try {
																																rObj = new RegExp(pattern, jsFlags.replace("u", ""));
																												} catch (err) {
																																errObj = err;
																												}

																												if (errObj !== null) {
																																var __except0__ = error(errObj.message, errObj, pattern, flags);
																																__except0__.__cause__ = null;
																																throw __except0__;
																												}
																												return tuple([jsFlags, rObj]);
																								}, '_compileWrapper');
																				},
																				get _convertFlags() {
																								return __get__(this, function (self, flags) {
																												var bitmaps = list([tuple([DEBUG, '']), tuple([IGNORECASE, 'i']), tuple([MULTILINE, 'm']), tuple([STICKY, 'y']), tuple([GLOBAL, 'g']), tuple([UNICODE, 'u'])]);
																												var ret = ''.join(function () {
																																var __accu0__ = [];
																																var __iterable0__ = bitmaps;
																																for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																				var x = __iterable0__[__index0__];
																																				if ((x[0] & flags) > 0) {
																																								__accu0__.append(x[1]);
																																				}
																																}
																																return __accu0__;
																												}());
																												return ret;
																								}, '_convertFlags');
																				},
																				get _getTargetStr() {
																								return __get__(this, function (self, string, pos, endpos) {
																												var endPtr = len(string);
																												if (endpos !== null) {
																																if (endpos < endPtr) {
																																				var endPtr = endpos;
																																}
																												}
																												if (endPtr < 0) {
																																var endPtr = 0;
																												}
																												var ret = string.__getslice__(pos, endPtr, 1);
																												return ret;
																								}, '_getTargetStr');
																				},
																				get _patternHasCaptures() {
																								return __get__(this, function (self) {
																												return self._groups > 0;
																								}, '_patternHasCaptures');
																				},
																				get search() {
																								return __get__(this, function (self, string, pos, endpos) {
																												if (typeof pos == 'undefined' || pos != null && pos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pos = 0;
																												};
																												if (typeof endpos == 'undefined' || endpos != null && endpos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var endpos = null;
																												};
																												if (endpos === null) {
																																var endpos = len(string);
																												}
																												var rObj = self._obj;
																												var m = rObj.exec(string);
																												if (m) {
																																if (m.index < pos || m.index > endpos) {
																																				return null;
																																} else {
																																				return Match(m, string, pos, endpos, self, self._groupindex);
																																}
																												} else {
																																return null;
																												}
																								}, 'search');
																				},
																				get match() {
																								return __get__(this, function (self, string, pos, endpos) {
																												if (typeof pos == 'undefined' || pos != null && pos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pos = 0;
																												};
																												if (typeof endpos == 'undefined' || endpos != null && endpos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var endpos = null;
																												};
																												var target = string;
																												if (endpos !== null) {
																																var target = target.__getslice__(0, endpos, 1);
																												} else {
																																var endpos = len(string);
																												}
																												var rObj = self._obj;
																												var m = rObj.exec(target);
																												if (m) {
																																if (m.index == pos) {
																																				return Match(m, string, pos, endpos, self, self._groupindex);
																																} else {
																																				return null;
																																}
																												} else {
																																return null;
																												}
																								}, 'match');
																				},
																				get fullmatch() {
																								return __get__(this, function (self, string, pos, endpos) {
																												if (typeof pos == 'undefined' || pos != null && pos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pos = 0;
																												};
																												if (typeof endpos == 'undefined' || endpos != null && endpos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var endpos = null;
																												};
																												var target = string;
																												var strEndPos = len(string);
																												if (endpos !== null) {
																																var target = target.__getslice__(0, endpos, 1);
																																var strEndPos = endpos;
																												}
																												var rObj = self._obj;
																												var m = rObj.exec(target);
																												if (m) {
																																var obsEndPos = m.index + len(m[0]);
																																if (m.index == pos && obsEndPos == strEndPos) {
																																				return Match(m, string, pos, strEndPos, self, self._groupindex);
																																} else {
																																				return null;
																																}
																												} else {
																																return null;
																												}
																								}, 'fullmatch');
																				},
																				get py_split() {
																								return __get__(this, function (self, string, maxsplit) {
																												if (typeof maxsplit == 'undefined' || maxsplit != null && maxsplit.hasOwnProperty("__kwargtrans__")) {
																																;
																																var maxsplit = 0;
																												};
																												if (maxsplit < 0) {
																																return list([string]);
																												}
																												var mObj = null;
																												var rObj = self._obj;
																												if (maxsplit == 0) {
																																var mObj = string.py_split(rObj);
																																return mObj;
																												} else {
																																var flags = self._flags;
																																flags |= GLOBAL;
																																var __left0__ = self._compileWrapper(self._jspattern, flags);
																																var _ = __left0__[0];
																																var rObj = __left0__[1];
																																var ret = list([]);
																																var lastM = null;
																																var cnt = 0;
																																for (var i = 0; i < maxsplit; i++) {
																																				var m = rObj.exec(string);
																																				if (m) {
																																								cnt++;
																																								if (lastM !== null) {
																																												var start = lastM.index + len(lastM[0]);
																																												var head = string.__getslice__(start, m.index, 1);
																																												ret.append(head);
																																												if (len(m) > 1) {
																																																ret.extend(m.__getslice__(1, null, 1));
																																												}
																																								} else {
																																												var head = string.__getslice__(0, m.index, 1);
																																												ret.append(head);
																																												if (len(m) > 1) {
																																																ret.extend(m.__getslice__(1, null, 1));
																																												}
																																								}
																																								var lastM = m;
																																				} else {
																																								break;
																																				}
																																}
																																if (lastM !== null) {
																																				var endPos = lastM.index + len(lastM[0]);
																																				var end = string.__getslice__(endPos, null, 1);
																																				ret.append(end);
																																}
																																return ret;
																												}
																								}, 'split');
																				},
																				get _findAllMatches() {
																								return __get__(this, function (self, string, pos, endpos) {
																												if (typeof pos == 'undefined' || pos != null && pos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pos = 0;
																												};
																												if (typeof endpos == 'undefined' || endpos != null && endpos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var endpos = null;
																												};
																												var target = self._getTargetStr(string, pos, endpos);
																												var flags = self._flags;
																												flags |= GLOBAL;
																												var __left0__ = self._compileWrapper(self._jspattern, flags);
																												var _ = __left0__[0];
																												var rObj = __left0__[1];
																												var ret = list([]);
																												while (true) {
																																var m = rObj.exec(target);
																																if (m) {
																																				ret.append(m);
																																} else {
																																				break;
																																}
																												}
																												return ret;
																								}, '_findAllMatches');
																				},
																				get findall() {
																								return __get__(this, function (self, string, pos, endpos) {
																												if (typeof pos == 'undefined' || pos != null && pos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pos = 0;
																												};
																												if (typeof endpos == 'undefined' || endpos != null && endpos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var endpos = null;
																												};
																												var mlist = self._findAllMatches(string, pos, endpos);
																												var mSelect = function mSelect(m) {
																																if (len(m) > 2) {
																																				return tuple(m.__getslice__(1, null, 1));
																																} else if (len(m) == 2) {
																																				return m[1];
																																} else {
																																				return m[0];
																																}
																												};
																												var ret = map(mSelect, mlist);
																												return ret;
																								}, 'findall');
																				},
																				get finditer() {
																								return __get__(this, function (self, string, pos, endpos) {
																												if (typeof endpos == 'undefined' || endpos != null && endpos.hasOwnProperty("__kwargtrans__")) {
																																;
																																var endpos = null;
																												};
																												var __except0__ = NotImplementedError('No Iterator Support in es5');
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}, 'finditer');
																				},
																				get sub() {
																								return __get__(this, function (self, repl, string, count) {
																												if (typeof count == 'undefined' || count != null && count.hasOwnProperty("__kwargtrans__")) {
																																;
																																var count = 0;
																												};
																												var __left0__ = self.subn(repl, string, count);
																												var ret = __left0__[0];
																												var _ = __left0__[1];
																												return ret;
																								}, 'sub');
																				},
																				get subn() {
																								return __get__(this, function (self, repl, string, count) {
																												if (typeof count == 'undefined' || count != null && count.hasOwnProperty("__kwargtrans__")) {
																																;
																																var count = 0;
																												};
																												var flags = self._flags;
																												flags |= GLOBAL;
																												var __left0__ = self._compileWrapper(self._jspattern, flags);
																												var _ = __left0__[0];
																												var rObj = __left0__[1];
																												var ret = '';
																												var totalMatch = 0;
																												var lastEnd = -1;
																												while (true) {
																																if (count > 0) {
																																				if (totalMatch >= count) {
																																								if (lastEnd < 0) {
																																												return tuple([ret, totalMatch]);
																																								} else {
																																												ret += string.__getslice__(lastEnd, m.index, 1);
																																												return tuple([ret, totalMatch]);
																																								}
																																				}
																																}
																																var m = rObj.exec(string);
																																if (m) {
																																				if (lastEnd < 0) {
																																								ret += string.__getslice__(0, m.index, 1);
																																				} else {
																																								ret += string.__getslice__(lastEnd, m.index, 1);
																																				}
																																				if (callable(repl)) {
																																								var content = repl(Match(m, string, 0, len(string), self, self._groupindex));
																																								ret += content;
																																				} else {
																																								ret += repl;
																																				}
																																				totalMatch++;
																																				var lastEnd = m.index + len(m[0]);
																																} else if (lastEnd < 0) {
																																				return tuple([string, 0]);
																																} else {
																																				ret += string.__getslice__(lastEnd, null, 1);
																																				return tuple([ret, totalMatch]);
																																}
																												}
																								}, 'subn');
																				}
																});
																Object.defineProperty(Regex, 'pattern', property.call(Regex, Regex._getPattern, Regex._setPattern));;
																Object.defineProperty(Regex, 'flags', property.call(Regex, Regex._getFlags, Regex._setFlags));;
																Object.defineProperty(Regex, 'groups', property.call(Regex, Regex._getGroups, Regex._setGroups));;
																Object.defineProperty(Regex, 'groupindex', property.call(Regex, Regex._getGroupIndex, Regex._setGroupIndex));;
																var PyRegExp = __class__('PyRegExp', [Regex], {
																				get __init__() {
																								return __get__(this, function (self, pyPattern, flags) {
																												var __left0__ = translate(pyPattern);
																												var jsTokens = __left0__[0];
																												var inlineFlags = __left0__[1];
																												var namedGroups = __left0__[2];
																												var nCapGroups = __left0__[3];
																												var n_splits = __left0__[4];
																												flags |= inlineFlags;
																												var jsPattern = ''.join(jsTokens);
																												Regex.__init__(self, jsPattern, flags);
																												self._pypattern = pyPattern;
																												self._nsplits = n_splits;
																												self._jsTokens = jsTokens;
																												self._capgroups = nCapGroups;
																												self._groupindex = namedGroups;
																								}, '__init__');
																				}
																});
																var compile = function compile(pattern, flags) {
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				if (flags & JSSTRICT) {
																								var p = Regex(pattern, flags);
																				} else {
																								var p = PyRegExp(pattern, flags);
																				}
																				return p;
																};
																var search = function search(pattern, string, flags) {
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.search(string);
																};
																var match = function match(pattern, string, flags) {
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.match(string);
																};
																var fullmatch = function fullmatch(pattern, string, flags) {
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.fullmatch(string);
																};
																var py_split = function py_split(pattern, string, maxsplit, flags) {
																				if (typeof maxsplit == 'undefined' || maxsplit != null && maxsplit.hasOwnProperty("__kwargtrans__")) {
																								;
																								var maxsplit = 0;
																				};
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.py_split(string, maxsplit);
																};
																var findall = function findall(pattern, string, flags) {
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.findall(string);
																};
																var finditer = function finditer(pattern, string, flags) {
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.finditer(string);
																};
																var sub = function sub(pattern, repl, string, count, flags) {
																				if (typeof count == 'undefined' || count != null && count.hasOwnProperty("__kwargtrans__")) {
																								;
																								var count = 0;
																				};
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.sub(repl, string, count);
																};
																var subn = function subn(pattern, repl, string, count, flags) {
																				if (typeof count == 'undefined' || count != null && count.hasOwnProperty("__kwargtrans__")) {
																								;
																								var count = 0;
																				};
																				if (typeof flags == 'undefined' || flags != null && flags.hasOwnProperty("__kwargtrans__")) {
																								;
																								var flags = 0;
																				};
																				var p = compile(pattern, flags);
																				return p.subn(repl, string, count);
																};
																var escape = function escape(string) {
																				var ret = null;
																				var replfunc = function replfunc(m) {
																								if (m[0] == '\\') {
																												return '\\\\\\\\';
																								} else {
																												return '\\\\' + m[0];
																								}
																				};

																				var r = /[^A-Za-z\d]/g;
																				ret = string.replace(r, replfunc);

																				if (ret !== null) {
																								return ret;
																				} else {
																								var __except0__ = Exception('Failed to escape the passed string');
																								__except0__.__cause__ = null;
																								throw __except0__;
																				}
																};
																var purge = function purge() {
																				// pass;
																};
																__pragma__('<use>' + 're.translate' + '</use>');
																__pragma__('<all>');
																__all__.A = A;
																__all__.ASCII = ASCII;
																__all__.DEBUG = DEBUG;
																__all__.DOTALL = DOTALL;
																__all__.G = G;
																__all__.GLOBAL = GLOBAL;
																__all__.I = I;
																__all__.IGNORECASE = IGNORECASE;
																__all__.J = J;
																__all__.JSSTRICT = JSSTRICT;
																__all__.L = L;
																__all__.LOCALE = LOCALE;
																__all__.M = M;
																__all__.MULTILINE = MULTILINE;
																__all__.Match = Match;
																__all__.PyRegExp = PyRegExp;
																__all__.ReIndexError = ReIndexError;
																__all__.Regex = Regex;
																__all__.S = S;
																__all__.STICKY = STICKY;
																__all__.T = T;
																__all__.TEMPLATE = TEMPLATE;
																__all__.U = U;
																__all__.UNICODE = UNICODE;
																__all__.VERBOSE = VERBOSE;
																__all__.X = X;
																__all__.Y = Y;
																__all__.compile = compile;
																__all__.error = error;
																__all__.escape = escape;
																__all__.findall = findall;
																__all__.finditer = finditer;
																__all__.fullmatch = fullmatch;
																__all__.match = match;
																__all__.purge = purge;
																__all__.search = search;
																__all__.py_split = py_split;
																__all__.sub = sub;
																__all__.subn = subn;
																__all__.translate = translate;
																__pragma__('</all>');
												}
								}
				});
				__nest__(__all__, 're.translate', {
								__all__: {
												__inited__: false,
												__init__: function __init__(__all__) {
																var re = {};
																var VERBOSE = false;
																var MAX_SHIFTREDUCE_LOOPS = 1000;
																var stringFlags = 'aiLmsux';
																var Group = __class__('Group', [object], {
																				get __init__() {
																								return __get__(this, function (self, start, end, klass) {
																												self.start = start;
																												self.end = end;
																												self.klass = klass;
																								}, '__init__');
																				},
																				get __repr__() {
																								return __get__(this, function (self) {
																												return str(tuple([self.start, self.end, self.klass]));
																								}, '__repr__');
																				}
																});
																var generateGroupSpans = function generateGroupSpans(tokens) {
																				var groupInfo = list([]);
																				var idx = 0;
																				var __iterable0__ = tokens;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var token = __iterable0__[__index0__];
																								if (__t__(token.py_name.startswith('('))) {
																												groupInfo.append(Group(idx, null, token.py_name));
																								} else if (__t__(token.py_name == ')')) {
																												var __iterable1__ = py_reversed(groupInfo);
																												for (var __index1__ = 0; __index1__ < __iterable1__.length; __index1__++) {
																																var group = __iterable1__[__index1__];
																																if (__t__(group.end === null)) {
																																				group.end = idx;
																																}
																												}
																								}
																								idx++;
																				}
																				return groupInfo;
																};
																var countCaptureGroups = function countCaptureGroups(tokens) {
																				var groupInfo = generateGroupSpans(tokens);
																				var count = 0;
																				var __iterable0__ = tokens;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var token = __iterable0__[__index0__];
																								if (__t__(token.py_name == '(')) {
																												count++;
																								}
																				}
																				return count;
																};
																var getCaptureGroup = function getCaptureGroup(groupInfo, namedGroups, groupRef) {
																				try {
																								var id = int(groupRef);
																				} catch (__except0__) {
																								var id = namedGroups[groupRef];
																				}
																				var search = 0;
																				var __iterable0__ = groupInfo;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var group = __iterable0__[__index0__];
																								if (__t__(group.klass == '(')) {
																												search++;
																												if (__t__(search == id)) {
																																return group;
																												}
																								}
																				}
																};
																var splitIfElse = function splitIfElse(tokens, namedGroups) {
																				var variants = list([]);
																				var groupInfo = generateGroupSpans(tokens);
																				var __iterable0__ = groupInfo;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var group = __iterable0__[__index0__];
																								if (__t__(group.klass == '(?<')) {
																												var iff = tokens.__getslice__(0, null, 1);
																												var els = tokens.__getslice__(0, null, 1);
																												var conStart = group.start;
																												var conEnd = group.end;
																												var ref = tokens[conStart + 1].py_name;
																												var captureGroup = getCaptureGroup(groupInfo, namedGroups, ref);
																												var captureGroupModifier = tokens[captureGroup.end + 1];
																												if (__t__(__t__(__in__(captureGroupModifier.py_name, list(['?', '*']))) || captureGroupModifier.py_name.startswith('{0,'))) {
																																if (__t__(captureGroupModifier.py_name == '?')) {
																																				iff[captureGroup.end + 1] = null;
																																} else if (__t__(captureGroupModifier.py_name == '*')) {
																																				iff[captureGroup.end + 1] = Token('+');
																																} else if (__t__(captureGroupModifier.py_name.startswith('{0,'))) {
																																				iff[captureGroup.end + 1].py_name.__setslice__(0, 3, null, '{1,');
																																}
																																els[captureGroup.end + 1] = null;
																																var hasElse = false;
																																for (var idx = conStart; idx < conEnd; idx++) {
																																				if (__t__(tokens[idx].py_name == '|')) {
																																								var hasElse = true;
																																								els.py_pop(conEnd);
																																								iff.__setslice__(idx, conEnd + 1, null, list([]));
																																								els.__setslice__(conStart, idx + 1, null, list([]));
																																								break;
																																				}
																																}
																																if (__t__(!__t__(hasElse))) {
																																				els.__setslice__(conStart, conEnd + 1, null, list([]));
																																				iff.py_pop(conEnd);
																																}
																																iff.__setslice__(conStart, conStart + 3, null, list([]));
																																els.__setslice__(captureGroup.start, captureGroup.end + 1, null, list([Token('('), Token(')')]));
																																iff.remove(null);
																																els.remove(null);
																																variants.append(iff);
																																variants.append(els);
																												} else {
																																var pastIff = false;
																																for (var idx = conStart; idx < conEnd; idx++) {
																																				if (__t__(iff[idx].py_name == '|')) {
																																								var iff = tokens.__getslice__(0, idx, 1);
																																								iff.extend(tokens.__getslice__(conEnd + 1, null, 1));
																																								break;
																																				}
																																}
																																iff.__setslice__(conStart, conStart + 3, null, list([]));
																																variants.append(iff);
																												}
																												break;
																								}
																				}
																				if (__t__(!__t__(variants))) {
																								return list([tokens]);
																				}
																				var allVariants = list([]);
																				var __iterable0__ = variants;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var variant = __iterable0__[__index0__];
																								allVariants.extend(splitIfElse(variant, namedGroups));
																				}
																				return allVariants;
																};
																var Token = __class__('Token', [object], {
																				get __init__() {
																								return __get__(this, function (self, py_name, paras, pure) {
																												if (typeof paras == 'undefined' || paras != null && paras.hasOwnProperty("__kwargtrans__")) {
																																;
																																var paras = null;
																												};
																												if (typeof pure == 'undefined' || pure != null && pure.hasOwnProperty("__kwargtrans__")) {
																																;
																																var pure = false;
																												};
																												if (__t__(paras === null)) {
																																var paras = list([]);
																												}
																												self.py_name = py_name;
																												self.paras = paras;
																												self.pure = pure;
																												self.isModeGroup = false;
																								}, '__init__');
																				},
																				get __repr__() {
																								return __get__(this, function (self) {
																												return self.py_name;
																								}, '__repr__');
																				},
																				get resolve() {
																								return __get__(this, function (self) {
																												var paras = '';
																												var __iterable0__ = self.paras;
																												for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																																var para = __iterable0__[__index0__];
																																paras += str(para);
																												}
																												return self.py_name + paras;
																								}, 'resolve');
																				}
																});
																var shift = function shift(stack, queue) {
																				var done = !__t__(bool(queue));
																				if (__t__(!__t__(done))) {
																								stack.append(Token(queue[0], list([]), true));
																								var queue = queue.__getslice__(1, null, 1);
																				}
																				return tuple([stack, queue, done]);
																};
																var shiftReduce = function shiftReduce(stack, queue, namedGroups, flags) {
																				var done = false;
																				var high = len(stack) - 1;
																				if (__t__(len(stack) < 2)) {
																								var __left0__ = shift(stack, queue);
																								var stack = __left0__[0];
																								var queue = __left0__[1];
																								var done = __left0__[2];
																								return tuple([stack, queue, flags, done]);
																				}
																				var s0 = __t__(len(stack) > 0) ? stack[high] : Token('');
																				var s1 = __t__(len(stack) > 1) ? stack[high - 1] : Token('');
																				if (__t__(VERBOSE)) {
																								var __iterable0__ = stack;
																								for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																												var token = __iterable0__[__index0__];
																												console.log(token.resolve(), '\t', __kwargtrans__({ end: '' }));
																								}
																								console.log('');
																				}
																				if (__t__(s1.py_name == '\\')) {
																								if (__t__(s0.py_name == 'A')) {
																												stack.__setslice__(-__t__(2), null, null, list([Token('^')]));
																								} else if (__t__(s0.py_name == 'a')) {
																												stack.__setslice__(-__t__(2), null, null, list([Token('\\07')]));
																								} else if (__t__(s0.py_name == 'Z')) {
																												stack.__setslice__(-__t__(2), null, null, list([Token('$')]));
																								} else {
																												stack.__setslice__(-__t__(2), null, null, list([Token('\\' + s0.py_name)]));
																								}
																				} else if (__t__(__t__(s0.py_name == '$') && s0.pure)) {
																								stack.py_pop();
																								stack.extend(list([Token('(?='), Token('\\n'), Token('?'), Token('$'), Token(')')]));
																				} else if (__t__(s1.py_name == '{')) {
																								if (__t__(__t__(s0.py_name == ',') && len(s1.paras) == 0)) {
																												s1.paras.append('0');
																												s1.paras.append(',');
																								} else if (__t__(s0.py_name == '}')) {
																												s1.paras.append('}');
																												s1.py_name = s1.resolve();
																												s1.paras = list([]);
																								} else {
																												s1.paras.append(s0.py_name);
																								}
																								var stack = stack.__getslice__(0, -__t__(1), 1);
																				} else if (__t__(__t__(s1.py_name == '[') && s0.py_name == '^')) {
																								stack.__setslice__(-__t__(2), null, null, list([Token('[^')]));
																				} else if (__t__(__t__(s1.py_name == '(') && s0.py_name == '?')) {
																								stack.__setslice__(-__t__(2), null, null, list([Token('(?')]));
																				} else if (__t__(__t__(__in__(s1.py_name, list(['*', '+', '?']))) && s0.py_name == '?')) {
																								stack.__setslice__(-__t__(2), null, null, list([Token(s1.py_name + '?')]));
																				} else if (__t__(__t__(s1.isModeGroup) && s0.py_name == ')')) {
																								var stack = stack.__getslice__(0, -__t__(2), 1);
																				} else if (__t__(s1.py_name == '(?')) {
																								if (__t__(__in__(s0.py_name, stringFlags))) {
																												if (__t__(s0.py_name == 'i')) {
																																flags |= re.IGNORECASE;
																												} else if (__t__(s0.py_name == 'L')) {
																																flags |= re.LOCALE;
																												} else if (__t__(s0.py_name == 'm')) {
																																flags |= re.MULTILINE;
																												} else if (__t__(s0.py_name == 's')) {
																																flags |= re.DOTALL;
																												} else if (__t__(s0.py_name == 'u')) {
																																flags |= re.UNICODE;
																												} else if (__t__(s0.py_name == 'x')) {
																																flags |= re.VERBOSE;
																												} else if (__t__(s0.py_name == 'a')) {
																																flags |= re.ASCII;
																												}
																												stack.py_pop();
																												s1.isModeGroup = true;
																								} else {
																												if (__t__(s0.py_name == '(')) {
																																s0.py_name = '<';
																												}
																												var newToken = Token('(?' + s0.py_name);
																												stack.__setslice__(-__t__(2), null, null, list([newToken]));
																								}
																				} else if (__t__(s1.py_name == '(?<')) {
																								if (__t__(s0.py_name == ')')) {
																												stack.__setslice__(-__t__(1), null, null, list([Token(''.join(s1.paras)), Token('>')]));
																												s1.paras = list([]);
																								} else {
																												s1.paras.append(s0.py_name);
																												stack.py_pop();
																								}
																				} else if (__t__(s1.py_name == '(?P')) {
																								stack.__setslice__(-__t__(2), null, null, list([Token('(?P' + s0.py_name)]));
																				} else if (__t__(s1.py_name == '(?P<')) {
																								if (__t__(s0.py_name == '>')) {
																												namedGroups[''.join(s1.paras)] = countCaptureGroups(stack) + 1;
																												stack.__setslice__(-__t__(2), null, null, list([Token('(')]));
																								} else {
																												s1.paras.append(s0.py_name);
																												stack.py_pop();
																								}
																				} else if (__t__(s1.py_name == '(?P=')) {
																								if (__t__(s0.py_name == ')')) {
																												stack.__setslice__(-__t__(2), null, null, list([Token('\\' + str(namedGroups[s1.paras[0]]))]));
																								} else if (__t__(!__t__(s1.paras))) {
																												s1.paras.append(s0.py_name);
																												stack.py_pop();
																								} else {
																												s1.paras[0] += s0.py_name;
																												stack.py_pop();
																								}
																				} else if (__t__(s1.py_name == '(?#')) {
																								if (__t__(s0.py_name == ')')) {
																												var stack = stack.__getslice__(0, -__t__(2), 1);
																								} else {
																												var stack = stack.__getslice__(0, -__t__(1), 1);
																								}
																				} else {
																								var __left0__ = shift(stack, queue);
																								var stack = __left0__[0];
																								var queue = __left0__[1];
																								var done = __left0__[2];
																				}
																				return tuple([stack, queue, flags, done]);
																};
																var translate = function translate(rgx) {
																				__nest__(re, '', _init__(__world__.re));
																				var stack = list([]);
																				var queue = list(rgx);
																				var flags = 0;
																				var namedGroups = dict();
																				var nloop = 0;
																				while (__t__(true)) {
																								nloop++;
																								if (__t__(nloop > MAX_SHIFTREDUCE_LOOPS)) {
																												var __except0__ = Exception();
																												__except0__.__cause__ = null;
																												throw __except0__;
																								}
																								var __left0__ = shiftReduce(stack, queue, namedGroups, flags);
																								var stack = __left0__[0];
																								var queue = __left0__[1];
																								var flags = __left0__[2];
																								var done = __left0__[3];
																								if (__t__(done)) {
																												break;
																								}
																				}
																				var variants = splitIfElse(stack, namedGroups);
																				var n_splits = len(variants);
																				var final = list([]);
																				for (var i = 0; i < len(variants); i++) {
																								final.extend(variants[i]);
																								if (__t__(i < len(variants) - 1)) {
																												final.append(Token('|'));
																								}
																				}
																				var stack = final;
																				var groupInfo = generateGroupSpans(stack);
																				var resolvedTokens = list([]);
																				var __iterable0__ = stack;
																				for (var __index0__ = 0; __index0__ < __iterable0__.length; __index0__++) {
																								var token = __iterable0__[__index0__];
																								var stringed = token.resolve();
																								if (__t__(__t__(flags & re.DOTALL) && stringed == '.')) {
																												var stringed = '[\\s\\S]';
																								}
																								resolvedTokens.append(stringed);
																				}
																				return tuple([resolvedTokens, flags, namedGroups, countCaptureGroups(stack), n_splits]);
																};
																__pragma__('<use>' + 're' + '</use>');
																__pragma__('<all>');
																__all__.Group = Group;
																__all__.MAX_SHIFTREDUCE_LOOPS = MAX_SHIFTREDUCE_LOOPS;
																__all__.Token = Token;
																__all__.VERBOSE = VERBOSE;
																__all__.countCaptureGroups = countCaptureGroups;
																__all__.generateGroupSpans = generateGroupSpans;
																__all__.getCaptureGroup = getCaptureGroup;
																__all__.shift = shift;
																__all__.shiftReduce = shiftReduce;
																__all__.splitIfElse = splitIfElse;
																__all__.stringFlags = stringFlags;
																__all__.translate = translate;
																__pragma__('</all>');
												}
								}
				});
				(function () {
								var decorate = _init__(__world__.lawtext.decorate).decorate;
								var analyze = _init__(__world__.lawtext.analyze).analyze;
								__pragma__('<use>' + 'lawtext.analyze' + 'lawtext.decorate' + '</use>');
								__pragma__('<all>');
								__all__.analyze = analyze;
								__all__.decorate = decorate;
								__pragma__('</all>');
				})();
				return __all__;
}
window['_parse_decorate'] = _parse_decorate();
