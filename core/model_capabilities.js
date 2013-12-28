define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(Model) {

        var index = 0;
        var collection = {};

        eventCapabilities(Model);

        Object.defineProperty(Model, "all", {
            value: collection,
            writable: false,
            enumerable: true
        });

        Model.find = function(identifier) {
            return collection[identifier];
        };

        Model.create = function() {
            var model = eventCapabilities({});
            model.identifier = index;
            collection[model.identifier] = model;
            index += 1;

            Object.defineProperty(model, "destroy", {
                get: function() {
                    delete collection[model.identifier];
                    BurstModel.emit("instance destroyed", model);
                }
            });

            Model.emit.apply(Model, ["instance created", model].concat(arguments));

            return model;
        };

        return Model;

    };

});
