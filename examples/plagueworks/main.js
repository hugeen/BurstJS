requirejs.config({
    paths: {
        burst: '../../'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['burst/libs/jquery', 'game'], function($, game) {
    $(function() {
        game.emit("start");
    });
});
