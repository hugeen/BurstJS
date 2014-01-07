define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");

    var View = modelCapabilities({});

    View.on("instance created", function(view, container, rendererCapabilities, params) {
        rendererCapabilities(view);
        view.emit("render", params);
    });

    View.on("instance destroyed", function(view) {
        view.emit("clear");
    });

    return View;

});
