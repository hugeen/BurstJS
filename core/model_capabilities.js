define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(BurstModel) {

        var index = 0;
        var collection = {};

        eventCapabilities(BurstModel);

        Object.defineProperty(BurstModel, "all", {
            value: collection,
            writable: false,
            enumerable: true
        });

        BurstModel.find = function(identifier) {
            return collection[identifier];
        };

        BurstModel.create = function() {
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

            BurstModel.emit.apply(BurstModel, ["instance created", model].concat(arguments));

            return model;
        };

        return BurstModel;

    };

});
