define(function() {

    var slice = Array.prototype.slice;

    return function(object) {

        if (typeof object.on !== "undefined") {
            return object;
        }

        var events = {
            root: {}
        };
        object.on = function(identifier, fnc) {
            if (Array.isArray(identifier)) {
                var scopes = identifier;
                identifier = identifier.pop();
                scopes.forEach(function(scope) {
                    events[scope] = events[scope] || {};
                    events[scope][identifier] = events[scope][identifier] || [];
                    events[scope][identifier].push(fnc);
                });
            } else {
                events.root[identifier] = events.root[identifier] || [];
                events.root[identifier].push(fnc);
            }
        };

        object.off = function(identifier, fnc) {
            if (Array.isArray(identifier)) {
                var scopes = identifier;
                identifier = identifier.pop();
                scopes.forEach(function(scope) {
                    events[scope] = events[scope] || {};
                    if (identifier in events[scope] === false) {
                        return;
                    }
                    events[scope][identifier].splice(events[scope][identifier].indexOf(fnc), 1);
                });
            } else {
                if (identifier in events.root === false) {
                    return;
                }
                events.root[identifier].splice(events.root[identifier].indexOf(fnc), 1);
            }

        };

        object.emit = function(identifier, fnc) {
            if (Array.isArray(identifier)) {
                var scopes = identifier;
                identifier = identifier.pop();
                scopes.forEach(function(scope) {
                    events[scope] = events[scope] || {};
                    if (identifier in events[scope] === false) {
                        return;
                    }
                    for (var i = 0; i < events[scope][identifier].length; i++) {
                        events[scope][identifier][i].apply(object, slice.call(arguments, 1));
                    }
                });
            } else {
                if (identifier in events.root === false) {
                    return;
                }
                for (var i = 0; i < events.root[identifier].length; i++) {
                    events.root[identifier][i].apply(object, slice.call(arguments, 1));
                }
            }
        };

        return object;

    };

});
