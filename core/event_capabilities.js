define(function() {

    var slice = Array.prototype.slice;

    return function(object) {

        if (typeof object.on !== "undefined") {
            return object;
        }

        var events = {
            root: {}
        };

        object.on = function(identifier, listener) {
            if (Array.isArray(identifier)) {
                var scopes = identifier;
                identifier = identifier.pop();
                scopes.forEach(function(scope) {
                    pushListener(scope, identifier, listener);
                });
            } else {
                pushListener("root", identifier, listener);
            }
        };

        object.off = function(identifier, listener) {
            if (Array.isArray(identifier)) {
                var scopes = identifier;
                identifier = identifier.pop();
                scopes.forEach(function(scope) {
                    removeListener(scope, identifier, listener);
                });
            } else {
                removeListener("root", identifier, listener);
            }
        };

        object.emit = function(identifier) {
            if (Array.isArray(identifier)) {
                var scopes = identifier;
                identifier = identifier.pop();
                scopes.forEach(function(scope) {
                    callListeners(scope, identifier, slice.call(arguments, 1));
                });
            } else {
                callListeners("root", identifier, slice.call(arguments, 1));
            }
        };

        function callListeners(scope, identifier, args) {
            events[scope] = events[scope] || {};
            if (identifier in events[scope] === false) {
                return;
            }
            for (var i = 0; i < events[scope][identifier].length; i++) {
                events[scope][identifier][i].apply(object, args);
            }
        }

        function pushListener(scope, identifier, listener) {
            events[scope] = events[scope] || {};
            events[scope][identifier] = events[scope][identifier] || [];
            events[scope][identifier].push(listener);
        }

        function removeListener(scope, identifier, listener) {
            events[scope] = events[scope] || {};
            if (identifier in events[scope] === false) {
                return;
            }
            events[scope][identifier].splice(events[scope][identifier].indexOf(listener), 1);
        }

        return object;

    };

});
