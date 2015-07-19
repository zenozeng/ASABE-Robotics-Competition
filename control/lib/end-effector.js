var yapcduino = require('yapcduino')({global: true});
var pins = require('./pins');

var pin = pins.END_EFFECTOR_SERVO;
pwmfreq_set(pin, 126);

module.exports = {
    open: function() {
        analogWrite(pin, 5);
        delayMicroseconds(500 * 1000); // 0.12sec/60degree, wait for 500ms
        analogWrite(pin, 0);
    },
    slowOpen: function() {
        for (var i = 30; i > 15; i--) {
            analogWrite(pin, i);
            delayMicroseconds(200 * 1000);
        }
        analogWrite(pin, 5);
        analogWrite(pin, 0);
    },
    close: function() {
        analogWrite(pin, 30);
        delayMicroseconds(500 * 1000);
    },
    stop: function() {
        analogWrite(pin, 0);
    }
};
