define(function(require) {
    var game = require("burst/core/event_capabilities")({});
    var Player = require("models/player");
    var entities = require("collections/entities");

    game.on("start", function() {
        
    });

    return game;
});
