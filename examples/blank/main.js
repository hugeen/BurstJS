requirejs.config({
    paths: {
        burst: '../../'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['burst/libs/zepto', 'game'], function($, game) {
    $(function() {
        game.emit("start");
    });
});
