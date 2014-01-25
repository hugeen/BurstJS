define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var modelCapabilities = require("burst/core/model_capabilities");
    var benchmark = require("burst/utils/benchmark_utils");

    var game = eventCapabilities({});

    var Player = modelCapabilities({});
    Player.addTag("global").addTag("hello").addTag("burst");
    Player.on("create", function(instance) {
        eventCapabilities(instance);
    });

    game.on("start", function() {

        benchmark("Model Creation", function(i) {
            var p = Player.create().tag("global");
            if (!(i % 3)) {
                p.tag("hello");
            }
            if (!(i % 5)) {
                p.tag("burst");
            }
        }, 1000);

        benchmark("Get tag", function() {
            Player.global;
        }, 750);

        benchmark("Get nested tag", function() {
            Player.burst.hello;
        }, 750);
        
        benchmark("Get nested tag twice", function() {
            Player.burst.hello;
        }, 750);

        console.log(Player.global.hello.length)

    });

    return game;
});
