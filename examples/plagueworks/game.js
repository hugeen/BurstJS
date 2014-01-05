define(function(require) {

    var $ = require("burst/libs/zepto");
    var game = require("burst/core/event_capabilities")({});
    var webglCapabilities = require("burst/renderers/webgl_capabilities");
    var Stage = require("burst/engine/stage");

    game.on("start", function() {
        stage.create($("#plagueworks"), webglCapabilities, {});
    });

    return game;
});
