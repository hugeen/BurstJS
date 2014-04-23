var eventCapabilities = require("../../moltencore/event");
var modelCapabilities = require("../../moltencore/model");

var game = eventCapabilities({});

var Player = modelCapabilities({});
Player.addTag("global").addTag("hello").addTag("burst");
Player.on("create", function(instance) {
    eventCapabilities(instance);
});

game.on("start", function() {
    console.log("hello");
});

game.emit("start");