require('yapcduino')({global: true});
var pins = require('./pins');
var pin = pins.BELT_SERVO;
var car = require('./car');
var end_effector = require('./end-effector');

pwmfreq_set(pin, 260);

module.exports = {
    load: function() {
        analogWrite(5, 150);
    },
    // 后循迹片刚好黑的时候触发
    unload: function() {
        analogWrite(5, 30);
        var steps = 1000;
        var forward = false;
        var count = 0;
        // forward
        car.go(true, true, 1, 1, 200, 200, true);
        // shake

        car.go(false, false, 0, 1, 0, steps, true);
        analogWrite(5, 150);
        delayMicroseconds(1000 * 1000);
        analogWrite(5, 30);

        car.go(false, true, 0, 1, 0, steps, true);
        analogWrite(5, 150);
        delayMicroseconds(1000 * 1000);
        analogWrite(5, 30);

        car.go(false, false, 0, 1, 0, steps, true);
        analogWrite(5, 150);
        delayMicroseonds(1000 * 1000);
        analogWrite(5, 30);

        car.go(true, true, 0, 1, 0, steps, true);
        analogWrite(5, 150);
        delayMicroseonds(1000 * 1000);
        analogWrite(5, 30);

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
