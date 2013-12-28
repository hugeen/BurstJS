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

    console.log(entities.hhh.aaa.hhh.zzz);

    return game;
});
