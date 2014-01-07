define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var gameLoopCapabilities = require("burst/engine/capabilities/game_loop_capabilities");

    modelCapabilities(GameLoop);

    GameLoop.on("instance created", function(gameLoop) {
        gameLoopCapabilities(gameLoop);
    });

    GameLoop.on("instance destroyed", function(gameLoop) {
        gameLoop.emit("stop");
    });

    return GameLoop;

});
