define(function(require) {

    var $ = require("burst/libs/jquery");

    var eventCapabilities = require("burst/core/event_capabilities");
    var Asset = require("burst/engine/models/asset");

    return function(view) {

        eventCapabilities(view);

        view.children = [];
        view.state = "initialized";

        Object.defineProperty(view, "container", {
            get: function() {
                return $(view.selector);
            }
        });

        view.on("initialize", function(params) {
            view.selector = params.selector || "body";
            Asset.emit("add manifest", (params.images || []), view.id);
            if (typeof params.parent !== "undefined") {
                params.parent.children.push(view);
            }
        });

        view.on("load assets", function() {
            view.state = "loading";
            Asset.on(view.id + " loaded", function() {
                view.emit("assets loaded");
            });
            Asset.emit("load by tag", view.id);
        });

        view.on("clear", function() {
            view.children.forEach(function(child) {
                child.emit("clear");
            });
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
