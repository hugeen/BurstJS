define(function(require) {

    function domUtils(selector) {
        return document.querySelectorAll(selector);
    }

    domUtils.find = function(id) {
        return document.getElementById(id);
    };

    domUtils.create = function(tagName) {
        return document.createElement(tagName);
    };

    domUtils.ready = function(callback) {
        window.addEventListener("load", callback, false);
        if (document.readyState === "complete") {
            callback();
        }
    };

    return domUtils;

});
