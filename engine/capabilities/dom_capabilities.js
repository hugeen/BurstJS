define(function(require) {

    var $ = require("burst/libs/jquery");
    var Mustache = require("burst/libs/mustache");

    var viewCapabilities = require("burst/engine/capabilities/view_capabilities");
    var Asset = require("burst/engine/models/asset");

    return function(view) {

        viewCapabilities(view);

        view.on("initialize", function(params) {
            view.template = Asset.createOrFind(params.template).tag(view.id);
            Asset.emit("add manifest", params.stylesheets || [], [view.id, "stylesheets"]);
        });

        view.on("assets loaded", function() {
            view.stylesheets = Asset[view.id].stylesheets;
            view.emit("render");
        });

        view.on("ready", function() {
            view.emit("display template");
            view.emit("apply stylesheets");
            view.emit("rendered");
            view.state = "rendered";
        });

        view.on("display template", function() {
            var compiledTemplate = Mustache.render(view.template.raw, view);
            view.container.html(compiledTemplate);
        });

        view.on("apply stylesheets", function() {
            Asset.stylesheets[view.id].forEach(function(stylesheet) {
                view.container.append($("<style>").html(stylesheet.raw));
            });
        });

        view.on("clear", function() {
            if (view.state === "rendered") {
                view.container.html("");
                view.state = "cleared";
                view.emit("cleared");
            }
        });

        return view;
    };

});
