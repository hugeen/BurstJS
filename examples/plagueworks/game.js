define(function(require) {

    var $ = require("burstjquery");
    var domCapabilities = require("livewire/capabilities/dom_capabilities");

    var View = require("livewire/models/view");
    var Asset = require("livewire/models/asset");
    Asset.rootPath = "assets/";
    Asset.noCache = true;

    var game = require("burstcore/event_capabilities")({});

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
