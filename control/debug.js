var car = require('./lib/car');
var head = require('./lib/head');
var forward = true;
car.auto(forward);
var checkInterval;
var stopCheck = function() {
    clearInterval(checkInterval);
};
var check = function() {
    checkInterval = setInterval(function() {
        if (head.isOnWhite()) {
            stopCheck();
            forward = !forward;
            car.auto(forward);
            setTimeout(function() {
                check();
            }, 5000);
        }
    }, 20);
};
check();
