define(function(require) {

    var _ = require("burst/utils/object_utils");
    var slice = Array.prototype.slice;

    return function(enumerable) {

        enumerable.find = function() {
            var where = enumerable.where.apply(enumerable, slice.call(arguments));
            return where.length > 0 ? where[0] : false;
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
                _.forEach(conditions, function(condition, key) {
                    satisfiedCondition = typeof item[key] !== "undefined" && item[key] === condition;
                });
                return satisfiedCondition;
            });
        };

    };

});
