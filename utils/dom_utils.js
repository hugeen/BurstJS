define(function(require) {

    return function(selector) {

        var elements = (typeof selector === "string") ? document.querySelectorAll(selector) : [selector];

        elements.on = function(eventName, callback, useCapture) {
            elements.forEach(function(element) {
                element.addEventListener(eventName, callback, useCapture, useCapture || false);
            });
        };

        elements.off = function(eventName, callback, useCapture) {
            elements.forEach(function(element) {
                element.removeEventListener(eventName, callback, useCapture, useCapture || false);
            });
        };

        elements.emit = function(eventName) {
            elements.forEach(function(element) {
                element.dispatchEvent(eventName);
            });
        };

        if (typeof selector === "function") {
            window.addEventListener("load", selector, false);
            if (document.readyState === "complete") {
                selector();
            }
            return [window];
        } else {
            return elements;
        }

    };

});
