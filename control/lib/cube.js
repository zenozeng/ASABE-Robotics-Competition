var e = require('./end-effector');
var m = require('./manipulator');
var b = require('./belt');

var steps = 30000;

var collect = function() {
    delayMicroseconds(1 * 1000 * 1000);
    return; // for now
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
