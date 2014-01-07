define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var $ = require("burst/libs/zepto");

    return function(dom) {

        eventCapabilities(dom);

        dom.state = "initialized";

        dom.on("initialize", function(params) {
            dom.template = params.template;
            dom.container = params.container;
        });

        dom.on("render", function(params) {
            if (dom.state === "rendered") {
                dom.emit("clear");
            }
            dom.el = $("<div>").html(dom.template).appendTo(dom.container);
            dom.state = "rendered";
            dom.emit("rendered");
        });

        dom.on("clear", function() {
            if (dom.state === "rendered") {
                dom.el.remove();
                dom.state = "cleared";
                dom.emit("cleared");
            }
        });

        return dom;
    };

});
