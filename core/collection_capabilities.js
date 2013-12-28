define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var objectUtils = require("burst/core/utils/object_utils");

    return function(collection) {

        var flattened = Object.create(Array.prototype, {
            add: {}
        });
        var tags = {};

        Object.defineProperty(collection, "all", {
            value: flattened,
            writable: false,
            enumerable: true
        });

        function add(item) {
            var items = Array.isArray(item) ? item : [item];
            items.forEach(function(item) {
                flattened.push(item);
            });

            return flattened;
        }

        function remove(item) {
            var items = Array.isArray(item) ? item : [item];
            items.forEach(function(item) {
                var index = flattened.indexOf(item);
                if (index !== -1) {
                    flattened.splice(index, 1);
                }
            });

            return flattened;
        }

        collection.add = add;
        collection.remove = remove;

        return collection;
    };

});
