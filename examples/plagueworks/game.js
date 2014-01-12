define(function(require) {

    var $ = require("burst/libs/zepto");
    var game = require("burst/core/event_capabilities")({});
    var domCapabilities = require("burst/engine/capabilities/dom_capabilities");
    var View = require("burst/engine/models/view");
    var Asset = require("burst/engine/models/asset");
    Asset.rootPath = "assets/";

    game.on("start", function() {

        Asset.emit("add manifest", ["templates/title.mustache", "images/achievements.png", "images/background.png", "images/credits.png", "images/items-frame.png", "images/how-to-play.png", "images/highscores.png", "images/main-frame.png"], "titleScreen");
        Asset.emit("load by tag", "titleScreen");

        // // Views stuff
        // var titleScreen = View.create(domCapabilities, {
        //     template: "hello world",
        //     container: $("#plagueworks")
        // }).emit("render");
    });

    return game;
});
