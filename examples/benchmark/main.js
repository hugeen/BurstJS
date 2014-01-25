requirejs.config({
    paths: {
        burst: '../../'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['game'], function(game) {
    game.emit("start");
});
