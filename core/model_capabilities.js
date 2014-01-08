define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var collectionCapabilities = require("burst/core/collection_capabilities");
    var slice = Array.prototype.slice;

    return function(Model) {

        eventCapabilities(Model);
        collectionCapabilities(Model);

        Model.create = function() {

            var instance = {};
            Model.add(instance);

            instance.tag = function(tagName) {
                Model.tag(tagName, instance);
                return instance;
            };

            instance.untag = function(tagName) {
                Model.untag(tagName, instance);
                return instance;
            };

            Object.defineProperty(instance, "destroy", {
                get: function() {
                    Model.remove(instance);
                    Model.emit("instance destroyed", instance);
                    return Model;
                }
            });

            Model.emit.apply(Model, ["instance created", instance].concat(slice.call(arguments)));

            return instance;
        };

        Model.alias = function(aliasName, value) {
            var def = {};
            def.configurable = true;
            if (typeof value === "function") {
                def.get = value;
            } else {
                def.value = value;
            }
            Object.defineProperty(Model, aliasName, def);
        };


        return Model;
    };

});
