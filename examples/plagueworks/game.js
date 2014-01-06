define(function(require) {

    var $ = require("burst/libs/zepto");
    var game = require("burst/core/event_capabilities")({});
    var domCapabilities = require("burst/renderers/dom_capabilities");
    var View = require("burst/engine/models/view");

    game.on("start", function() {
        View.create($("#plagueworks"), domCapabilities, {
            template: "loading.mustache" 
        });
    });

    return game;
});
