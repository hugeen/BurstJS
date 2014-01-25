define(function(require) {

    var finderCapabilities = require("burst/core/finder_capabilities");
    var slice = Array.prototype.slice;

    return function(object) {

        var tags = {};
        var tagNames = [];

        object.tag = function() {
            var args = slice.call(arguments);
            var item = args.shift();
            args.forEach(function(arg) {
                var tagNames = Array.isArray(arg) ? arg : [arg];
                tagNames.forEach(function(tagName) {
                    var tag = object.getTag(tagName);
                    if (tag.indexOf(item) === -1) {
                        tag.push(item);
                    }
                });
            });

            return object;
        };

        object.untag = function() {

            var args = slice.call(arguments);
            var item = args.shift();

            args.forEach(function(arg) {
                var tagNames = Array.isArray(arg) ? arg : [arg];
                tagNames.forEach(function(tagName) {
                    var tag = tags[tagName] || false;
                    if (tag) {
                        var index = tag.indexOf(item);
                        if (index !== -1) {
                            tag.splice(index, 1);
                        }
                    }
                });
            });

            return object;
        };

        object.untagAll = function(item) {
            tagNames.forEach(function(tagName) {
                object.untag(tagName, item);
            });

            return object;
        };

        object.getTag = function(tagName) {
            object.addTag(tagName);

            return tags[tagName];
        };

        object.addTag = function(tagName) {
            if (typeof tags[tagName] === "undefined") {
                tagNames.push(tagName);
                var tag = Object.create(Array.prototype);
                tags[tagName] = tag;
                finderCapabilities(tag);
                tagBroadcastCapabilities(tag);
                Object.defineProperty(object, tagName, {
                    get: function() {
                        return tagCascade(tag);
                    },
                    configurable: true
                });
            }

            return this;
        };

        function tagCascade(parentTag) {
            tagNames.forEach(function(tagName) {
                Object.defineProperty(parentTag, tagName, {
                    get: function() {
                        var filtered = Object.create(Array.prototype);
                        tags[tagName].forEach(function(item) {
                            if (parentTag.indexOf(item) !== -1) {
                                filtered.push(item);
                            }
                        });
                        finderCapabilities(filtered);
                        tagBroadcastCapabilities(filtered);
                        return tagCascade(filtered);
                    },
                    configurable: true
                });
            });

            return parentTag;
        }

        function tagBroadcastCapabilities(tag) {
            tag.broadcast = function() {
                var args = slice.call(arguments);
                tag.forEach(function(item) {
                    item.emit.apply(item, args);
                });
            };
        };

        return object;
    };

});
