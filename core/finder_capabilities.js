define(function(require) {

    var slice = Array.prototype.slice;

    return function(enumerable) {

        enumerable.find = function() {
            var where = enumerable.where.apply(enumerable, slice.call(arguments));

            return where.length > 0 ? where[0] : null;
        };

        enumerable.where = function() {
            var conditions = {};
            if (typeof arguments[0] === "string") {
                conditions[arguments[0]] = arguments[1];
            } else {
                conditions = arguments[0];
            }

            return enumerable.filter(function(item) {
                var satisfiedCondition = false;
                for (var key in conditions) {
                    if (object.hasOwnProperty(key)) {
                        satisfiedCondition = typeof item[key] !== "undefined" && item[key] === conditions[key];
                    }
                }

                return satisfiedCondition;
            });
        };

    };

});
