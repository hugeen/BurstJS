define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var modelCapabilities = require("burst/core/model_capabilities");

    var $ = require("burst/libs/zepto");
    var benchmark = require("burst/utils/benchmark_utils");

    // Game handler
    var game = eventCapabilities({});

    // Player
    var Player = modelCapabilities({});
    Player.addTag("global").addTag("hello");
    Player.on("create", function(instance) {
        eventCapabilities(instance);
    });

    // On start
    game.on("start", function() {
        benchmark("Model Creation", function(i) {
            var p = Player.create().tag("global");
            p.on("hi", function() {
                console.log(i);
            });
            if ( !! (i % 2)) {
                p.tag("hello");
            }
        }, 1000);

        benchmark("Get Collection", function() {
            var p = Player.global.hello;
        }, 1);

        Player.hello.broadcast("hi");
    });

    return game;
});
