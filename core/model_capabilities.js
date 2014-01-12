define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var collectionCapabilities = require("burst/core/collection_capabilities");
    var slice = Array.prototype.slice;

    return function(Model) {

        eventCapabilities(Model);
        collectionCapabilities(Model);

        Model.create = function() {

            var instance = {};

            Object.defineProperty(instance, "destroy", {
                get: function() {
                    Model.remove(instance);
                    Model.emit("instance destroyed", instance);
                    return Model;
                }
            });

            instance.tag = function() {
                Model.tag.apply(Model, [instance].concat(slice.call(arguments)));
                return instance;
            };

            instance.untag = function() {
                Model.untag.apply(Model, [instance].concat(slice.call(arguments)));
                return instance;
            };

            Model.add(instance);

            Model.emit.apply(Model, ["instance created", instance].concat(slice.call(arguments)));

            return instance;
        };

        return Model;
    };

});
