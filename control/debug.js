var car = require('./lib/car');
var head = require('./lib/head');
var forward = true;
car.turnLeft90Sync();
car.auto(forward);
var checkInterval;
var stopCheck = function() {
    clearInterval(checkInterval);
};
var rightFirst = false;
var check = function() {
    checkInterval = setInterval(function() {
        if (head.isOnWhite()) {
            stopCheck();
            car.stopAuto();
            car.turn180(rightFirst);
            rightFirst = !rightFirst;
            car.auto(forward);
            setTimeout(function() {
                check();
            }, 5000);
        }
    }, 20);
};
check();
