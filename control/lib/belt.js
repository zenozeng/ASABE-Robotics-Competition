require('yapcduino')({global: true});
var pins = require('./pins');
var pin = pins.BELT_SERVO;
var car = require('./car');

pwmfreq_set(pin, 260);

module.exports = {
    load: function() {
        analogWrite(5, 150);
    },
    // 后循迹片刚好黑的时候触发
    unload: function() {
        analogWrite(5, 30);
        var steps = 6000;
        var forward = false;
        var count = 0;
        car.go(true, true, 1, 1, 200, 200, true);
        car.go(false, false, 0, 3, 0, steps, true);
        car.go(false, false, 0, 3, 0, steps, true);
        car.go(true, true, 0, 3, 0, steps * 2, true);
        analogWrite(5, 0);
        // var shake = function() {
        //     count++;
        //     car.go(forward, forward, 0, 3, 0, steps);
        //     forward = !forward;
        //     if (count < 10) {
        //         setTimeout(shake, 3000);
        //     } else {
        //         analogWrite(5, 0);
        //     }
        // };
        // shake();
    },
    stop: function() {
        analogWrite(5, 0);
    }
};
