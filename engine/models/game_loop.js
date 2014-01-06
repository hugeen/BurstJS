define(function(require) {

    var modelCapabilities = require("burst/core/model_capabilities");
    var gameLoopCapabilities = require("burst/engine/capabilities/game_loop_capabilities");

    return function(GameLoop) {

        modelCapabilities(GameLoop);

        GameLoop("instance created", function(gameLoop) {
            gameLoopCapabilities(gameLoop);
        });

        GameLoop.on("instance destroyed", function(gameLoop) {
            gameLoop.emit("stop");
        });

        return GameLoop;
    };

});
