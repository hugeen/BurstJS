requirejs.config({
    paths: {
        jquery: '../../libs/jquery',
        burst: '../../'
    },
    urlArgs: "bust=" + (new Date()).getTime()
});

require(['jquery', 'game'], function($, game) {
    $(game.init);
});
