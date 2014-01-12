define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");

    var View = modelCapabilities({});

    var uid = 0;

    View.on("instance created", function(view, rendererCapabilities, params) {
        view.id = params.id || "view_" + (uid + 1);
        rendererCapabilities(view);
        view.emit("initialize", params);
    });

    View.on("instance destroyed", function(view) {
        view.emit("clear");
    });

    return View;

});
