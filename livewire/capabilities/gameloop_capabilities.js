define(function(require) {

    var eventCapabilities = require("burstcore/event_capabilities");

    return function(gameLoop) {

        eventCapabilities(gameLoop);

        gameLoop.updatedAt = undefined;
        gameLoop.active = false;

        gameLoop.on("resume", function() {
            if (!gameLoop.active) {
                gameLoop.active = true;
                loop();
            }
        });

        gameLoop.on("resume", function() {
            gameLoop.active = false;
        });

        function loop() {
            requestAnimationFrame(function(time) {
                var delta = time - (gameLoop.updatedAt || time);
                gameLoop.updatedAt = time;
                gameLoop.emit("update", delta / 1000);
                if (gameLoop.active) {
                    loop();
                }
            });
        }

        return gameLoop;
    };

});
