require('yapcduino')({global: true});
var pins = require('./pins');
var pin = pins.BELT_SERVO;
var car = require('./car');
var end_effector = require('./end-effector');
var manipulator = require('./manipulator');

pwmfreq_set(pin, 260);

module.exports = {
    load: function() {
        analogWrite(5, 150);
    },
    // 后循迹片刚好黑的时候触发
    unload: function() {
        end_effector.open();
        analogWrite(5, 30);
        delayMicroseconds(3 * 1000 * 1000);
        for (var i = 0; i < 5; i++) {
            end_effector.close();
            manipulator.move(10000);
            end_effector.open();
            manipulator.move(-10000);
        }
        analogWrite(5, 0);
    },
    stop: function() {
        analogWrite(5, 0);
    }
};
