requirejs.config({
    paths: {
        burstcore: '../../burstcore'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['game'], function(game) {
    game.emit("start");
});
