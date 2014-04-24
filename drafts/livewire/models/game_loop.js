define(function(require) {

    var modelCapabilities = require("burstcore/model_capabilities");
    var gameLoopCapabilities = require("livewire/capabilities/game_loop_capabilities");

    var GameLoop = modelCapabilities({});

    GameLoop.on("create", function(gameLoop) {
        gameLoopCapabilities(gameLoop);
    });

    GameLoop.on("destroy", function(gameLoop) {
        gameLoop.emit("stop");
    });

    return GameLoop;

});
