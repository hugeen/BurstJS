define(function(require) {

    var $ = require("burst/libs/zepto");
    var game = require("burst/core/event_capabilities")({});
    var domCapabilities = require("burst/engine/capabilities/dom_capabilities");
    var View = require("burst/engine/models/view");
    var Asset = require("burst/engine/models/asset");

    game.on("start", function() {

        // Views stuff
        View.create(domCapabilities, {
            template: "hello world",
            container: $("#plagueworks")
        }).emit("render");
        // Assets stuff
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
        // 
        // Asset.on(["main", "loaded"], function() {
        //     console.log("main assets loaded");
        // });
        // 
        // Asset.emit("load by tag", "main");
        // Asset.emit("load by tag", "hello");
    });

    return game;
});
