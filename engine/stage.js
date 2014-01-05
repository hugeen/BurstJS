define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");

    return function(Stage) {

        modelCapabilities(Stage);

        Stage.on("instance created", function(stage, rendererCapabilities, params) {
            rendererCapabilities(stage);
            stage.emit("initialize", params);
        });

        return Stage;
    };

});
