define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var modelCapabilities = require("burst/core/model_capabilities");

    // Game handler
    var game = eventCapabilities({});

    // Player
    var Player = modelCapabilities({});

    Player.on("instance created", function(instance, params) {
        console.log(instance, params);
    });

    Player.on(["selfPlayer", "ready"], function() {
        console.log(Player.selfPlayer, "sssss");
    });

    // On start
    game.on("start", function() {

        // Create a player
        var player = Player.create();
        Player.alias("selfPlayer", player);
        Player.emit(["selfPlayer", "ready"], "hello");
    });

    return game;
});
