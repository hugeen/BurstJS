define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var gameLoopCapabilities = require("burst/engine/capabilities/game_loop_capabilities");

    var GameLoop = modelCapabilities({});

    GameLoop.on("create", function(gameLoop) {
        gameLoopCapabilities(gameLoop);
    });

    GameLoop.on("destroy", function(gameLoop) {
        gameLoop.emit("stop");
    });

    return GameLoop;

});
