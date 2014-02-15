define(function(require) {

    var $ = require("burst/libs/jquery");
    var domCapabilities = require("burst/engine/capabilities/dom_capabilities");

    var View = require("burst/engine/models/view");
    var Asset = require("burst/engine/models/asset");
    Asset.rootPath = "assets/";
    Asset.noCache = true;

    var game = require("burst/core/event_capabilities")({});

    game.on("start", function() {

        var layout = View.create(domCapabilities, {
            id: "layout",
            template: "templates/layout.html",
            stylesheets: ["stylesheets/layout.css"],
            images: []
        });

        var title = View.create(domCapabilities, {
            id: "title",
            template: "templates/title.html",
            stylesheets: ["stylesheets/title.css"],
            selector: '#plagueworks',
            parent: layout,
            images: [
                "images/achievements.png",
                "images/background.png",
                "images/credits.png",
                "images/how-to-play.png",
                "images/highscores.png",
                "images/main-frame.png"
            ]
        });

        layout.on("rendered", function() {
            title.emit("render");
        });

        layout.emit("render");
    });

    return game;
});
