define(function(require) {

    var Player = require("burst/core/model_capabilities")({});
    require("model_capabilities/entity_model_capabilities")(Player);

    return Player;
});
