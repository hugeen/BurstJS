(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var eventCapabilities = require("../../moltencore/event");
var modelCapabilities = require("../../moltencore/model");

var game = eventCapabilities({});

var Player = modelCapabilities({});
Player.addTag("global").addTag("hello").addTag("burst");
Player.on("create", function(instance) {
    eventCapabilities(instance);
});

game.on("start", function() {
    console.log("hello"+e)
});

game.emit("start");
},{"../../moltencore/event":3,"../../moltencore/model":5}],2:[function(require,module,exports){
var finderCapabilities = require("./finder");
var tagCapabilities = require("./tag");
var slice = Array.prototype.slice;

module.exports = function(collection) {

    collection.all = Object.create(Array.prototype);

    finderCapabilities(collection.all);
    tagCapabilities(collection);

    collection.find = function() {
        return collection.all.find.apply(collection.all, slice.call(arguments));
    };

    collection.where = function() {
        return collection.all.where.apply(collection.all, slice.call(arguments));
    };

    collection.add = function(item) {
        var items = Array.isArray(item) ? item : [item];
        items.forEach(function(item) {
            collection.all.push(item);
        });

        return collection;
    };

    collection.remove = function(item) {
        var items = Array.isArray(item) ? item : [item];
        collection.untagAll(item);
        items.forEach(function(item) {
            var index = collection.all.indexOf(item);
            if (index !== -1) {
                collection.all.splice(index, 1);
            }
        });

        return collection;
    };

    return collection;
};

},{"./finder":4,"./tag":6}],3:[function(require,module,exports){
var slice = Array.prototype.slice;

module.exports = function(object) {

    if (typeof object.on !== "undefined") {
        return object;
    }

    var events = {};

    object.on = function(identifier, fnc) {
        events[identifier] = events[identifier] || [];
        events[identifier].push(fnc);

        return object;
    };

    object.off = function(identifier, fnc) {
        if (identifier in events === true) {
            events[identifier].splice(events[identifier].indexOf(fnc), 1);
        }

        return object;
    };

    object.emit = function(identifier, fnc) {
        if (identifier in events === true) {
            for (var i = 0; i < events[identifier].length; i++) {
                events[identifier][i].apply(object, slice.call(arguments, 1));
            }
        }

        return object;
    };

    return object;

};

},{}],4:[function(require,module,exports){
var slice = Array.prototype.slice;

module.exports = function(collection) {

    collection.find = function() {
        var where = collection.where.apply(collection, slice.call(arguments));

        return where.length > 0 ? where[0] : null;
    };

    collection.where = function() {
        var conditions = {};
        if (typeof arguments[0] === "string") {
            conditions[arguments[0]] = arguments[1];
        } else {
            conditions = arguments[0];
        }

        return collection.filter(function(item) {
            var satisfiedCondition = false;
            for (var key in conditions) {
                if (conditions.hasOwnProperty(key)) {
                    satisfiedCondition = typeof item[key] !== "undefined" && item[key] === conditions[key];
                }
            }

            return satisfiedCondition;
        });
    };

};

},{}],5:[function(require,module,exports){
var eventCapabilities = require("./event");
var collectionCapabilities = require("./collection");
var slice = Array.prototype.slice;

module.exports = function(Model) {

    eventCapabilities(Model);
    collectionCapabilities(Model);

    Model.create = function() {

        var instance = {};

        Object.defineProperty(instance, "destroy", {
            get: function() {
                Model.remove(instance);
                Model.emit("instance destroyed", instance);
                return Model;
            }
        });

        instance.tag = function() {
            Model.tag.apply(Model, [instance].concat(slice.call(arguments)));
            return instance;
        };

        instance.untag = function() {
            Model.untag.apply(Model, [instance].concat(slice.call(arguments)));
            return instance;
        };

        Model.add(instance);

        Model.emit.apply(Model, ["create", instance].concat(slice.call(arguments)));

        return instance;
    };

    return Model;
};

},{"./collection":2,"./event":3}],6:[function(require,module,exports){
var finderCapabilities = require("./finder");
var slice = Array.prototype.slice;

module.exports = function(object) {

    var tags = {};
    var tagNames = [];

    object.tag = function() {
        var args = slice.call(arguments);
        var item = args.shift();
        args.forEach(function(arg) {
            var tagNames = Array.isArray(arg) ? arg : [arg];
            tagNames.forEach(function(tagName) {
                var tag = object.getTag(tagName);
                if (tag.indexOf(item) === -1) {
                    tag.push(item);
                }
            });
        });

        return object;
    };

    object.untag = function() {

        var args = slice.call(arguments);
        var item = args.shift();

        args.forEach(function(arg) {
            var tagNames = Array.isArray(arg) ? arg : [arg];
            tagNames.forEach(function(tagName) {
                var tag = tags[tagName] || false;
                if (tag) {
                    var index = tag.indexOf(item);
                    if (index !== -1) {
                        tag.splice(index, 1);
                    }
                }
            });
        });

        return object;
    };

    object.untagAll = function(item) {
        tagNames.forEach(function(tagName) {
            object.untag(tagName, item);
        });

        return object;
    };

    object.getTag = function(tagName) {
        object.addTag(tagName);

        return tags[tagName];
    };

    object.addTag = function(tagName) {
        if (typeof tags[tagName] === "undefined") {
            tagNames.push(tagName);
            var tag = Object.create(Array.prototype);
            tags[tagName] = tag;
            finderCapabilities(tag);
            tagBroadcastCapabilities(tag);
            Object.defineProperty(object, tagName, {
                get: function() {
                    return tagCascade(tag);
                },
                configurable: true
            });
        }

        return this;
    };

    function tagCascade(parentTag) {
        tagNames.forEach(function(tagName) {
            defineFilteredTag(parentTag, tagName);
        });

        return parentTag;
    }

    function defineFilteredTag(parentTag, tagName) {
        Object.defineProperty(parentTag, tagName, {
            get: function() {
                var filteredTag = filterTag(parentTag, tags[tagName]);
                finderCapabilities(filteredTag);
                tagBroadcastCapabilities(filteredTag);
                return tagCascade(filteredTag);
            },
            configurable: true
        });
    }

    function filterTag(parentTag, tag) {
        var filtered = Object.create(Array.prototype);
        parentTag.forEach(function(item) {
            for (var i = 0; i < tag.length; i++) {
                if (tag[i] === item) {
                    filtered.push(item);
                    break;
                }
            }
        });

        return filtered;
    }

    function tagBroadcastCapabilities(tag) {
        tag.broadcast = function() {
            var args = slice.call(arguments);
            tag.forEach(function(item) {
                item.emit.apply(item, args);
            });
        };
    };

    return object;
};

},{"./finder":4}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvaHVnZWVuL0J1cnN0SlMvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9odWdlZW4vQnVyc3RKUy9leGFtcGxlcy9icm93c2VyaWZ5L21haW4uanMiLCIvVXNlcnMvaHVnZWVuL0J1cnN0SlMvbW9sdGVuY29yZS9jb2xsZWN0aW9uLmpzIiwiL1VzZXJzL2h1Z2Vlbi9CdXJzdEpTL21vbHRlbmNvcmUvZXZlbnQuanMiLCIvVXNlcnMvaHVnZWVuL0J1cnN0SlMvbW9sdGVuY29yZS9maW5kZXIuanMiLCIvVXNlcnMvaHVnZWVuL0J1cnN0SlMvbW9sdGVuY29yZS9tb2RlbC5qcyIsIi9Vc2Vycy9odWdlZW4vQnVyc3RKUy9tb2x0ZW5jb3JlL3RhZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZXZlbnRDYXBhYmlsaXRpZXMgPSByZXF1aXJlKFwiLi4vLi4vbW9sdGVuY29yZS9ldmVudFwiKTtcbnZhciBtb2RlbENhcGFiaWxpdGllcyA9IHJlcXVpcmUoXCIuLi8uLi9tb2x0ZW5jb3JlL21vZGVsXCIpO1xuXG52YXIgZ2FtZSA9IGV2ZW50Q2FwYWJpbGl0aWVzKHt9KTtcblxudmFyIFBsYXllciA9IG1vZGVsQ2FwYWJpbGl0aWVzKHt9KTtcblBsYXllci5hZGRUYWcoXCJnbG9iYWxcIikuYWRkVGFnKFwiaGVsbG9cIikuYWRkVGFnKFwiYnVyc3RcIik7XG5QbGF5ZXIub24oXCJjcmVhdGVcIiwgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgICBldmVudENhcGFiaWxpdGllcyhpbnN0YW5jZSk7XG59KTtcblxuZ2FtZS5vbihcInN0YXJ0XCIsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUubG9nKFwiaGVsbG9cIitlKVxufSk7XG5cbmdhbWUuZW1pdChcInN0YXJ0XCIpOyIsInZhciBmaW5kZXJDYXBhYmlsaXRpZXMgPSByZXF1aXJlKFwiLi9maW5kZXJcIik7XG52YXIgdGFnQ2FwYWJpbGl0aWVzID0gcmVxdWlyZShcIi4vdGFnXCIpO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGNvbGxlY3Rpb24pIHtcblxuICAgIGNvbGxlY3Rpb24uYWxsID0gT2JqZWN0LmNyZWF0ZShBcnJheS5wcm90b3R5cGUpO1xuXG4gICAgZmluZGVyQ2FwYWJpbGl0aWVzKGNvbGxlY3Rpb24uYWxsKTtcbiAgICB0YWdDYXBhYmlsaXRpZXMoY29sbGVjdGlvbik7XG5cbiAgICBjb2xsZWN0aW9uLmZpbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uYWxsLmZpbmQuYXBwbHkoY29sbGVjdGlvbi5hbGwsIHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgfTtcblxuICAgIGNvbGxlY3Rpb24ud2hlcmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24uYWxsLndoZXJlLmFwcGx5KGNvbGxlY3Rpb24uYWxsLCBzbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICBjb2xsZWN0aW9uLmFkZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdmFyIGl0ZW1zID0gQXJyYXkuaXNBcnJheShpdGVtKSA/IGl0ZW0gOiBbaXRlbV07XG4gICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgY29sbGVjdGlvbi5hbGwucHVzaChpdGVtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gICAgfTtcblxuICAgIGNvbGxlY3Rpb24ucmVtb3ZlID0gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICB2YXIgaXRlbXMgPSBBcnJheS5pc0FycmF5KGl0ZW0pID8gaXRlbSA6IFtpdGVtXTtcbiAgICAgICAgY29sbGVjdGlvbi51bnRhZ0FsbChpdGVtKTtcbiAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICB2YXIgaW5kZXggPSBjb2xsZWN0aW9uLmFsbC5pbmRleE9mKGl0ZW0pO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIGNvbGxlY3Rpb24uYWxsLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICAgIH07XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbn07XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG5cbiAgICBpZiAodHlwZW9mIG9iamVjdC5vbiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH1cblxuICAgIHZhciBldmVudHMgPSB7fTtcblxuICAgIG9iamVjdC5vbiA9IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICBldmVudHNbaWRlbnRpZmllcl0gPSBldmVudHNbaWRlbnRpZmllcl0gfHwgW107XG4gICAgICAgIGV2ZW50c1tpZGVudGlmaWVyXS5wdXNoKGZuYyk7XG5cbiAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICB9O1xuXG4gICAgb2JqZWN0Lm9mZiA9IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICBpZiAoaWRlbnRpZmllciBpbiBldmVudHMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGV2ZW50c1tpZGVudGlmaWVyXS5zcGxpY2UoZXZlbnRzW2lkZW50aWZpZXJdLmluZGV4T2YoZm5jKSwgMSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb2JqZWN0O1xuICAgIH07XG5cbiAgICBvYmplY3QuZW1pdCA9IGZ1bmN0aW9uKGlkZW50aWZpZXIsIGZuYykge1xuICAgICAgICBpZiAoaWRlbnRpZmllciBpbiBldmVudHMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzW2lkZW50aWZpZXJdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZXZlbnRzW2lkZW50aWZpZXJdW2ldLmFwcGx5KG9iamVjdCwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcblxuICAgIHJldHVybiBvYmplY3Q7XG5cbn07XG4iLCJ2YXIgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oY29sbGVjdGlvbikge1xuXG4gICAgY29sbGVjdGlvbi5maW5kID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB3aGVyZSA9IGNvbGxlY3Rpb24ud2hlcmUuYXBwbHkoY29sbGVjdGlvbiwgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcblxuICAgICAgICByZXR1cm4gd2hlcmUubGVuZ3RoID4gMCA/IHdoZXJlWzBdIDogbnVsbDtcbiAgICB9O1xuXG4gICAgY29sbGVjdGlvbi53aGVyZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY29uZGl0aW9ucyA9IHt9O1xuICAgICAgICBpZiAodHlwZW9mIGFyZ3VtZW50c1swXSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgY29uZGl0aW9uc1thcmd1bWVudHNbMF1dID0gYXJndW1lbnRzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uZGl0aW9ucyA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjb2xsZWN0aW9uLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICB2YXIgc2F0aXNmaWVkQ29uZGl0aW9uID0gZmFsc2U7XG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29uZGl0aW9ucykge1xuICAgICAgICAgICAgICAgIGlmIChjb25kaXRpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgc2F0aXNmaWVkQ29uZGl0aW9uID0gdHlwZW9mIGl0ZW1ba2V5XSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVtW2tleV0gPT09IGNvbmRpdGlvbnNba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBzYXRpc2ZpZWRDb25kaXRpb247XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn07XG4iLCJ2YXIgZXZlbnRDYXBhYmlsaXRpZXMgPSByZXF1aXJlKFwiLi9ldmVudFwiKTtcbnZhciBjb2xsZWN0aW9uQ2FwYWJpbGl0aWVzID0gcmVxdWlyZShcIi4vY29sbGVjdGlvblwiKTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihNb2RlbCkge1xuXG4gICAgZXZlbnRDYXBhYmlsaXRpZXMoTW9kZWwpO1xuICAgIGNvbGxlY3Rpb25DYXBhYmlsaXRpZXMoTW9kZWwpO1xuXG4gICAgTW9kZWwuY3JlYXRlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIGluc3RhbmNlID0ge307XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGluc3RhbmNlLCBcImRlc3Ryb3lcIiwge1xuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBNb2RlbC5yZW1vdmUoaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIE1vZGVsLmVtaXQoXCJpbnN0YW5jZSBkZXN0cm95ZWRcIiwgaW5zdGFuY2UpO1xuICAgICAgICAgICAgICAgIHJldHVybiBNb2RlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW5zdGFuY2UudGFnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBNb2RlbC50YWcuYXBwbHkoTW9kZWwsIFtpbnN0YW5jZV0uY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgICB9O1xuXG4gICAgICAgIGluc3RhbmNlLnVudGFnID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBNb2RlbC51bnRhZy5hcHBseShNb2RlbCwgW2luc3RhbmNlXS5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XG4gICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgICAgIH07XG5cbiAgICAgICAgTW9kZWwuYWRkKGluc3RhbmNlKTtcblxuICAgICAgICBNb2RlbC5lbWl0LmFwcGx5KE1vZGVsLCBbXCJjcmVhdGVcIiwgaW5zdGFuY2VdLmNvbmNhdChzbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcblxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG4gICAgfTtcblxuICAgIHJldHVybiBNb2RlbDtcbn07XG4iLCJ2YXIgZmluZGVyQ2FwYWJpbGl0aWVzID0gcmVxdWlyZShcIi4vZmluZGVyXCIpO1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuXG4gICAgdmFyIHRhZ3MgPSB7fTtcbiAgICB2YXIgdGFnTmFtZXMgPSBbXTtcblxuICAgIG9iamVjdC50YWcgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBpdGVtID0gYXJncy5zaGlmdCgpO1xuICAgICAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgICB2YXIgdGFnTmFtZXMgPSBBcnJheS5pc0FycmF5KGFyZykgPyBhcmcgOiBbYXJnXTtcbiAgICAgICAgICAgIHRhZ05hbWVzLmZvckVhY2goZnVuY3Rpb24odGFnTmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciB0YWcgPSBvYmplY3QuZ2V0VGFnKHRhZ05hbWUpO1xuICAgICAgICAgICAgICAgIGlmICh0YWcuaW5kZXhPZihpdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFnLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcblxuICAgIG9iamVjdC51bnRhZyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBhcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICB2YXIgaXRlbSA9IGFyZ3Muc2hpZnQoKTtcblxuICAgICAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgICAgICB2YXIgdGFnTmFtZXMgPSBBcnJheS5pc0FycmF5KGFyZykgPyBhcmcgOiBbYXJnXTtcbiAgICAgICAgICAgIHRhZ05hbWVzLmZvckVhY2goZnVuY3Rpb24odGFnTmFtZSkge1xuICAgICAgICAgICAgICAgIHZhciB0YWcgPSB0YWdzW3RhZ05hbWVdIHx8IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmICh0YWcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGFnLmluZGV4T2YoaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcblxuICAgIG9iamVjdC51bnRhZ0FsbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgdGFnTmFtZXMuZm9yRWFjaChmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgICAgICAgICBvYmplY3QudW50YWcodGFnTmFtZSwgaXRlbSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBvYmplY3Q7XG4gICAgfTtcblxuICAgIG9iamVjdC5nZXRUYWcgPSBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgICAgIG9iamVjdC5hZGRUYWcodGFnTmFtZSk7XG5cbiAgICAgICAgcmV0dXJuIHRhZ3NbdGFnTmFtZV07XG4gICAgfTtcblxuICAgIG9iamVjdC5hZGRUYWcgPSBmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGFnc1t0YWdOYW1lXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGFnTmFtZXMucHVzaCh0YWdOYW1lKTtcbiAgICAgICAgICAgIHZhciB0YWcgPSBPYmplY3QuY3JlYXRlKEFycmF5LnByb3RvdHlwZSk7XG4gICAgICAgICAgICB0YWdzW3RhZ05hbWVdID0gdGFnO1xuICAgICAgICAgICAgZmluZGVyQ2FwYWJpbGl0aWVzKHRhZyk7XG4gICAgICAgICAgICB0YWdCcm9hZGNhc3RDYXBhYmlsaXRpZXModGFnKTtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIHRhZ05hbWUsIHtcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFnQ2FzY2FkZSh0YWcpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiB0YWdDYXNjYWRlKHBhcmVudFRhZykge1xuICAgICAgICB0YWdOYW1lcy5mb3JFYWNoKGZ1bmN0aW9uKHRhZ05hbWUpIHtcbiAgICAgICAgICAgIGRlZmluZUZpbHRlcmVkVGFnKHBhcmVudFRhZywgdGFnTmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBwYXJlbnRUYWc7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZGVmaW5lRmlsdGVyZWRUYWcocGFyZW50VGFnLCB0YWdOYW1lKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwYXJlbnRUYWcsIHRhZ05hbWUsIHtcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpbHRlcmVkVGFnID0gZmlsdGVyVGFnKHBhcmVudFRhZywgdGFnc1t0YWdOYW1lXSk7XG4gICAgICAgICAgICAgICAgZmluZGVyQ2FwYWJpbGl0aWVzKGZpbHRlcmVkVGFnKTtcbiAgICAgICAgICAgICAgICB0YWdCcm9hZGNhc3RDYXBhYmlsaXRpZXMoZmlsdGVyZWRUYWcpO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YWdDYXNjYWRlKGZpbHRlcmVkVGFnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyVGFnKHBhcmVudFRhZywgdGFnKSB7XG4gICAgICAgIHZhciBmaWx0ZXJlZCA9IE9iamVjdC5jcmVhdGUoQXJyYXkucHJvdG90eXBlKTtcbiAgICAgICAgcGFyZW50VGFnLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0YWcubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGFnW2ldID09PSBpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcmVkLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbHRlcmVkO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRhZ0Jyb2FkY2FzdENhcGFiaWxpdGllcyh0YWcpIHtcbiAgICAgICAgdGFnLmJyb2FkY2FzdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB0YWcuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5lbWl0LmFwcGx5KGl0ZW0sIGFyZ3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIHJldHVybiBvYmplY3Q7XG59O1xuIl19
