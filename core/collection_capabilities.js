define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var objectUtils = require("jburst/core/utils/object_utils");
    var ArrayPrototype = objectUtils.clone(Array.prototype);

    return function(collection) {

        var flattened = Object.create(ArrayPrototype);

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
