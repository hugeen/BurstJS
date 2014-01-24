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
            return tags[tagName] || object.addTag(tagName);
        };

        object.addTag = function(tagName) {
            if(typeof tags[tagName] === "undefined") {
                tagNames.push(tagName);
                tags[tagName] = Object.create(Array.prototype);
                finderCapabilities(tags[tagName]);
                Object.defineProperty(object, tagName, {
                    get: function() {
                        return tagCascade(tags[tagName]);
                    },
                    configurable: true
                });
            }

            return tags[tagName];
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
                        return tagCascade(filtered);
                    },
                    configurable: true
                });
            });

            return parentTag;
        }

        return object;
    };

});
