define(function(require) {

    var $ = require("burst/libs/zepto");
    var game = require("burst/core/event_capabilities")({});
    var domCapabilities = require("burst/renderers/dom_capabilities");
    var View = require("burst/engine/models/view");
    var Asset = require("burst/engine/models/asset");
    // console.log(Asset);
    var assetsManifest = {
        css: [],
        images: [],
        sounds: [],
        scripts: [],
        others: []
    };

    game.on("start", function() {
        // View.create(domCapabilities, {
        //     name: "level",
        //     container: $("#plagueworks")
        // });
        var achievementAsset = Asset.create({
            url: "assets/images/big.jpg",
            type: "image"
        });
        achievementAsset.on("loaded", function() {
            $("body").append("<img src='"+achievementAsset.url+"'>");
        });
        achievementAsset.emit("load");
    });

    return game;
});
