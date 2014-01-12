define(function(require) {

    var $ = require("burst/libs/zepto");
    var domCapabilities = require("burst/engine/capabilities/dom_capabilities");

    var View = require("burst/engine/models/view");
    var Asset = require("burst/engine/models/asset");
    Asset.rootPath = "assets/";
    Asset.noCache = true;

    var game = require("burst/core/event_capabilities")({});

    game.on("start", function() {

        View.create(domCapabilities, {
            id: "titleScreen",
            template: "templates/title.mustache",
            images: ["images/achievements.png", "images/background.png", "images/credits.png", "images/how-to-play.png", "images/highscores.png", "images/main-frame.png"],
            container: $("#plagueworks")
        }).emit("render");
    });

    return game;
});
