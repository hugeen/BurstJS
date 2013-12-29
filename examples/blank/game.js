define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var modelCapabilities = require("burst/core/model_capabilities");
    var collectionCapabilities = require("burst/core/collection_capabilities");

    // Game handler
    var game = eventCapabilities({});

    // Entities collection
    var entities = collectionCapabilities({});

    // Player
    var Player = modelCapabilities({});
    Player.bindCollection(entities);

    // On start
    game.on("start", function() {

        // Create a player
        var player = Player.create();
    });

    return game;
});
