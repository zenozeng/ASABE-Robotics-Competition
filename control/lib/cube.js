var e = require('./lib/end-effector');
var m = require('./lib/manipulator');

var collect = function() {
    e.open();
    m.set();
    e.close();
    m.unset();
    m.slowOpen();
};

module.exports = {
    collect: collect
};
