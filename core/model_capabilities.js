define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(Model) {

        var index = 0;
        var models = {};
        var collections = [];

        eventCapabilities(Model);

        Object.defineProperty(Model, "all", {
            value: models,
            writable: false,
            enumerable: true
        });

        Model.find = function(identifier) {
            return collection[identifier];
        };

        Model.create = function() {
            var model = eventCapabilities({});
            model.identifier = index;
            models[model.identifier] = model;
            index += 1;

            Object.defineProperty(model, "destroy", {
                get: function() {
                    collections.forEach(function(collection) {
                        collection.remove(model);
                    });
                    delete collection[model.identifier];
                    Model.emit("instance destroyed", model);
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

        Model.removeCollection = function(collection) {
            var index = collections.indexOf(collection);
            if (index !== -1) {
                collections.splice(index, 1);
            }
            return Model;
        };

        return Model;

    };

});
