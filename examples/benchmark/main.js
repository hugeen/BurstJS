requirejs.config({
    paths: {
        burstcore: '../../burstcore',
        burstutils: '../../burstutils'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['game'], function(game) {
    game.emit("start");
});
