var e = require('./lib/end-effector');
var m = require('./lib/manipulator');
var b = require('./lib/belt');

var steps = 30000;

var collect = function() {
    b.load();
    e.open();
    m.move(steps);
    e.close();
    m.move(steps * -1);
    e.slowOpen();
    delayMicroseconds(1 * 1000 * 1000);
    b.stop();
    // 再合上，防止掉落
    e.close();
    e.stop();
};

module.exports = {
    collect: collect
};
