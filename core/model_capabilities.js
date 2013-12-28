define(function(require) {

    var eventCapabilities = require("jburst/core/event_capabilities");

    return function(BurstModel) {

        eventCapabilities(BurstModel);

        BurstModel.find = function(id) {

        };

        BurstModel.create = function() {
            var model = new BurstModel;
            eventCapabilities(model);
            BurstModel.emit("instance created", model);

            return model;
        };

        return BurstModel;

    };

});
