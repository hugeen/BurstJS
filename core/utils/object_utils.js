define(function(require) {

    function clone(object) {
        var clone = {};
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                clone[i] = object[i];
            }
        }
        return clone;
    }

    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }
        return destination;
    }

    return {
        clone: clone,
        extend: extend
    };

});

// ES5 Native
// Object.create
// Object.defineProperty
// Object.defineProperties
// Object.getPrototypeOf
// Object.keys
// Object.seal
// Object.freeze
// Object.preventExtensions
// Object.isSealed
// Object.isFrozen
// Object.isExtensible
// Object.getOwnPropertyDescriptor
// Object.getOwnPropertyNames
// Date.prototype.toISOString
// Date.now
// Array.isArray
// JSON
// Function.prototype.bind
// String.prototype.trim
// Array.prototype.indexOf
// Array.prototype.lastIndexOf
// Array.prototype.every
// Array.prototype.some
// Array.prototype.forEach
// Array.prototype.map
// Array.prototype.filter
// Array.prototype.reduce
// Array.prototype.reduceRight
