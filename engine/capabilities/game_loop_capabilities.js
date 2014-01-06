define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(gameLoop) {

        eventCapabilities(gameLoop);

        var lastTime = undefined;
        var active = false;

        gameLoop.on("resume", function() {
            if (!active) {
                active = true;
                loop();
            }
        });

        gameLoop.on("resume", function() {
            active = false;
        });

        function loop() {
            requestAnimationFrame(function(time) {
                var delta = time - (lastTime || time);
                lastTime = time;
                gameLoop.emit("update", delta / 1000);
                if (active) {
                    loop();
                }
            });
        }

        return gameLoop;
    };

});
