var e = require('./lib/end-effector');
var m = require('./lib/manipulator');

e.open();
m.move(3700);
e.close();
m.move(-3700);
m.slowOpen();
