define(function(require) {

    var $ = require("burst/libs/zepto");
    var Mustache = require("burst/libs/mustache");

    var viewCapabilities = require("burst/engine/capabilities/view_capabilities");
    var Asset = require("burst/engine/models/asset");

    return function(view) {

        viewCapabilities(view);

        view.on("initialize", function(params) {
            view.templatePath = params.template;
            Asset.emit("add manifest", [view.templatePath], view.id);
        });

        view.on("assets loaded", function() {
            view.template = Asset.find("path", view.templatePath).raw;
            view.emit("render");
        });

        view.on("ready", function() {
            var compiledTemplate = Mustache.render(view.template, view);
            view.el = $("<div>").html(compiledTemplate).appendTo(view.container);
            view.state = "rendered";
            view.emit("rendered");
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
