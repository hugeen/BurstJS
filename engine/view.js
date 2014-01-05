define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");

    return function(View) {

        modelCapabilities(View);

        View.on("instance created", function(view, rendererCapabilities, params) {
            rendererCapabilities(view);
            view.emit("initialize", params);
        });

        View.on("instance destroyed", function(view) {
            view.emit("clear");
        });

        return View;
    };

});
