define(function(require) {

    var eventCapabilities = require("burst/core/event_capabilities");

    return function(gameLoop) {

        eventCapabilities(gameLoop);

        var lastTime;
        var active = false;

        gameLoop.start = function() {
            if (!active) {
                active = true;
                loop();
            }
        };

        gameLoop.stop = function() {
            active = false;
        };

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
    };

});
