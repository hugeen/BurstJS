define(function(require) {
    var game = require("burst/core/event_capabilities")({});
    var Player = require("burst/core/model_capabilities")({});
    Player.on("instance created", function(player, params) {

    });
    var player = Player.create({ hello: "world" });
    console.log(Player.all);
    console.log(player);
    player.destroy;
    console.log(Player.all);

    return game;
});
