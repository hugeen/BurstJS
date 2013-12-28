define(function(require) {
    var game = require("burst/core/event_capabilities")({});
    var Player = require("models/player");
    var entities = require("collections/entities");

    var player = Player.create({
        hello: "world"
    });
    console.log(player);
    console.log(entities);
    // playersCollection.add(player);
    // console.log(playersCollection.all);
    // playersCollection.remove(player);
    // console.log(playersCollection.all);

    return game;
});
