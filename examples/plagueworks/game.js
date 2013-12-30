define(function(require) {
    var game = require("burst/core/event_capabilities")({});
    var $ = require("burst/utils/dom_utils");

    game.on("start", function() {
        var canvas = $.create("canvas");
        $.find("plagueworks").appendChild(canvas);
    });

    return game;
});
