define(function(require) {

    var $ = require("burst/libs/zepto");
    var game = require("burst/core/event_capabilities")({});
    var domCapabilities = require("burst/renderers/dom_capabilities");
    var View = require("burst/engine/models/view");
    var Asset = require("burst/engine/models/asset");

    game.on("start", function() {
        // View.create(domCapabilities, {
        //     name: "level",
        //     container: $("#plagueworks")
        // });
        // var assets = ["achievements.png", "background.png", "credits.png", "gem-blob.png"];
        // assets.forEach(function(assetName) {
        //     Asset.create({
        //         url: "assets/images/" + assetName
        //     }).tag("main").tag("hello");
        // });
        // ["gem-blood.png"].forEach(function(assetName) {
        //     Asset.create({
        //         url: "assets/images/" + assetName
        //     }).tag("hello");
        // });
        // Asset.emit("load by tag", "main");
        // Asset.emit("load by tag", "hello");
    });
    return game;
});
