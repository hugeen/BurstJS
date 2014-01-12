define(function(require) {

    var $ = require("burst/libs/zepto");
    var Mustache = require("burst/libs/mustache");

    var eventCapabilities = require("burst/core/event_capabilities");
    var Asset = require("burst/engine/models/asset");

    return function(view) {

        eventCapabilities(view);

        view.state = "initialized";

        view.on("initialize", function(params) {
            view.templatePath = params.template || false;
            view.container = params.container;
            Asset.emit("add manifest", (params.images || []).concat(params.template), view.id);
        });

        view.on("load assets", function() {
            view.state = "loading";
            Asset.on(view.id + " loaded", function() {
                if (view.templatePath) {
                    view.template = Asset.find("path", view.templatePath).raw;
                }
                view.emit("render");
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
                var compiledTemplate = Mustache.render(view.template, view);
                console.log(compiledTemplate);
                view.el = $("<div>").html(compiledTemplate).appendTo(view.container);
                view.state = "rendered";
                view.emit("rendered");
            }
        });

        view.on("clear", function() {
            if (view.state === "rendered") {
                view.el.remove();
                view.state = "cleared";
                view.emit("cleared");
            }
        });

        return view;
    };

});
