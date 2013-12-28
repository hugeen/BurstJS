define(function(require) {
    var game = require("burst/core/event_capabilities")({});
    var Player = require("burst/core/model_capabilities")({});

    var player = Player.create({
        hello: "world"
    });
    player.destroy;

    return game;
});
