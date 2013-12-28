define(function() {

    var slice = Array.prototype.slice;

    return function(object) {

        if (typeof object.on !== "undefined") {
            return object;
        }

        var events = {};

        object.on = function(identifier, fnc) {
            events[identifier] = events[identifier] || [];
            events[identifier].push(fnc);
        };

        object.off = function(identifier, fnc) {
            if (identifier in events === false) {
                return;
            }
            events[identifier].splice(events[identifier].indexOf(fnc), 1);
        };

        object.emit = function(identifier, fnc) {
            if (identifier in events === false) {
                return;
            }
            for (var i = 0; i < events[identifier].length; i++) {
                events[identifier][i].apply(object, slice.call(arguments, 1));
            }
        };

        return object;

    };

});
