define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(Model) {

        var collections = [];
        eventCapabilities(Model);

        Model.find = function(identifier) {
            return collection[identifier];
        };

        Model.create = function() {
            var model = eventCapabilities({});

            Object.defineProperty(model, "destroy", {
                get: function() {
                    collections.forEach(function(collection) {
                        collection.remove(model);
                    });
                    Model.emit("instance destroyed", model);
                    return Model;
                }
            });

            collections.forEach(function(collection) {
                collection.add(model);
            });

            model.tag = function(tagName) {
                collections.forEach(function(collection) {
                    collection.tag(tagName, model);
                });
                return model;
            };

            model.untag = function(tagName) {
                collections.forEach(function(collection) {
                    collection.untag(tagName, model);
                });
                return model;
            };

            Model.emit.apply(Model, ["instance created", model].concat(arguments));

            return model;
        };

        Model.bindCollection = function(collection) {
            collections.push(collection);

            return Model;
        };

        return Model;

    };

});
