define(function(require) {
    var game = require("burst/core/event_capabilities")({});
    var Player = require("models/player");
    var entities = require("collections/entities");

    Player.create().tag("hhh").tag("aaa").tag("zzz");
    Player.create().tag("aaa");
    Player.create().tag("hhh");
    Player.create().tag("hhh");
    Player.create().tag("hhh");
    Player.create().tag("zzz");
    Player.create().tag("hhh");
    Player.create().tag("aaa");
    Player.create().tag("hhh");
    Player.create().tag("hhh");
    Player.create().tag("salut");

    Player.on(["test", "test"], function() {
        console.log("test");
    });

    Player.on(["hello", "test"], function() {
        console.log("hello");
    });

    Player.emit(["test", "hello", "test"]);
    game.on("start", function() {
        // scenesController.emit("render", "loading");
    });

    return game;
});
