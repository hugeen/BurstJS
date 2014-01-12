define(function(require) {

    var $ = require("burst/libs/zepto");

    var eventCapabilities = require("burst/core/event_capabilities");
    var Asset = require("burst/engine/models/asset");

    return function(view) {

        eventCapabilities(view);

        view.state = "initialized";

        view.on("initialize", function(params) {
            view.container = params.container || $("body");
            Asset.emit("add manifest", (params.images || []), view.id);
        });

        view.on("load assets", function() {
            view.state = "loading";
            Asset.on(view.id + " loaded", function() {
                view.emit("assets loaded");
            });
            Asset.emit("load by tag", view.id);
        });

        view.on("render", function() {
            if (view.state === "rendered") {
                view.emit("clear");
            }
            if (Asset.toLoad[view.id].length > 0) {
                view.emit("load assets");
            } else {
                view.emit("ready");
            }
        });

        return view;
    };

});
