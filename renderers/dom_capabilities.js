define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");
    var $ = require("burst/libs/zepto");

    return function(dom) {

        eventCapabilities(dom);

        dom.on("render", function(params) {
            dom.el = $("<div>");
            dom.el.appendTo(params.container);
            dom.el.append(params.template);

            dom.stylesheet = $("<link>");
            dom.stylesheet.appendTo($('head'));
            dom.attr({
                type: 'text/css',
                rel: 'stylesheet'
            }).text(params.stylesheet);
        });

        dom.on("clear", function() {
            dom.el.remove();
            dom.stylesheet.remove();
        });

        return dom;
    };

});
