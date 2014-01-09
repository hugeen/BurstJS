define(function(require) {

    var finderCapabilities = require("burst/core/finder");
    var slice = Array.prototype.slice;

    return function(collection) {

        var flattened = Object.create(Array.prototype);
        finderCapabilities(flattened);

        var tags = {};
        var tagNames = [];

        Object.defineProperty(collection, "all", {
            value: flattened,
            writable: false,
            enumerable: true
        });

        collection.find = function() {
            return flattened.find.apply(flattened, slice.call(arguments));
        };

        collection.where = function() {
            return flattened.where.apply(flattened, slice.call(arguments));
        };

        collection.add = function(item) {
            var items = Array.isArray(item) ? item : [item];
            items.forEach(function(item) {
                flattened.push(item);
            });

            return flattened;
        };

        collection.remove = function(item) {
            var items = Array.isArray(item) ? item : [item];
            collection.untagAll(item);
            items.forEach(function(item) {
                var index = flattened.indexOf(item);
                if (index !== -1) {
                    flattened.splice(index, 1);
                }
            });

            return flattened;
        };

        collection.tag = function(tagName, item) {
            var tag = tags[tagName] || createTag(tagName);
            tag.push(item);

            return collection;
        };

        collection.untag = function(tagName, item) {
            var tag = tags[tagName] || false;
            if (!tag) {
                return collection;
            }
            var index = tag.indexOf(item);
            if (index !== -1) {
                tag.splice(index, 1);
            }

            return collection;
        };

        collection.untagAll = function(item) {
            tagNames.forEach(function(tagName) {
                collection.untag(tagName, item);
            });

            return collection;
        };

        function createTag(tagName) {
            tagNames.push(tagName);
            tags[tagName] = Object.create(Array.prototype);
            finderCapabilities(tags[tagName]);
            Object.defineProperty(collection, tagName, {
                get: function() {
                    return tagCascade(tags[tagName]);
                },
                configurable: true
            });

            return tags[tagName];
        }

        function tagCascade(parentTag) {
            tagNames.forEach(function(tagName) {
                Object.defineProperty(parentTag, tagName, {
                    get: function() {
                        var filtered = [];
                        tags[tagName].forEach(function(item) {
                            if (parentTag.indexOf(item) !== -1) {
                                filtered.push(item);
                            }
                        });
                        finderCapabilities(filtered);
                        return tagCascade(filtered);
                    },
                    configurable: true
                });
            });

            return parentTag;
        }

        return collection;
    };

});
