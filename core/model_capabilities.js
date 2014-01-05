define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var collectionCapabilities = require("burst/core/collection_capabilities");

    return function(Model) {

        eventCapabilities(Model);
        collectionCapabilities(Model);

        Model.create = function() {

            var instance = eventCapabilities({});
            Model.add(instance);

            instance.tag = function(tagName) {
                Model.tag(tagName, instance);
                return model;
            };

            instance.untag = function(tagName) {
                Model.untag(tagName, instance);
                return model;
            };

            Object.defineProperty(instance, "destroy", {
                get: function() {
                    Model.remove(instance);
                    Model.emit("instance destroyed", instance);
                    return Model;
                }
            });

            Model.emit.apply(Model, ["instance created", instance].concat(arguments));

            return instance;
        };

        return Model;
    };

});
