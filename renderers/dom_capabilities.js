define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var $ = require("burst/libs/zepto");

    return function(dom) {

        eventCapabilities(dom);

        dom.on("initialize", function(params) {
            dom.el = $("<div />").appendTo(params.container);
        });

        dom.on("draw", function() {

        });

        dom.on("clear", function() {
            dom.el.html("");
        });

        return dom;
    };

});
