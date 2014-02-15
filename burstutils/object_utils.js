define(function() {

    var objectUtils = {};
    var slice = Array.prototype.slice;

    objectUtils.clone = function(object) {
        var clone = {};
        for (var i in object) {
            if (object.hasOwnProperty(i)) {
                clone[i] = object[i];
            }
        }

        return clone;
    };

    objectUtils.extend = function(destination, source) {
        for (var property in source) {
            destination[property] = source[property];
        }

        return destination;
    };

    objectUtils.forEach = function(object, iterator, context) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                iterator.call(context, object[key], key, object);
            }
        }

        return object;
    };

    return objectUtils;

});

// Object.create
// Object.defineProperty
// Object.defineProperties
// Object.keys
// Array.isArray
// Array.prototype.indexOf
// Array.prototype.lastIndexOf
// Array.prototype.every
// Array.prototype.some
// Array.prototype.forEach
// Array.prototype.map
// Array.prototype.filter
