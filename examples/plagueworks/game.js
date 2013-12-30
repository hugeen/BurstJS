define(function(require) {
    var game = require("burst/core/event_capabilities")({});
    var $ = require("burst/utils/dom_utils");

    var stage = require("burst/core/stage_capabilities")({});

    game.on("start", function() {
        var canvas = $.create("canvas");
        $.find("plagueworks").appendChild(canvas);
        stage.setupRenderer(canvas);
    });

    return game;
});
