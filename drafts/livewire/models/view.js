define(function(require) {

    var modelCapabilities = require("burstcore/model_capabilities");

    var View = modelCapabilities({});
    var uid = 0;

    View.on("create", function(view, rendererCapabilities, params) {
        view.id = params.id || "view_" + (uid + 1);
        rendererCapabilities(view);
        view.emit("initialize", params);
    });

    View.on("destroy", function(view) {
        view.emit("clear");
    });

    return View;

});
